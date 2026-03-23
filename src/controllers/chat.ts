import { Request, Response } from 'express';
import { supabase } from '../lib/supabase';
import { groqChat } from '../lib/groq';

export const handleChat = async (req: Request, res: Response) => {
  const { user_id, message } = req.body;
  const appId = (req as any).app_id;

  if (!user_id || !message) {
    return res.status(400).json({ error: 'user_id and message are required' });
  }

  try {
    // 1. Context Retrieval: Fetch recent memories
    let dbQuery = supabase
      .from('memories')
      .select('content, created_at')
      .eq('user_id', user_id);

    if (appId) {
      dbQuery = dbQuery.eq('app_id', appId);
    } else {
      dbQuery = dbQuery.is('app_id', null);
    }

    const { data: memories, error: fetchError } = await dbQuery
      .order('created_at', { ascending: false })
      .limit(10);

    if (fetchError) throw fetchError;

    const memoryContext = memories?.map(m => `- ${m.content}`).join('\n') || "No prior memories found.";
    console.log(`[CHAT] Context for ${user_id}: ${memoryContext}`);

    // 2. LLM Reasoning: Store vs Query
    const systemPrompt = `
You are Retayn, an AI memory assistant. 
Your primary goal is to provide context-aware responses using the user's stored memories.

IMPORTANT - USER CONTEXT:
${memoryContext}

INSTRUCTIONS:
1. Always check the "USER CONTEXT" above before answering. If the user asks about something you already know (like their name, preferences, or past events), answer using that information.
2. If the user provides NEW information (facts, name, likes), extract it for storage.
3. If no relevant memory exists, acknowledge it naturally but don't say "I don't have that information" if you can be more helpful.
4. Output your response ONLY as a valid JSON object. No extra text allowed.

JSON FORMAT:
{
  "response": "Your friendly response here",
  "new_memory": "Concise fact to store (or null)"
}
`;

    const result = await groqChat([
      { role: "system", content: systemPrompt },
      { role: "user", content: message }
    ]);

    const rawContent = result.choices[0]?.message?.content || "{}";
    let aiData;
    
    try {
        // Try to find JSON block in case AI was talkative
        const jsonMatch = rawContent.match(/\{[\s\S]*\}/);
        const jsonString = jsonMatch ? jsonMatch[0] : rawContent;
        aiData = JSON.parse(jsonString);
    } catch (e) {
        console.error('JSON Parse Error:', rawContent);
        aiData = {
            response: rawContent.replace(/\{[\s\S]*\}/, '').trim() || "I understood that.",
            new_memory: null
        };
    }

    // 3. Selective Memory Storage
    if (aiData.new_memory) {
      console.log(`[MEMORY] Storing new fact for ${user_id}: ${aiData.new_memory}`);
      const { error: storeError } = await supabase
        .from('memories')
        .insert([{ 
            user_id, 
            content: aiData.new_memory, 
            app_id: appId, 
            type: 'fact' 
        }]);
      if (storeError) console.error('[MEMORY ERROR]', storeError);
    }

    res.json({
      response: aiData.response,
      stored: !!aiData.new_memory
    });

  } catch (error: any) {
    console.error('[CHAT ERROR]', {
      message: error.message,
      details: error.details,
      hint: error.hint,
      stack: error.stack
    });
    res.status(500).json({ error: error.message || 'Internal Server Error' });
  }
};

import { groqChat } from '../src/lib/groq';

async function testGroq() {
  console.log("🚀 Testing Groq API Integration...");
  const messages = [
    { role: "system", content: "You are a helpful assistant." },
    { role: "user", content: "Say hello and confirm you are working!" }
  ];

  try {
    const response = await groqChat(messages);
    console.log("✅ Groq Response:", response.choices[0].message.content);
  } catch (error) {
    console.error("❌ Groq Test Failed:", error);
  }
}

testGroq();

import axios from 'axios';
import dotenv from 'dotenv';

dotenv.config();

const GROQ_API_KEY = process.env.GROQ_API_KEY;
const GROQ_API_URL = 'https://api.groq.com/openai/v1/chat/completions';

if (!GROQ_API_KEY) {
  throw new Error('GROQ_API_KEY is not defined in environment variables');
}

export const groqChat = async (messages: any[]) => {
  try {
    const response = await axios.post(
      GROQ_API_URL,
      {
        messages,
        model: "llama-3.3-70b-versatile",
      },
      {
        headers: {
          'Authorization': `Bearer ${GROQ_API_KEY}`,
          'Content-Type': 'application/json',
        },
      }
    );
    return response.data;
  } catch (error: any) {
    console.error('Groq API Error:', error.response?.data || error.message);
    throw error;
  }
};

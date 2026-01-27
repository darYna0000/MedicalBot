
import { GoogleGenAI, Type } from "@google/genai";
import { BotStage, MedicalDocument, UserProfile } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });

const COORDINATOR_SYSTEM_PROMPT = `
You are a professional Medical Coordinator for an Israeli Medical Tourism service. 
CRITICAL LIMITATION: You are NOT a doctor. You NEVER give medical advice, treatment plans, or prognoses.

YOUR MISSION:
1. Conduct a live dialogue. Answer off-topic questions/emotions gently, then return to data collection.
2. Collect personal data and documents.
3. If asked medical questions, say: "I will transfer these materials to the profile doctor/curator, who will contact you."

STRICT RULES:
- Never output raw JSON blocks in the 'reply' field.
- The 'reply' field must contain ONLY natural, empathetic language for the patient.
- Detect any new information about the patient (name, city, country, phone) and put it in 'profileUpdate'.
- Determine the correct 'nextStage' based on the conversation flow.
`;

export const getGeminiResponse = async (
  messages: { role: string; content: string }[],
  currentStage: BotStage,
  profile: Partial<UserProfile>
) => {
  const model = 'gemini-3-flash-preview';
  
  const contents = messages.map(m => ({
    role: m.role === 'model' ? 'model' : 'user',
    parts: [{ text: m.content }]
  }));

  const response = await ai.models.generateContent({
    model,
    contents,
    config: {
      systemInstruction: `${COORDINATOR_SYSTEM_PROMPT}\n\nCurrent State:
      Stage: ${currentStage}
      Language: ${profile.language || 'RU'}
      User Profile: ${JSON.stringify(profile)}`,
      temperature: 0.7,
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          reply: { type: Type.STRING, description: "The message to show to the patient." },
          nextStage: { type: Type.STRING, enum: Object.values(BotStage), description: "The suggested next stage of the bot." },
          profileUpdate: {
            type: Type.OBJECT,
            properties: {
              name: { type: Type.STRING },
              country: { type: Type.STRING },
              city: { type: Type.STRING },
              phone: { type: Type.STRING },
              email: { type: Type.STRING },
              oncoCase: { type: Type.BOOLEAN }
            }
          }
        },
        required: ["reply", "nextStage"]
      }
    }
  });

  try {
    return JSON.parse(response.text || '{}');
  } catch (e) {
    console.error("Failed to parse Gemini JSON response", e);
    return { reply: response.text, nextStage: currentStage };
  }
};

export const analyzeMedicalDocument = async (
  base64Data: string,
  mimeType: string,
  fileName: string
): Promise<Partial<MedicalDocument>> => {
  const response = await ai.models.generateContent({
    model: 'gemini-3-flash-preview',
    contents: [
      {
        parts: [
          { inlineData: { data: base64Data, mimeType } },
          { text: `Extract technical details from this medical document. No interpretation.` }
        ]
      }
    ],
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          type: { type: Type.STRING },
          date: { type: Type.STRING },
          organ: { type: Type.STRING },
          keyFindings: { type: Type.STRING },
          language: { type: Type.STRING }
        }
      }
    }
  });

  return {
    ...JSON.parse(response.text || '{}'),
    fileName
  };
};

export const generateFinalAnamnesis = async (
  profile: UserProfile,
  documents: MedicalDocument[],
  chatHistory: string
): Promise<{ ru: string; en: string }> => {
  const prompt = `Generate a structured medical anamnesis in two languages (Russian and English).
    User: ${JSON.stringify(profile)}
    Docs: ${JSON.stringify(documents)}
    History: ${chatHistory}
    Output JSON: { "ru": "markdown text", "en": "markdown text" }`;

  const response = await ai.models.generateContent({
    model: 'gemini-3-pro-preview',
    contents: prompt,
    config: {
      responseMimeType: "application/json"
    }
  });

  return JSON.parse(response.text || '{}');
};

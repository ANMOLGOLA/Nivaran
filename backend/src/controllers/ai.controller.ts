import { Request, Response } from 'express';
import { ragService } from '../services/rag.service';
import { translationService } from '../services/translation.service';

const GEMINI_API_KEY = process.env.GEMINI_API_KEY || '';

interface ChatMessage {
  role: 'user' | 'model';
  text: string;
}

export const chatWithAi = async (req: Request, res: Response): Promise<void> => {
  try {
    const { message, history } = req.body;

    if (!message || typeof message !== 'string') {
      res.status(400).json({ success: false, error: 'Message query must be a valid string' });
      return;
    }

    // 1. Detect language
    const detectedLang = translationService.detectLanguage(message);

    // 2. Translate query to English
    const englishQuery = await translationService.translateToEnglish(message, detectedLang);

    // 3. Search RAG documents
    const searchResults = ragService.searchSchemes(englishQuery);
    
    // Compile RAG context block
    let contextBlock = '';
    if (searchResults.length > 0) {
      // Use top 3 matching snippets
      contextBlock = searchResults
        .slice(0, 3)
        .map(r => `[Source: ${r.source}]\n${r.text}`)
        .join('\n\n');
    }

    let finalReplyText = '';
    let redirectAction: string | null = null;
    let suggestedFields: any = null;

    // Detect complaint intent in query
    const lowerQuery = englishQuery.toLowerCase();
    const isComplaintIntent = lowerQuery.includes('complaint') || 
                              lowerQuery.includes('leak') || 
                              lowerQuery.includes('garbage') || 
                              lowerQuery.includes('street light') || 
                              lowerQuery.includes('pothole') ||
                              lowerQuery.includes('trash') ||
                              lowerQuery.includes('road');

    if (isComplaintIntent) {
      redirectAction = 'file-complaint';
      suggestedFields = {
        description: message,
        category: lowerQuery.includes('garbage') || lowerQuery.includes('trash') ? 'Sanitation' :
                  lowerQuery.includes('light') ? 'Electricity' :
                  lowerQuery.includes('road') || lowerQuery.includes('pothole') ? 'Roads' : 'Water Supply'
      };
    }

    // 4. Query LLM or Fall back to rules-based responder
    if (GEMINI_API_KEY) {
      try {
        const systemPrompt = `You are a helpful government AI companion named "Smart Bharat".
Your goal is to answer citizen questions about government schemes and civic issues.
Keep your answers professional, direct, and concise (max 3-4 sentences).

Use the following Context to answer the citizen's query. Cite the source name (e.g., Ayushman Bharat, PM-KISAN, PMAY) when answering:
${contextBlock ? contextBlock : 'No scheme documents matching this query were found in the database.'}

If the user wants to report a civic issue (like garbage, street light, pothole, water leak), tell them you can help file a complaint.

Citizen Query: ${englishQuery}`;

        const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${GEMINI_API_KEY}`;
        const llmResponse = await fetch(url, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            contents: [{ parts: [{ text: systemPrompt }] }],
            generationConfig: {
              maxOutputTokens: 250,
              temperature: 0.2
            }
          })
        });

        if (llmResponse.ok) {
          const data = (await llmResponse.json()) as any;
          finalReplyText = data.candidates?.[0]?.content?.parts?.[0]?.text || '';
        } else {
          console.warn('Gemini API returned error status, falling back to rule-based RAG');
          finalReplyText = generateRulesBasedReply(englishQuery, contextBlock, isComplaintIntent);
        }
      } catch (err) {
        console.error('Failed to contact Gemini API, using RAG fallback:', err);
        finalReplyText = generateRulesBasedReply(englishQuery, contextBlock, isComplaintIntent);
      }
    } else {
      // Default offline fallback
      finalReplyText = generateRulesBasedReply(englishQuery, contextBlock, isComplaintIntent);
    }

    // 5. Translate reply back to detected language
    const translatedReply = await translationService.translateFromEnglish(finalReplyText, detectedLang);

    res.status(200).json({
      success: true,
      reply: translatedReply,
      detectedLanguage: detectedLang,
      redirect: redirectAction,
      suggestedFields
    });
  } catch (error) {
    console.error('Error in chatWithAi:', error);
    res.status(500).json({ success: false, error: 'Internal server error' });
  }
};

/**
 * Fallback rules-based generator when LLM API is unavailable.
 */
function generateRulesBasedReply(query: string, context: string, isComplaint: boolean): string {
  if (isComplaint) {
    return 'I noticed you want to report an issue. Click below to file a civic complaint. Our team will route it to the correct department immediately.';
  }

  if (context) {
    return `Based on official records:\n\n${context}\n\nFor further help, please specify the details of the scheme you need help with.`;
  }

  return 'I am your Smart Bharat AI Companion. You can ask me details about PM-KISAN, Ayushman Bharat health insurance, or Pradhan Mantri Awas Yojana (PMAY). How may I assist you today?';
}

/**
 * Handle Mock Speech-to-Text Upload.
 */
export const speechToText = async (req: Request, res: Response): Promise<void> => {
  try {
    // For this hackathon/demo build, we simulate transcription from audio.
    // If the client posts an audio clip, we return a mock transcript.
    // In a real build, this parses Webm/Wav audio and posts to Whisper API.
    const mockTranscripts = [
      'Tell me about PM-KISAN benefits',
      'Am I eligible for Ayushman Bharat health insurance?',
      'सड़क पर कचरा पड़ा हुआ है शिकायत दर्ज करो', // Hindi: garbage on road complaint
      'What is PMAY scheme?'
    ];
    
    const randomTranscript = mockTranscripts[Math.floor(Math.random() * mockTranscripts.length)];

    res.status(200).json({
      success: true,
      transcript: randomTranscript
    });
  } catch (error) {
    console.error('Error in speechToText:', error);
    res.status(500).json({ success: false, error: 'Failed to transcribe audio' });
  }
};


import { GoogleGenAI } from "@google/genai";

// Standard implementation for Gemini API services
export class GeminiService {
  // Use a getter to ensure we always use the latest API key from environment
  private get ai() {
    return new GoogleGenAI({ apiKey: process.env.API_KEY });
  }

  // Handle document/image analysis and extraction
  async processWithFile(prompt: string, fileBase64: string, mimeType: string, systemInstruction?: string): Promise<string> {
    const client = this.ai;
    const response = await client.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: {
        parts: [
          {
            inlineData: {
              data: fileBase64.split(',')[1] || fileBase64,
              mimeType: mimeType
            }
          },
          { text: prompt }
        ]
      },
      config: {
        systemInstruction,
        temperature: 0.2, // Lower temperature for high precision extraction
      },
    });
    return response.text || "No data extracted.";
  }

  // Standard text generation for general queries
  async generateText(prompt: string, systemInstruction?: string): Promise<string> {
    const client = this.ai;
    const response = await client.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: prompt,
      config: {
        systemInstruction,
        temperature: 0.7,
      },
    });
    return response.text || "No response generated.";
  }

  // Image generation using nano banana series models
  async generateImage(prompt: string): Promise<string> {
    const client = this.ai;
    const response = await client.models.generateContent({
      model: 'gemini-2.5-flash-image',
      contents: {
        parts: [{ text: prompt }],
      },
      config: {
        imageConfig: {
          aspectRatio: "1:1",
        },
      },
    });

    // Find and return the generated image data
    for (const part of response.candidates?.[0]?.content?.parts || []) {
      if (part.inlineData) {
        const base64EncodeString: string = part.inlineData.data;
        return `data:image/png;base64,${base64EncodeString}`;
      }
    }
    throw new Error("The model did not return an image.");
  }

  // Stream text output for interactive feel
  async *streamText(prompt: string, systemInstruction?: string) {
    const client = this.ai;
    const streamResponse = await client.models.generateContentStream({
      model: "gemini-3-flash-preview",
      contents: prompt,
      config: {
        systemInstruction,
        temperature: 0.4,
      },
    });

    for await (const chunk of streamResponse) {
      if (chunk.text) {
        yield chunk.text;
      }
    }
  }
}

export const gemini = new GeminiService();

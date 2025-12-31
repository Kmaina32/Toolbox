
import { GoogleGenAI } from "@google/genai";

export class GeminiService {
  private get ai() {
    return new GoogleGenAI({ apiKey: process.env.API_KEY });
  }

  async measureLatency(): Promise<number> {
    const start = performance.now();
    try {
      // Smallest possible request to check connectivity and latency
      await fetch(`https://generativelanguage.googleapis.com/v1beta/models?key=${process.env.API_KEY}`, { method: 'HEAD', mode: 'no-cors' });
      return Math.round(performance.now() - start);
    } catch (e) {
      return 0;
    }
  }

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
        temperature: 0.2,
      },
    });
    return response.text || "No data extracted.";
  }

  async processWithMaps(prompt: string, lat?: number, lng?: number): Promise<{ text: string, links: any[] }> {
    const client = this.ai;
    const response = await client.models.generateContent({
      model: "gemini-2.5-flash-preview-09-2025",
      contents: prompt,
      config: {
        tools: [{ googleMaps: {} }],
        toolConfig: lat && lng ? {
          retrievalConfig: {
            latLng: { latitude: lat, longitude: lng }
          }
        } : undefined
      },
    });

    const links = response.candidates?.[0]?.groundingMetadata?.groundingChunks?.map((chunk: any) => chunk.maps) || [];
    return {
      text: response.text || "No response generated.",
      links: links.filter(Boolean)
    };
  }

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

  async generateImage(prompt: string): Promise<string> {
    const client = this.ai;
    const response = await client.models.generateContent({
      model: 'gemini-2.5-flash-image',
      contents: {
        parts: [{ text: prompt }],
      },
    });

    for (const part of response.candidates?.[0]?.content?.parts || []) {
      if (part.inlineData) {
        return `data:image/png;base64,${part.inlineData.data}`;
      }
    }
    throw new Error("No image returned.");
  }

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
      if (chunk.text) yield chunk.text;
    }
  }
}

export const gemini = new GeminiService();

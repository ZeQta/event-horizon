import { StreamResponse } from '../types';

const API_KEY = import.meta.env.VITE_A4F_API_KEY;
const MODEL = import.meta.env.VITE_A4F_MODEL;
const API_URL = import.meta.env.VITE_A4F_API_URL;

export class A4FService {
  static async streamChatCompletion(
    messages: { role: string; content: string }[],
    onChunk: (chunk: string) => void,
    onComplete: () => void,
    onError: (error: string) => void
  ) {
    try {
      const response = await fetch(API_URL, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${API_KEY}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: MODEL,
          messages: messages,
          stream: true,
          temperature: 0.7,
          max_tokens: 200000,
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const reader = response.body?.getReader();
      if (!reader) {
        throw new Error('No reader available');
      }

      const decoder = new TextDecoder();
      let buffer = '';

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split('\n');
        buffer = lines.pop() || '';

        for (const line of lines) {
          const trimmed = line.trim();
          if (trimmed === '' || trimmed === 'data: [DONE]') continue;
          
          if (trimmed.startsWith('data: ')) {
            try {
              const jsonStr = trimmed.slice(6);
              const parsed: StreamResponse = JSON.parse(jsonStr);
              const content = parsed.choices[0]?.delta?.content;
              
              if (content) {
                onChunk(content);
              }
              
              if (parsed.choices[0]?.finish_reason === 'stop') {
                onComplete();
                return;
              }
            } catch (parseError) {
              console.warn('Failed to parse chunk:', parseError);
            }
          }
        }
      }

      onComplete();
    } catch (error) {
      console.error('Stream error:', error);
      onError(error instanceof Error ? error.message : 'Unknown error occurred');
    }
  }
}
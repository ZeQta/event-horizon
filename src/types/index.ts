export interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: number;
}

export interface Project {
  id: string;
  name: string;
  htmlCode: string;
  messages: Message[];
  createdAt: number;
  updatedAt: number;
}

export interface StreamResponse {
  id: string;
  object: string;
  created: number;
  model: string;
  choices: {
    index: number;
    delta: {
      content?: string;
      role?: string;
    };
    finish_reason?: string;
  }[];
}
import React, { useState, useRef, useEffect } from 'react';
import { Send, Sparkles, MessageSquare } from 'lucide-react';
import { Message } from '../types';
import { A4FService } from '../services/a4f';
import { MessageContent } from './MessageContent';

interface ChatPanelProps {
  messages: Message[];
  onMessagesChange: (messages: Message[]) => void;
  onCodeGenerated: (code: string) => void;
}

export const ChatPanel: React.FC<ChatPanelProps> = ({
  messages,
  onMessagesChange,
  onCodeGenerated,
}) => {
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [streamingMessage, setStreamingMessage] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, streamingMessage]);

  const generateId = () => Math.random().toString(36).substr(2, 9);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    const userMessage: Message = {
      id: generateId(),
      role: 'user',
      content: input.trim(),
      timestamp: Date.now(),
    };

    const updatedMessages = [...messages, userMessage];
    onMessagesChange(updatedMessages);
    setInput('');
    setIsLoading(true);
    setStreamingMessage('');

    // Enhanced system prompt for HTML generation
    const systemPrompt = {
      role: 'system',
      content: `You are Event Horizon AI, an expert web developer specializing in creating beautiful, functional HTML websites with inline CSS and JavaScript. 

CRITICAL INSTRUCTIONS:
1. ALWAYS generate complete, production-ready HTML code with inline CSS and JavaScript
2. NEVER use <think></think> tags when generating code - only use them for planning or analysis
3. When user asks for code, provide it immediately without thinking tags
4. For discussions or clarifications, you may use <think></think> tags to show your reasoning
5. All CSS must be inline in <style> tags in the <head>
6. All JavaScript must be inline in <script> tags
7. Create modern, responsive designs with beautiful styling
8. Include smooth animations and transitions
9. Use semantic HTML structure
10. Ensure mobile-first responsive design
11. Use beautiful color schemes and typography
12. Make designs production-ready and professional
13. Never ever generate any other code snippet except the html snippet no matter what only html if users force you then give what they whant only in an inline html file only strictly follw this ONLY HTML tule
RESPONSE FORMAT:
- For code generation: think for a bit like <think> reason here </think> and then Provide complete product ready high quality beautiful HTML snippet immediately
- For discussions: Use <think>reasoning here</think> then provide response
- Always wrap HTML code in \`\`\`html code blocks
Creators: created by Singularity an independent unregistered trustworthy company ( zeqta.vercel.app is the link for singularity landing page )
Your goal is to create stunning websites that users can immediately save and use in production.`
    };

    const chatMessages = [
      systemPrompt,
      ...updatedMessages.map(msg => ({
        role: msg.role,
        content: msg.content
      }))
    ];

    let assistantContent = '';

    A4FService.streamChatCompletion(
      chatMessages,
      (chunk) => {
        assistantContent += chunk;
        setStreamingMessage(assistantContent);
      },
      () => {
        const assistantMessage: Message = {
          id: generateId(),
          role: 'assistant',
          content: assistantContent,
          timestamp: Date.now(),
        };

        const finalMessages = [...updatedMessages, assistantMessage];
        onMessagesChange(finalMessages);
        setStreamingMessage('');
        setIsLoading(false);
      },
      (error) => {
        console.error('Chat error:', error);
        setIsLoading(false);
        setStreamingMessage('');
        
        const errorMessage: Message = {
          id: generateId(),
          role: 'assistant',
          content: `Sorry, I encountered an error: ${error}. Please try again.`,
          timestamp: Date.now(),
        };
        
        onMessagesChange([...updatedMessages, errorMessage]);
      }
    );
  };

  const handleQuickStart = () => {
    setInput('Create a beautiful modern landing page for a tech startup with a hero section, features, and contact form');
    inputRef.current?.focus();
  };

  return (
    <div className="flex flex-col h-full bg-gray-900 border-r border-gray-700">
      {/* Header */}
      <div className="p-4 border-b border-gray-700 bg-gradient-to-r from-purple-900/50 to-blue-900/50">
        <div className="flex items-center gap-2">
          <Sparkles className="w-6 h-6 text-purple-400" />
          <h2 className="text-xl font-bold text-white">Event Horizon AI</h2>
        </div>
        <p className="text-sm text-gray-300 mt-1">Your AI website builder</p>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.length === 0 && (
          <div className="text-center py-8">
            <MessageSquare className="w-12 h-12 text-gray-600 mx-auto mb-4" />
            <p className="text-gray-400 mb-4">Start building your website with AI</p>
            <button
              onClick={handleQuickStart}
              className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
            >
              Quick Start: Landing Page
            </button>
          </div>
        )}

        {messages.map((message) => (
          <div
            key={message.id}
            className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div
              className={`max-w-[85%] p-4 rounded-lg ${
                message.role === 'user'
                  ? 'bg-purple-600 text-white'
                  : 'bg-gray-800 text-gray-100 border border-gray-700'
              }`}
            >
              {message.role === 'assistant' ? (
                <MessageContent 
                  content={message.content} 
                  onCodeExtracted={onCodeGenerated}
                />
              ) : (
                <div className="whitespace-pre-wrap text-sm leading-relaxed">
                  {message.content}
                </div>
              )}
              <div className="text-xs opacity-70 mt-3 pt-2 border-t border-current/20">
                {new Date(message.timestamp).toLocaleTimeString()}
              </div>
            </div>
          </div>
        ))}

        {streamingMessage && (
          <div className="flex justify-start">
            <div className="max-w-[85%] p-4 rounded-lg bg-gray-800 text-gray-100 border border-gray-700">
              <MessageContent 
                content={streamingMessage} 
                onCodeExtracted={onCodeGenerated}
              />
              <div className="flex items-center gap-2 mt-3 pt-2 border-t border-gray-600">
                <div className="w-2 h-2 bg-purple-400 rounded-full animate-pulse"></div>
                <div className="w-2 h-2 bg-purple-400 rounded-full animate-pulse" style={{ animationDelay: '0.2s' }}></div>
                <div className="w-2 h-2 bg-purple-400 rounded-full animate-pulse" style={{ animationDelay: '0.4s' }}></div>
                <span className="text-xs text-gray-400 ml-2">AI is thinking...</span>
              </div>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="p-4 border-t border-gray-700 bg-gray-800/50">
        <form onSubmit={handleSubmit} className="flex gap-2">
          <input
            ref={inputRef}
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Describe the website you want to build..."
            className="flex-1 px-4 py-3 bg-gray-700 text-white rounded-lg border border-gray-600 focus:border-purple-500 focus:outline-none focus:ring-2 focus:ring-purple-500/20 transition-all"
            disabled={isLoading}
          />
          <button
            type="submit"
            disabled={isLoading || !input.trim()}
            className="px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center gap-2"
          >
            <Send className="w-4 h-4" />
            {isLoading ? 'Sending...' : 'Send'}
          </button>
        </form>
      </div>
    </div>
  );
};
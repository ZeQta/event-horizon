import React, { useState } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeHighlight from 'rehype-highlight';
import rehypeRaw from 'rehype-raw';
import { ChevronDown, ChevronRight, Brain } from 'lucide-react';
import 'highlight.js/styles/github-dark.css';

interface MessageContentProps {
  content: string;
  onCodeExtracted?: (code: string) => void;
}

export const MessageContent: React.FC<MessageContentProps> = ({ content, onCodeExtracted }) => {
  const [showThoughts, setShowThoughts] = useState(false);

  // Extract thoughts and main content
  const extractThoughts = (text: string) => {
    const thoughtsRegex = /<think>([\s\S]*?)<\/think>/g;
    const thoughts: string[] = [];
    let match;
    
    while ((match = thoughtsRegex.exec(text)) !== null) {
      thoughts.push(match[1].trim());
    }
    
    const mainContent = text.replace(thoughtsRegex, '').trim();
    return { thoughts, mainContent };
  };

  const { thoughts, mainContent } = extractThoughts(content);

  // Extract and trigger code updates
  React.useEffect(() => {
    const htmlMatch = mainContent.match(/```html\n([\s\S]*?)\n```/);
    if (htmlMatch && onCodeExtracted) {
      onCodeExtracted(htmlMatch[1]);
    } else if (mainContent.includes('<!DOCTYPE html>') && onCodeExtracted) {
      // If HTML is not in code blocks but contains DOCTYPE
      const lines = mainContent.split('\n');
      const htmlStart = lines.findIndex(line => line.includes('<!DOCTYPE html>'));
      if (htmlStart !== -1) {
        const htmlCode = lines.slice(htmlStart).join('\n');
        onCodeExtracted(htmlCode);
      }
    }
  }, [mainContent, onCodeExtracted]);

  return (
    <div className="space-y-3">
      {/* AI Thoughts Section */}
      {thoughts.length > 0 && (
        <div className="border border-blue-500/30 rounded-lg bg-blue-900/20 overflow-hidden">
          <button
            onClick={() => setShowThoughts(!showThoughts)}
            className="w-full flex items-center gap-2 p-3 text-left hover:bg-blue-900/30 transition-colors"
          >
            <Brain className="w-4 h-4 text-blue-400" />
            <span className="text-sm font-medium text-blue-300">AI Thought Process</span>
            {showThoughts ? (
              <ChevronDown className="w-4 h-4 text-blue-400 ml-auto" />
            ) : (
              <ChevronRight className="w-4 h-4 text-blue-400 ml-auto" />
            )}
          </button>
          
          {showThoughts && (
            <div className="px-3 pb-3 border-t border-blue-500/20">
              {thoughts.map((thought, index) => (
                <div key={index} className="mt-2 p-2 bg-blue-900/30 rounded text-sm text-blue-100 italic">
                  {thought}
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Main Content */}
      <div className="prose prose-invert prose-sm max-w-none">
        <ReactMarkdown
          remarkPlugins={[remarkGfm]}
          rehypePlugins={[rehypeHighlight, rehypeRaw]}
          components={{
            code: ({ node, inline, className, children, ...props }) => {
              const match = /language-(\w+)/.exec(className || '');
              const language = match ? match[1] : '';
              
              if (!inline && language) {
                return (
                  <div className="relative">
                    <div className="absolute top-2 right-2 text-xs text-gray-400 bg-gray-800 px-2 py-1 rounded">
                      {language}
                    </div>
                    <pre className={`${className} !bg-gray-800 !border border-gray-600 rounded-lg p-4`} {...props}>
                      <code className={className} {...props}>
                        {children}
                      </code>
                    </pre>
                  </div>
                );
              }
              
              return (
                <code className="bg-gray-700 text-purple-300 px-1.5 py-0.5 rounded text-sm" {...props}>
                  {children}
                </code>
              );
            },
            pre: ({ children }) => (
              <div className="overflow-x-auto">
                {children}
              </div>
            ),
            p: ({ children }) => (
              <p className="text-gray-100 leading-relaxed mb-3">
                {children}
              </p>
            ),
            h1: ({ children }) => (
              <h1 className="text-xl font-bold text-white mb-3 border-b border-gray-600 pb-2">
                {children}
              </h1>
            ),
            h2: ({ children }) => (
              <h2 className="text-lg font-semibold text-white mb-2">
                {children}
              </h2>
            ),
            h3: ({ children }) => (
              <h3 className="text-base font-medium text-gray-200 mb-2">
                {children}
              </h3>
            ),
            ul: ({ children }) => (
              <ul className="list-disc list-inside text-gray-100 space-y-1 mb-3">
                {children}
              </ul>
            ),
            ol: ({ children }) => (
              <ol className="list-decimal list-inside text-gray-100 space-y-1 mb-3">
                {children}
              </ol>
            ),
            li: ({ children }) => (
              <li className="text-gray-100">
                {children}
              </li>
            ),
            blockquote: ({ children }) => (
              <blockquote className="border-l-4 border-purple-500 pl-4 italic text-gray-300 bg-gray-800/50 py-2 rounded-r">
                {children}
              </blockquote>
            ),
            strong: ({ children }) => (
              <strong className="text-white font-semibold">
                {children}
              </strong>
            ),
            em: ({ children }) => (
              <em className="text-purple-300">
                {children}
              </em>
            ),
          }}
        >
          {mainContent}
        </ReactMarkdown>
      </div>
    </div>
  );
};
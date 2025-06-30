import React from 'react';
import { MessageSquare, ChevronLeft, ChevronRight, Trash2, Clock } from 'lucide-react';
import { Message } from '../types';

interface ConversationSidebarProps {
  messages: Message[];
  isCollapsed: boolean;
  onToggle: () => void;
  onClearHistory: () => void;
}

export const ConversationSidebar: React.FC<ConversationSidebarProps> = ({
  messages,
  isCollapsed,
  onToggle,
  onClearHistory,
}) => {
  const conversationSummary = React.useMemo(() => {
    const userMessages = messages.filter(m => m.role === 'user');
    const assistantMessages = messages.filter(m => m.role === 'assistant');
    
    return {
      totalMessages: messages.length,
      userMessages: userMessages.length,
      assistantMessages: assistantMessages.length,
      lastActivity: messages.length > 0 ? messages[messages.length - 1].timestamp : null
    };
  }, [messages]);

  const getMessagePreview = (content: string, maxLength: number = 50) => {
    const cleaned = content.replace(/```[\s\S]*?```/g, '[Code]').replace(/\n/g, ' ').trim();
    return cleaned.length > maxLength ? cleaned.substring(0, maxLength) + '...' : cleaned;
  };

  return (
    <div className={`bg-gray-800 border-r border-gray-700 transition-all duration-300 ${
      isCollapsed ? 'w-12' : 'w-80'
    } flex flex-col h-full`}>
      {/* Header */}
      <div className="p-3 border-b border-gray-700 flex items-center justify-between">
        {!isCollapsed && (
          <div className="flex items-center gap-2">
            <MessageSquare className="w-5 h-5 text-purple-400" />
            <h3 className="font-medium text-white">Conversation</h3>
          </div>
        )}
        
        <button
          onClick={onToggle}
          className="p-1.5 text-gray-400 hover:text-white hover:bg-gray-700 rounded transition-colors"
          title={isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
        >
          {isCollapsed ? (
            <ChevronRight className="w-4 h-4" />
          ) : (
            <ChevronLeft className="w-4 h-4" />
          )}
        </button>
      </div>

      {!isCollapsed && (
        <>
          {/* Stats */}
          <div className="p-3 border-b border-gray-700 bg-gray-900/50">
            <div className="grid grid-cols-2 gap-3 text-xs">
              <div className="text-center p-2 bg-gray-700/50 rounded">
                <div className="text-purple-400 font-semibold">{conversationSummary.totalMessages}</div>
                <div className="text-gray-400">Messages</div>
              </div>
              <div className="text-center p-2 bg-gray-700/50 rounded">
                <div className="text-blue-400 font-semibold">{conversationSummary.assistantMessages}</div>
                <div className="text-gray-400">AI Responses</div>
              </div>
            </div>
            
            {conversationSummary.lastActivity && (
              <div className="mt-2 text-xs text-gray-400 flex items-center gap-1">
                <Clock className="w-3 h-3" />
                Last: {new Date(conversationSummary.lastActivity).toLocaleTimeString()}
              </div>
            )}
          </div>

          {/* Messages History */}
          <div className="flex-1 overflow-y-auto p-3 space-y-2">
            {messages.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                <MessageSquare className="w-8 h-8 mx-auto mb-2 opacity-50" />
                <p className="text-sm">No messages yet</p>
                <p className="text-xs mt-1">Start a conversation to see history</p>
              </div>
            ) : (
              messages.map((message, index) => (
                <div
                  key={message.id}
                  className={`p-2 rounded-lg text-xs ${
                    message.role === 'user'
                      ? 'bg-purple-600/20 border-l-2 border-purple-500'
                      : 'bg-gray-700/50 border-l-2 border-blue-500'
                  }`}
                >
                  <div className="flex items-center gap-2 mb-1">
                    <span className={`font-medium ${
                      message.role === 'user' ? 'text-purple-300' : 'text-blue-300'
                    }`}>
                      {message.role === 'user' ? 'You' : 'AI'}
                    </span>
                    <span className="text-gray-500">
                      {new Date(message.timestamp).toLocaleTimeString()}
                    </span>
                  </div>
                  <div className="text-gray-300 leading-relaxed">
                    {getMessagePreview(message.content)}
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Actions */}
          {messages.length > 0 && (
            <div className="p-3 border-t border-gray-700">
              <button
                onClick={onClearHistory}
                className="w-full flex items-center gap-2 px-3 py-2 text-red-400 hover:text-red-300 hover:bg-red-900/20 rounded-lg transition-colors text-sm"
              >
                <Trash2 className="w-4 h-4" />
                Clear History
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
};
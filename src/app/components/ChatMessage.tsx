import React from 'react';

interface ChatMessageProps {
  message: string;
  isBot: boolean;
  timestamp: Date;
}

export function ChatMessage({ message, isBot, timestamp }: ChatMessageProps) {
  const formattedTime = timestamp.toLocaleTimeString('ko-KR', {
    hour: '2-digit',
    minute: '2-digit',
  });

  return (
    <div 
      className={`flex ${isBot ? 'justify-start' : 'justify-end'} mb-4 animate-slideIn`}
      style={{
        animation: 'slideIn 0.3s ease-out',
      }}
    >
      <div className={`max-w-[80%] md:max-w-[70%] ${isBot ? 'order-1' : 'order-2'}`}>
        <div
          className={`rounded-2xl px-4 py-3 ${
            isBot
              ? 'bg-[#3a3a3a] text-[#f5f5f5] border-l-4 border-[#ff5555]'
              : 'bg-white text-[#2a2a2a]'
          }`}
          style={{
            wordWrap: 'break-word',
            whiteSpace: 'pre-wrap',
          }}
        >
          <div dangerouslySetInnerHTML={{ __html: message }} />
        </div>
        <div
          className={`text-xs text-gray-500 mt-1 ${
            isBot ? 'text-left' : 'text-right'
          }`}
        >
          {formattedTime}
        </div>
      </div>
    </div>
  );
}

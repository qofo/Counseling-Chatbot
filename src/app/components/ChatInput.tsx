import React, { useState } from 'react';
import { ArrowUp } from 'lucide-react';

interface ChatInputProps {
  onSend: (message: string) => void;
}

export function ChatInput({ onSend }: ChatInputProps) {
  const [input, setInput] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (input.trim()) {
      onSend(input.trim());
      setInput('');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="border-t border-[#3a3a3a] bg-[#2a2a2a] p-4">
      <div className="flex gap-3">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="뭐하세요?"
          className="flex-1 px-4 py-3 bg-[#3a3a3a] text-[#f5f5f5] rounded-full focus:outline-none focus:ring-2 focus:ring-[#ff5555] transition-all placeholder-gray-500"
        />
        <button
          type="submit"
          disabled={!input.trim()}
          className="bg-[#ff5555] text-white rounded-full w-12 h-12 min-w-[48px] min-h-[48px] flex items-center justify-center hover:bg-[#ff3333] disabled:bg-gray-600 disabled:cursor-not-allowed transition-all active:scale-95"
        >
          <ArrowUp size={24} strokeWidth={2.5} />
        </button>
      </div>
    </form>
  );
}

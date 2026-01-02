import React from 'react';

interface QuickChipsProps {
  onChipClick: (text: string) => void;
}

const QUICK_SUGGESTIONS = [
  '연애 시작법',
  '데이트 팁',
  '고백 준비',
  '이별 극복',
];

export function QuickChips({ onChipClick }: QuickChipsProps) {
  return (
    <div className="px-4 pb-3 flex flex-wrap gap-2">
      {QUICK_SUGGESTIONS.map((suggestion) => (
        <button
          key={suggestion}
          onClick={() => onChipClick(suggestion)}
          className="px-4 py-2 border-2 border-[#ff5555] text-[#ff5555] rounded-full hover:bg-[#ff5555] hover:text-white transition-all duration-200 active:scale-95"
        >
          {suggestion}
        </button>
      ))}
    </div>
  );
}

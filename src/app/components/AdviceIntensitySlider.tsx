import React from 'react';
import { Flame } from 'lucide-react';

interface AdviceIntensitySliderProps {
  intensity: number;
  onChange: (value: number) => void;
}

export function AdviceIntensitySlider({ intensity, onChange }: AdviceIntensitySliderProps) {
  return (
    <div className="bg-[#3a3a3a] p-4 rounded-lg border border-[#4a4a4a]">
      <div className="flex items-center gap-2 mb-3">
        <Flame size={20} className="text-[#ff5555]" />
        <h3 className="text-sm font-semibold text-[#f5f5f5]">조언 강도</h3>
      </div>
      
      <div className="space-y-2">
        <input
          type="range"
          min="0"
          max="100"
          value={intensity}
          onChange={(e) => onChange(Number(e.target.value))}
          className="w-full h-2 bg-[#2a2a2a] rounded-lg appearance-none cursor-pointer slider-thumb"
          style={{
            background: `linear-gradient(to right, #ff5555 0%, #ff5555 ${intensity}%, #2a2a2a ${intensity}%, #2a2a2a 100%)`,
          }}
        />
        
        <div className="flex justify-between text-xs text-gray-400">
          <span>순한맛</span>
          <span className="text-[#ff5555] font-semibold">
            {intensity < 30 ? '순한맛' : intensity < 70 ? '중간맛' : '매운맛'}
          </span>
          <span>직설적</span>
        </div>
      </div>
    </div>
  );
}

import React from 'react';

interface KnobProps {
  rotation: number;
  onClick: () => void;
}

export const Knob: React.FC<KnobProps> = ({ rotation, onClick }) => {
  
  const playClickSound = () => {
    try {
      const AudioContext = window.AudioContext || (window as any).webkitAudioContext;
      if (!AudioContext) return;
      
      const ctx = new AudioContext();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.connect(gain);
      gain.connect(ctx.destination);

      // Create a short, mechanical "click"
      osc.type = 'square'; 
      osc.frequency.setValueAtTime(200, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(10, ctx.currentTime + 0.05);
      
      gain.gain.setValueAtTime(0.05, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.05);

      osc.start();
      osc.stop(ctx.currentTime + 0.06);
    } catch (e) {
      // Ignore audio errors (e.g. user hasn't interacted with page yet)
    }
  };

  const handleClick = () => {
    playClickSound();
    onClick();
  };

  return (
    <div className="relative w-24 h-24 sm:w-32 sm:h-32 flex items-center justify-center">
      {/* Knob Shadow/Base */}
      <div className="absolute inset-0 rounded-full bg-stone-500 shadow-inner blur-[1px]"></div>
      
      {/* The Knob Itself */}
      <button
        onClick={handleClick}
        style={{ transform: `rotate(${rotation}deg)` }}
        className="relative w-full h-full rounded-full bg-gradient-to-br from-stone-300 to-stone-600 shadow-[2px_2px_5px_rgba(0,0,0,0.6),-1px_-1px_2px_rgba(255,255,255,0.3)] flex items-center justify-center transition-transform duration-300 ease-out active:scale-95 z-10 border-4 border-stone-400"
        aria-label="Change Artist Type"
      >
        {/* Inner Circle */}
        <div className="w-2/3 h-2/3 rounded-full bg-stone-200 shadow-[inset_1px_1px_4px_rgba(0,0,0,0.3)] flex items-center justify-center relative">
          {/* Indicator Dot */}
          <div className="absolute top-2 w-2 h-2 sm:w-3 sm:h-3 bg-orange-600 rounded-full shadow-[0_0_5px_rgba(255,100,0,1)]"></div>
          
          {/* Grip Texture */}
          <div className="absolute inset-0 rounded-full border-2 border-dashed border-stone-400 opacity-30"></div>
        </div>
      </button>

      {/* Label */}
      <div className="absolute -bottom-8 text-xs font-bold text-stone-400 tracking-widest uppercase font-serif drop-shadow-md">
        TUNING
      </div>
    </div>
  );
};

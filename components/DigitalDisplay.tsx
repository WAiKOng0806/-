import React from 'react';

interface DigitalDisplayProps {
  text: string;
  isScrolling?: boolean;
}

export const DigitalDisplay: React.FC<DigitalDisplayProps> = ({ text, isScrolling }) => {
  return (
    <div className="relative bg-[#1a2e1a] border-4 border-[#2c3e2c] rounded p-1 w-32 h-14 sm:w-40 sm:h-16 flex items-center justify-center overflow-hidden shadow-[inset_0_2px_8px_rgba(0,0,0,0.8)]">
      {/* Screen reflection/glare */}
      <div className="absolute top-0 left-0 w-full h-1/2 bg-gradient-to-b from-white to-transparent opacity-10 pointer-events-none z-10"></div>
      
      {/* Text Container */}
      <div className="w-full h-full flex items-center justify-center">
        <span 
          className={`font-['Orbitron'] text-[#4afc4a] text-lg sm:text-xl font-bold tracking-widest drop-shadow-[0_0_5px_rgba(74,252,74,0.6)] ${isScrolling ? 'animate-pulse' : ''}`}
        >
          {text}
        </span>
      </div>

      {/* Grid Overlay for pixel effect */}
      <div 
        className="absolute inset-0 pointer-events-none opacity-20"
        style={{
            backgroundImage: `linear-gradient(rgba(18, 18, 18, 0.8) 1px, transparent 1px), linear-gradient(90deg, rgba(18, 18, 18, 0.8) 1px, transparent 1px)`,
            backgroundSize: '3px 3px'
        }}
      ></div>
    </div>
  );
};

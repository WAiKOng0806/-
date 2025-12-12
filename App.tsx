import React from 'react';
import { Radio } from './components/Radio';

const App: React.FC = () => {
  return (
    <div className="w-full h-full min-h-screen flex flex-col items-center justify-center p-4">
      <div className="mb-4 text-center z-10">
        <h1 className="text-3xl md:text-5xl font-['Noto_Serif_SC'] font-bold text-[#e0c080] tracking-[0.2em] mb-2 drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]">
            粵語流行台
        </h1>
        <p className="font-mono text-[#a0a0a0] text-xs md:text-sm tracking-widest drop-shadow-md">
            FM 90.3 COMMERCIAL RADIO
        </p>
      </div>
      
      <Radio />

      <footer className="fixed bottom-2 right-4 text-[10px] text-stone-600 font-mono opacity-50">
        POWERED BY GEMINI
      </footer>
    </div>
  );
};

export default App;

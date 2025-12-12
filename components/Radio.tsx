import React, { useState } from 'react';
import { ArtistType, Era, Song } from '../types';
import { Knob } from './Knob';
import { DigitalDisplay } from './DigitalDisplay';
import { fetchRecommendations } from '../services/geminiService';

const ARTIST_TYPES = [ArtistType.MALE, ArtistType.FEMALE, ArtistType.BAND];

// Helper to fetch album covers from iTunes Search API
const fetchAlbumCovers = async (songs: Song[]): Promise<Song[]> => {
  const updatedSongs = await Promise.all(songs.map(async (song) => {
    try {
      const term = `${song.artist} ${song.title}`;
      const response = await fetch(`https://itunes.apple.com/search?term=${encodeURIComponent(term)}&media=music&entity=song&limit=1`);
      const data = await response.json();
      
      if (data.results && data.results.length > 0) {
        const artworkUrl = data.results[0].artworkUrl100.replace('100x100bb', '600x600bb');
        return { ...song, coverUrl: artworkUrl };
      }
    } catch (error) {
      console.warn(`Failed to fetch cover for ${song.title}`, error);
    }
    return { 
        ...song, 
        coverUrl: song.coverUrl || `https://picsum.photos/seed/${encodeURIComponent(song.title)}/400` 
    };
  }));
  return updatedSongs;
};

export const Radio: React.FC = () => {
  const [artistTypeIndex, setArtistTypeIndex] = useState(0);
  const [era, setEra] = useState<Era>(Era.NINETIES);
  const [songs, setSongs] = useState<Song[]>([]);
  const [loading, setLoading] = useState(false);
  const [printed, setPrinted] = useState(false);

  // Knob rotation calculation
  const rotation = artistTypeIndex * 120;

  const handleKnobClick = () => {
    setArtistTypeIndex((prev) => (prev + 1) % ARTIST_TYPES.length);
    setPrinted(false);
  };

  const handleEraChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = parseInt(e.target.value);
    if (val === 0) setEra(Era.EIGHTIES);
    else if (val === 1) setEra(Era.NINETIES);
    else setEra(Era.TWO_THOUSANDS);
    setPrinted(false);
  };

  const getEraValue = () => {
    if (era === Era.EIGHTIES) return 0;
    if (era === Era.NINETIES) return 1;
    return 2;
  };

  const handleGenerate = async () => {
    if (loading) return;
    setLoading(true);
    setPrinted(false);
    
    try {
      const basicList = await fetchRecommendations(ARTIST_TYPES[artistTypeIndex], era);
      const listWithCovers = await fetchAlbumCovers(basicList);
      setSongs(listWithCovers);
      setPrinted(true);
    } catch (error) {
      alert("Signal interference... could not tune in. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative w-full h-full flex flex-col items-center justify-center">
      
      {/* 
         RADIO CONTAINER 
         Moves UP when printed is true.
      */}
      <div 
        className={`relative z-30 transition-all duration-1000 ease-in-out transform ${printed ? '-translate-y-[32vh] scale-90' : 'translate-y-0 scale-100'}`}
      >
        {/* Antenna */}
        <div className="absolute -top-24 right-20 w-1 h-32 bg-stone-500 origin-bottom transform -rotate-12 border-r border-stone-700 z-0"></div>

        {/* Radio Body */}
        <div className="relative w-[90vw] max-w-4xl bg-[#e3ded1] rounded-[3rem] p-4 sm:p-8 shadow-[20px_20px_60px_rgba(0,0,0,0.5),-5px_-5px_20px_rgba(255,255,255,0.1)] border-4 border-[#d6cfbe]">
            {/* Top Metallic Trim */}
            <div className="absolute top-8 left-8 right-8 h-1 bg-gradient-to-r from-transparent via-stone-400 to-transparent opacity-50"></div>

            <div className="flex flex-col md:flex-row gap-6 md:gap-8 items-center justify-between h-full">
            
            {/* Left Speaker / Realistic Vinyl Display Area */}
            <div className="flex-1 w-full h-48 sm:h-64 bg-[#2b2b2b] rounded-2xl shadow-[inset_0_0_20px_rgba(0,0,0,0.8)] border-4 border-[#3a3a3a] relative overflow-hidden flex items-center justify-center group">
                
                {/* Wood/Material texture for inside the cabinet */}
                <div className="absolute inset-0 opacity-30" style={{ backgroundImage: 'url(https://www.transparenttextures.com/patterns/dark-leather.png)' }}></div>

                {/* Turntable Platter (Base) */}
                <div className="absolute w-44 h-44 sm:w-56 sm:h-56 rounded-full bg-stone-800 shadow-2xl border border-stone-700"></div>

                {/* REALISTIC VINYL RECORD */}
                <div 
                  className={`relative w-40 h-40 sm:w-52 sm:h-52 rounded-full shadow-[0_5px_15px_rgba(0,0,0,0.5)] transition-transform duration-[4000ms] linear ${printed ? 'animate-spin' : ''}`}
                  style={{ animationDuration: '3s', animationTimingFunction: 'linear', animationIterationCount: 'infinite' }}
                >
                    {/* Vinyl Black Base + Grooves */}
                    <div className="absolute inset-0 rounded-full vinyl-grooves"></div>
                    
                    {/* Vinyl Shine (Static relative to record, so it rotates with it if not separated. Usually shine is static relative to light source. 
                        For CSS spin, if we put shine inside, it spins. To make it realistic, we often put shine ON TOP of the spinning container. 
                        But here, let's let it spin for a stylized effect or put an overlay outside.) 
                    */}
                    
                    {/* Label Area */}
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-16 h-16 sm:w-20 sm:h-20 bg-orange-700 rounded-full border-4 border-black flex items-center justify-center overflow-hidden">
                        {/* If we have a song, show its cover on the label, spinning */}
                        {songs.length > 0 && printed ? (
                             <img src={songs[0].coverUrl} alt="label" className="w-full h-full object-cover opacity-80" />
                        ) : (
                            <div className="text-[6px] text-center text-orange-200 font-serif leading-tight opacity-70">
                                CANTO<br/>POP<br/>CLASSICS
                            </div>
                        )}
                        <div className="absolute inset-0 rounded-full border border-white/20"></div>
                    </div>

                    {/* Spindle Hole */}
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-2 h-2 bg-stone-300 rounded-full shadow-inner"></div>
                </div>

                {/* Static Shine Overlay (Light reflection doesn't spin) */}
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-40 h-40 sm:w-52 sm:h-52 rounded-full vinyl-shine pointer-events-none opacity-40"></div>

                {/* Tone Arm (Stylized) */}
                <div className={`absolute top-4 right-4 w-2 h-32 bg-stone-400 origin-top transform transition-transform duration-1000 ease-in-out shadow-lg z-20 ${printed ? 'rotate-[25deg]' : 'rotate-0'}`}>
                    <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-4 h-6 bg-stone-700 rounded"></div>
                </div>
                
                {/* Status Text overlay (Small LED) */}
                <div className="absolute bottom-4 left-4 flex items-center gap-2">
                    <div className={`w-2 h-2 rounded-full ${printed ? 'bg-red-500 shadow-[0_0_5px_red]' : 'bg-red-900'}`}></div>
                    <span className="text-[8px] font-mono text-stone-400 tracking-widest">STEREO</span>
                </div>
            </div>

            {/* Right Controls Area */}
            <div className="flex-1 flex flex-col items-center justify-center gap-6 w-full">
                
                <div className="flex items-center gap-6">
                {/* Digital Display */}
                <div className="flex flex-col items-center gap-2">
                    <DigitalDisplay 
                        text={loading ? "SEARCHING" : ARTIST_TYPES[artistTypeIndex]} 
                        isScrolling={loading} 
                    />
                    <span className="text-[10px] text-stone-500 font-mono tracking-widest">BAND SELECTOR</span>
                </div>

                {/* Knob */}
                <Knob rotation={rotation} onClick={handleKnobClick} />
                </div>

                {/* Play Button - Enhanced */}
                <button 
                    onClick={handleGenerate}
                    disabled={loading}
                    className="w-full bg-[#cc4400] hover:bg-[#ff5500] active:bg-[#aa3300] text-[#ffddcc] border-2 border-[#993300] py-4 px-6 rounded-lg shadow-[0_0_15px_rgba(255,85,0,0.4),inset_0_2px_0_rgba(255,255,255,0.2)] active:shadow-none active:translate-y-1 transition-all group disabled:opacity-50 disabled:cursor-not-allowed disabled:shadow-none"
                >
                    <span className="font-['Orbitron'] text-xl font-bold tracking-[0.2em] group-hover:drop-shadow-[0_0_8px_rgba(255,200,200,0.8)]">
                        {loading ? 'TUNING...' : 'PLAY RADIO'}
                    </span>
                </button>

            </div>
            </div>

            {/* Bottom Era Slider - Enhanced Glow */}
            <div className="mt-6 md:mt-8 relative">
            <div className="bg-[#1a1a1a] h-14 sm:h-16 rounded-full w-full flex items-center justify-between px-6 sm:px-10 relative shadow-[inset_0_2px_5px_rgba(0,0,0,0.8)] border-b-2 border-stone-600">
                {/* Scale Markings */}
                <div className="absolute left-10 right-10 top-1/2 -translate-y-1/2 h-0.5 bg-stone-700 z-0"></div>
                
                {[Era.EIGHTIES, Era.NINETIES, Era.TWO_THOUSANDS].map((e) => (
                    <div key={e} className="relative z-10 flex flex-col items-center gap-1 sm:gap-2 pointer-events-none">
                    <div className={`w-1 h-2 sm:h-3 ${era === e ? 'bg-orange-500 shadow-[0_0_8px_#f97316]' : 'bg-stone-600'}`}></div>
                    <span className={`text-[10px] sm:text-xs font-bold font-mono ${era === e ? 'text-orange-400 drop-shadow-[0_0_5px_rgba(249,115,22,0.8)]' : 'text-stone-600'}`}>{e}</span>
                    </div>
                ))}

                {/* Hidden Input for Interaction */}
                <input 
                type="range" 
                min="0" 
                max="2" 
                step="1"
                value={getEraValue()}
                onChange={handleEraChange}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-20"
                />
                
                {/* Visual Indicator (Needle) - Glowing */}
                <div 
                    className="absolute w-1 h-8 sm:h-10 bg-orange-500 shadow-[0_0_15px_rgba(255,100,0,1)] transition-all duration-300 ease-out z-10 pointer-events-none"
                    style={{ 
                        left: `${10 + (getEraValue() * 40)}%`,
                        transform: `translateX(${getEraValue() === 1 ? '-50%' : getEraValue() === 2 ? '0' : '0' })`
                    }}
                >
                    <div className="absolute -top-1 left-1/2 -translate-x-1/2 w-4 h-4 bg-orange-600 rounded-full blur-[2px]"></div>
                </div>
            </div>
            <div className="text-center mt-2 text-[10px] font-bold text-stone-500 tracking-[0.3em] uppercase">Frequency Modulation</div>
            </div>
             {/* Slot Shadow */}
            <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-2/3 h-4 bg-black rounded-full opacity-60 blur-[4px]"></div>
        </div>
      </div>

      {/* 
          RECEIPT PAPER 
          Larger dimensions, larger text.
      */}
      <div 
        className={`
            absolute top-[45%] left-1/2 -translate-x-1/2 z-20 
            w-[95vw] max-w-2xl h-[60vh]
            transition-all duration-1000 ease-out 
            ${printed ? 'translate-y-0 opacity-100 scale-100' : 'translate-y-20 opacity-0 scale-95 pointer-events-none'}
        `}
      >
        <div className="w-full h-full wrinkled-paper-bg relative shadow-[0_20px_50px_rgba(0,0,0,0.5)] flex flex-col">
            
            {/* Receipt Jagged Top */}
            <div 
                className="absolute -top-2 left-0 right-0 h-4 w-full bg-[#fdfbf7]"
                style={{
                    maskImage: 'linear-gradient(45deg, transparent 33%, black 33%, black 66%, transparent 66%)',
                    maskSize: '16px 24px',
                    WebkitMaskImage: 'linear-gradient(45deg, transparent 33%, black 33%, black 66%, transparent 66%)',
                    WebkitMaskSize: '16px 24px',
                    transform: 'rotate(180deg)'
                }}
            ></div>

            {/* Content Area */}
            <div className="flex-1 overflow-y-auto paper-scroll p-8 pb-4">
                {/* Header */}
                <div className="text-center font-['Share_Tech_Mono'] border-b-4 border-dashed border-gray-800 pb-6 mb-6">
                    <h2 className="text-3xl sm:text-4xl font-bold tracking-widest text-black uppercase mb-2">CantoRadio</h2>
                    <div className="inline-block border-2 border-black px-4 py-1 mb-2">
                        <span className="text-lg font-bold">RECOMMENDED PLAYLIST</span>
                    </div>
                    <div className="flex justify-between text-sm sm:text-base text-gray-800 mt-4 uppercase font-bold">
                        <span>FREQ: {era}</span>
                        <span>TYPE: {ARTIST_TYPES[artistTypeIndex]}</span>
                    </div>
                    <div className="text-xs sm:text-sm text-gray-600 mt-2">
                        ISSUED: {new Date().toLocaleString('en-US', { dateStyle: 'long', timeStyle: 'short' }).toUpperCase()}
                    </div>
                </div>

                {/* List */}
                <div className="space-y-6">
                    {songs.map((song, idx) => (
                        <div key={idx} className="flex gap-4 items-center group">
                            {/* Number */}
                            <span className="font-['Share_Tech_Mono'] text-gray-400 text-lg w-8 pt-1 font-bold">{(idx + 1).toString().padStart(2, '0')}</span>
                            
                            {/* Art - Larger */}
                            <div className="w-16 h-16 sm:w-20 sm:h-20 flex-shrink-0 bg-gray-300 shadow-md border-2 border-gray-800 overflow-hidden grayscale-[0.2] group-hover:grayscale-0 transition-all transform group-hover:scale-105">
                                <img src={song.coverUrl} alt="album" className="w-full h-full object-cover" />
                            </div>

                            {/* Details */}
                            <div className="flex-1 min-w-0 font-['Noto_Serif_SC'] border-b-2 border-gray-200 pb-4">
                                <div className="flex justify-between items-start">
                                    <h3 className="font-bold text-lg sm:text-xl text-black leading-tight tracking-wide">{song.title}</h3>
                                    <span className="font-['Share_Tech_Mono'] text-sm text-black font-bold ml-2 bg-gray-100 px-1">{song.duration}</span>
                                </div>
                                <div className="flex justify-between items-center mt-2">
                                    <p className="text-sm sm:text-base font-bold text-gray-700 truncate">{song.artist}</p>
                                    <span className="text-xs sm:text-sm text-gray-500 font-mono border border-gray-400 px-1 rounded">{song.year}</span>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Footer */}
                <div className="mt-12 pt-6 border-t-4 border-dashed border-gray-800 text-center pb-8">
                    <p className="font-['Share_Tech_Mono'] text-base text-gray-600 uppercase mb-4">*** ENJOY THE MUSIC ***</p>
                    {/* Fake Barcode */}
                    <div className="h-16 w-3/4 mx-auto bg-black opacity-90" 
                        style={{
                             maskImage: 'repeating-linear-gradient(90deg, black, black 2px, transparent 2px, transparent 4px, black 4px, black 5px, transparent 5px, transparent 8px)',
                             WebkitMaskImage: 'repeating-linear-gradient(90deg, black, black 2px, transparent 2px, transparent 4px, black 4px, black 5px, transparent 5px, transparent 8px)'
                        }}>
                    </div>
                    <p className="text-sm font-mono tracking-[0.5em] mt-2 font-bold">FM 903-881-224</p>
                </div>
            </div>

            {/* Receipt Jagged Bottom */}
            <div 
                className="absolute -bottom-2 left-0 right-0 h-4 w-full bg-[#fdfbf7]"
                style={{
                    maskImage: 'linear-gradient(45deg, transparent 33%, black 33%, black 66%, transparent 66%)',
                    maskSize: '16px 24px',
                    WebkitMaskImage: 'linear-gradient(45deg, transparent 33%, black 33%, black 66%, transparent 66%)',
                    WebkitMaskSize: '16px 24px',
                }}
            ></div>
        </div>
      </div>
    </div>
  );
};

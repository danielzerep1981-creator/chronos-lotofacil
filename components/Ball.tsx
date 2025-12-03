import React from 'react';

interface BallProps {
  number: number;
  delay: number;
}

export const Ball: React.FC<BallProps> = ({ number, delay }) => {
  // Lotofácil has 15 balls, so we keep them slightly smaller to fit well on mobile
  return (
    <div 
      className="relative flex items-center justify-center w-8 h-8 md:w-10 md:h-10 rounded-full bg-gradient-to-br from-gray-800 to-black border border-neon-purple/30 shadow-[0_0_10px_rgba(188,19,254,0.3)] animate-in fade-in zoom-in duration-500 fill-mode-forwards"
      style={{ animationDelay: `${delay}ms` }}
    >
      <div className="absolute inset-0 rounded-full bg-gradient-to-br from-white/10 to-transparent opacity-50" />
      <span className="text-xs md:text-sm font-bold font-mono text-white drop-shadow-[0_0_5px_rgba(255,255,255,0.8)]">
        {number.toString().padStart(2, '0')}
      </span>
      {/* Decorative ring */}
      <div className="absolute inset-0 rounded-full border border-neon-purple/20 transform scale-110" />
    </div>
  );
};
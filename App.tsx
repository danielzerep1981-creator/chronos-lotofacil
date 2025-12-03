
import React, { useState } from 'react';
import { generateGames } from './services/geminiService';
import { GeneratedGame, StrategyType } from './types';
import { Ball } from './components/Ball';
import { StrategySelector } from './components/StrategySelector';

export default function App() {
  const [games, setGames] = useState<GeneratedGame[]>([]);
  const [quickGame, setQuickGame] = useState<GeneratedGame | null>(null);
  const [loading, setLoading] = useState(false);
  const [quickLoading, setQuickLoading] = useState(false);
  const [strategy, setStrategy] = useState<StrategyType>(StrategyType.BALANCED);
  const [count, setCount] = useState(5);
  // Store a set of expanded indices to manage state individually
  const [expandedIndices, setExpandedIndices] = useState<Set<number>>(new Set());
  const [history, setHistory] = useState<number[][]>([]); // Memory to avoid repeats

  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);
  const [quickCopied, setQuickCopied] = useState(false);

  // Helper to copy text
  const copyToClipboard = async (numbers: number[], isQuick: boolean = false, index: number = 0) => {
    const text = numbers.map(n => n.toString().padStart(2, '0')).join(' ');
    try {
      await navigator.clipboard.writeText(text);
      if (isQuick) {
        setQuickCopied(true);
        setTimeout(() => setQuickCopied(false), 2000);
      } else {
        setCopiedIndex(index);
        setTimeout(() => setCopiedIndex(null), 2000);
      }
    } catch (err) {
      console.error('Failed to copy!', err);
    }
  };

  const handleGenerate = async () => {
    setLoading(true);
    // Pass current history to exclude those games
    const newGames = await generateGames(count, strategy, history);
    
    setGames(newGames);
    
    // Add new unique games to history
    const newHistory = [...history];
    newGames.forEach(g => newHistory.push(g.numbers));
    setHistory(newHistory);
    
    setLoading(false);
    setExpandedIndices(new Set()); // Reset expansions
  };

  const handleQuickGame = async () => {
    setQuickLoading(true);
    // Use BALANCED for quick game, pass history
    const result = await generateGames(1, StrategyType.BALANCED, history);
    if (result && result.length > 0) {
      setQuickGame(result[0]);
      setHistory(prev => [...prev, result[0].numbers]);
    }
    setQuickLoading(false);
  };

  const toggleAnalysis = (idx: number) => {
    const newSet = new Set(expandedIndices);
    if (newSet.has(idx)) {
      newSet.delete(idx);
    } else {
      newSet.add(idx);
    }
    setExpandedIndices(newSet);
  };

  return (
    <div className="min-h-screen bg-dark-bg text-white font-sans selection:bg-neon-blue selection:text-black">
      
      {/* Background Ambience */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] bg-neon-purple/20 blur-[120px] rounded-full mix-blend-screen animate-pulse-slow" />
        <div className="absolute bottom-[-20%] right-[-10%] w-[50%] h-[50%] bg-neon-blue/20 blur-[120px] rounded-full mix-blend-screen animate-pulse-slow" style={{ animationDelay: '1.5s' }} />
      </div>

      <div className="relative max-w-5xl mx-auto px-4 py-12 flex flex-col items-center z-10">
        
        {/* Header */}
        <header className="text-center mb-12 animate-slide-up duration-700">
          <div className="inline-block mb-4 px-4 py-1 rounded-full bg-white/5 border border-white/10 backdrop-blur-md">
            <span className="text-xs font-mono tracking-[0.2em] text-neon-blue">IA GENERATIVA v2.5 • LOTOFÁCIL</span>
          </div>
          <h1 className="text-5xl md:text-7xl font-black tracking-tighter mb-4 text-transparent bg-clip-text bg-gradient-to-r from-white via-gray-200 to-gray-500 neon-text">
            CHRONOS
          </h1>
          <p className="text-gray-400 max-w-lg mx-auto leading-relaxed">
            Algoritmo preditivo de alta precisão treinado em 3 anos de resultados da Lotofácil da Caixa.
            <br/><span className="text-neon-purple text-xs">Probabilidade Base: 1 em 3.268.760</span>
          </p>
        </header>

        {/* Controls */}
        <section className="w-full flex flex-col items-center gap-8 mb-12 animate-fade-in duration-1000 delay-300">
          
          <StrategySelector selected={strategy} onSelect={setStrategy} />

          {/* Game Count Selection */}
          <div className="glass-card p-2 rounded-xl flex gap-2">
            {[1, 5, 10].map((num) => (
              <button
                key={num}
                onClick={() => setCount(num)}
                className={`
                  px-6 py-2 rounded-lg font-mono font-bold transition-all
                  ${count === num 
                    ? 'bg-neon-blue text-black shadow-[0_0_15px_rgba(0,243,255,0.4)] animate-glow' 
                    : 'hover:bg-white/5 text-gray-400'}
                `}
              >
                {num} {num === 1 ? 'JOGO' : 'JOGOS'}
              </button>
            ))}
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col md:flex-row gap-4 w-full max-w-md">
            <button
              onClick={handleGenerate}
              disabled={loading}
              className="flex-1 relative group overflow-hidden px-8 py-4 bg-white text-black font-bold text-lg tracking-widest uppercase rounded-xl transition-all hover:scale-105 hover:shadow-[0_0_30px_rgba(255,255,255,0.3)] disabled:opacity-50 disabled:hover:scale-100"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-neon-blue via-neon-purple to-neon-pink opacity-0 group-hover:opacity-100 transition-opacity duration-300 mix-blend-screen" />
              <span className="relative z-10 flex items-center justify-center gap-2">
                {loading ? (
                  <>
                    <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none"/><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"/></svg>
                    PROCESSANDO...
                  </>
                ) : (
                  'GERAR PALPITES'
                )}
              </span>
            </button>

            <button
              onClick={handleQuickGame}
              disabled={quickLoading}
              className="flex-none px-6 py-4 bg-transparent border border-neon-green/30 text-neon-green font-bold text-lg tracking-widest uppercase rounded-xl transition-all hover:bg-neon-green/10 hover:border-neon-green hover:shadow-[0_0_15px_rgba(10,255,10,0.2)] disabled:opacity-50"
            >
              {quickLoading ? '...' : '⚡ SURPRESA'}
            </button>
          </div>
        </section>

        {/* Quick Game Display */}
        {quickGame && (
           <div className="w-full max-w-3xl mb-12 animate-zoom-in duration-500">
              <div className="relative group">
                <div className="absolute inset-0 bg-neon-green/10 blur-xl rounded-2xl group-hover:bg-neon-green/20 transition-all duration-500"></div>
                <div className="relative glass-card border-neon-green/30 p-8 rounded-2xl">
                    <div className="flex justify-between items-start mb-6">
                      <div className="flex items-center gap-2">
                         <span className="text-2xl">⚡</span>
                         <h3 className="text-xl font-bold text-neon-green tracking-wider">JOGO SURPRESA</h3>
                      </div>
                      <button 
                        onClick={() => copyToClipboard(quickGame.numbers, true)}
                        className="text-xs font-mono uppercase tracking-widest text-neon-green/70 hover:text-white transition-colors flex items-center gap-1"
                      >
                         {quickCopied ? 'COPIADO!' : 'COPIAR'} 
                         <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3"></path></svg>
                      </button>
                    </div>
                    <div className="flex flex-wrap gap-2 md:gap-3 justify-center mb-6">
                      {quickGame.numbers.map((num, i) => (
                        <Ball key={i} number={num} delay={i * 30} />
                      ))}
                    </div>
                    <div className="text-center">
                       <span className="inline-block px-3 py-1 rounded bg-neon-green/10 text-neon-green text-xs font-mono border border-neon-green/20">
                         {quickGame.methodology}
                       </span>
                    </div>
                </div>
              </div>
           </div>
        )}

        {/* Main Results Grid */}
        {games.length > 0 && (
          <div className="w-full grid grid-cols-1 gap-6 animate-slide-up duration-700">
            {games.map((game, idx) => (
              <div key={idx} className="glass-card p-6 md:p-8 rounded-2xl relative overflow-hidden group hover:border-white/20 transition-colors">
                
                {/* Methodology Badge */}
                <div className="absolute top-0 right-0 p-4 opacity-50 group-hover:opacity-100 transition-opacity">
                   <div className="px-3 py-1 rounded-full bg-white/5 border border-white/10 text-[10px] uppercase tracking-wider font-mono text-neon-blue">
                      {game.methodology}
                   </div>
                </div>

                <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-6 gap-4">
                  <div>
                    <h3 className="text-2xl font-bold text-white mb-1">JOGO {idx + 1}</h3>
                    <p className="text-sm font-mono text-gray-400">{game.strategy} • <span className="text-neon-purple">{game.probability}</span></p>
                  </div>
                  
                  <button 
                    onClick={() => copyToClipboard(game.numbers, false, idx)}
                    className="px-4 py-2 rounded-lg bg-white/5 hover:bg-white/10 text-xs font-bold uppercase tracking-widest transition-colors flex items-center gap-2 border border-white/5"
                  >
                    {copiedIndex === idx ? (
                      <span className="text-neon-green">COPIADO!</span>
                    ) : (
                      <>
                        <span>COPIAR</span>
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"></path></svg>
                      </>
                    )}
                  </button>
                </div>

                <div className="flex flex-wrap gap-2 md:gap-3 justify-center md:justify-start mb-6">
                  {game.numbers.map((num, i) => (
                    <Ball key={i} number={num} delay={i * 50} />
                  ))}
                </div>

                {/* Refactored AI Analysis Section */}
                <div className="bg-black/40 rounded-xl p-4 border border-white/5 transition-all duration-300 hover:border-white/10">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-gray-500 uppercase tracking-widest">Análise da IA</span>
                      <div className="h-px w-12 bg-white/10"></div>
                    </div>
                    <button 
                         onClick={() => toggleAnalysis(idx)}
                         className="flex items-center gap-1 text-[10px] text-neon-blue hover:text-white transition-colors uppercase tracking-wider font-bold"
                    >
                         {expandedIndices.has(idx) ? 'Minimizar' : 'Ver Detalhes'}
                         <svg 
                           className={`w-3 h-3 transform transition-transform duration-300 ${expandedIndices.has(idx) ? 'rotate-180' : ''}`} 
                           fill="none" 
                           viewBox="0 0 24 24" 
                           stroke="currentColor"
                         >
                           <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                         </svg>
                    </button>
                  </div>
                  <p className="text-sm text-gray-300 leading-relaxed font-light">
                    {/* Conditionally render truncated or full text based on expansion state */}
                    {expandedIndices.has(idx) 
                      ? game.analysis 
                      : (game.analysis.length > 150 ? `${game.analysis.substring(0, 150)}...` : game.analysis)
                    }
                  </p>
                </div>

              </div>
            ))}
          </div>
        )}

      </div>
    </div>
  );
}

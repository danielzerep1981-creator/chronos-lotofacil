
import React from 'react';
import { StrategyType, StrategyOption } from '../types';

interface StrategySelectorProps {
  selected: StrategyType;
  onSelect: (s: StrategyType) => void;
}

const strategies: StrategyOption[] = [
  {
    id: StrategyType.GOLD_STANDARD,
    label: "Padrão Ouro",
    description: "Fusão suprema de estratégias.",
    icon: "🏆",
    tooltip: "A estratégia definitiva. Combina simultaneamente o Padrão Moldura (9-10 na borda), média perfeita de Primos (5-6) e Fibonacci (4-5), garantindo o equilíbrio estatístico máximo."
  },
  {
    id: StrategyType.HOT_NUMBERS,
    label: "Ciclo & Frequência",
    description: "Dezenas quentes e Ciclo atual.",
    icon: "🔥",
    tooltip: "Analisa o 'Ciclo das Dezenas' da Lotofácil. Identifica números que faltam para fechar o ciclo e combina com as dezenas de maior frequência nos últimos 10 concursos."
  },
  {
    id: StrategyType.COLD_NUMBERS,
    label: "Retorno da Zebra",
    description: "Números atrasados matematicamente.",
    icon: "❄️",
    tooltip: "Foca em dezenas com atraso estatístico anormal. Utiliza a teoria da probabilidade para prever o retorno de números que estão 'dormindo' fora da média histórica."
  },
  {
    id: StrategyType.BALANCED,
    label: "Padrão Moldura",
    description: "Geometria e equilíbrio Par/Ímpar.",
    icon: "⚖️",
    tooltip: "Aplica a estratégia da MOLDURA (números na borda do volante). Estatisticamente, 9 ou 10 números da moldura saem por sorteio. Também busca o equilíbrio 8 Ímpares / 7 Pares."
  },
  {
    id: StrategyType.FIBONACCI_PRIME,
    label: "Primos & Fibonacci",
    description: "Sequências matemáticas puras.",
    icon: "🌀",
    tooltip: "Foca na quantidade ideal de números Primos (média de 5 a 6) e Fibonacci (média de 4 a 5) que compõem a espinha dorsal de 80% dos sorteios da Lotofácil."
  }
];

export const StrategySelector: React.FC<StrategySelectorProps> = ({ selected, onSelect }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full max-w-3xl">
      {strategies.map((strat) => (
        <button
          key={strat.id}
          onClick={() => onSelect(strat.id)}
          className={`
            relative overflow-visible p-4 rounded-xl text-left transition-all duration-300 border
            hover:shadow-[0_0_20px_rgba(0,243,255,0.3)] group z-10 hover:z-20
            ${selected === strat.id 
              ? 'bg-neon-blue/10 border-neon-blue animate-glow' 
              : 'bg-dark-card border-white/5 hover:border-white/20'}
          `}
        >
          {/* Tooltip */}
          <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-3 w-64 opacity-0 group-hover:opacity-100 transition-all duration-300 pointer-events-none transform group-hover:translate-y-0 translate-y-2 z-30">
            <div className="bg-black/95 backdrop-blur-xl border border-neon-blue/30 text-gray-200 text-xs p-3 rounded-lg shadow-[0_0_20px_rgba(0,0,0,0.8)] relative">
              <span className="text-neon-blue font-bold block mb-1 uppercase text-[10px] tracking-wider">Lógica Lotofácil:</span>
              {strat.tooltip}
              {/* Arrow */}
              <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-2 h-2 bg-black border-b border-r border-neon-blue/30 transform rotate-45"></div>
            </div>
          </div>

          <div className="flex items-start justify-between">
            <div>
              <h3 className={`font-bold font-mono mb-1 ${selected === strat.id ? 'text-neon-blue' : 'text-gray-200'}`}>
                {strat.icon} {strat.label}
              </h3>
              <p className="text-xs text-gray-400 font-light">{strat.description}</p>
            </div>
            {selected === strat.id && (
              <div className="h-2 w-2 rounded-full bg-neon-blue shadow-[0_0_10px_#00f3ff] animate-pulse" />
            )}
          </div>
          {selected === strat.id && (
             <div className="absolute bottom-0 left-0 h-0.5 w-full bg-gradient-to-r from-transparent via-neon-blue to-transparent" />
          )}
        </button>
      ))}
    </div>
  );
};

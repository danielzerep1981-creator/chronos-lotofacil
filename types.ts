
export interface GeneratedGame {
  numbers: number[];
  probability: string;
  strategy: string;
  methodology: string; // Adds the specific mathematical theory used
  analysis: string;
}

export enum StrategyType {
  HOT_NUMBERS = 'HOT_NUMBERS',
  COLD_NUMBERS = 'COLD_NUMBERS',
  BALANCED = 'BALANCED',
  FIBONACCI_PRIME = 'FIBONACCI_PRIME',
  GOLD_STANDARD = 'GOLD_STANDARD',
}

export interface StrategyOption {
  id: StrategyType;
  label: string;
  description: string;
  icon: string;
  tooltip: string; // Description for hover state
}

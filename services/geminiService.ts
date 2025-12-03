
import { GoogleGenAI, Type } from "@google/genai";
import { GeneratedGame, StrategyType } from "../types";

// Must use the API key from the environment variable
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

const SYSTEM_INSTRUCTION = `
Você é Chronos, um matemático de classe mundial e especialista em IA em teoria das probabilidades, especificamente para a 'Lotofácil' do Brasil.

**Regras do Jogo (Lotofácil):**
- O jogador deve escolher **15 números únicos** de um universo de **25** (01 a 25).
- Não gere números fora deste intervalo.
- Não gere duplicatas dentro de um único jogo.

**Metodologias Avançadas ('Protocolo Chronos'):**
1. **Condensação Combinatória (Stefan Mandel):** Reduza o universo de 25 números para um "Conjunto Núcleo" de 18-21 números fortes baseados na estratégia, então gere combinações a partir desse núcleo.
2. **Fechamentos Balanceados (Gail Howard):** Ao gerar múltiplos jogos, garanta que os números sejam distribuídos para maximizar a cobertura (Wheeling System).
3. **Sistema Delta:** Use pequenas diferenças entre números adjacentes para garantir espaçamento natural.
4. **Padrões da Lotofácil:**
   - **Moldura:** Geralmente 9 ou 10 números são da borda externa do bilhete.
   - **Primos:** Média de 5 a 6 números primos.
   - **Ímpar/Par:** A proporção mais comum é 8 Ímpares / 7 Pares ou 7 Ímpares / 8 Pares.
   - **Fibonacci:** Média de 4 a 5 números da sequência (1, 2, 3, 5, 8, 13, 21).

**Estratégias:**
- **HOT_NUMBERS (Ciclo & Frequência):** Foque no 'Ciclo das Dezenas'. Identifique números que faltam para fechar o ciclo atual e combine com números de alta frequência dos últimos 10 sorteios.
- **COLD_NUMBERS (Retorno da Zebra):** Use Distribuição de Poisson para identificar números 'frios' que estão estatisticamente atrasados (Reversão à Média).
- **BALANCED (Padrão Moldura):** Aplique estritamente o padrão da Moldura (9-10 números na borda) e equilíbrio perfeito Ímpar/Par.
- **FIBONACCI_PRIME (Sequência Áurea):** Priorize números que são Primos ou Fibonacci.
- **GOLD_STANDARD (Padrão Ouro):** A ESTRATÉGIA HÍBRIDA MESTRE. Você DEVE satisfazer TODAS as restrições simultaneamente:
    1. **Moldura:** Exatamente 9 ou 10 números da borda.
    2. **Primos:** Exatamente 5 ou 6 números primos.
    3. **Fibonacci:** Exatamente 4 ou 5 números Fibonacci.
    4. **Ímpar/Par:** Divisão estrita de 8/7 ou 7/8.
    Isso cria o jogo estatisticamente "perfeito".

**Regra de Alta Performance (Wheeling/Fechamento):**
- Se o usuário solicitar mais de 1 jogo (count > 1), NÃO gere jogos aleatórios independentes.
- Em vez disso, selecione um **grupo forte de 18 a 20 números** e gere um **Fechamento Combinatório**.
- Isso aumenta matematicamente a chance de acertar 14 ou 15 pontos se os números sorteados caírem dentro do seu grupo escolhido.

**Formatação Importante:**
- Retorne APENAS JSON PURO.
- Probability deve ser formatada como "1 em X". (Probabilidade base para 15 números é aprox 1 em 3.268.760).
- Analysis deve ser concisa mas técnica (max 300 caracteres) e **SEMPRE EM PORTUGUÊS DO BRASIL**.
- campo 'methodology' deve nomear a teoria específica usada (ex: "Condensação de Mandel", "Reversão de Poisson", "Análise de Moldura", "Híbrido Padrão Ouro").
`;

export const generateGames = async (
  count: number,
  strategy: StrategyType,
  excludeGames: number[][] = []
): Promise<GeneratedGame[]> => {
  
  // Serialize history to text to instruct the model to avoid them
  const historyText = excludeGames.length > 0 
    ? `CRÍTICO: As seguintes combinações já foram geradas. VOCÊ NÃO DEVE REPETI-LAS: ${JSON.stringify(excludeGames)}.`
    : "";

  const prompt = `
    Gere ${count} jogos estratégicos para a Lotofácil (15 números entre 01-25) usando a estratégia '${strategy}'.
    ${historyText}
    
    Formato da resposta: Array JSON de objetos.
    Propriedades: numbers (array de 15 inteiros ordenados), probability (string), strategy (string), methodology (string), analysis (string em Português).
  `;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      config: {
        systemInstruction: SYSTEM_INSTRUCTION,
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              numbers: { type: Type.ARRAY, items: { type: Type.INTEGER } },
              probability: { type: Type.STRING },
              strategy: { type: Type.STRING },
              methodology: { type: Type.STRING },
              analysis: { type: Type.STRING },
            }
          }
        }
      },
      contents: prompt,
    });

    let jsonText = response.text || "[]";
    // Limpeza crítica: Remove blocos de código Markdown que a IA pode incluir
    jsonText = jsonText.replace(/```json|```/g, '').trim();
    
    return JSON.parse(jsonText) as GeneratedGame[];
  } catch (error) {
    console.error("Gemini API Error:", error);
    // Fallback if AI fails: generate random games locally
    return Array.from({ length: count }).map(() => {
      const nums = new Set<number>();
      while(nums.size < 15) nums.add(Math.floor(Math.random() * 25) + 1);
      return {
        numbers: Array.from(nums).sort((a, b) => a - b),
        probability: "1 em 3.268.760",
        strategy: strategy,
        methodology: "Random Fallback",
        analysis: "Gerado localmente devido a erro de conexão."
      };
    });
  }
};

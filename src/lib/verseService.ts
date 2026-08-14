import { unstable_cache } from "next/cache";

export interface VerseData {
  verse: string;
  reference: string;
  reflection: string;
}

export const FALLBACK_VERSES_NVT: VerseData[] = [
  {
    verse: "Quando jejuarem, não façam como os hipócritas, que fingem sofrimento. Eles tentam parecer desfigurados para que os outros percebam que estão jejuando. Eu lhes digo a verdade: eles já receberam toda a sua recompensa. Mas você, quando jejuar, arrume o cabelo e lave o rosto, para que ninguém perceba que você está jejuando, exceto seu Pai, que está em secreto. E seu Pai, que vê em secreto, o recompensará.",
    reference: "Mateus 6:16-18 (NVT)",
    reflection: "A consagração sincera não busca a aprovação ou os olhares humanos, mas a comunhão profunda e a recompensa do Pai celestial.",
  },
  {
    verse: "Não é este o tipo de jejum que desejo? Libertem os que foram presos injustamente, aliviem a carga dos que são oprimidos, libertem os indefesos e quebrem todo jugo.",
    reference: "Isaías 58:6 (NVT)",
    reflection: "O verdadeiro jejum alinha nosso coração com a compaixão e o poder libertador de Deus para quebrar cadeias e renovar nossa vida.",
  },
  {
    verse: "Por isso o Senhor diz: 'Voltem para mim agora mesmo, de todo o coração! Jejuem, chorem e lamentem!'. Não rasguem as roupas em sinal de tristeza, mas rasguem o coração.",
    reference: "Joel 2:12-13 (NVT)",
    reflection: "O jejum é um retorno sincero ao coração do Pai, onde a transformação começa de dentro para fora.",
  },
  {
    verse: "Assim, jejuamos e oramos intensamente a Deus a esse respeito, e ele ouviu nossas súplicas.",
    reference: "Esdras 8:23 (NVT)",
    reflection: "Quando nos colocamos diante de Deus com humildade e propósito em oração, o Senhor atende e direciona os nossos passos.",
  },
  {
    verse: "Pois posso todas as coisas por meio de Cristo, que me dá forças.",
    reference: "Filipenses 4:13 (NVT)",
    reflection: "Mesmo nos momentos em que o corpo sentir fraqueza, lembre-se de que a força de Cristo habita e sustenta o seu espírito.",
  },
  {
    verse: "Mas os que confiam no Senhor renovam suas forças. Voam alto como águias; correm e não se cansam, caminham e não desfalecem.",
    reference: "Isaías 40:31 (NVT)",
    reflection: "A consagração e a confiança paciente no Senhor restauram a vitalidade física e a clareza espiritual.",
  },
  {
    verse: "Humilhem-se, portanto, sob a mão poderosa de Deus, para que ele os exalte no tempo devido. Entreguem-lhe todas as suas ansiedades, pois ele cuida de vocês.",
    reference: "1 Pedro 5:6-7 (NVT)",
    reflection: "Ao jejuar, entregue suas preocupações e fardos nas mãos de Deus, descansando na certeza do Seu cuidado.",
  },
  {
    verse: "Ó Deus, tu és meu Deus; eu te busco ansiosamente. Minha alma tem sede de ti, meu corpo anseia por ti nesta terra seca e esgotada, onde não há água.",
    reference: "Salmos 63:1 (NVT)",
    reflection: "A fome física do jejum nos lembra de que a nossa maior e mais profunda necessidade é a presença de Deus.",
  },
  {
    verse: "Espere pelo Senhor. Seja forte e corajoso; sim, espere pelo Senhor.",
    reference: "Salmos 27:14 (NVT)",
    reflection: "A disciplina do jejum ensina a nossa alma a esperar e a encontrar força constante no agir de Deus.",
  },
  {
    verse: "Aproximem-se de Deus, e ele se aproximará de vocês. Lavem as mãos, pecadores; purifiquem o coração, vocês que têm a mente dividida.",
    reference: "Tiago 4:8 (NVT)",
    reflection: "Cada hora dedicada ao propósito é um passo de intimidade que atrai a presença manifesta do Senhor sobre sua vida.",
  },
];

/**
 * Retorna a chave do ciclo diário das 03:00 da manhã.
 */
export function getDailyVerseCycleKey(): string {
  const now = new Date();
  const shifted = new Date(now.getTime() - 3 * 60 * 60 * 1000);
  const year = shifted.getFullYear();
  const month = String(shifted.getMonth() + 1).padStart(2, "0");
  const day = String(shifted.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

// In-memory cache de servidor como camada 1
let memoryCache: { cycleKey: string; data: VerseData } | null = null;

async function fetchFromOpenRouter(previousVerse = ""): Promise<VerseData> {
  const apiKey = process.env.OPENROUTER_API_KEY;
  const model = process.env.OPENROUTER_MODEL || "openrouter/free";

  if (!apiKey || apiKey === "chave-do-open-router") {
    const chosen = FALLBACK_VERSES_NVT[Math.floor(Math.random() * FALLBACK_VERSES_NVT.length)];
    return chosen;
  }

  const systemPrompt = `Você é um teólogo e biblista especialista na tradução NVT (Nova Versão Transformadora) da Bíblia Sagrada em Português.

Sua tarefa é retornar estritamente um objeto JSON com as seguintes chaves:
- "verse": O texto EXATO e autêntico do versículo na tradução NVT (Nova Versão Transformadora) em português impecável, sem erros gramaticais, sem palavras inventadas e sem truncar o sentido do texto.
- "reference": O livro, capítulo, versículo e a sigla da versão, exatamente no formato: "Livro Capítulo:Versículo (NVT)" (por exemplo: "Mateus 6:16-18 (NVT)" ou "Isaías 58:6 (NVT)").
- "reflection": Uma breve reflexão devocional de 1 a 2 frases, em português culto e inspirador, relacionando a passagem com o jejum, a oração e o fortalecimento espiritual.

IMPORTANTE: Retorne SOMENTE o JSON puro, sem blocos de código markdown (\`\`\`json), sem aspas extras e sem comentários.`;

  const userPrompt = `Selecione um versículo bíblico da tradução NVT focado em jejum, consagração, oração, busca pela presença de Deus, paciência ou renovação espiritual.
${previousVerse ? `ATENÇÃO: Não repita nem utilize a passagem anterior: "${previousVerse}". Escolha uma passagem diferente.` : ""}`;

  const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "HTTP-Referer": "https://jejum-com-proposito.vercel.app",
      "X-Title": "Jejum com Proposito",
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model: model,
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: userPrompt },
      ],
      temperature: 0.3,
      max_tokens: 350,
    }),
    next: { revalidate: 3600 },
  });

  if (!response.ok) {
    throw new Error(`OpenRouter responded with status: ${response.status}`);
  }

  const json = await response.json();
  const rawContent = json?.choices?.[0]?.message?.content || "";
  const cleanContent = rawContent.replace(/```json/g, "").replace(/```/g, "").trim();
  const parsed = JSON.parse(cleanContent);

  let reference = (parsed.reference || "").trim();
  if (!reference.includes("NVT")) {
    reference = `${reference} (NVT)`;
  }

  return {
    verse: parsed.verse.trim(),
    reference,
    reflection: parsed.reflection?.trim() || "Reserve este momento para interiorizar suas intenções e buscar a Deus em oração.",
  };
}

/**
 * Função executada no servidor para buscar o Versículo do Dia com cache por ciclo das 03:00.
 */
export async function getVerseOfTheDayServer(): Promise<VerseData> {
  const currentCycle = getDailyVerseCycleKey();

  if (memoryCache && memoryCache.cycleKey === currentCycle) {
    return memoryCache.data;
  }

  try {
    const data = await fetchFromOpenRouter();
    memoryCache = {
      cycleKey: currentCycle,
      data,
    };
    return data;
  } catch (error) {
    console.warn("Falha ao buscar versículo via OpenRouter no servidor, usando curadoria NVT:", error);
    const fallback = FALLBACK_VERSES_NVT[0];
    memoryCache = {
      cycleKey: currentCycle,
      data: fallback,
    };
    return fallback;
  }
}

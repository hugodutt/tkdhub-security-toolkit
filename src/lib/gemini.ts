import { GoogleGenerativeAI, HarmCategory, HarmBlockThreshold } from "@google/generative-ai";

// Verifica se a chave da API está disponível
const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
console.log("Chave da API:", apiKey ? "Presente" : "Ausente");

if (!apiKey) {
  console.error("Chave da API do Gemini não encontrada. Verifique o arquivo .env");
}

// Inicializa o cliente do Gemini
const genAI = new GoogleGenerativeAI(apiKey);

// Configuração do modelo
const model = genAI.getGenerativeModel({ 
  model: "gemini-1.5-flash",
  generationConfig: {
    temperature: 0.7,
    topK: 40,
    topP: 0.95,
    maxOutputTokens: 1024,
  },
  safetySettings: [
    {
      category: HarmCategory.HARM_CATEGORY_HARASSMENT,
      threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE
    },
    {
      category: HarmCategory.HARM_CATEGORY_HATE_SPEECH,
      threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE
    },
    {
      category: HarmCategory.HARM_CATEGORY_SEXUALLY_EXPLICIT,
      threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE
    },
    {
      category: HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT,
      threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE
    },
  ],
});

// Função para gerar respostas
export async function generateResponse(prompt: string): Promise<string> {
  try {
    console.log("Enviando prompt para o Gemini:", prompt);
    
    // Pré-processamento do input para evitar bloqueios
    const processInput = (input: string) => {
      // Mantém a estrutura original mas limpa caracteres problemáticos
      let processed = input
        .replace(/\r\n/g, '\n')  // Normaliza quebras de linha
        .replace(/\n\s*\n\s*\n/g, '\n\n')  // Remove múltiplas linhas vazias
        .trim();

      return processed;
    };

    const processedPrompt = processInput(prompt);
    
    // Verifica se é um prompt para geração de template
    const isTemplateGeneration = processedPrompt.includes("Gere um template de email");
    
    // Adiciona um contexto ao prompt
    const fullPrompt = isTemplateGeneration ? processedPrompt : `Você é um especialista em análise técnica de domínios, DNS e infraestrutura.
Analise os dados fornecidos e encontre todas as informações relevantes.

IMPORTANTE: 
1. Analise SEMPRE os nameservers (NS) como potenciais contatos para remoção
2. Grandes provedores de DNS são contatos prioritários para remoção
3. Provedores locais (do mesmo país do registrante) são especialmente relevantes
4. Seja conciso e direto, evite repetir informações
5. Use apenas hífens para listas, sem asteriscos

[RESUMO TÉCNICO]
- Domínio: nome
- Registrar: empresa responsável
- Provedor de DNS: responsável pelos nameservers (CRUCIAL)
- Provedor de Hospedagem: identificado pelo IP
- Status: atual
- Nameservers: lista

[ANÁLISE TÉCNICA]
- DNS: registros encontrados, falhas, configurações
- IP/Rede: provedor, localização, rotas
- Configuração: detalhes relevantes, DNSSEC

[CONTATOS PARA REMOÇÃO] (em ordem de prioridade)
- DNS: contatos do provedor de DNS (principal)
- Registrar: abuse/suporte
- Hosting: contatos do datacenter
- Outros: SOA, técnicos, administrativos

[OBSERVAÇÕES]
- Pontos críticos identificados
- Relações relevantes
- Informações adicionais importantes

Seja direto e evite redundâncias. Foque em informações úteis para remoção.

Dados para análise: ${processedPrompt}`;

    const result = await model.generateContent(fullPrompt);
    const response = await result.response;
    const text = response.text();
    console.log("Resposta recebida do Gemini:", text);
    return text;
  } catch (error) {
    console.error("Erro detalhado ao gerar resposta:", error);
    throw error;
  }
} 
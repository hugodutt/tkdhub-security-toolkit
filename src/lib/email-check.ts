import { env } from "@/env";

interface BouncerDomain {
  name: string;
  acceptAll: "yes" | "no" | "unknown";
  disposable: "yes" | "no" | "unknown";
  free: "yes" | "no" | "unknown";
}

interface BouncerAccount {
  role: "yes" | "no" | "unknown";
  disabled: "yes" | "no" | "unknown";
  fullMailbox: "yes" | "no" | "unknown";
}

interface BouncerDNS {
  type: "MX" | "A";
  record: string;
}

export interface BouncerResponse {
  email: string;
  status: "deliverable" | "risky" | "undeliverable" | "unknown";
  reason: "accepted_email" | "low_deliverability" | "low_quality" | "invalid_email" | 
          "invalid_domain" | "rejected_email" | "dns_error" | "unavailable_smtp" | 
          "unsupported" | "timeout" | "unknown";
  domain: BouncerDomain;
  account: BouncerAccount;
  dns: BouncerDNS;
  provider: string;
  score: number;
  toxic: string;
  toxicity: number;
  retryAfter?: string;
}

export async function verifyEmail(email: string, timeout: number = 10): Promise<BouncerResponse> {
  try {
    // Log da URL completa e headers
    const url = `/api/email-checker?email=${encodeURIComponent(email)}&timeout=${timeout}`;
    console.log('URL da chamada:', url);
    
    const options = {
      method: 'GET',
      headers: {
        'x-api-key': env.VITE_EMAIL_CHECKER_API_KEY,
        'Accept': 'application/json'
      }
    };
    
    console.log('Headers enviados:', {
      'x-api-key': env.VITE_EMAIL_CHECKER_API_KEY ? 'Presente (primeiros 4 caracteres): ' + env.VITE_EMAIL_CHECKER_API_KEY.substring(0, 4) : 'Ausente',
      'Accept': 'application/json'
    });

    const response = await fetch(url, options);
    
    // Log detalhado da resposta
    console.log('Status da resposta:', response.status);
    console.log('Headers da resposta:', Object.fromEntries(response.headers));

    if (!response.ok) {
      const errorBody = await response.text();
      console.error('Erro completo da API:', {
        status: response.status,
        statusText: response.statusText,
        body: errorBody
      });
      
      switch (response.status) {
        case 402:
          throw new Error("Créditos insuficientes para verificação");
        case 429:
          throw new Error("Limite de requisições excedido (máximo 1000/min)");
        case 503:
          throw new Error("Serviço temporariamente indisponível");
        default:
          throw new Error(`Erro na verificação: ${response.statusText} - ${errorBody}`);
      }
    }

    const data = await response.json();
    console.log('Resposta completa da API:', JSON.stringify(data, null, 2));
    return data as BouncerResponse;
  } catch (error) {
    console.error("Erro detalhado ao verificar email:", error);
    throw error;
  }
}

export function getStatusDescription(status: string): string {
  switch (status) {
    case "deliverable":
      return "O email existe e é seguro para envio";
    case "risky":
      return "O email pode resultar em bounce ou baixo engajamento";
    case "undeliverable":
      return "O endereço está incorreto ou não existe";
    case "unknown":
      return "Não foi possível verificar o email";
    default:
      return "Status desconhecido";
  }
}

export function getReasonDescription(reason: string): string {
  switch (reason) {
    case "accepted_email":
      return "Email aceito e válido";
    case "low_deliverability":
      return "Email parece entregável, mas a entrega não pode ser garantida";
    case "low_quality":
      return "Email tem problemas de qualidade que podem torná-lo arriscado";
    case "invalid_email":
      return "Email tem sintaxe inválida";
    case "invalid_domain":
      return "Domínio não existe ou não tem registros DNS válidos";
    case "rejected_email":
      return "Email foi rejeitado pelo servidor SMTP, não existe";
    case "dns_error":
      return "Não foi possível resolver registros DNS ou domínio mal configurado";
    case "unavailable_smtp":
      return "Servidor SMTP indisponível";
    case "unsupported":
      return "Provedor de email não suportado";
    case "timeout":
      return "Verificação excedeu o tempo limite";
    case "unknown":
      return "Erro inesperado ocorreu";
    default:
      return "Razão desconhecida";
  }
} 
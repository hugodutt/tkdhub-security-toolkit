
import { useState, useRef, useEffect } from "react";
import Navbar from "@/components/Navbar";
import { MessageCircle, Send, Bot, Loader2, User, RefreshCcw } from "lucide-react";

interface Message {
  id: string;
  text: string;
  sender: "user" | "bot";
  timestamp: Date;
}

const ChatbotPage = () => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "welcome",
      text: "Olá! Sou o assistente de segurança do TKDHub. Como posso ajudar você com segurança web ou diagnóstico hoje?",
      sender: "bot",
      timestamp: new Date()
    }
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    scrollToBottom();
  }, [messages]);
  
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;
    
    // Adicionar mensagem do usuário
    const userMessage: Message = {
      id: `user-${Date.now()}`,
      text: input,
      sender: "user",
      timestamp: new Date()
    };
    
    setMessages(prev => [...prev, userMessage]);
    setInput("");
    setIsLoading(true);
    
    // Simular resposta do bot após um delay
    setTimeout(() => {
      const botResponses: Record<string, string[]> = {
        "segurança": [
          "A segurança web envolve vários aspectos, incluindo HTTPS, Headers de segurança, proteção contra XSS e CSRF, e autenticação robusta. Qual aspecto você gostaria de explorar mais?",
          "Recomendo algumas práticas essenciais de segurança: utilizar HTTPS, implementar CSP (Content Security Policy), manter bibliotecas atualizadas e realizar testes de penetração regularmente."
        ],
        "ssl": [
          "Certificados SSL/TLS são essenciais para criptografar a comunicação entre o navegador e o servidor. Você pode obter certificados gratuitos através do Let's Encrypt ou comprar de autoridades certificadoras comerciais.",
          "Para verificar a configuração SSL do seu site, você pode usar ferramentas como SSL Labs ou Mozilla Observatory."
        ],
        "senha": [
          "Para senhas seguras, recomendo: mínimo de 12 caracteres, combinação de letras (maiúsculas e minúsculas), números e símbolos, e implementação de autenticação de dois fatores (2FA).",
          "Evite armazenar senhas em texto plano, sempre utilize algoritmos de hash seguros como bcrypt ou Argon2 com salt adequado."
        ],
        "xss": [
          "A vulnerabilidade XSS (Cross-Site Scripting) ocorre quando uma aplicação web permite que código JavaScript malicioso seja injetado e executado. Para prevenir, escape ou sanitize inputs e implemente o header Content-Security-Policy.",
          "Existem três tipos principais de XSS: Reflected, Stored e DOM-based. Cada um exige diferentes estratégias de mitigação."
        ],
        "sql": [
          "Para prevenir SQL Injection, utilize consultas parametrizadas ou prepared statements, nunca concatene strings SQL diretamente com inputs do usuário.",
          "ORMs (Object-Relational Mappings) como Sequelize, Prisma ou TypeORM podem ajudar a prevenir SQL Injection automaticamente."
        ],
        "api": [
          "Para APIs seguras, recomendo: autenticação via JWT ou OAuth2, rate limiting, validação de inputs, CORS configurado corretamente e documentação com OpenAPI/Swagger.",
          "Considere implementar API keys para identificação de clientes e tokens JWT com tempo de expiração curto para autenticação."
        ],
        "malware": [
          "Para detectar malware em seu site, utilize ferramentas como Google Safe Browsing, Sucuri SiteCheck ou ClamAV para varreduras regulares.",
          "Sinais de comprometimento incluem redirecionamentos inesperados, scripts desconhecidos, arquivos modificados e quedas de desempenho."
        ],
        "firewall": [
          "Um WAF (Web Application Firewall) ajuda a proteger aplicações web contra ataques comuns como XSS, SQLi e DDoS. Soluções populares incluem Cloudflare, AWS WAF e ModSecurity.",
          "Configure regras personalizadas em seu WAF com base nos padrões de tráfego específicos da sua aplicação."
        ],
        "oi": [
          "Olá! Como posso ajudar você hoje com segurança web ou diagnóstico?",
          "Oi! Estou aqui para responder suas dúvidas sobre segurança e ferramentas de diagnóstico. O que gostaria de saber?"
        ]
      };
      
      // Encontrar palavras-chave na mensagem do usuário
      const userInput = input.toLowerCase();
      let botResponse = "Não tenho informações específicas sobre isso, mas posso ajudar com questões de segurança web, SSL/TLS, senhas seguras, proteção contra XSS e SQL injection, configuração de APIs, detecção de malware e firewalls. Pergunte-me sobre esses tópicos!";
      
      // Procurar palavras-chave e selecionar respostas relevantes
      for (const [keyword, responses] of Object.entries(botResponses)) {
        if (userInput.includes(keyword)) {
          const randomIndex = Math.floor(Math.random() * responses.length);
          botResponse = responses[randomIndex];
          break;
        }
      }
      
      // Processa mensagens específicas sobre ferramentas
      if (userInput.includes("ferramenta") || userInput.includes("tool")) {
        botResponse = "O TKDHub oferece diversas ferramentas de segurança e diagnóstico web, incluindo URL Dedupe para identificar URLs duplicadas, Email Checker para verificar validade de emails, WHOIS para consultar informações de domínios, e este Chatbot para tirar suas dúvidas sobre segurança web.";
      }
      
      // Adicionar resposta do bot
      const botMessage: Message = {
        id: `bot-${Date.now()}`,
        text: botResponse,
        sender: "bot",
        timestamp: new Date()
      };
      
      setMessages(prev => [...prev, botMessage]);
      setIsLoading(false);
    }, 1500);
  };
  
  const handleReset = () => {
    setMessages([
      {
        id: "welcome",
        text: "Olá! Sou o assistente de segurança do TKDHub. Como posso ajudar você com segurança web ou diagnóstico hoje?",
        sender: "bot",
        timestamp: new Date()
      }
    ]);
  };
  
  const formatTime = (date: Date) => {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };
  
  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Navbar />
      
      <main className="flex-grow container mx-auto px-4 py-8 flex flex-col">
        <div className="mb-6">
          <div className="flex items-center mb-4">
            <MessageCircle className="w-6 h-6 text-primary mr-2" />
            <h1 className="text-2xl font-bold">Chatbot de Segurança</h1>
          </div>
          <p className="text-muted-foreground">
            Converse com nosso assistente virtual especializado em segurança web e diagnóstico.
          </p>
        </div>
        
        <div className="flex-grow flex flex-col max-w-4xl mx-auto w-full">
          <div className="bg-card rounded-lg shadow-md flex flex-col flex-grow overflow-hidden">
            {/* Chat header */}
            <div className="flex items-center justify-between p-4 border-b border-border">
              <div className="flex items-center">
                <div className="bg-primary/20 p-1.5 rounded-full mr-3">
                  <Bot className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <h3 className="font-medium">Assistente TKDHub</h3>
                  <p className="text-xs text-muted-foreground">Especialista em segurança web</p>
                </div>
              </div>
              
              <button 
                onClick={handleReset}
                className="p-2 hover:bg-secondary rounded-md transition-colors"
                aria-label="Reset conversation"
                title="Reiniciar conversa"
              >
                <RefreshCcw className="w-4 h-4 text-muted-foreground" />
              </button>
            </div>
            
            {/* Chat messages */}
            <div className="flex-grow overflow-y-auto p-4 space-y-4">
              {messages.map((message) => (
                <div 
                  key={message.id} 
                  className={`flex ${message.sender === 'bot' ? 'justify-start' : 'justify-end'}`}
                >
                  <div 
                    className={`max-w-[80%] px-4 py-3 rounded-lg ${
                      message.sender === 'bot' 
                        ? 'bg-secondary text-foreground' 
                        : 'bg-primary text-primary-foreground'
                    }`}
                  >
                    <div className="flex items-center mb-1">
                      {message.sender === 'bot' ? (
                        <Bot className="w-4 h-4 mr-1" />
                      ) : (
                        <User className="w-4 h-4 mr-1" />
                      )}
                      <span className="text-xs opacity-75">
                        {message.sender === 'bot' ? 'Assistente' : 'Você'} • {formatTime(message.timestamp)}
                      </span>
                    </div>
                    <p className="whitespace-pre-wrap">{message.text}</p>
                  </div>
                </div>
              ))}
              
              {isLoading && (
                <div className="flex justify-start">
                  <div className="max-w-[80%] px-4 py-3 rounded-lg bg-secondary">
                    <div className="flex items-center">
                      <Bot className="w-4 h-4 mr-2" />
                      <div className="flex space-x-1">
                        <div className="w-2 h-2 rounded-full bg-muted-foreground/40 animate-pulse"></div>
                        <div className="w-2 h-2 rounded-full bg-muted-foreground/40 animate-pulse delay-75"></div>
                        <div className="w-2 h-2 rounded-full bg-muted-foreground/40 animate-pulse delay-150"></div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
              
              <div ref={messagesEndRef} />
            </div>
            
            {/* Chat input */}
            <div className="p-4 border-t border-border">
              <form onSubmit={handleSubmit} className="flex items-center">
                <input
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="Digite sua mensagem..."
                  className="flex-grow px-4 py-2 bg-secondary rounded-l-md border border-r-0 border-border focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                  disabled={isLoading}
                />
                <button
                  type="submit"
                  disabled={isLoading || !input.trim()}
                  className={`px-4 py-2 rounded-r-md ${
                    isLoading || !input.trim() 
                      ? 'bg-primary/70 cursor-not-allowed' 
                      : 'bg-primary hover:bg-primary/90'
                  } text-primary-foreground transition-colors`}
                >
                  {isLoading ? (
                    <Loader2 className="w-5 h-5 animate-spin" />
                  ) : (
                    <Send className="w-5 h-5" />
                  )}
                </button>
              </form>
              
              <div className="mt-2 text-center">
                <span className="text-xs text-muted-foreground">
                  Experimente perguntar sobre: SSL/TLS, senhas seguras, XSS, SQL injection, ferramentas
                </span>
              </div>
            </div>
          </div>
        </div>
      </main>
      
      <footer className="bg-card mt-auto py-6">
        <div className="container mx-auto px-4 text-center text-sm text-foreground/60">
          &copy; {new Date().getFullYear()} TKDHub. Todos os direitos reservados.
        </div>
      </footer>
    </div>
  );
};

export default ChatbotPage;

import { useState, useRef, useEffect } from "react";
import Navbar from "@/components/Navbar";
import { MessageCircle, Send, Bot, Loader2, User, RefreshCcw } from "lucide-react";
import { generateResponse } from "@/lib/gemini";

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
      text: "Olá! Sou o assistente de segurança do TKDHub, agora com o poder do Gemini. Como posso ajudar você com segurança web ou diagnóstico hoje?",
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
  
  const handleSubmit = async (e: React.FormEvent) => {
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
    
    try {
      console.log("Iniciando geração de resposta para:", input);
      // Gerar resposta usando o Gemini
      const botResponse = await generateResponse(input);
      console.log("Resposta recebida:", botResponse);
      
      // Adicionar resposta do bot
      const botMessage: Message = {
        id: `bot-${Date.now()}`,
        text: botResponse,
        sender: "bot",
        timestamp: new Date()
      };
      
      setMessages(prev => [...prev, botMessage]);
    } catch (error) {
      console.error("Erro detalhado no handleSubmit:", error);
      const errorMessage: Message = {
        id: `bot-${Date.now()}`,
        text: "Desculpe, ocorreu um erro ao processar sua mensagem. Por favor, tente novamente.",
        sender: "bot",
        timestamp: new Date()
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleReset = () => {
    setMessages([
      {
        id: "welcome",
        text: "Olá! Sou o assistente de segurança do TKDHub, agora com o poder do Gemini. Como posso ajudar você com segurança web ou diagnóstico hoje?",
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

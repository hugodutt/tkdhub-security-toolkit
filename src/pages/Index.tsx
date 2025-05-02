
import { 
  Link2, 
  Mail, 
  Globe, 
  MessageSquare,
  Shield
} from "lucide-react";
import Navbar from "@/components/Navbar";
import ToolCard from "@/components/ToolCard";

const Index = () => {
  const tools = [
    {
      title: "URL Dedupe",
      description: "Identifique URLs duplicadas em uma lista, agrupando por domínio e TLD, mesmo com paths diferentes.",
      icon: <Link2 size={24} />,
      path: "/tools/url-dedupe"
    },
    {
      title: "Email Checker",
      description: "Verifique se um endereço de email está ativo e válido através de verificações de domínio e servidor.",
      icon: <Mail size={24} />,
      path: "/tools/email-check"
    },
    {
      title: "WHOIS",
      description: "Consulte dados WHOIS de um domínio para obter informações sobre o registrante, datas e servidores DNS.",
      icon: <Globe size={24} />,
      path: "/tools/whois"
    },
    {
      title: "Chatbot",
      description: "Interaja com um chatbot de segurança para solucionar dúvidas e receber orientações sobre segurança web.",
      icon: <MessageSquare size={24} />,
      path: "/tools/chatbot"
    }
  ];

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Navbar />
      
      <main className="flex-grow container mx-auto px-4 py-8">
        <section className="mb-16">
          <div className="text-center max-w-3xl mx-auto">
            <div className="inline-flex justify-center items-center mb-6">
              <Shield className="w-12 h-12 text-primary mr-3" />
              <h1 className="text-4xl font-bold tracking-tight">TKDHub</h1>
            </div>
            <p className="text-xl text-muted-foreground mb-8">
              Hub de ferramentas de segurança e diagnóstico web
            </p>
          </div>
        </section>
        
        <section>
          <h2 className="text-2xl font-bold mb-8">Ferramentas Disponíveis</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {tools.map((tool) => (
              <ToolCard
                key={tool.title}
                title={tool.title}
                description={tool.description}
                icon={tool.icon}
                path={tool.path}
              />
            ))}
          </div>
        </section>
      </main>
      
      <footer className="bg-card mt-auto py-8">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-center mb-4">
            <Shield className="w-6 h-6 text-primary mr-2" />
            <span className="text-lg font-bold">TKDHub</span>
          </div>
          <div className="text-center text-sm text-foreground/60">
            &copy; {new Date().getFullYear()} TKDHub. Todos os direitos reservados.
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;

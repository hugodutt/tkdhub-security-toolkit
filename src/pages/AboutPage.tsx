
import Navbar from "@/components/Navbar";
import { Shield } from "lucide-react";

const AboutPage = () => {
  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Navbar />
      
      <main className="flex-grow container mx-auto px-4 py-12">
        <div className="max-w-3xl mx-auto">
          <div className="flex items-center mb-8">
            <Shield className="w-8 h-8 text-primary mr-3" />
            <h1 className="text-3xl font-bold">Sobre o TKDHub</h1>
          </div>
          
          <div className="space-y-8">
            <section>
              <h2 className="text-2xl font-semibold mb-4">Nossa Missão</h2>
              <p className="text-muted-foreground leading-relaxed">
                O TKDHub é um hub de ferramentas de segurança e diagnóstico web desenvolvido para fornecer 
                recursos gratuitos e fáceis de usar para profissionais de segurança, desenvolvedores e 
                entusiastas de tecnologia. Nosso objetivo é democratizar o acesso a ferramentas de 
                segurança de alta qualidade, permitindo que qualquer pessoa possa diagnosticar 
                problemas e melhorar a segurança de seus projetos web.
              </p>
            </section>
            
            <section>
              <h2 className="text-2xl font-semibold mb-4">Ferramentas Disponíveis</h2>
              <div className="space-y-4">
                <div className="bg-card p-4 rounded-md">
                  <h3 className="font-medium text-lg">URL Dedupe</h3>
                  <p className="text-muted-foreground">
                    Identifique URLs duplicadas em uma lista, agrupando por domínio e TLD, mesmo com paths diferentes.
                    Útil para auditoria de SEO e detecção de conteúdo duplicado.
                  </p>
                </div>
                
                <div className="bg-card p-4 rounded-md">
                  <h3 className="font-medium text-lg">Email Checker</h3>
                  <p className="text-muted-foreground">
                    Verifique se um endereço de email está ativo e válido através de verificações 
                    de domínio e servidor. Ideal para validar listas de email e reduzir taxas de bounce.
                  </p>
                </div>
                
                <div className="bg-card p-4 rounded-md">
                  <h3 className="font-medium text-lg">WHOIS</h3>
                  <p className="text-muted-foreground">
                    Consulte dados WHOIS de um domínio para obter informações sobre o registrante, 
                    datas e servidores DNS. Essencial para investigações de segurança e due diligence.
                  </p>
                </div>
                
                <div className="bg-card p-4 rounded-md">
                  <h3 className="font-medium text-lg">Chatbot</h3>
                  <p className="text-muted-foreground">
                    Interaja com um chatbot de segurança alimentado por IA para solucionar dúvidas e 
                    receber orientações sobre segurança web. Uma forma rápida de obter insights 
                    sobre melhores práticas.
                  </p>
                </div>
              </div>
            </section>
            
            <section>
              <h2 className="text-2xl font-semibold mb-4">Tecnologias</h2>
              <p className="text-muted-foreground mb-4 leading-relaxed">
                O TKDHub foi desenvolvido utilizando tecnologias modernas e de código aberto:
              </p>
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-card p-4 rounded-md">
                  <h3 className="font-medium">Front-end</h3>
                  <ul className="text-muted-foreground list-disc ml-5 mt-2">
                    <li>React</li>
                    <li>Tailwind CSS</li>
                    <li>TypeScript</li>
                  </ul>
                </div>
                <div className="bg-card p-4 rounded-md">
                  <h3 className="font-medium">Back-end</h3>
                  <ul className="text-muted-foreground list-disc ml-5 mt-2">
                    <li>Node.js</li>
                    <li>TypeScript</li>
                    <li>API RESTful</li>
                  </ul>
                </div>
              </div>
            </section>
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

export default AboutPage;

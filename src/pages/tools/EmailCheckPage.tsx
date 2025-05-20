import { useState } from "react";
import Navbar from "@/components/Navbar";
import { Mail, ArrowRight, Check, X, AlertCircle, Loader2 } from "lucide-react";
import { verifyEmail, BouncerResponse } from "@/lib/email-check";

interface EmailCheckResult {
  email: string;
  status: "deliverable" | "undeliverable" | "risky" | "unknown";
  info: {
    format: boolean;
    domain: boolean;
    mx: boolean;
    disposable: boolean;
    smtp: boolean;
    message?: string;
  };
}

const EmailCheckPage = () => {
  const [emails, setEmails] = useState<string>("");
  const [results, setResults] = useState<EmailCheckResult[] | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    setIsLoading(true);
    setResults(null);
    
    try {
      const emailList = emails.split("\n")
        .filter(email => email.trim() !== "")
        .map(email => email.trim());
      
      const checkResults = await Promise.all(
        emailList.map(async (email) => {
          try {
            const response = await verifyEmail(email);
            const result: EmailCheckResult = {
              email,
              status: response.status,
              info: {
                format: response.reason !== "invalid_email",
                domain: response.domain?.name ? true : false,
                mx: response.dns?.type === "MX",
                disposable: response.domain?.disposable === "yes",
                smtp: response.status === "deliverable",
                message: response.reason
              }
            };
            return result;
          } catch (error) {
            const errorResult: EmailCheckResult = {
              email,
              status: "unknown",
              info: {
                format: true,
                domain: false,
                mx: false,
                disposable: false,
                smtp: false,
                message: error instanceof Error ? error.message : "Erro na verificação"
              }
            };
            return errorResult;
          }
        })
      );
      
      setResults(checkResults);
    } catch (error) {
      console.error("Erro ao verificar emails:", error);
    } finally {
      setIsLoading(false);
    }
  };
  
  const getStatusIcon = (status: string) => {
    switch (status) {
      case "deliverable":
        return <Check className="h-4 w-4 text-green-500" />;
      case "undeliverable":
        return <X className="h-4 w-4 text-red-500" />;
      case "risky":
      case "unknown":
        return <AlertCircle className="h-4 w-4 text-yellow-500" />;
      default:
        return null;
    }
  };
  
  const getStatusText = (status: string) => {
    switch (status) {
      case "deliverable":
        return "Válido";
      case "undeliverable":
        return "Inválido";
      case "risky":
        return "Risco";
      case "unknown":
        return "Inconclusivo";
      default:
        return "Desconhecido";
    }
  };
  
  const getStatusClass = (status: string) => {
    switch (status) {
      case "deliverable":
        return "bg-green-500/10 text-green-500";
      case "undeliverable":
        return "bg-red-500/10 text-red-500";
      case "risky":
      case "unknown":
        return "bg-yellow-500/10 text-yellow-500";
      default:
        return "bg-gray-500/10 text-gray-500";
    }
  };
  
  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Navbar />
      
      <main className="flex-grow container mx-auto px-4 py-8">
        <div className="mb-8">
          <div className="flex items-center mb-4">
            <Mail className="w-6 h-6 text-primary mr-2" />
            <h1 className="text-2xl font-bold">Email Checker</h1>
          </div>
          <p className="text-muted-foreground">
            Verifique se endereços de email estão ativos e válidos através de múltiplas verificações.
          </p>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Form */}
          <div>
            <div className="bg-card rounded-lg p-6 shadow-md">
              <h2 className="text-lg font-semibold mb-4">Insira seus emails</h2>
              <p className="text-sm text-muted-foreground mb-4">
                Coloque um email por linha. O sistema verificará cada endereço.
              </p>
              
              <form onSubmit={handleSubmit}>
                <div className="mb-4">
                  <textarea
                    value={emails}
                    onChange={(e) => setEmails(e.target.value)}
                    placeholder="usuario@gmail.com&#10;contato@empresa.com.br&#10;teste@exemplo.com"
                    rows={10}
                    className="w-full px-3 py-2 bg-secondary rounded-md border border-border focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                    required
                  />
                </div>
                
                <button
                  type="submit"
                  disabled={isLoading || emails.trim() === ""}
                  className={`w-full flex justify-center items-center py-2.5 rounded-md text-sm font-medium ${
                    isLoading || emails.trim() === "" 
                      ? "bg-primary/70 cursor-not-allowed" 
                      : "bg-primary hover:bg-primary/90"
                  } text-primary-foreground transition-colors`}
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Verificando...
                    </>
                  ) : (
                    <>
                      Verificar emails <ArrowRight className="ml-2 h-4 w-4" />
                    </>
                  )}
                </button>
              </form>
              
              <div className="mt-4">
                <h3 className="text-sm font-medium mb-2">O que verificamos:</h3>
                <ul className="text-xs text-muted-foreground space-y-1">
                  <li>• Formato do email</li>
                  <li>• Existência do domínio</li>
                  <li>• Registros MX</li>
                  <li>• Emails temporários/descartáveis</li>
                  <li>• Validação SMTP (quando possível)</li>
                </ul>
              </div>
            </div>
          </div>
          
          {/* Results */}
          <div>
            <div className="bg-card rounded-lg p-6 shadow-md">
              <h2 className="text-lg font-semibold mb-4">Resultados</h2>
              
              {isLoading && (
                <div className="flex flex-col items-center justify-center h-64">
                  <Loader2 className="h-8 w-8 text-primary animate-spin mb-4" />
                  <p className="text-muted-foreground">Verificando emails...</p>
                </div>
              )}
              
              {!isLoading && !results && (
                <div className="flex flex-col items-center justify-center h-64 text-muted-foreground">
                  <Mail className="h-12 w-12 mb-4 opacity-20" />
                  <p>Os resultados aparecerão aqui</p>
                </div>
              )}
              
              {!isLoading && results && results.length === 0 && (
                <div className="flex flex-col items-center justify-center h-64 text-muted-foreground">
                  <p>Nenhum resultado encontrado</p>
                </div>
              )}
              
              {!isLoading && results && results.length > 0 && (
                <div className="space-y-4 max-h-[500px] overflow-y-auto pr-2">
                  {results.map((result, index) => (
                    <div key={index} className="bg-secondary/50 p-4 rounded-md">
                      <div className="flex items-center justify-between mb-2">
                        <div className="font-medium break-all">{result.email}</div>
                        <div className={`text-xs px-2 py-0.5 rounded-full flex items-center ${getStatusClass(result.status)}`}>
                          {getStatusIcon(result.status)}
                          <span className="ml-1">{getStatusText(result.status)}</span>
                        </div>
                      </div>
                      
                      <div className="mt-3 pt-3 border-t border-border/40">
                        <div className="grid grid-cols-2 gap-2 text-xs">
                          <div className="flex items-center">
                            <span className="mr-2">Formato:</span>
                            {result.info.format ? 
                              <Check className="h-3.5 w-3.5 text-green-500" /> : 
                              <X className="h-3.5 w-3.5 text-red-500" />}
                          </div>
                          <div className="flex items-center">
                            <span className="mr-2">Domínio:</span>
                            {result.info.domain ? 
                              <Check className="h-3.5 w-3.5 text-green-500" /> : 
                              <X className="h-3.5 w-3.5 text-red-500" />}
                          </div>
                          <div className="flex items-center">
                            <span className="mr-2">MX:</span>
                            {result.info.mx ? 
                              <Check className="h-3.5 w-3.5 text-green-500" /> : 
                              <X className="h-3.5 w-3.5 text-red-500" />}
                          </div>
                          <div className="flex items-center">
                            <span className="mr-2">SMTP:</span>
                            {result.info.smtp ? 
                              <Check className="h-3.5 w-3.5 text-green-500" /> : 
                              <X className="h-3.5 w-3.5 text-red-500" />}
                          </div>
                          <div className="flex items-center col-span-2">
                            <span className="mr-2">Temporário:</span>
                            {result.info.disposable ? 
                              <Check className="h-3.5 w-3.5 text-yellow-500" /> : 
                              <X className="h-3.5 w-3.5 text-green-500" />}
                          </div>
                        </div>
                        
                        {result.info.message && (
                          <div className="mt-2 text-xs text-muted-foreground p-2 bg-secondary/30 rounded">
                            {result.info.message}
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
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

export default EmailCheckPage;

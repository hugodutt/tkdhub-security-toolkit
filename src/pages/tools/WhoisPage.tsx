
import { useState } from "react";
import Navbar from "@/components/Navbar";
import { Globe, ArrowRight, Calendar, Database, Server, Shield, Loader2 } from "lucide-react";

interface WhoisResult {
  domain: string;
  registrar: string;
  createdDate: string;
  expiryDate: string;
  updatedDate: string;
  nameServers: string[];
  status: string[];
  registrant?: {
    name?: string;
    organization?: string;
    country?: string;
  };
  error?: string;
}

const WhoisPage = () => {
  const [domains, setDomains] = useState<string>("");
  const [results, setResults] = useState<WhoisResult[] | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [selectedDomain, setSelectedDomain] = useState<string | null>(null);
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    setIsLoading(true);
    setResults(null);
    setSelectedDomain(null);
    
    // Simular uma chamada à API
    setTimeout(() => {
      const domainList = domains.split("\n").filter(domain => domain.trim() !== "").map(domain => domain.trim());
      
      const mockResults: WhoisResult[] = domainList.map(domain => {
        // Remover http://, https://, www. para extrair apenas o domínio
        const cleanDomain = domain.replace(/^https?:\/\//i, "").replace(/^www\./i, "").split("/")[0];
        
        // Validação básica de formato de domínio
        const isValidFormat = /^[a-zA-Z0-9][a-zA-Z0-9-]{1,61}[a-zA-Z0-9](?:\.[a-zA-Z]{2,})+$/.test(cleanDomain);
        
        if (!isValidFormat) {
          return {
            domain: cleanDomain,
            registrar: "",
            createdDate: "",
            expiryDate: "",
            updatedDate: "",
            nameServers: [],
            status: [],
            error: "Formato de domínio inválido"
          };
        }
        
        // Simulando diferentes resultados para demonstração
        const now = new Date();
        const createdDate = new Date(now.setFullYear(now.getFullYear() - Math.floor(Math.random() * 10) - 1));
        const expiryDate = new Date(now.setFullYear(now.getFullYear() + Math.floor(Math.random() * 10) + 1));
        const updatedDate = new Date(now.setMonth(now.getMonth() - Math.floor(Math.random() * 11)));
        
        const registrars = [
          "GoDaddy.com, LLC",
          "NameCheap, Inc.",
          "Amazon Registrar, Inc.",
          "Google LLC",
          "Registro.br"
        ];
        
        const nameServers = [
          [`ns1.${cleanDomain}`, `ns2.${cleanDomain}`],
          ["dns1.registrar-servers.com", "dns2.registrar-servers.com"],
          ["ns-1234.awsdns-26.org", "ns-567.awsdns-07.net"],
          ["ns1.googledomains.com", "ns2.googledomains.com"]
        ];
        
        const statuses = [
          ["clientTransferProhibited", "serverDeleteProhibited"],
          ["clientDeleteProhibited", "clientTransferProhibited"],
          ["ok"],
          ["serverUpdateProhibited", "clientTransferProhibited"]
        ];
        
        const registrants = [
          {
            name: "Redacted for Privacy",
            organization: "Privacy service",
            country: "US"
          },
          {
            name: "Domain Administrator",
            organization: cleanDomain.split(".")[0].toUpperCase() + " Inc.",
            country: "BR"
          },
          undefined
        ];
        
        const randomIndex = Math.floor(Math.random() * registrars.length);
        const nsIndex = Math.floor(Math.random() * nameServers.length);
        const statusIndex = Math.floor(Math.random() * statuses.length);
        const registrantIndex = Math.floor(Math.random() * registrants.length);
        
        return {
          domain: cleanDomain,
          registrar: registrars[randomIndex],
          createdDate: createdDate.toISOString().split("T")[0],
          expiryDate: expiryDate.toISOString().split("T")[0],
          updatedDate: updatedDate.toISOString().split("T")[0],
          nameServers: nameServers[nsIndex],
          status: statuses[statusIndex],
          registrant: registrants[registrantIndex]
        };
      });
      
      setResults(mockResults);
      if (mockResults.length > 0) {
        setSelectedDomain(mockResults[0].domain);
      }
      setIsLoading(false);
    }, 2000);
  };
  
  const handleSelectDomain = (domain: string) => {
    setSelectedDomain(domain);
  };
  
  const getSelectedDomainData = () => {
    if (!results || !selectedDomain) return null;
    return results.find(r => r.domain === selectedDomain);
  };
  
  const selectedData = getSelectedDomainData();
  
  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Navbar />
      
      <main className="flex-grow container mx-auto px-4 py-8">
        <div className="mb-8">
          <div className="flex items-center mb-4">
            <Globe className="w-6 h-6 text-primary mr-2" />
            <h1 className="text-2xl font-bold">WHOIS</h1>
          </div>
          <p className="text-muted-foreground">
            Consulte dados WHOIS de um domínio para obter informações sobre registros, datas e servidores DNS.
          </p>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Form */}
          <div className="lg:col-span-1">
            <div className="bg-card rounded-lg p-6 shadow-md">
              <h2 className="text-lg font-semibold mb-4">Consultar domínios</h2>
              <p className="text-sm text-muted-foreground mb-4">
                Insira um ou mais domínios para consulta, um por linha.
              </p>
              
              <form onSubmit={handleSubmit}>
                <div className="mb-4">
                  <textarea
                    value={domains}
                    onChange={(e) => setDomains(e.target.value)}
                    placeholder="exemplo.com&#10;meusite.com.br&#10;outrodominio.net"
                    rows={8}
                    className="w-full px-3 py-2 bg-secondary rounded-md border border-border focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                    required
                  />
                </div>
                
                <button
                  type="submit"
                  disabled={isLoading || domains.trim() === ""}
                  className={`w-full flex justify-center items-center py-2.5 rounded-md text-sm font-medium ${
                    isLoading || domains.trim() === "" 
                      ? "bg-primary/70 cursor-not-allowed" 
                      : "bg-primary hover:bg-primary/90"
                  } text-primary-foreground transition-colors`}
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Consultando...
                    </>
                  ) : (
                    <>
                      Consultar WHOIS <ArrowRight className="ml-2 h-4 w-4" />
                    </>
                  )}
                </button>
              </form>
              
              <div className="mt-6">
                <h3 className="text-sm font-medium mb-2">Domínios consultados:</h3>
                
                {isLoading && (
                  <div className="flex items-center justify-center h-20 text-muted-foreground">
                    <Loader2 className="h-5 w-5 animate-spin mr-2" />
                    <span>Carregando...</span>
                  </div>
                )}
                
                {!isLoading && !results && (
                  <div className="text-sm text-muted-foreground py-4">
                    Nenhuma consulta realizada.
                  </div>
                )}
                
                {!isLoading && results && results.length > 0 && (
                  <div className="space-y-2 max-h-64 overflow-y-auto pr-2">
                    {results.map((result, index) => (
                      <button
                        key={index}
                        onClick={() => handleSelectDomain(result.domain)}
                        className={`w-full text-left px-3 py-2 text-sm rounded-md transition-colors ${
                          selectedDomain === result.domain 
                            ? "bg-primary/20 text-primary" 
                            : "bg-secondary hover:bg-secondary/70"
                        }`}
                      >
                        {result.domain}
                        {result.error && (
                          <span className="block text-xs text-red-400 mt-0.5">
                            Erro: {result.error}
                          </span>
                        )}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
          
          {/* Results */}
          <div className="lg:col-span-2">
            <div className="bg-card rounded-lg p-6 shadow-md">
              <h2 className="text-lg font-semibold mb-4">Resultado WHOIS</h2>
              
              {isLoading && (
                <div className="flex flex-col items-center justify-center h-64">
                  <Loader2 className="h-8 w-8 text-primary animate-spin mb-4" />
                  <p className="text-muted-foreground">Consultando informações WHOIS...</p>
                </div>
              )}
              
              {!isLoading && !selectedData && (
                <div className="flex flex-col items-center justify-center h-64 text-muted-foreground">
                  <Globe className="h-12 w-12 mb-4 opacity-20" />
                  <p>Selecione um domínio para ver os detalhes</p>
                </div>
              )}
              
              {!isLoading && selectedData && selectedData.error && (
                <div className="flex flex-col items-center justify-center h-64 text-muted-foreground">
                  <div className="bg-red-500/10 p-4 rounded-md text-center">
                    <p className="text-red-400 mb-2">Erro na consulta</p>
                    <p>{selectedData.error}</p>
                  </div>
                </div>
              )}
              
              {!isLoading && selectedData && !selectedData.error && (
                <div className="space-y-6">
                  <div className="flex items-center justify-between">
                    <h3 className="text-xl font-semibold">{selectedData.domain}</h3>
                    <div className="text-xs bg-primary/10 text-primary px-2 py-1 rounded-full">
                      {selectedData.status.includes("ok") ? "Status: OK" : "Status: Protegido"}
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-4">
                      {/* Informações de registro */}
                      <div className="bg-secondary/30 p-4 rounded-md">
                        <div className="flex items-center mb-3">
                          <Database className="h-5 w-5 text-primary mr-2" />
                          <h4 className="font-medium">Informações de Registro</h4>
                        </div>
                        
                        <div className="space-y-2 text-sm">
                          <div className="grid grid-cols-3 gap-1">
                            <span className="text-muted-foreground">Registrar:</span>
                            <span className="col-span-2">{selectedData.registrar}</span>
                          </div>
                          
                          {selectedData.registrant && (
                            <>
                              {selectedData.registrant.organization && (
                                <div className="grid grid-cols-3 gap-1">
                                  <span className="text-muted-foreground">Organização:</span>
                                  <span className="col-span-2">{selectedData.registrant.organization}</span>
                                </div>
                              )}
                              
                              {selectedData.registrant.country && (
                                <div className="grid grid-cols-3 gap-1">
                                  <span className="text-muted-foreground">País:</span>
                                  <span className="col-span-2">{selectedData.registrant.country}</span>
                                </div>
                              )}
                            </>
                          )}
                        </div>
                      </div>
                      
                      {/* Servidores de nome */}
                      <div className="bg-secondary/30 p-4 rounded-md">
                        <div className="flex items-center mb-3">
                          <Server className="h-5 w-5 text-primary mr-2" />
                          <h4 className="font-medium">Servidores DNS</h4>
                        </div>
                        
                        <div className="space-y-1 text-sm">
                          {selectedData.nameServers.map((ns, idx) => (
                            <div key={idx} className="py-1 px-2 bg-secondary/30 rounded">
                              {ns}
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                    
                    <div className="space-y-4">
                      {/* Datas importantes */}
                      <div className="bg-secondary/30 p-4 rounded-md">
                        <div className="flex items-center mb-3">
                          <Calendar className="h-5 w-5 text-primary mr-2" />
                          <h4 className="font-medium">Datas</h4>
                        </div>
                        
                        <div className="space-y-2 text-sm">
                          <div className="grid grid-cols-3 gap-1">
                            <span className="text-muted-foreground">Criado:</span>
                            <span className="col-span-2">{selectedData.createdDate}</span>
                          </div>
                          
                          <div className="grid grid-cols-3 gap-1">
                            <span className="text-muted-foreground">Expira:</span>
                            <span className="col-span-2">{selectedData.expiryDate}</span>
                          </div>
                          
                          <div className="grid grid-cols-3 gap-1">
                            <span className="text-muted-foreground">Atualizado:</span>
                            <span className="col-span-2">{selectedData.updatedDate}</span>
                          </div>
                        </div>
                      </div>
                      
                      {/* Status do domínio */}
                      <div className="bg-secondary/30 p-4 rounded-md">
                        <div className="flex items-center mb-3">
                          <Shield className="h-5 w-5 text-primary mr-2" />
                          <h4 className="font-medium">Status do Domínio</h4>
                        </div>
                        
                        <div className="space-y-1 text-sm">
                          {selectedData.status.map((status, idx) => (
                            <div key={idx} className="py-1 px-2 bg-secondary/30 rounded flex items-center">
                              <span className="w-2 h-2 rounded-full bg-primary mr-2"></span>
                              {status}
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="text-xs text-muted-foreground bg-secondary/20 p-3 rounded-md">
                    <p>
                      Nota: As informações WHOIS são fornecidas por registradores e registries. 
                      Alguns dados podem estar protegidos por políticas de privacidade.
                    </p>
                  </div>
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

export default WhoisPage;


import { useState } from "react";
import Navbar from "@/components/Navbar";
import { Link2, ArrowRight, Check, Loader2 } from "lucide-react";

interface DedupeResult {
  base: string;
  urls: string[];
}

const UrlDedupePage = () => {
  const [urls, setUrls] = useState<string>("");
  const [results, setResults] = useState<DedupeResult[] | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    setIsLoading(true);
    
    // Simular uma chamada à API
    setTimeout(() => {
      const urlList = urls.split("\n").filter(url => url.trim() !== "").map(url => url.trim());
      const groupedUrls: Record<string, string[]> = {};
      
      // Função simplificada para extrair base domain (simulando a API)
      urlList.forEach(url => {
        try {
          let formattedUrl = url;
          if (!/^https?:\/\//i.test(formattedUrl)) {
            formattedUrl = 'http://' + formattedUrl;
          }
          
          const urlObj = new URL(formattedUrl);
          const hostParts = urlObj.hostname.split('.');
          const baseDomain = hostParts.length >= 2 
            ? hostParts.slice(-2).join('.') 
            : urlObj.hostname;
          
          if (!groupedUrls[baseDomain]) {
            groupedUrls[baseDomain] = [];
          }
          
          groupedUrls[baseDomain].push(url);
        } catch (error) {
          console.error(`Erro ao processar URL: ${url}`, error);
        }
      });
      
      const results: DedupeResult[] = Object.entries(groupedUrls).map(([base, urls]) => ({
        base,
        urls
      }));
      
      setResults(results);
      setIsLoading(false);
    }, 1500);
  };
  
  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Navbar />
      
      <main className="flex-grow container mx-auto px-4 py-8">
        <div className="mb-8">
          <div className="flex items-center mb-4">
            <Link2 className="w-6 h-6 text-primary mr-2" />
            <h1 className="text-2xl font-bold">URL Dedupe</h1>
          </div>
          <p className="text-muted-foreground">
            Identifique URLs duplicadas baseadas no mesmo domínio, ignorando paths, query strings e subdomínios distintos.
          </p>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Form */}
          <div>
            <div className="bg-card rounded-lg p-6 shadow-md">
              <h2 className="text-lg font-semibold mb-4">Insira suas URLs</h2>
              <p className="text-sm text-muted-foreground mb-4">
                Coloque uma URL por linha. O sistema identificará grupos com o mesmo domínio base.
              </p>
              
              <form onSubmit={handleSubmit}>
                <div className="mb-4">
                  <textarea
                    value={urls}
                    onChange={(e) => setUrls(e.target.value)}
                    placeholder="https://exemplo.com&#10;https://exemplo.com/page&#10;https://outrosite.com"
                    rows={10}
                    className="w-full px-3 py-2 bg-secondary rounded-md border border-border focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                    required
                  />
                </div>
                
                <button
                  type="submit"
                  disabled={isLoading || urls.trim() === ""}
                  className={`w-full flex justify-center items-center py-2.5 rounded-md text-sm font-medium ${
                    isLoading || urls.trim() === "" 
                      ? "bg-primary/70 cursor-not-allowed" 
                      : "bg-primary hover:bg-primary/90"
                  } text-primary-foreground transition-colors`}
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Processando...
                    </>
                  ) : (
                    <>
                      Identificar duplicadas <ArrowRight className="ml-2 h-4 w-4" />
                    </>
                  )}
                </button>
              </form>
              
              <div className="mt-4">
                <h3 className="text-sm font-medium mb-2">Exemplos:</h3>
                <ul className="text-xs text-muted-foreground space-y-1">
                  <li>https://exemplo.com</li>
                  <li>https://exemplo.com/page?id=123</li>
                  <li>http://blog.exemplo.com</li>
                  <li>https://outrosite.com</li>
                </ul>
              </div>
            </div>
          </div>
          
          {/* Results */}
          <div>
            <div className="bg-card rounded-lg p-6 shadow-md min-h-[200px]">
              <h2 className="text-lg font-semibold mb-4">Resultados</h2>
              
              {isLoading && (
                <div className="flex flex-col items-center justify-center h-64">
                  <Loader2 className="h-8 w-8 text-primary animate-spin mb-4" />
                  <p className="text-muted-foreground">Processando URLs...</p>
                </div>
              )}
              
              {!isLoading && !results && (
                <div className="flex flex-col items-center justify-center h-64 text-muted-foreground">
                  <Link2 className="h-12 w-12 mb-4 opacity-20" />
                  <p>Os resultados aparecerão aqui</p>
                </div>
              )}
              
              {!isLoading && results && results.length === 0 && (
                <div className="flex flex-col items-center justify-center h-64 text-muted-foreground">
                  <p>Nenhum resultado encontrado</p>
                </div>
              )}
              
              {!isLoading && results && results.length > 0 && (
                <div className="space-y-6">
                  {results.map((result, index) => (
                    <div key={index} className="bg-secondary/50 p-4 rounded-md">
                      <div className="flex items-center mb-2">
                        <Check className="h-4 w-4 text-primary mr-2" />
                        <h3 className="font-medium">{result.base}</h3>
                        <span className="text-xs bg-secondary ml-2 px-2 py-0.5 rounded-full">
                          {result.urls.length} URL{result.urls.length !== 1 ? 's' : ''}
                        </span>
                      </div>
                      <div className="pl-6">
                        <ul className="text-sm text-muted-foreground space-y-1">
                          {result.urls.map((url, urlIndex) => (
                            <li key={urlIndex} className="break-all">{url}</li>
                          ))}
                        </ul>
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

export default UrlDedupePage;

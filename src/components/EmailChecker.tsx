import { useState } from "react";
import { verifyEmail, getStatusDescription, getReasonDescription } from "@/lib/email-check";
import { Check, X, Loader2 } from "lucide-react";

export function EmailChecker() {
  const [email, setEmail] = useState("");
  const [result, setResult] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleCheck() {
    if (!email) return;
    
    setLoading(true);
    setError("");
    setResult(null);
    
    try {
      const response = await verifyEmail(email);
      setResult(response);
    } catch (error) {
      setError(error instanceof Error ? error.message : "Erro ao verificar email");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex flex-col gap-4 p-4">
      <div className="flex gap-2">
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Digite o email"
          className="flex-1 rounded border p-2"
        />
        <button
          onClick={handleCheck}
          disabled={loading}
          className="rounded bg-blue-500 px-4 py-2 text-white hover:bg-blue-600 disabled:opacity-50 flex items-center gap-2"
        >
          {loading ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              Verificando...
            </>
          ) : (
            "Verificar"
          )}
        </button>
      </div>
      
      {error && (
        <div className="rounded border border-red-200 bg-red-50 p-4 text-red-600">
          <p>{error}</p>
        </div>
      )}
      
      {result && (
        <div className="rounded border p-4 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-medium">{result.email}</h3>
            <span className={`px-2 py-1 rounded text-sm ${
              result.status === "deliverable" ? "bg-green-100 text-green-700" :
              result.status === "undeliverable" ? "bg-red-100 text-red-700" :
              "bg-yellow-100 text-yellow-700"
            }`}>
              {getStatusDescription(result.status)}
            </span>
          </div>

          <div className="grid grid-cols-2 gap-4 text-sm">
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <span>Formato:</span>
                {result.status !== "invalid_email" ? 
                  <Check className="h-4 w-4 text-green-500" /> : 
                  <X className="h-4 w-4 text-red-500" />}
              </div>
              
              <div className="flex items-center gap-2">
                <span>MX:</span>
                {result.dns?.type === "MX" ? 
                  <Check className="h-4 w-4 text-green-500" /> : 
                  <X className="h-4 w-4 text-red-500" />}
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <span>Domínio:</span>
                {result.domain?.name ? 
                  <Check className="h-4 w-4 text-green-500" /> : 
                  <X className="h-4 w-4 text-red-500" />}
              </div>
              
              <div className="flex items-center gap-2">
                <span>Temporário:</span>
                {result.domain?.disposable === "yes" ? 
                  <Check className="h-4 w-4 text-yellow-500" /> : 
                  <X className="h-4 w-4 text-green-500" />}
              </div>
            </div>
          </div>

          {result.reason && (
            <div className="text-sm text-gray-600 bg-gray-50 p-3 rounded">
              <strong>Detalhes:</strong> {getReasonDescription(result.reason)}
            </div>
          )}
        </div>
      )}
    </div>
  );
} 

import { useState } from "react";
import Navbar from "@/components/Navbar";
import { Mail, Send } from "lucide-react";

const ContactPage = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: ""
  });
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Simular envio do formulário
    setTimeout(() => {
      setIsSubmitting(false);
      setSubmitted(true);
      setFormData({ name: "", email: "", subject: "", message: "" });
    }, 1500);
  };
  
  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Navbar />
      
      <main className="flex-grow container mx-auto px-4 py-12">
        <div className="max-w-2xl mx-auto">
          <div className="flex items-center mb-8">
            <Mail className="w-8 h-8 text-primary mr-3" />
            <h1 className="text-3xl font-bold">Contato</h1>
          </div>
          
          <p className="text-muted-foreground mb-8">
            Tem alguma dúvida, sugestão ou feedback sobre o TKDHub? Entre em contato conosco 
            preenchendo o formulário abaixo. Nossa equipe responderá o mais breve possível.
          </p>
          
          {submitted ? (
            <div className="bg-secondary/30 rounded-lg p-6 text-center">
              <div className="mb-4 inline-flex items-center justify-center w-12 h-12 rounded-full bg-primary/20">
                <Send className="text-primary h-6 w-6" />
              </div>
              <h2 className="text-xl font-semibold mb-2">Mensagem enviada!</h2>
              <p className="text-muted-foreground">
                Obrigado por entrar em contato. Responderemos o mais breve possível.
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label htmlFor="name" className="text-sm font-medium">
                    Nome
                  </label>
                  <input
                    id="name"
                    name="name"
                    type="text"
                    required
                    value={formData.name}
                    onChange={handleChange}
                    className="w-full px-3 py-2 bg-secondary rounded-md border border-border focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                  />
                </div>
                
                <div className="space-y-2">
                  <label htmlFor="email" className="text-sm font-medium">
                    Email
                  </label>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    required
                    value={formData.email}
                    onChange={handleChange}
                    className="w-full px-3 py-2 bg-secondary rounded-md border border-border focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <label htmlFor="subject" className="text-sm font-medium">
                  Assunto
                </label>
                <select
                  id="subject"
                  name="subject"
                  required
                  value={formData.subject}
                  onChange={handleChange}
                  className="w-full px-3 py-2 bg-secondary rounded-md border border-border focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                >
                  <option value="">Selecione um assunto</option>
                  <option value="sugestão">Sugestão de ferramenta</option>
                  <option value="bug">Reportar um problema</option>
                  <option value="feedback">Feedback</option>
                  <option value="outro">Outro</option>
                </select>
              </div>
              
              <div className="space-y-2">
                <label htmlFor="message" className="text-sm font-medium">
                  Mensagem
                </label>
                <textarea
                  id="message"
                  name="message"
                  rows={5}
                  required
                  value={formData.message}
                  onChange={handleChange}
                  className="w-full px-3 py-2 bg-secondary rounded-md border border-border focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                />
              </div>
              
              <button
                type="submit"
                disabled={isSubmitting}
                className={`w-full flex justify-center items-center py-2.5 rounded-md text-sm font-medium ${
                  isSubmitting 
                    ? "bg-primary/70 cursor-not-allowed" 
                    : "bg-primary hover:bg-primary/90"
                } text-primary-foreground transition-colors`}
              >
                {isSubmitting ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Enviando...
                  </>
                ) : (
                  <>
                    Enviar mensagem <Send className="ml-2 h-4 w-4" />
                  </>
                )}
              </button>
            </form>
          )}
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

export default ContactPage;


import { Link } from "react-router-dom";
import { AlertTriangle } from "lucide-react";
import Navbar from "@/components/Navbar";

const NotFound = () => {
  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Navbar />
      
      <main className="flex-grow flex items-center justify-center px-4">
        <div className="text-center">
          <AlertTriangle className="mx-auto h-16 w-16 text-primary mb-4" />
          <h1 className="text-4xl font-bold mb-2">404</h1>
          <p className="text-xl mb-6 text-muted-foreground">Página não encontrada</p>
          <Link
            to="/"
            className="inline-flex items-center justify-center rounded-md bg-primary text-primary-foreground px-4 py-2 text-sm font-medium shadow hover:bg-primary/90 transition-colors"
          >
            Voltar para a página inicial
          </Link>
        </div>
      </main>
    </div>
  );
};

export default NotFound;

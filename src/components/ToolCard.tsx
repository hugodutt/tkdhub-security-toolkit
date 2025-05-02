
import { ReactNode } from "react";
import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";

interface ToolCardProps {
  title: string;
  description: string;
  icon: ReactNode;
  path: string;
}

const ToolCard = ({ title, description, icon, path }: ToolCardProps) => {
  return (
    <div className="bg-card rounded-lg overflow-hidden shadow-md card-shadow card-hover">
      <div className="p-6 flex flex-col h-full">
        <div className="flex items-center mb-4">
          <div className="mr-3 text-primary">{icon}</div>
          <h3 className="text-xl font-bold">{title}</h3>
        </div>
        <p className="text-muted-foreground mb-6 flex-grow">{description}</p>
        <Link
          to={path}
          className="inline-flex items-center gap-2 text-sm font-medium text-primary hover:text-primary/80 transition-colors"
        >
          Abrir ferramenta <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
    </div>
  );
};

export default ToolCard;

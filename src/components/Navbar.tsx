
import { useState } from "react";
import { Link } from "react-router-dom";
import { Menu, X, Shield } from "lucide-react";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav className="bg-card py-4 px-6 shadow-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto flex justify-between items-center">
        <Link to="/" className="flex items-center space-x-2">
          <Shield className="w-8 h-8 text-primary" />
          <span className="text-xl font-bold text-foreground">TKDHub</span>
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden md:flex space-x-8">
          <Link to="/" className="text-foreground hover:text-primary transition-colors">
            Ferramentas
          </Link>
        </div>

        {/* Mobile Navigation Toggle */}
        <button 
          className="md:hidden text-foreground focus:outline-none"
          onClick={() => setIsOpen(!isOpen)}
        >
          {isOpen ? <X /> : <Menu />}
        </button>
      </div>

      {/* Mobile Navigation Menu */}
      {isOpen && (
        <div className="md:hidden mt-4 pb-4 px-6">
          <div className="flex flex-col space-y-4">
            <Link 
              to="/" 
              className="text-foreground hover:text-primary transition-colors"
              onClick={() => setIsOpen(false)}
            >
              Ferramentas
            </Link>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;

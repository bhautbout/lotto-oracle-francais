
import { Link, useLocation } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { ChevronDown, Menu, X } from 'lucide-react';
import { useState } from 'react';
import { Button } from '@/components/ui/button';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();
  
  const toggleMenu = () => setIsOpen(!isOpen);
  
  const routes = [
    { path: '/', label: 'Accueil' },
    { path: '/tirages', label: 'Tirages' },
    { path: '/statistiques', label: 'Statistiques' },
    { path: '/predictions', label: 'Prédictions' }
  ];

  return (
    <nav className="bg-loto-blue text-white shadow-md">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          <div className="flex-shrink-0 flex items-center">
            <Link 
              to="/" 
              className="flex items-center"
            >
              <span className="text-loto-white font-bold text-xl">Loto Oracle</span>
              <span className="text-loto-gold font-bold ml-1">FR</span>
            </Link>
          </div>
          
          {/* Menu pour les grands écrans */}
          <div className="hidden md:flex space-x-4">
            {routes.map((route) => (
              <Link
                key={route.path}
                to={route.path}
                className={cn(
                  "px-3 py-2 rounded-md text-sm font-medium transition-colors",
                  location.pathname === route.path
                    ? "bg-loto-darkblue text-white"
                    : "text-loto-white hover:bg-loto-darkblue hover:text-white"
                )}
              >
                {route.label}
              </Link>
            ))}
          </div>
          
          {/* Menu pour mobile */}
          <div className="md:hidden flex items-center">
            <Button
              variant="ghost"
              size="icon"
              className="text-white"
              onClick={toggleMenu}
            >
              {isOpen ? <X size={24} /> : <Menu size={24} />}
            </Button>
          </div>
        </div>
        
        {/* Menu déroulant pour mobile */}
        {isOpen && (
          <div className="md:hidden animate-fade-in">
            <div className="px-2 pt-2 pb-3 space-y-1">
              {routes.map((route) => (
                <Link
                  key={route.path}
                  to={route.path}
                  className={cn(
                    "block px-3 py-2 rounded-md text-base font-medium",
                    location.pathname === route.path
                      ? "bg-loto-darkblue text-white"
                      : "text-loto-white hover:bg-loto-darkblue hover:text-white"
                  )}
                  onClick={() => setIsOpen(false)}
                >
                  {route.label}
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;

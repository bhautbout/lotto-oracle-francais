
import { useState } from "react";
import { NavLink } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Menu, Home, DatabaseZap, TrendingUp, BrainCircuit, BarChart3 } from "lucide-react";
import { useMobile } from "@/hooks/use-mobile";

const Navbar = () => {
  const isMobile = useMobile();
  const [open, setOpen] = useState(false);

  const links = [
    { to: "/", label: "Accueil", icon: <Home className="h-5 w-5 mr-2" /> },
    { to: "/tirages", label: "Tirages", icon: <DatabaseZap className="h-5 w-5 mr-2" /> },
    { to: "/statistiques", label: "Statistiques", icon: <BarChart3 className="h-5 w-5 mr-2" /> },
    { to: "/predictions", label: "Prédictions", icon: <BrainCircuit className="h-5 w-5 mr-2" /> },
    { to: "/performance", label: "Performance", icon: <TrendingUp className="h-5 w-5 mr-2" /> }
  ];

  const NavItems = () => (
    <>
      {links.map((link) => (
        <NavLink
          key={link.to}
          to={link.to}
          className={({ isActive }) =>
            `flex items-center px-4 py-2 rounded-md transition-colors ${
              isActive
                ? "bg-primary/10 text-primary"
                : "text-gray-600 hover:text-primary hover:bg-primary/5"
            }`
          }
          onClick={() => setOpen(false)}
        >
          {link.icon}
          {link.label}
        </NavLink>
      ))}
    </>
  );

  return (
    <header className="bg-white border-b sticky top-0 z-40">
      <div className="container flex h-16 items-center justify-between">
        <div className="flex items-center gap-2">
          <NavLink to="/" className="text-xl font-bold text-primary flex items-center">
            <span className="text-red-500">Loto</span>
            <span className="text-blue-500">Stats</span>
          </NavLink>
        </div>

        {isMobile ? (
          <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger asChild>
              <Button variant="outline" size="icon">
                <Menu className="h-5 w-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-60">
              <nav className="flex flex-col gap-2 mt-8">
                <NavItems />
              </nav>
            </SheetContent>
          </Sheet>
        ) : (
          <nav className="flex items-center gap-2">
            <NavItems />
          </nav>
        )}
      </div>
    </header>
  );
};

export default Navbar;

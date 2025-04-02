
import { ReactNode } from 'react';
import Navbar from './Navbar';

interface LayoutProps {
  children: ReactNode;
}

const Layout = ({ children }: LayoutProps) => {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-grow">
        {children}
      </main>
      <footer className="bg-gray-100 py-4 text-center text-gray-600 text-sm">
        <p>Loto Oracle Français &copy; {new Date().getFullYear()} - Application d'analyse de loto</p>
      </footer>
    </div>
  );
};

export default Layout;

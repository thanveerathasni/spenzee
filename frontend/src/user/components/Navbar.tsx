
import React from 'react';

const Navbar: React.FC = () => {
  return (
    <nav className="fixed top-0 left-0 right-0 h-16 flex items-center justify-between px-8 md:px-16 bg-transparent z-50">
      <div className="text-xl font-medium tracking-tight text-stone-800">
        spenzee
      </div>
      <a 
        href="/" 
        className="text-sm font-medium text-stone-500 hover:text-stone-800 transition-colors"
      >
        Back to Home
      </a>
    </nav>
  );
};

export default Navbar;

import { NAV_ITEMS } from '../constants';

export const Navbar = () => (
  <nav className="flex justify-between px-16 py-8 max-w-[1600px] mx-auto">
    <a href="#/" className="text-2xl font-serif">Spenzee</a>
    <div className="space-x-8">
      {NAV_ITEMS.map(item => (
        <a key={item.label} href={item.href} className="text-xs uppercase tracking-widest">
          {item.label}
        </a>
      ))}
    </div>
  </nav>
);

export const Footer = () => (
  <footer className="border-t border-[#E5E2DD] mt-20 px-16 py-16 text-sm text-[#A3A3A3]">
    © 2024 Spenzee
  </footer>
);

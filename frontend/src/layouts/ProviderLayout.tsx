import { NavLink, Outlet } from "react-router-dom";
import { BarChart3, Boxes, Home, ShoppingBag } from "lucide-react";

const navItems = [
  { label: "Dashboard", to: "/provider/dashboard", icon: Home },
  { label: "Products", to: "/provider/products", icon: Boxes },
  { label: "Orders", to: "/provider/orders", icon: ShoppingBag },
  { label: "Analytics", to: "/provider/analytics", icon: BarChart3 },
];

export default function ProviderLayout() {
  return (
    <div className="min-h-screen bg-zinc-50 text-zinc-950">
      <aside className="fixed inset-y-0 left-0 hidden w-64 border-r border-zinc-200 bg-white px-4 py-6 lg:block">
        <div className="px-3 text-xl font-black tracking-tight">Spenzee</div>
        <nav className="mt-8 space-y-1">
          {navItems.map((item) => {
            const Icon = item.icon;

            return (
              <NavLink
                key={item.to}
                to={item.to}
                className={({ isActive }) =>
                  `flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-semibold transition ${
                    isActive
                      ? "bg-zinc-950 text-white"
                      : "text-zinc-500 hover:bg-zinc-100 hover:text-zinc-950"
                  }`
                }
              >
                <Icon size={17} />
                {item.label}
              </NavLink>
            );
          })}
        </nav>
      </aside>

      <main className="min-h-screen px-4 py-6 lg:ml-64 lg:px-8">
        <Outlet />
      </main>
    </div>
  );
}

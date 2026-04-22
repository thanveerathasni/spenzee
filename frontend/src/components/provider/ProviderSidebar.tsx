import { NavLink } from "react-router-dom";

export default function ProviderSidebar() {
  return (
    <div className="w-64 bg-white border-r border-gray-100 min-h-screen p-6 space-y-4">
      <h2 className="text-lg font-bold">Provider Panel</h2>

      <nav className="space-y-2">
        <NavLink
          to="/provider/dashboard"
          className="block px-4 py-2 rounded-xl hover:bg-gray-100"
        >
          Dashboard
        </NavLink>

        <NavLink
          to="/provider/profile"
          className="block px-4 py-2 rounded-xl hover:bg-gray-100"
        >
          Profile
        </NavLink>
      </nav>
    </div>
  );
}
import { Bell, Menu, Search } from "lucide-react";

interface Props {
  onMenuClick: () => void;
  userName: string;
}

export default function ProfileNavbar({ onMenuClick, userName }: Props) {

  const initials = userName
    ?.split(" ")
    .map((n) => n[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();


  return (
    <nav className="h-14 border-b flex items-center px-6 gap-4 bg-white">

      {/* LOGO */}
      <div className="flex items-center gap-2">
        <Menu size={18} onClick={onMenuClick} className="cursor-pointer" />
        <span className="font-semibold">Spenzee</span>
      </div>

      {/* SEARCH */}
      <div className="flex-1 flex justify-center">
        <div className="flex items-center gap-2 bg-gray-100 px-4 py-2 rounded-lg w-80">
          <Search size={16} />
          <input
            className="bg-transparent outline-none text-sm w-full"
            placeholder="Search..."
          />
        </div>
      </div>

      {/* ICONS */}
      <Bell size={18} />

      {/* AVATAR */}
      <div className="w-8 h-8 rounded-full bg-black text-white flex items-center justify-center">
       {initials}
      </div>
    </nav>
  );
}

import { LogOut } from "lucide-react";

interface Props {
  brandName: string;
  onLogout: () => void;
}

export default function ProviderNavbar({ brandName, onLogout }: Props) {
  return (
    <div className="flex justify-between items-center bg-white p-6 rounded-2xl border border-gray-100 shadow-sm relative overflow-hidden">
      <div className="absolute top-0 left-0 w-1 h-full bg-black"></div>

      <div className="flex items-center gap-6 z-10 relative">
        <div className="w-24 h-24 bg-gray-100 rounded-full border-4 border-white shadow-md flex items-center justify-center relative group">
          <span className="text-3xl font-black text-gray-400">A</span>
          <div className="absolute inset-0 bg-black/50 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer">
            <span className="text-[10px] uppercase font-bold text-white tracking-widest text-center">
              Change<br />Photo
            </span>
          </div>
        </div>

        <div>
          <h1 className="text-2xl font-bold text-gray-900">{brandName}</h1>
          <p className="text-sm text-gray-500 font-medium">Provider ID: PRV-88291</p>

          <div className="mt-2 inline-flex items-center gap-1 text-[10px] font-bold tracking-widest uppercase text-green-600 bg-green-50 px-2 py-1 rounded">
            Verified Account
          </div>
        </div>
      </div>

      <button
        onClick={onLogout}
        className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-red-600 hover:bg-red-50 rounded-xl transition"
      >
        <LogOut size={16} />
        Logout
      </button>
    </div>
  );
}



import ProfileNavbar from "../profile/ProfileNavbar";
import ProfileSidebar from "../profile/ProfileSidebar";
import { useState } from "react";
import type { User } from "../../../types/user";

interface Props {
  children: React.ReactNode;
  user?: User;
  active: string;
  setActive: (val: string) => void;
}

export default function ProfileLayout({ children, user, active, setActive }: Props) {
  const [open, setOpen] = useState(false);

  return (
    <div className="min-h-screen flex flex-col bg-[#080808]">
      <ProfileNavbar
        onMenuClick={() => setOpen(!open)}
        userName={user?.name ?? "User"}
      />
      <div className="flex flex-1">
        <ProfileSidebar active={active} setActive={setActive} user={user} open={open} />
        <main className="flex-1 p-6 md:p-8 overflow-y-auto">
          {children}
        </main>
      </div>
    </div>
  );
}

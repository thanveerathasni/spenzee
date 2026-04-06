import ProfileNavbar from "../profile/ProfileNavbar";
import ProfileSidebar from "../profile/ProfileSidebar";   

import {useState} from "react";


interface Props {
  children: React.ReactNode;
  user?: { name?: string; email?: string };
  active: string;
  setActive: (val: string) => void;
}

export default function ProfileLayout({
  children,
  user,
  active,
  setActive,
}: Props) {
  const [open, setOpen] = useState(false);

  return (
    <div className="min-h-screen flex flex-col">

      <ProfileNavbar
        onMenuClick={() => setOpen(!open)}
        userName={user?.name ?? "User"}
      />

      <div className="flex flex-1">

        <ProfileSidebar
          active={active}
          setActive={setActive}
          user={user}
          open={open}
        />

        <main className="flex-1 p-6">{children}</main>
      </div>
    </div>
  );
}






import { User } from "../../../types/user";
import ProfileCard from "./ProfileCard";

interface ProfileInfoProps { user: User; }

export default function ProfileInfo({ user }: ProfileInfoProps) {
  return (
    <ProfileCard>
      <h4 className="text-xs text-white/30 uppercase tracking-widest mb-4">Personal Info</h4>
      <div className="grid grid-cols-2 gap-5 text-sm">
        {[
          { label: "Name",  value: user?.name },
          { label: "Phone", value: user.phone },
          { label: "Email", value: user.email },
        ].map(({ label, value }) => (
          <div key={label}>
            <p className="text-white/30 text-xs uppercase tracking-widest mb-1">{label}</p>
            <p className="text-white font-medium">{value || "—"}</p>
          </div>
        ))}
      </div>
    </ProfileCard>
  );
}
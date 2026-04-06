import { User } from "../../../types/user";
import ProfileCard from "./ProfileCard";

interface ProfileInfoProps {
  user: User;
}

export default function ProfileInfo({ user }: ProfileInfoProps) {
  return (
    <ProfileCard>
      <h3 className="text-lg font-semibold mb-4">Personal Info</h3>

      <div className="grid grid-cols-2 gap-4 text-sm">
        <div>
          <p className="text-gray-500">Name</p>
          <p className="font-medium">{user?.name ?? ""}</p>
        </div>

        <div>
          <p className="text-gray-500">Phone</p>
          <p className="font-medium">{user.phone}</p>
        </div>

        <div>
          <p className="text-gray-500">Email</p>
          <p className="font-medium">{user.email}</p>
        </div>
      </div>
    </ProfileCard>
  );
}
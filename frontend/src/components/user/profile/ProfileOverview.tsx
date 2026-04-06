import { User } from "../../../types/user";
import ProfileCard from "./ProfileCard";
import ImageUpload from "./ImageUpload";
interface Props {
  user: User;
}

export default function ProfileOverview({ user }: Props) {
  return (
    <div className="space-y-6">

      {/* PERSONAL INFO */}
      <ProfileCard>
        <h3 className="text-lg font-semibold mb-4">Personal Info</h3>

        <div className="grid grid-cols-2 gap-4 text-sm">
<ImageUpload user={user} />
          <div>
            <p className="text-gray-500">Name</p>
            <p className="font-medium">{user.name}</p>
          </div>

          <div>
            <p className="text-gray-500">Email</p>
            <p className="font-medium">{user.email}</p>
          </div>

          <div>
            <p className="text-gray-500">Phone</p>
            <p className="font-medium">{user.phone}</p>
          </div>

        </div>
      </ProfileCard>

      {/* ADDRESS */}
      <ProfileCard>
        <h3 className="text-lg font-semibold mb-4">Address</h3>

        <div className="text-sm space-y-1">
          <p>{user.address?.street || "—"}</p>
          <p>{user.address?.city || "—"}</p>
          <p>{user.address?.state || "—"}</p>
          <p>{user.address?.pincode || "—"}</p>
        </div>
      </ProfileCard>

    </div>
  );
}
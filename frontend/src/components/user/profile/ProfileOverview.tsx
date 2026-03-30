import { useSelector } from "react-redux";
import { RootState } from "../../../store";

export default function ProfileOverview() {
  const user = useSelector((state: RootState) => state.auth.user);

  if (!user) {
    return <div className="text-gray-400">Loading profile...</div>;
  }

  return (
    <div className="space-y-10 max-w-2xl">
      <div>
        <h2 className="text-3xl font-serif mb-2">Overview</h2>
        <p className="text-gray-500 text-sm">
          Your personal account information
        </p>
      </div>

      <div className="grid gap-6">
        <div>
          <p className="text-xs text-gray-400 uppercase">Name</p>
          <p className="text-lg font-medium">{user.name || "Not set"}</p>
        </div>

        <div>
          <p className="text-xs text-gray-400 uppercase">Email</p>
          <p className="text-lg font-medium">{user.email}</p>
        </div>

        <div>
          <p className="text-xs text-gray-400 uppercase">Phone</p>
          <p className="text-lg font-medium">
            {user.phone || "Not added"}
          </p>
        </div>

        <div>
          <p className="text-xs text-gray-400 uppercase">Address</p>
          <p className="text-lg font-medium">
            {user.address?.street || "No address added"}
          </p>
        </div>
      </div>
    </div>
  );
}
import { useSelector } from "react-redux";
import { RootState } from "../../../store/store";

export default function ProfileOverview() {
  const user = useSelector((state: RootState) => state.auth.user);

  return (
    <div className="space-y-6">
      <h2 className="text-3xl font-serif">Overview</h2>

      <div>
        <p>Name: {user?.name}</p>
        <p>Email: {user?.email}</p>
        <p>Phone: {user?.phone}</p>
      </div>

      <div>
        <h3 className="text-xl">Address</h3>
        <p>{user?.address?.street}</p>
        <p>{user?.address?.city}</p>
        <p>{user?.address?.state}</p>
        <p>{user?.address?.pincode}</p>
      </div>
    </div>
  );
}
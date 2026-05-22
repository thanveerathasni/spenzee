// import { User } from "../../../types/user";
// import Avatar from "./Avatar";
// import ActionButton from "./ActionButton";

// interface ProfileHeaderProps {
//   user: User;
//   onEdit?: () => void;
// }

// export default function ProfileHeader({ user, onEdit }: ProfileHeaderProps) {
//   return (
//     <div className="flex items-center justify-between mb-6">
//       <div className="flex items-center gap-4">
//         <Avatar name={user.name} image={user.profileImage} />
//         <div>
//           <h2 className="text-xl font-semibold">{user.name}</h2>
//           <p className="text-sm text-gray-500">{user.email}</p>
//         </div>
//       </div>

//       <ActionButton onClick={onEdit}>Edit Profile</ActionButton>
//     </div>
//   );
// }











import { User } from "../../../types/user";
import Avatar from "./Avatar";
import ActionButton from "./ActionButton";

interface ProfileHeaderProps {
  user: User;
  onEdit?: () => void;
}

export default function ProfileHeader({ user, onEdit }: ProfileHeaderProps) {
  return (
    <div className="flex items-center justify-between mb-6">
      <div className="flex items-center gap-4">
        <Avatar name={user.name} image={user.profilePicture} />
        <div>
          <h2 className="text-lg font-medium text-white">{user.name}</h2>
          <p className="text-sm text-white/40">{user.email}</p>
        </div>
      </div>
      <ActionButton onClick={onEdit}>Edit Profile</ActionButton>
    </div>
  );
}
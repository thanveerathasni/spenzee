import ChangeEmailModal from "./ChangeEmailModal";
import ChangePasswordModal from "./ChangePasswordModal";



export default function Settings() {
  return (
    <div className="space-y-4">

      <button className="bg-black text-white px-4 py-2">
        Change Email
      </button>

      <button className="bg-black text-white px-4 py-2">
        Change Password
      </button>
      

      <ChangeEmailModal />
      
      <ChangePasswordModal />

    </div>

  );

}







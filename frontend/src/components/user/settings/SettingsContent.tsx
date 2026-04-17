import ChangeEmail from "../profile/ChangeEmail";
import ChangePassword from "../security/ChangePassword";

const SettingsContent = () => {
  return (
    <div className="space-y-6">

      {/* 🔐 EMAIL CHANGE */}
      <div className="bg-white p-5 rounded-2xl shadow">
        <h3 className="text-lg font-semibold mb-3">Change Email</h3>
        <ChangeEmail />
      </div>

      {/* 🔐 PASSWORD CHANGE */}
      <div className="bg-white p-5 rounded-2xl shadow">
        <h3 className="text-lg font-semibold mb-3">Change Password</h3>
        <ChangePassword />
      </div>

    </div>
  );
};

export default SettingsContent;
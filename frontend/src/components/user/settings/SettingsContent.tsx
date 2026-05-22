// import ChangeEmail from "../profile/ChangeEmail";
// import ChangePassword from "../security/ChangePassword";

// const SettingsContent = () => {
//   return (
//     <div className="space-y-6">

//       {/* 🔐 EMAIL CHANGE */}
//       <div className="bg-white p-5 rounded-2xl shadow">
//         <h3 className="text-lg font-semibold mb-3">Change Email</h3>
//         <ChangeEmail />
//       </div>

//       {/* 🔐 PASSWORD CHANGE */}
//       <div className="bg-white p-5 rounded-2xl shadow">
//         <h3 className="text-lg font-semibold mb-3">Change Password</h3>
//         <ChangePassword />
//       </div>

//     </div>
//   );
// };

// export default SettingsContent;











import ChangeEmail from "../profile/ChangeEmail";
import ChangePassword from "../security/ChangePassword";
import ProfileCard from "../profile/ProfileCard";
import { motion } from "framer-motion";

const SettingsContent = () => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
      className="space-y-6"
    >
      <h2 className="text-2xl font-serif text-white tracking-tight">Settings</h2>

      <ProfileCard>
        <h4 className="text-xs text-white/30 uppercase tracking-widest mb-5">Change Email</h4>
        <ChangeEmail />
      </ProfileCard>

      <ProfileCard>
        <h4 className="text-xs text-white/30 uppercase tracking-widest mb-5">Change Password</h4>
        <ChangePassword />
      </ProfileCard>
    </motion.div>
  );
};

export default SettingsContent;
import { useState } from "react";
import { motion } from "framer-motion";

import ProfileNavbar from "../../../components/user/profile/ProfileNavbar";
import ProfileSidebar from "../../../components/user/profile/ProfileSidebar";

import ProfileOverview from "../../../components/user/profile/ProfileOverview";
import EditProfile from "../../../components/user/profile/EditProfile";
import AddressManagement from "../../../components/user/profile/AddressManagement";
import ChangePassword from "../../../components/user/profile/ChangePassword";
import EmailSettings from "../../../components/user/profile/EmailSettings";

export default function ProfilePage() {
  const [activeTab, setActiveTab] = useState("overview");

  const renderContent = () => {
    switch (activeTab) {
      case "overview":
        return <ProfileOverview />;
      case "edit":
        return <EditProfile />;
      case "address":
        return <AddressManagement />;
      case "password":
        return <ChangePassword />;
      case "email":
        return <EmailSettings />;
      default:
        return <ProfileOverview />;
    }
  };

  return (
    <div className="min-h-screen bg-white">
      <ProfileNavbar />

      <div className="pt-24 px-6 md:px-16 flex gap-16">
        <ProfileSidebar
          activeTab={activeTab}
          setActiveTab={setActiveTab}
        />

        <motion.div
          key={activeTab}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="flex-1"
        >
          {renderContent()}
        </motion.div>
      </div>
    </div>
  );
}
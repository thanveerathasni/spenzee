import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useDispatch } from "react-redux";

import ProfileNavbar from "../../../components/user/profile/ProfileNavbar";
import ProfileSidebar from "../../../components/user/profile/ProfileSidebar";

import ProfileOverview from "../../../components/user/profile/ProfileOverview";
import EditProfile from "../../../components/user/profile/EditProfile";
import AddressManagement from "../../../components/user/profile/AddressManagement";
import ChangePassword from "../../../components/user/profile/ChangePassword";
import EmailSettings from "../../../components/user/profile/EmailSettings";

import { userProfileApi } from "../../../api/user/userProfile.api";
import { setAuth } from "../../../store/auth/auth.slice";

export default function ProfilePage() {
  const [activeTab, setActiveTab] = useState("overview");
  const dispatch = useDispatch();

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const data = await userProfileApi.getProfile();

        dispatch(
          setAuth({
            accessToken: "",
            user: data,
          })
        );
      } catch (error) {
        console.error(error);
      }
    };

    fetchProfile();
  }, [dispatch]);

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
    <div className="min-h-screen bg-[#F6F5F3]">
      {/* NAVBAR */}
      <ProfileNavbar />

      {/* MAIN */}
      <div className="pt-24 px-6 md:px-16">
        
        {/* FLEX FIX (IMPORTANT) */}
        <div className="flex gap-10 max-w-7xl mx-auto">
          
          {/* SIDEBAR (FIXED WIDTH) */}
          <div className="w-[280px] flex-shrink-0">
            <ProfileSidebar
              activeTab={activeTab}
              setActiveTab={setActiveTab}
            />
          </div>

          {/* CONTENT (TAKES REST SPACE) */}
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex-1 bg-white rounded-3xl shadow-lg p-8 md:p-12 min-h-[600px] transition-all duration-300 hover:shadow-2xl"
          >
            {renderContent()}
          </motion.div>

        </div>
      </div>
    </div>
  );
}
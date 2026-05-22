




import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import ProfileLayout from "../../../components/user/profile/ProfileLayout";
import ProfileOverview from "../../../components/user/profile/ProfileOverview";
import EditProfile from "../../../components/user/profile/EditProfile";
import SettingsContent from "../../../components/user/settings/SettingsContent";
import AddressSection from "../../../components/user/profile/AddressSection";
import { userProfileApi } from "../../../api/user/userProfile.api";
import { RootState } from "../../../store/store";
import { User } from "../../../types/user";
import { setUser } from "../../../store/auth/auth.slice";
import { mapApiError } from "../../../util/errorHandler";
import toast from "react-hot-toast";
import { motion } from "framer-motion";

export default function ProfilePage() {
  const [active, setActive]   = useState("overview");
  const [loading, setLoading] = useState(true);
  const dispatch = useDispatch();
  const user = useSelector((state: RootState) => state.auth.user);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const data: User = await userProfileApi.getProfile();
        dispatch(setUser(data));
      } catch (err: unknown) {
        const mapped = mapApiError(err);
        toast.error(mapped.message || "Failed to load profile");
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, [dispatch]);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#080808] flex items-center justify-center">
        <motion.div
          animate={{ opacity: [0.3, 1, 0.3] }}
          transition={{ duration: 1.5, repeat: Infinity }}
          className="text-white/40 text-sm tracking-widest uppercase"
        >
          Loading...
        </motion.div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-[#080808] flex items-center justify-center">
        <p className="text-white/40 text-sm">Unable to load profile</p>
      </div>
    );
  }

  return (
    <ProfileLayout user={user} active={active} setActive={setActive}>
      {active === "overview"     && <ProfileOverview user={user} />}
      {active === "edit-profile" && <EditProfile user={user} />}
      {active === "address"      && <AddressSection />}
      {active === "settings"     && <SettingsContent />}
    </ProfileLayout>
  );
}

// import { useState, useEffect } from "react";
// import { useDispatch, useSelector } from "react-redux";

// import ProfileLayout from "../../../components/user/profile/ProfileLayout";
// import ProfileOverview from "../../../components/user/profile/ProfileOverview";
// import EditProfile from "../../../components/user/profile/EditProfile";

// import { userProfileApi } from "../../../api/user/userProfile.api";
// import { RootState } from "../../../store/store";
// import { User } from "../../../types/user";
// import { setUser } from "../../../store/auth/auth.slice";

// export default function ProfilePage() {
//   const [active, setActive] = useState("edit-profile");
//   const [loading, setLoading] = useState(true);

//   const dispatch = useDispatch();

//   const user = useSelector((state: RootState) => state.auth.user);

//   useEffect(() => {
//     const fetchProfile = async () => {
//       try {
//         const data: User = await userProfileApi.getProfile();

//         dispatch(setUser(data));

//       } catch (err) {
//         console.error("Profile fetch failed:", err);
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchProfile();
//   }, [dispatch]);

//   if (loading || !user) {
//     return <div className="p-6">Loading profile...</div>;
//   }

//   return (
// <ProfileLayout user={user} active={active} setActive={setActive}>

//   {active === "edit-profile" && <EditProfile user={user} />}

//   {active === "address" && <div>Address Section</div>}

//   {active === "settings" && <div>Settings Section</div>}

//   {active === "statements" && <div>Statements Section</div>}

//   {active === "upload" && <div>Upload Section</div>}

//   {active === "security" && <div>Security Section</div>}

//   {active === "billing" && <div>Billing Section</div>}

// </ProfileLayout>
//   );
// }









import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";

import ProfileLayout from "../../../components/user/profile/ProfileLayout";
import ProfileOverview from "../../../components/user/profile/ProfileOverview";
import EditProfile from "../../../components/user/profile/EditProfile";
import SettingsContent from "../../../components/user/settings/SettingsContent";
import { userProfileApi } from "../../../api/user/userProfile.api";
import { RootState } from "../../../store/store";
import { User } from "../../../types/user";
import { setUser } from "../../../store/auth/auth.slice";

export default function ProfilePage() {
  const [active, setActive] = useState("overview"); 
  const [loading, setLoading] = useState(true);

  const dispatch = useDispatch();
  const user = useSelector((state: RootState) => state.auth.user);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const data: User = await userProfileApi.getProfile();
        dispatch(setUser(data));
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [dispatch]);

  if (loading || !user) {
    return <div className="p-6">Loading profile...</div>;
  }

  return (
    <ProfileLayout user={user} active={active} setActive={setActive}>

      {active === "overview" && <ProfileOverview user={user} />}

      {active === "edit-profile" && <EditProfile user={user} />}

      {active === "address" && <div>Address Section</div>}

      {active === "settings" && <SettingsContent />}

    </ProfileLayout>
  );
}





import { User } from "../../../types/user";
import ProfileCard from "./ProfileCard";
import ImageUpload from "./ImageUpload";
import { motion } from "framer-motion";

interface Props { user: User; }

const InfoRow = ({ label, value }: { label: string; value?: string }) => (
  <div>
    <p className="text-xs text-white/30 uppercase tracking-widest mb-1">{label}</p>
    <p className="text-white font-medium text-sm">{value || "—"}</p>
  </div>
);

export default function ProfileOverview({ user }: Props) {
  return (
    <motion.div
      className="space-y-6"
      initial="hidden"
      animate="visible"
      variants={{ visible: { transition: { staggerChildren: 0.1 } } }}
    >
      <motion.h2
        initial={{ opacity: 0, y: -8 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-2xl font-serif text-white tracking-tight"
      >
        Overview
      </motion.h2>

      {/* Personal Info */}
      <ProfileCard>
        <div className="flex items-start gap-6 mb-6">
          <div className="w-14 h-14 rounded-full overflow-hidden border border-white/20 flex-shrink-0">
            <ImageUpload user={user} />
          </div>
          <div>
            <h3 className="text-white font-medium text-base">{user.name}</h3>
            <p className="text-white/40 text-sm mt-0.5">{user.email}</p>
          </div>
        </div>

        <div className="border-t border-white/10 pt-5">
          <h4 className="text-xs text-white/30 uppercase tracking-widest mb-4">Personal Info</h4>
          <div className="grid grid-cols-2 gap-5">
            <InfoRow label="Name" value={user.name} />
            <InfoRow label="Email" value={user.email} />
            <InfoRow label="Phone" value={user.phone} />
            <InfoRow label="Occupation" value={user.occupation} />
            <InfoRow label="Verification" value={user.verificationStatus} />
          </div>
        </div>
      </ProfileCard>

      {/* Address */}
      <ProfileCard>
        <h4 className="text-xs text-white/30 uppercase tracking-widest mb-4">Address</h4>
        <div className="grid grid-cols-2 gap-4">
          <InfoRow label="Street" value={user.address?.street} />
          <InfoRow label="City" value={user.address?.city} />
          <InfoRow label="District" value={user.address?.district} />
          <InfoRow label="State" value={user.address?.state} />
          <InfoRow label="Postal Code" value={user.address?.postalCode ?? user.address?.pincode} />
        </div>
      </ProfileCard>
    </motion.div>
  );
}

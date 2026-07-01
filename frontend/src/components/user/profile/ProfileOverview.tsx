import { useEffect, useState } from "react";

import { motion } from "framer-motion";

import { User, Address } from "../../../types/user";

import { userProfileApi } from "../../../api/user/userProfile.api";

import ProfileCard from "./ProfileCard";
import ImageUpload from "./ImageUpload";

interface Props {
  user: User;
}

const InfoRow = ({
  label,
  value,
}: {
  label: string;
  value?: string;
}) => (
  <div>
    <p className="text-xs text-white/30 uppercase tracking-widest mb-1">
      {label}
    </p>

    <p className="text-white font-medium text-sm">
      {value || "—"}
    </p>
  </div>
);

export default function ProfileOverview({
  user,
}: Props) {
  const [
    primaryAddress,
    setPrimaryAddress,
  ] = useState<Address | null>(
    null,
  );

  const [
    addressLoading,
    setAddressLoading,
  ] = useState(true);

  /* ====================================================== */
  /* LOAD PRIMARY ADDRESS */
  /* ====================================================== */

  const loadPrimaryAddress =
    async () => {
      try {
        setAddressLoading(true);

        const data =
          await userProfileApi.getPrimaryAddress();

        setPrimaryAddress(
          data,
        );
      } catch (
        error
      ) {
        console.error(
          "Failed to load primary address",
          error,
        );
      } finally {
        setAddressLoading(
          false,
        );
      }
    };

  useEffect(() => {
    void loadPrimaryAddress();
  }, []);

  return (
    <motion.div
      className="space-y-6"
      initial="hidden"
      animate="visible"
      variants={{
        visible: {
          transition: {
            staggerChildren: 0.1,
          },
        },
      }}
    >
      {/* ====================================================== */}
      {/* HEADING */}
      {/* ====================================================== */}

      <motion.h2
        initial={{
          opacity: 0,
          y: -8,
        }}
        animate={{
          opacity: 1,
          y: 0,
        }}
        className="text-2xl font-serif text-white tracking-tight"
      >
        Overview
      </motion.h2>

      {/* ====================================================== */}
      {/* PERSONAL INFO */}
      {/* ====================================================== */}

      <ProfileCard>
        <div className="flex items-start gap-6 mb-6">
          <div className="w-14 h-14 rounded-full overflow-hidden border border-white/20 flex-shrink-0">
            <ImageUpload user={user} />
          </div>

          <div>
            <h3 className="text-white font-medium text-base">
              {user.name}
            </h3>

            <p className="text-white/40 text-sm mt-0.5">
              {user.email}
            </p>
          </div>
        </div>

        <div className="border-t border-white/10 pt-5">
          <h4 className="text-xs text-white/30 uppercase tracking-widest mb-4">
            Personal Info
          </h4>

          <div className="grid grid-cols-2 gap-5">
            <InfoRow
              label="Name"
              value={user.name}
            />

            <InfoRow
              label="Email"
              value={user.email}
            />

            <InfoRow
              label="Phone"
              value={user.phone}
            />

            <InfoRow
              label="Occupation"
              value={user.occupation}
            />

            <InfoRow
              label="Verification"
              value={
                user.verificationStatus
              }
            />
          </div>
        </div>
      </ProfileCard>

      {/* ====================================================== */}
      {/* PRIMARY ADDRESS */}
      {/* ====================================================== */}

      <ProfileCard>
        <div className="flex items-center justify-between mb-4">
          <h4 className="text-xs text-white/30 uppercase tracking-widest">
            Primary Address
          </h4>

          {primaryAddress && (
            <span className="rounded-full bg-emerald-400/10 px-2 py-1 text-[10px] text-emerald-300">
              PRIMARY
            </span>
          )}
        </div>

        {addressLoading ? (
          <div className="h-24 animate-pulse rounded-lg bg-white/[0.03]" />
        ) : !primaryAddress ? (
          <div className="text-sm text-white/40">
            No primary address added
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-5">
            <InfoRow
              label="Full Name"
              value={
                primaryAddress.fullName
              }
            />

            <InfoRow
              label="Phone"
              value={
                primaryAddress.phone
              }
            />

            <InfoRow
              label="House Name"
              value={
                primaryAddress.houseName
              }
            />

            <InfoRow
              label="Street"
              value={
                primaryAddress.street
              }
            />

            <InfoRow
              label="City"
              value={
                primaryAddress.city
              }
            />

            <InfoRow
              label="District"
              value={
                primaryAddress.district
              }
            />

            <InfoRow
              label="State"
              value={
                primaryAddress.state
              }
            />

            <InfoRow
              label="Country"
              value={
                primaryAddress.country
              }
            />

            <InfoRow
              label="Postal Code"
              value={
                primaryAddress.postalCode ??
                primaryAddress.pincode
              }
            />

            <InfoRow
              label="Address Type"
              value={
                primaryAddress.addressType
              }
            />
          </div>
        )}
      </ProfileCard>
    </motion.div>
  );
}
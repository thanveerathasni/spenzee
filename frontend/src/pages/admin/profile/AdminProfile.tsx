import { motion } from "framer-motion";

export default function AdminProfile() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-3xl space-y-6"
    >
      <h1 className="text-2xl font-bold">Admin Profile</h1>

      <div className="bg-gray-50 p-6 rounded-xl">
        <p className="text-sm text-gray-500">Email</p>
        <p className="font-medium">admin@spenzee.com</p>
      </div>

      <div className="bg-gray-50 p-6 rounded-xl">
        <p className="text-sm text-gray-500">Role</p>
        <p className="font-medium">Super Admin</p>
      </div>

      <button className="px-6 py-3 bg-black text-white rounded-lg">
        Change Password
      </button>
    </motion.div>
  );
}

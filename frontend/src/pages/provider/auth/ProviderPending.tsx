import { motion } from "framer-motion";

const ProviderPending = () => {
  return (
    <div className="min-h-screen bg-black text-white flex items-center justify-center">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-[#111] p-10 rounded-2xl text-center space-y-4 max-w-md"
      >
        <h1 className="text-2xl font-bold">
          Request Submitted 
        </h1>

        <p className="text-gray-400">
          Your provider account is under review.
        </p>

        <p className="text-sm text-gray-500">
          You will be notified once admin approves your request.
        </p>

        <div className="pt-4">
          <span className="px-4 py-2 bg-yellow-500/20 text-yellow-400 rounded-lg text-sm">
            Status: Pending
          </span>
        </div>
      </motion.div>
    </div>
  );
};

export default ProviderPending;
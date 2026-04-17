import { useState } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";

export default function ProviderWelcome() {
  const [accepted, setAccepted] = useState(false);
  const navigate = useNavigate();

  const handleProceed = () => {
    if (accepted) {
      navigate("/provider/dashboard");
    }
  };

  return (
    <div className="min-h-screen bg-neutral-50 dark:bg-black flex items-center justify-center p-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-2xl w-full bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-3xl p-10 shadow-2xl"
      >
        <header className="mb-8 text-center">
          <h1 className="text-3xl font-black text-black dark:text-white uppercase tracking-tighter italic leading-none">
            Welcome to Spenzee
          </h1>
          <p className="text-[10px] font-bold text-neutral-400 dark:text-neutral-500 uppercase tracking-[0.2em] mt-3">
            Provider Rules & Regulations
          </p>
        </header>

        <div className="space-y-6 text-sm text-neutral-600 dark:text-neutral-400 max-h-[40vh] overflow-y-auto pr-4 mb-8 custom-scrollbar">
          <section className="space-y-2">
            <h3 className="font-bold text-black dark:text-white text-base">1. Account Responsibilities</h3>
            <p>
              As a provider on Spenzee, you are responsible for maintaining the confidentiality of your account credentials and for all activities that occur under your account. You agree to immediately notify us of any unauthorized use of your account.
            </p>
          </section>

          <section className="space-y-2">
            <h3 className="font-bold text-black dark:text-white text-base">2. Service Quality & Standards</h3>
            <p>
              You agree to provide services that meet or exceed industry standards. Misrepresentation of services, failure to deliver promised value, or consistent poor ratings may result in account suspension or termination.
            </p>
          </section>

          <section className="space-y-2">
            <h3 className="font-bold text-black dark:text-white text-base">3. Financial Transactions</h3>
            <p>
              All payments for services must be processed through the Spenzee platform. Circumventing the platform's payment system is strictly prohibited and will lead to an immediate permanent ban.
            </p>
          </section>

          <section className="space-y-2">
            <h3 className="font-bold text-black dark:text-white text-base">4. Compliance & Legal</h3>
            <p>
              You must comply with all applicable local, state, and national laws regarding your services. Spenzee is not liable for any legal infractions committed by providers on our platform.
            </p>
          </section>
        </div>

        <div className="flex items-center gap-3 p-4 bg-neutral-100 dark:bg-neutral-950 rounded-xl mb-8">
          <input
            type="checkbox"
            id="accept"
            checked={accepted}
            onChange={(e) => setAccepted(e.target.checked)}
            className="w-5 h-5 accent-black dark:accent-white rounded cursor-pointer"
          />
          <label htmlFor="accept" className="text-sm font-medium text-black dark:text-white cursor-pointer select-none">
            I have read and agree to the Provider Rules & Regulations
          </label>
        </div>

        <button
          onClick={handleProceed}
          disabled={!accepted}
          className={`w-full py-4 rounded-xl font-black uppercase tracking-[0.2em] text-[11px] transition shadow-sm
            ${accepted 
              ? "bg-black text-white hover:bg-neutral-800 dark:bg-white dark:text-black dark:hover:bg-neutral-200 active:scale-[0.99]" 
              : "bg-neutral-200 text-neutral-400 dark:bg-neutral-800 dark:text-neutral-600 cursor-not-allowed"
            }
          `}
        >
          Proceed to Dashboard
        </button>
      </motion.div>
    </div>
  );
}

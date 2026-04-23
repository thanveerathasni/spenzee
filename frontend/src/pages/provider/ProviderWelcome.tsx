





import { useState } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { api } from "../../api/axios";
import toast from "react-hot-toast";
import { useDispatch ,useSelector } from "react-redux";
import type { RootState } from "../../store/store";
import { setUser } from "../../store/auth/auth.slice";
export default function ProviderWelcome() {
  const [accepted, setAccepted] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const user = useSelector((state: RootState) => state.auth.user);

  const handleProceed = async () => {
    if (!accepted) return;

    try {
      await api.patch("/provider/accept-terms");

      if (user) {
        dispatch(
          setUser({
            ...user,
            hasAcceptedTerms: true,
          })
        );
      }

      navigate("/provider/dashboard");
    } catch {
      toast.error("Something went wrong. Please try again.");
    }
  }


  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.3, delayChildren: 0.5 },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 1.2, ease: [0.22, 1, 0.36, 1] as [number, number, number, number] },
    },
  };

  return (
    <div className="relative w-screen min-h-screen flex flex-col bg-white dark:bg-black overflow-hidden transition-colors duration-700">
      {/* Navbar */}
      <motion.nav
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
        className="fixed top-0 left-0 w-full z-50 flex items-center justify-between px-6 py-6 md:px-12 md:py-8 bg-white dark:bg-black border-b border-black/5 dark:border-white/5 transition-colors duration-700"
      >
        <div className="font-serif text-2xl font-medium tracking-tight text-black dark:text-white transition-colors duration-700">
          Spenzee
        </div>
      </motion.nav>

      {/* Main */}
      <main className="flex-1 flex items-center justify-center px-6 md:px-24 pt-32 pb-16">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="w-full max-w-2xl"
        >
          {/* Header */}
          <motion.div variants={itemVariants} className="text-center mb-10">
            <h1 className="text-5xl md:text-7xl font-serif font-medium tracking-tight text-black dark:text-white mb-4 transition-colors duration-700">
              Welcome to
              <br />
              <span className="italic font-serif font-normal">Spenzee</span>
            </h1>
            <p className="text-xs md:text-sm font-sans text-black/40 dark:text-white/40 uppercase tracking-[0.35em] transition-colors duration-700">
              Provider Rules & Regulations
            </p>
          </motion.div>

          {/* Rules Content */}
          <motion.div
            variants={itemVariants}
            className="space-y-6 text-sm text-black/60 dark:text-white/40 max-h-[35vh] overflow-y-auto pr-4 mb-8 border-t border-b border-black/10 dark:border-white/10 py-6"
          >
            <section className="space-y-2">
              <h3 className="font-bold text-black dark:text-white text-base">
                1. Account Responsibilities
              </h3>
              <p>
                As a provider on Spenzee, you are responsible for maintaining
                the confidentiality of your account credentials and for all
                activities that occur under your account. You agree to
                immediately notify us of any unauthorized use of your account.
              </p>
            </section>

            <section className="space-y-2">
              <h3 className="font-bold text-black dark:text-white text-base">
                2. Service Quality & Standards
              </h3>
              <p>
                You agree to provide services that meet or exceed industry
                standards. Misrepresentation of services, failure to deliver
                promised value, or consistent poor ratings may result in account
                suspension or termination.
              </p>
            </section>

            <section className="space-y-2">
              <h3 className="font-bold text-black dark:text-white text-base">
                3. Financial Transactions
              </h3>
              <p>
                All payments for services must be processed through the Spenzee
                platform. Circumventing the platform's payment system is
                strictly prohibited and will lead to an immediate permanent ban.
              </p>
            </section>

            <section className="space-y-2">
              <h3 className="font-bold text-black dark:text-white text-base">
                4. Compliance & Legal
              </h3>
              <p>
                You must comply with all applicable local, state, and national
                laws regarding your services. Spenzee is not liable for any
                legal infractions committed by providers on our platform.
              </p>
            </section>
          </motion.div>

          {/* Checkbox */}
          <motion.div
            variants={itemVariants}
            className="flex items-center gap-3 mb-8"
          >
            <input
              type="checkbox"
              id="accept"
              checked={accepted}
              onChange={(e) => setAccepted(e.target.checked)}
              className="w-5 h-5 accent-black dark:accent-white rounded cursor-pointer"
            />
            <label
              htmlFor="accept"
              className="text-sm font-medium text-black dark:text-white cursor-pointer select-none"
            >
              I have read and agree to the Provider Rules & Regulations
            </label>
          </motion.div>

          {/* CTA Button */}
          <motion.div variants={itemVariants} className="flex justify-center">
            <motion.button
              whileHover={accepted ? { scale: 1.02 } : {}}
              whileTap={accepted ? { scale: 0.98 } : {}}
              onClick={handleProceed}
              disabled={!accepted}
              className={`group flex items-center justify-center gap-4 px-14 py-5 text-xs uppercase tracking-[0.25em] font-medium transition-all duration-700
                ${
                  accepted
                    ? "bg-black text-white dark:bg-white dark:text-black hover:bg-black/80 dark:hover:bg-white/80 cursor-pointer"
                    : "bg-black/20 text-black/30 dark:bg-white/10 dark:text-white/20 cursor-not-allowed"
                }`}
            >
              <span>Proceed to Dashboard</span>
              <svg
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="none"
                className={`transition-transform duration-300 ${accepted ? "group-hover:translate-x-1" : ""}`}
              >
                <path
                  d="M5 12h14M13 6l6 6-6 6"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </motion.button>
          </motion.div>
        </motion.div>
      </main>

      {/* Footer */}
      <motion.footer
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.5, duration: 1 }}
        className="px-12 py-8 flex justify-between items-center text-[10px] uppercase tracking-[0.2em] text-black/30 dark:text-white/30 transition-colors duration-700 w-full"
      >
        <div className="hidden md:block">Est. MMXXIV</div>
        <div className="w-full text-center md:w-auto">
          © Spenzee Protocol — All Rights Reserved
        </div>
        <div className="hidden md:block">Provider Tier</div>
      </motion.footer>
    </div>
  );
}
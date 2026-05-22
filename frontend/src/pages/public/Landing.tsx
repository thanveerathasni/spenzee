import React, { useEffect, useRef, useState } from "react";
import oakChair from "../../assets/images/chair-for-landing.png";
import lamp from "../../assets/images/lamb-for-landing.png";
import coffeeTable from "../../assets/images/landing-1.png";
import sofa from "../../assets/images/landing-2.png";
import onepercent from "../../assets/hero/onepercent.jpg"
import { useNavigate } from "react-router-dom";
import {
  motion,
  useScroll,
  useTransform,
  useInView,
  AnimatePresence,
  useMotionValue,
  useSpring,
} from "framer-motion";

/* ─────────────────────────────────────────────
   TOKENS
───────────────────────────────────────────── */
const C = {
  cream: "#F5F0E8",
  creamDark: "#EDE7D9",
  creamDeep: "#E0D9CC",
  ink: "#0F0F0D",
  inkMid: "#3A3A36",
  inkLight: "#7A7A74",
  inkGhost: "#B8B4AC",
  accent: "#1A1A18",
};

/* ─────────────────────────────────────────────
   CUSTOM CURSOR
───────────────────────────────────────────── */
const CustomCursor: React.FC = () => {
  const cursorX = useMotionValue(-100);
  const cursorY = useMotionValue(-100);
  const springX = useSpring(cursorX, { stiffness: 500, damping: 40 });
  const springY = useSpring(cursorY, { stiffness: 500, damping: 40 });
  const [hovered, setHovered] = useState(false);

  useEffect(() => {
    const move = (e: MouseEvent) => { cursorX.set(e.clientX); cursorY.set(e.clientY); };
    const over = () => setHovered(true);
    const out = () => setHovered(false);
    window.addEventListener("mousemove", move);
    document.querySelectorAll("a,button,[data-cursor]").forEach((el) => {
      el.addEventListener("mouseenter", over);
      el.addEventListener("mouseleave", out);
    });
    return () => window.removeEventListener("mousemove", move);
  }, []);

  return (
    <>
      <motion.div
        className="fixed top-0 left-0 w-2.5 h-2.5 rounded-full pointer-events-none z-[9999]"
        style={{ x: springX, y: springY, translateX: "-50%", translateY: "-50%", backgroundColor: C.ink }}
        animate={{ scale: hovered ? 3.5 : 1 }}
        transition={{ duration: 0.15 }}
      />
      <motion.div
        className="fixed top-0 left-0 w-8 h-8 rounded-full pointer-events-none z-[9998]"
        style={{
          x: useSpring(cursorX, { stiffness: 130, damping: 22 }),
          y: useSpring(cursorY, { stiffness: 130, damping: 22 }),
          translateX: "-50%", translateY: "-50%",
          border: `1px solid ${C.inkGhost}`,
        }}
        animate={{ scale: hovered ? 0 : 1, opacity: hovered ? 0 : 1 }}
        transition={{ duration: 0.15 }}
      />
    </>
  );
};

/* ─────────────────────────────────────────────
   REVEAL TEXT
───────────────────────────────────────────── */
const RevealText: React.FC<{
  children: string;
  className?: string;
  delay?: number;
  style?: React.CSSProperties;
}> = ({
  children, className = "", delay = 0, style,
}) => {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-8% 0px" });
  return (
    <span ref={ref} className={`inline-block ${className}`} style={style}>
      {children.split(" ").map((word, i) => (
        <span key={i} className="inline-block overflow-hidden mr-[0.2em]">
          <motion.span
            className="inline-block"
            initial={{ y: "105%", opacity: 0 }}
            animate={inView ? { y: 0, opacity: 1 } : {}}
            transition={{ duration: 0.85, delay: delay + i * 0.07, ease: [0.22, 1, 0.36, 1] }}
          >
            {word}
          </motion.span>
        </span>
      ))}
    </span>
  );
};

/* ─────────────────────────────────────────────
   FADE UP
───────────────────────────────────────────── */
const FadeUp: React.FC<{ children: React.ReactNode; delay?: number; className?: string }> = ({
  children, delay = 0, className = "",
}) => {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-8% 0px" });
  return (
    <motion.div ref={ref}
      initial={{ opacity: 0, y: 36 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.95, delay, ease: [0.22, 1, 0.36, 1] }}
      className={className}
    >
      {children}
    </motion.div>
  );
};

/* ─────────────────────────────────────────────
   SECTION LABEL
───────────────────────────────────────────── */
const SectionLabel: React.FC<{ children: string; dark?: boolean }> = ({ children, dark }) => (
  <div className="flex items-center gap-3 mb-6">
    <div className="w-6 h-px" style={{ backgroundColor: dark ? "rgba(255,255,255,0.2)" : C.inkGhost }} />
    <span className="text-[9px] font-bold uppercase tracking-[0.45em]"
      style={{ color: dark ? "rgba(255,255,255,0.3)" : C.inkLight }}>
      {children}
    </span>
  </div>
);

/* ─────────────────────────────────────────────
   NAVBAR
───────────────────────────────────────────── */
export const Navbar: React.FC = () => {
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", fn);
    return () => window.removeEventListener("scroll", fn);
  }, []);

  return (
    <motion.nav
      initial={{ y: -70, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
      className="fixed top-0 left-0 right-0 z-[100] transition-all duration-500"
      style={{
        backgroundColor: scrolled ? "rgba(245,240,232,0.95)" : "rgba(245,240,232,0.7)",
        backdropFilter: "blur(20px)",
        borderBottom: scrolled ? `1px solid ${C.creamDeep}` : "1px solid transparent",
        padding: scrolled ? "14px 56px" : "20px 56px",
      }}
    >
      <div className="flex items-center justify-between max-w-[1600px] mx-auto">
        {/* Logo */}
        <motion.button
          onClick={() => navigate("/")}
          whileHover={{ opacity: 0.55 }}
          transition={{ duration: 0.2 }}
          className="font-black text-sm tracking-[-0.04em] uppercase"
          style={{ color: C.ink }}
        >
          Spenzee
        </motion.button>

        {/* Desktop nav */}
        <div className="hidden md:flex items-center gap-10">
          {[["Features", "#features"], ["How it works", "#how-it-works"], ["Providers", "#for-providers"]].map(([label, href]) => (
            <a key={label} href={href}
              className="relative group text-[10px] font-bold uppercase tracking-[0.28em] transition-colors duration-200"
              style={{ color: C.inkLight }}
              onMouseEnter={e => (e.currentTarget.style.color = C.ink)}
              onMouseLeave={e => (e.currentTarget.style.color = C.inkLight)}
            >
              {label}
              <span className="absolute -bottom-0.5 left-0 w-0 h-px group-hover:w-full transition-all duration-300"
                style={{ backgroundColor: C.ink }} />
            </a>
          ))}
        </div>

        {/* CTAs */}
        <div className="hidden md:flex items-center gap-3">
          <motion.button
            whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.97 }}
            onClick={() => navigate("/login")}
            className="px-5 py-2.5 text-[10px] font-black uppercase tracking-[0.22em] transition-all duration-200"
            style={{ border: `1px solid ${C.inkGhost}`, color: C.inkMid, backgroundColor: "transparent" }}
            onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.borderColor = C.ink; (e.currentTarget as HTMLButtonElement).style.color = C.ink; }}
            onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.borderColor = C.inkGhost; (e.currentTarget as HTMLButtonElement).style.color = C.inkMid; }}
          >
            Sign In
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.02, opacity: 0.88 }} whileTap={{ scale: 0.97 }}
            onClick={() => navigate("/signup")}
            className="px-5 py-2.5 text-[10px] font-black uppercase tracking-[0.22em] transition-all duration-200"
            style={{ backgroundColor: C.ink, color: C.cream }}
          >
            Get Started
          </motion.button>
        </div>

        {/* Mobile toggle */}
        <button className="md:hidden p-1.5" onClick={() => setMenuOpen(v => !v)}>
          <motion.span animate={menuOpen ? { rotate: 45, y: 5 } : { rotate: 0, y: 0 }} className="block w-5 h-px mb-1.5" style={{ backgroundColor: C.ink }} />
          <motion.span animate={menuOpen ? { opacity: 0 } : { opacity: 1 }} className="block w-5 h-px mb-1.5" style={{ backgroundColor: C.ink }} />
          <motion.span animate={menuOpen ? { rotate: -45, y: -5 } : { rotate: 0, y: 0 }} className="block w-5 h-px" style={{ backgroundColor: C.ink }} />
        </button>
      </div>

      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
            className="absolute top-full left-0 right-0 px-6 py-10 flex flex-col gap-7"
            style={{ backgroundColor: C.cream, borderBottom: `1px solid ${C.creamDeep}` }}
          >
            {[["Features", "#features"], ["How it works", "#how-it-works"], ["Providers", "#for-providers"]].map(([label, href]) => (
              <a key={label} href={href}
                className="text-[10px] font-black uppercase tracking-[0.3em]"
                style={{ color: C.inkLight }}
                onClick={() => setMenuOpen(false)}
              >{label}</a>
            ))}
            <div className="flex gap-3 pt-4" style={{ borderTop: `1px solid ${C.creamDeep}` }}>
              <button onClick={() => navigate("/login")}
                className="flex-1 py-3.5 text-[10px] font-black uppercase tracking-widest"
                style={{ border: `1px solid ${C.inkGhost}`, color: C.inkMid }}
              >Sign In</button>
              <button onClick={() => navigate("/signup")}
                className="flex-1 py-3.5 text-[10px] font-black uppercase tracking-widest"
                style={{ backgroundColor: C.ink, color: C.cream }}
              >Get Started</button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  );
};

/* ─────────────────────────────────────────────
   HERO — split layout, image on right
───────────────────────────────────────────── */
const Hero: React.FC = () => {
  const navigate = useNavigate();
  const { scrollYProgress } = useScroll();
  const imageY = useTransform(scrollYProgress, [0, 0.5], [0, 60]);
  const imageScale = useTransform(scrollYProgress, [0, 0.5], [1, 1.06]);

  return (
    <section
      className="w-full min-h-screen flex overflow-hidden"
      style={{ backgroundColor: C.cream, paddingTop: "80px" }}
    >
      {/* ── LEFT — text panel ── */}
      <div className="flex flex-col justify-between w-full lg:w-[52%] px-8 md:px-14 lg:px-20 pt-16 pb-14">

        {/* Top row */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3, duration: 0.8 }}
          className="flex items-center justify-between"
        >
          <div className="flex items-center gap-3">
            <div className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: C.inkGhost }} />
            <span className="text-[9px] font-bold uppercase tracking-[0.45em]" style={{ color: C.inkLight }}>
              Smart Finance Platform
            </span>
          </div>
          <span className="text-[9px] font-bold uppercase tracking-[0.3em]" style={{ color: C.inkGhost }}>
            Est. 2024
          </span>
        </motion.div>

        {/* Headline */}
        <div className="my-auto py-12">
          <motion.div
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2, duration: 0.7 }}
            className="inline-flex items-center gap-2 mb-8 px-3 py-1.5"
            style={{ border: `1px solid ${C.creamDeep}`, backgroundColor: C.creamDark }}
          >
            <span className="text-[8px] font-black uppercase tracking-[0.4em]" style={{ color: C.inkMid }}>
              Now in Beta
            </span>
            <span className="text-[8px] font-black uppercase tracking-[0.4em]" style={{ color: C.inkGhost }}>→ Join 10K+ users</span>
          </motion.div>

          <h1
            className="font-black uppercase leading-[0.88] tracking-[-0.045em] mb-8"
            style={{ fontSize: "clamp(3.8rem, 8vw, 7.5rem)", color: C.ink }}
          >
            <span className="block overflow-hidden">
              <RevealText delay={0.35}>Control</RevealText>
            </span>
            <span className="block overflow-hidden">
              <RevealText delay={0.5} className="font-extralight italic normal-case tracking-[-0.02em]"
                style={{ color: C.inkLight } as React.CSSProperties}>
                your money.
              </RevealText>
            </span>
            <span className="block overflow-hidden">
              <RevealText delay={0.65}>Live</RevealText>
            </span>
            <span className="block overflow-hidden">
              <RevealText delay={0.8} className="font-extralight italic normal-case tracking-[-0.02em]"
                style={{ color: C.inkLight } as React.CSSProperties}>
                better.
              </RevealText>
            </span>
          </h1>

          <motion.p
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1, duration: 0.85, ease: [0.22, 1, 0.36, 1] }}
            className="text-sm leading-[1.9] max-w-sm mb-12"
            style={{ color: C.inkLight }}
          >
            Track expenses. Understand habits. Discover curated products matched to your lifestyle —
            all in one privacy-first platform.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.15, duration: 0.85, ease: [0.22, 1, 0.36, 1] }}
            className="flex flex-wrap items-center gap-5"
          >
            <motion.button
              whileHover={{ scale: 1.02, opacity: 0.88 }} whileTap={{ scale: 0.97 }}
              onClick={() => navigate("/signup")}
              className="px-8 py-4 text-[10px] font-black uppercase tracking-[0.25em] transition-all"
              style={{ backgroundColor: C.ink, color: C.cream }}
            >
              Start for free
            </motion.button>
            <motion.button
              whileHover={{ x: 4 }} transition={{ duration: 0.2 }}
              onClick={() => navigate("/login")}
              className="flex items-center gap-3 text-[10px] font-black uppercase tracking-[0.25em] group"
              style={{ color: C.inkLight }}
            >
              Sign in
              <motion.span
                variants={{ hover: { x: 3 } }}
                className="inline-block transition-transform duration-200 group-hover:translate-x-1"
              >→</motion.span>
            </motion.button>
          </motion.div>
        </div>

        {/* Stats strip */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.4, duration: 0.9 }}
          className="flex items-center gap-10 pt-8"
          style={{ borderTop: `1px solid ${C.creamDeep}` }}
        >
          {[["10K+", "Active users"], ["4.9 / 5", "App rating"], ["₹2Cr+", "Tracked monthly"]].map(([num, label]) => (
            <div key={label}>
              <p className="text-xl font-black leading-none mb-1.5 tracking-tight" style={{ color: C.ink }}>{num}</p>
              <p className="text-[9px] font-bold uppercase tracking-[0.35em]" style={{ color: C.inkGhost }}>{label}</p>
            </div>
          ))}
        </motion.div>
      </div>

      {/* ── RIGHT — image panel ── */}
      <motion.div
        initial={{ opacity: 0, x: 40 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 1.1, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
        className="hidden lg:block relative w-[48%] overflow-hidden"
        style={{ backgroundColor: C.creamDark }}
      >
        <motion.img
          src={onepercent}
          alt="Spenzee"
          className="absolute inset-0 w-full h-full object-cover object-center"
          style={{ y: imageY, scale: imageScale }}
        />

        {/* Subtle left fade to blend with text */}
        <div className="absolute inset-0 bg-gradient-to-r from-[#F5F0E8]/30 to-transparent pointer-events-none" />

        {/* Floating data card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.2, duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
          className="absolute bottom-10 left-8 right-8 p-6"
          style={{
            backgroundColor: "rgba(245,240,232,0.92)",
            backdropFilter: "blur(16px)",
            border: `1px solid ${C.creamDeep}`,
          }}
        >
          <div className="flex items-center justify-between mb-4">
            <span className="text-[9px] font-black uppercase tracking-[0.35em]" style={{ color: C.inkLight }}>
              Monthly Overview
            </span>
            <span className="text-[9px] font-bold" style={{ color: C.inkGhost }}>April 2025</span>
          </div>
          <div className="grid grid-cols-3 gap-4">
            {[["₹42,800", "Spent", C.ink], ["₹12,200", "Saved", "#2D6A4F"], ["₹6,400", "Rewards", "#7B5EA7"]].map(([val, label, color]) => (
              <div key={label}>
                <p className="font-black text-base leading-none mb-1" style={{ color }}>{val}</p>
                <p className="text-[9px] font-bold uppercase tracking-widest" style={{ color: C.inkGhost }}>{label}</p>
              </div>
            ))}
          </div>
          {/* Mini bar chart */}
          <div className="flex items-end gap-1 mt-5 h-8">
            {[65, 45, 80, 55, 70, 40, 90, 60, 75, 50, 85, 68].map((h, i) => (
              <motion.div key={i}
                initial={{ scaleY: 0 }} animate={{ scaleY: 1 }}
                transition={{ delay: 1.5 + i * 0.05, duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
                className="flex-1 origin-bottom"
                style={{ height: `${h}%`, backgroundColor: i === 10 ? C.ink : C.creamDeep }}
              />
            ))}
          </div>
        </motion.div>
      </motion.div>
    </section>
  );
};

/* ─────────────────────────────────────────────
   TICKER
───────────────────────────────────────────── */
const Ticker: React.FC = () => {
  const items = ["Expense Tracking", "Spending Insights", "Partner Rewards", "Privacy First", "Curated Products", "Zero Data Risk", "Smart Budgeting", "Lifestyle Finance"];
  const doubled = [...items, ...items];
  return (
    <div className="w-full py-3.5 overflow-hidden flex items-center"
      style={{ backgroundColor: C.ink, borderTop: `1px solid rgba(255,255,255,0.06)` }}>
      <motion.div
        animate={{ x: ["0%", "-50%"] }}
        transition={{ repeat: Infinity, duration: 28, ease: "linear" }}
        className="flex whitespace-nowrap gap-12 items-center"
      >
        {doubled.map((item, i) => (
          <span key={i} className="flex items-center gap-12">
            <span className="text-[9px] font-black uppercase tracking-[0.4em]"
              style={{ color: "rgba(245,240,232,0.35)" }}>{item}</span>
            <span className="text-[7px]" style={{ color: "rgba(245,240,232,0.12)" }}>◆</span>
          </span>
        ))}
      </motion.div>
    </div>
  );
};

/* ─────────────────────────────────────────────
   FEATURES
───────────────────────────────────────────── */
const FeaturesStrip: React.FC = () => {
  const features = [
    { title: "Track expenses", desc: "Log every transaction instantly. Categorised, searchable, always up to date.", icon: "M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2", num: "01" },
    { title: "Spending analysis", desc: "Deep insights into patterns. Understand where your money actually goes.", icon: "M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z", num: "02" },
    { title: "Product discovery", desc: "Curated recommendations matched to your actual spending habits.", icon: "M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z", num: "03" },
    { title: "Partner rewards", desc: "Exclusive benefits from verified brands aligned with your lifestyle.", icon: "M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z", num: "04" },
  ];

  return (
    <section id="features" className="w-full py-32 px-8 md:px-14" style={{ backgroundColor: C.cream }}>
      <div className="max-w-[1600px] mx-auto">
        <FadeUp className="mb-20 flex flex-col md:flex-row md:items-end justify-between gap-8">
          <div>
            <SectionLabel>What we offer</SectionLabel>
            <h2 className="font-black uppercase tracking-[-0.04em] leading-[0.9]"
              style={{ fontSize: "clamp(2.6rem,5vw,4.5rem)", color: C.ink }}>
              Built for<br />
              <span className="font-extralight italic normal-case tracking-[-0.02em]"
                style={{ color: C.inkLight }}>financial clarity.</span>
            </h2>
          </div>
          <p className="text-sm leading-[1.9] max-w-xs" style={{ color: C.inkLight }}>
            Every feature is designed around one principle — helping you understand and control your money.
          </p>
        </FadeUp>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-px"
          style={{ backgroundColor: C.creamDeep }}>
          {features.map((f, i) => (
            <FadeUp key={i} delay={i * 0.09}>
              <motion.div
                whileHover={{ backgroundColor: C.ink }}
                transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
                className="group p-10 flex flex-col gap-10 h-full cursor-default"
                style={{ backgroundColor: C.cream }}
              >
                <div className="flex justify-between items-start">
                  <div className="w-10 h-10 flex items-center justify-center"
                    style={{ border: `1px solid ${C.creamDeep}` }}>
                    <svg className="w-4 h-4 transition-colors duration-300"
                      style={{ color: C.inkLight }}
                      fill="none" stroke="currentColor" viewBox="0 0 24 24"
                      onMouseEnter={e => { (e.currentTarget as SVGElement).style.color = C.cream; }}
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d={f.icon} />
                    </svg>
                  </div>
                  <span className="text-[9px] font-black tracking-widest transition-colors duration-300"
                    style={{ color: C.inkGhost }}>
                    {f.num}
                  </span>
                </div>
                <div>
                  <h3 className="font-black text-base mb-3 uppercase tracking-tight transition-colors duration-300 group-hover:text-[#F5F0E8]"
                    style={{ color: C.ink }}>
                    {f.title}
                  </h3>
                  <p className="text-sm leading-[1.8] transition-colors duration-300 group-hover:text-[rgba(245,240,232,0.45)]"
                    style={{ color: C.inkLight }}>
                    {f.desc}
                  </p>
                </div>
              </motion.div>
            </FadeUp>
          ))}
        </div>
      </div>
    </section>
  );
};

/* ─────────────────────────────────────────────
   ADVANTAGE
───────────────────────────────────────────── */
const SpenzeeAdvantage: React.FC = () => {
  const advantages = [
    { title: "Real spending clarity", desc: "See exactly where every rupee goes. No jargon. No confusion. Pure financial transparency that builds better habits over time.", tag: "Insights" },
    { title: "Personalised discovery", desc: "Our engine learns your spending patterns and surfaces products you actually want — not ads, curated recommendations.", tag: "Intelligence" },
    { title: "Rewards that matter", desc: "Unlock premium benefits from hand-picked brands. Rewards that are relevant to how you actually live and spend.", tag: "Rewards" },
    { title: "Privacy by design", desc: "No bank linking. No financial storage. Your data never leaves your device. Privacy isn't a feature — it's the foundation.", tag: "Privacy" },
  ];

  return (
    <section id="how-it-works" className="w-full py-32 px-8 md:px-14"
      style={{ backgroundColor: C.creamDark }}>
      <div className="max-w-[1600px] mx-auto">
        <FadeUp className="mb-24">
          <SectionLabel>Why Spenzee</SectionLabel>
          <h2 className="font-black uppercase tracking-[-0.04em] leading-[0.9]"
            style={{ fontSize: "clamp(2.6rem,5vw,4.5rem)", color: C.ink }}>
            The Spenzee<br />
            <span className="font-extralight italic normal-case tracking-[-0.02em]"
              style={{ color: C.inkLight }}>difference.</span>
          </h2>
        </FadeUp>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-px"
          style={{ backgroundColor: C.creamDeep }}>
          {advantages.map((adv, i) => (
            <FadeUp key={i} delay={i * 0.08}>
              <motion.div
                whileHover={{ backgroundColor: C.ink }}
                transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
                className="group p-14 relative overflow-hidden cursor-default"
                style={{ backgroundColor: C.creamDark }}
              >
                <span className="absolute -bottom-8 right-6 font-black leading-none select-none pointer-events-none transition-colors duration-500"
                  style={{ fontSize: "9rem", color: `rgba(15,15,13,0.04)` }}>
                  {String(i + 1).padStart(2, "0")}
                </span>
                <span className="inline-block text-[9px] font-black uppercase tracking-[0.3em] px-3 py-1.5 mb-10 transition-all duration-300"
                  style={{ border: `1px solid ${C.creamDeep}`, color: C.inkLight }}>
                  {adv.tag}
                </span>
                <h3 className="font-black text-2xl mb-5 uppercase tracking-tight leading-tight transition-colors duration-300 group-hover:text-[#F5F0E8]"
                  style={{ color: C.ink }}>
                  {adv.title}
                </h3>
                <p className="text-sm leading-[1.85] transition-colors duration-300 group-hover:text-[rgba(245,240,232,0.4)]"
                  style={{ color: C.inkLight }}>
                  {adv.desc}
                </p>
                <motion.div
                  className="absolute bottom-0 left-0 h-px"
                  style={{ backgroundColor: C.inkGhost }}
                  initial={{ width: 0 }}
                  whileHover={{ width: "100%" }}
                  transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
                />
              </motion.div>
            </FadeUp>
          ))}
        </div>
      </div>
    </section>
  );
};

/* ─────────────────────────────────────────────
   PRODUCT PREVIEW
───────────────────────────────────────────── */
const ProductPreview: React.FC<{ products: { [key: string]: string } }> = ({ products }) => {
  const items = [
    { name: "Oak Wood Chair", price: "$290", id: "oak-chair" },
    { name: "Ceramic Table Lamp", price: "$145", id: "lamp" },
    { name: "Minimal Coffee Table", price: "$480", id: "coffee-table" },
    { name: "Linen Lounge Sofa", price: "$1,250", id: "sofa" },
  ];

  return (
    <section id="products" className="w-full py-32 px-8 md:px-14" style={{ backgroundColor: C.cream }}>
      <div className="max-w-[1600px] mx-auto">
        <div className="flex justify-between items-end mb-20">
          <FadeUp>
            <SectionLabel>Curated picks</SectionLabel>
            <h2 className="font-black uppercase tracking-[-0.04em] leading-[0.9]"
              style={{ fontSize: "clamp(2.6rem,5vw,4.5rem)", color: C.ink }}>
              Matched to<br />
              <span className="font-extralight italic normal-case tracking-[-0.02em]"
                style={{ color: C.inkLight }}>your lifestyle.</span>
            </h2>
          </FadeUp>
          <FadeUp>
            <motion.button
              whileHover="hover" whileTap={{ scale: 0.97 }}
              className="hidden md:flex items-center gap-3 group"
            >
              <motion.span
                variants={{ hover: { x: 2 } }}
                className="text-[10px] font-black uppercase tracking-[0.28em] transition-colors"
                style={{ color: C.inkLight }}
              >View all</motion.span>
              <motion.div
                variants={{ hover: { backgroundColor: C.ink } }}
                transition={{ duration: 0.25 }}
                className="w-9 h-9 flex items-center justify-center transition-colors"
                style={{ border: `1px solid ${C.creamDeep}` }}
              >
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none"
                  className="group-hover:text-[#F5F0E8] transition-colors"
                  style={{ color: C.ink }}>
                  <path d="M5 12h14M13 6l6 6-6 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </motion.div>
            </motion.button>
          </FadeUp>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {items.map((item, i) => (
            <FadeUp key={i} delay={i * 0.09}>
              <motion.div whileHover="hover" className="group cursor-pointer">
                <motion.div
                  variants={{ hover: { scale: 1.01 } }}
                  transition={{ duration: 0.5 }}
                  className="aspect-[3/4] mb-5 overflow-hidden flex items-center justify-center p-10 relative"
                  style={{ backgroundColor: C.creamDark, border: `1px solid ${C.creamDeep}` }}
                >
                  <motion.img
                    src={products[item.id]} alt={item.name}
                    className="max-h-full object-contain"
                    variants={{ hover: { scale: 1.07, y: -6 } }}
                    transition={{ duration: 0.65, ease: [0.22, 1, 0.36, 1] }}
                  />
                  <motion.div
                    initial={{ opacity: 0, y: 12 }}
                    variants={{ hover: { opacity: 1, y: 0 } }}
                    transition={{ duration: 0.28 }}
                    className="absolute bottom-4 left-4 right-4"
                  >
                    <button className="w-full py-3 text-[9px] font-black uppercase tracking-[0.3em]"
                      style={{ backgroundColor: C.ink, color: C.cream }}>
                      Quick Add
                    </button>
                  </motion.div>
                </motion.div>
                <div className="flex justify-between items-center px-1">
                  <div>
                    <h4 className="font-black text-[11px] tracking-tight uppercase mb-1" style={{ color: C.ink }}>{item.name}</h4>
                    <p className="font-bold text-[10px] uppercase tracking-widest" style={{ color: C.inkGhost }}>{item.price}</p>
                  </div>
                  <motion.div
                    variants={{ hover: { rotate: 90 } }}
                    transition={{ duration: 0.3 }}
                    className="w-8 h-8 flex items-center justify-center"
                    style={{ border: `1px solid ${C.creamDeep}` }}
                  >
                    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"
                      style={{ color: C.inkMid }}>
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
                    </svg>
                  </motion.div>
                </div>
              </motion.div>
            </FadeUp>
          ))}
        </div>
      </div>
    </section>
  );
};

/* ─────────────────────────────────────────────
   FOR PROVIDERS
───────────────────────────────────────────── */
const ForProviders: React.FC = () => {
  const navigate = useNavigate();
  const ref = useRef(null);

  return (
    <section id="for-providers" ref={ref} className="w-full px-8 md:px-14 py-8"
      style={{ backgroundColor: C.creamDark }}>
      <div style={{ backgroundColor: C.ink }} className="relative overflow-hidden">
        {[...Array(8)].map((_, i) => (
          <div key={i} className="absolute top-0 bottom-0 w-px"
            style={{ left: `${(i + 1) * 12}%`, backgroundColor: "rgba(245,240,232,0.03)" }} />
        ))}

        <div className="relative z-10 grid grid-cols-1 lg:grid-cols-2 items-stretch min-h-[500px]">
          <div className="p-14 lg:p-24 flex flex-col justify-between"
            style={{ borderRight: "1px solid rgba(245,240,232,0.06)" }}>
            <FadeUp>
              <SectionLabel dark>Partner Program</SectionLabel>
              <h2 className="font-black uppercase tracking-[-0.04em] leading-[0.88] mb-10"
                style={{ fontSize: "clamp(3rem,6vw,6rem)", color: C.cream }}>
                Become<br />A<br />
                <span style={{ color: "rgba(245,240,232,0.2)" }}>Provider.</span>
              </h2>
              <p className="text-sm leading-[1.9] max-w-[300px]" style={{ color: "rgba(245,240,232,0.35)" }}>
                Join a curated marketplace. Reach high-intent, privacy-conscious customers who are actively spending.
              </p>
            </FadeUp>
            <FadeUp delay={0.2} className="mt-14">
              <motion.button
                whileHover="hover" whileTap={{ scale: 0.97 }}
                onClick={() => navigate("/provider/request")}
                className="group flex items-center gap-5"
              >
                <motion.span
                  variants={{ hover: { x: 4 } }} transition={{ duration: 0.2 }}
                  className="font-black uppercase tracking-[-0.04em] leading-none"
                  style={{ fontSize: "2.6rem", color: C.cream }}
                >
                  Apply Now
                </motion.span>
                <motion.div
                  variants={{ hover: { x: 6, backgroundColor: C.cream } }}
                  transition={{ duration: 0.25 }}
                  className="w-12 h-12 flex items-center justify-center"
                  style={{ border: "1px solid rgba(245,240,232,0.2)" }}
                >
                  <motion.svg
                    variants={{ hover: { x: 2 } }} transition={{ duration: 0.2 }}
                    width="17" height="17" viewBox="0 0 24 24" fill="none"
                    className="transition-colors duration-200 group-hover:text-[#0F0F0D]"
                    style={{ color: C.cream }}
                  >
                    <path d="M5 12h14M13 6l6 6-6 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                  </motion.svg>
                </motion.div>
              </motion.button>
            </FadeUp>
          </div>

          <div className="grid grid-cols-2 gap-px"
            style={{ backgroundColor: "rgba(245,240,232,0.04)" }}>
            {[["10K+", "Active users on platform"], ["Free", "To join as a provider"], ["48hr", "Average approval time"], ["100%", "Privacy-first approach"]].map(([num, label], i) => (
              <FadeUp key={i} delay={0.1 + i * 0.09}>
                <motion.div
                  whileHover={{ backgroundColor: "rgba(245,240,232,0.05)" }}
                  transition={{ duration: 0.3 }}
                  className="p-12 flex flex-col justify-between h-full"
                  style={{ backgroundColor: C.ink }}
                >
                  <p className="font-black leading-none mb-4 tracking-tight"
                    style={{ fontSize: "2.6rem", color: C.cream }}>{num}</p>
                  <p className="text-[9px] font-black uppercase tracking-[0.3em]"
                    style={{ color: "rgba(245,240,232,0.2)" }}>{label}</p>
                </motion.div>
              </FadeUp>
            ))}
          </div>
        </div>

        <div className="px-14 lg:px-24 py-5 flex items-center justify-between"
          style={{ borderTop: "1px solid rgba(245,240,232,0.05)" }}>
          <span className="text-[8px] font-black uppercase tracking-[0.35em]"
            style={{ color: "rgba(245,240,232,0.15)" }}>Spenzee Partner Network</span>
          <span className="text-[8px] font-black uppercase tracking-[0.35em]"
            style={{ color: "rgba(245,240,232,0.08)" }}>© {new Date().getFullYear()}</span>
        </div>
      </div>
    </section>
  );
};

/* ─────────────────────────────────────────────
   TRUST
───────────────────────────────────────────── */
const TrustAndPrivacy: React.FC = () => (
  <section className="w-full py-32 px-8 md:px-14" style={{ backgroundColor: C.cream }}>
    <div className="max-w-[1600px] mx-auto">
      <FadeUp className="mb-24 text-center">
        <div className="flex items-center justify-center gap-3 mb-6">
          <div className="w-6 h-px" style={{ backgroundColor: C.inkGhost }} />
          <span className="text-[9px] font-bold uppercase tracking-[0.45em]" style={{ color: C.inkLight }}>Security</span>
          <div className="w-6 h-px" style={{ backgroundColor: C.inkGhost }} />
        </div>
        <h2 className="font-black uppercase tracking-[-0.04em] leading-[0.9]"
          style={{ fontSize: "clamp(2.6rem,5vw,4.5rem)", color: C.ink }}>
          Privacy is not<br />
          <span className="font-extralight italic normal-case tracking-[-0.02em]"
            style={{ color: C.inkLight }}>optional here.</span>
        </h2>
      </FadeUp>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-px"
        style={{ backgroundColor: C.creamDeep }}>
        {[
          { title: "No bank linking", desc: "We never request or store bank credentials. Your financial accounts remain completely separate.", icon: "M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" },
          { title: "Local data only", desc: "All your financial data stays on your device. Nothing is uploaded to servers without explicit consent.", icon: "M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" },
          { title: "Anonymous identity", desc: "Your shopping identity is always anonymous. Partners see purchasing behaviour, never personal details.", icon: "M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" },
        ].map((item, idx) => (
          <FadeUp key={idx} delay={idx * 0.1}>
            <motion.div
              whileHover={{ backgroundColor: C.ink }}
              transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
              className="group p-14 cursor-default"
              style={{ backgroundColor: C.cream }}
            >
              <div className="w-10 h-10 flex items-center justify-center mb-10"
                style={{ border: `1px solid ${C.creamDeep}` }}>
                <svg className="w-4 h-4 transition-colors duration-300 group-hover:text-[#F5F0E8]"
                  style={{ color: C.inkLight }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d={item.icon} />
                </svg>
              </div>
              <h3 className="font-black text-lg mb-4 uppercase tracking-tight transition-colors duration-300 group-hover:text-[#F5F0E8]"
                style={{ color: C.ink }}>{item.title}</h3>
              <p className="text-sm leading-[1.85] transition-colors duration-300 group-hover:text-[rgba(245,240,232,0.4)]"
                style={{ color: C.inkLight }}>{item.desc}</p>
            </motion.div>
          </FadeUp>
        ))}
      </div>
    </div>
  </section>
);

/* ─────────────────────────────────────────────
   FOOTER
───────────────────────────────────────────── */
const Footer: React.FC = () => (
  <footer className="w-full px-8 md:px-14 pt-24 pb-10"
    style={{ backgroundColor: C.ink, borderTop: `1px solid rgba(245,240,232,0.05)` }}>
    <div className="max-w-[1600px] mx-auto">
      <div className="flex flex-col md:flex-row justify-between items-start gap-16 mb-20 pb-20"
        style={{ borderBottom: "1px solid rgba(245,240,232,0.06)" }}>
        <div className="max-w-xs">
          <p className="font-black tracking-[-0.06em] uppercase mb-5 leading-none"
            style={{ fontSize: "2.8rem", color: C.cream }}>
            Spenzee
          </p>
          <p className="text-sm leading-[1.8]" style={{ color: "rgba(245,240,232,0.25)" }}>
            Smart finance built for people who want clarity, privacy, and real control over their money.
          </p>
        </div>
        <div className="grid grid-cols-2 gap-x-20 gap-y-5">
          {[["About", "#"], ["Privacy", "#"], ["Terms", "#"], ["Support", "#"], ["Features", "#features"], ["Providers", "#for-providers"]].map(([label, href]) => (
            <a key={label} href={href}
              className="text-[9px] font-black uppercase tracking-[0.3em] transition-colors duration-300"
              style={{ color: "rgba(245,240,232,0.2)" }}
              onMouseEnter={e => (e.currentTarget.style.color = C.cream)}
              onMouseLeave={e => (e.currentTarget.style.color = "rgba(245,240,232,0.2)")}
            >{label}</a>
          ))}
        </div>
      </div>
      <div className="flex flex-col md:flex-row justify-between items-center gap-4">
        <p className="text-[9px] font-black uppercase tracking-[0.3em]"
          style={{ color: "rgba(245,240,232,0.15)" }}>
          © {new Date().getFullYear()} Spenzee Studios — Crafted for Privacy.
        </p>
        <div className="flex gap-8">
          {["Twitter", "Instagram", "LinkedIn"].map((s) => (
            <a key={s} href="#"
              className="text-[9px] font-black uppercase tracking-widest transition-colors duration-300"
              style={{ color: "rgba(245,240,232,0.15)" }}
              onMouseEnter={e => (e.currentTarget.style.color = C.cream)}
              onMouseLeave={e => (e.currentTarget.style.color = "rgba(245,240,232,0.15)")}
            >{s}</a>
          ))}
        </div>
      </div>
    </div>
  </footer>
);

/* ─────────────────────────────────────────────
   PAGE
───────────────────────────────────────────── */
export default function Landing() {
  return (
    <div className="min-h-screen selection:bg-black selection:text-[#F5F0E8] overflow-x-hidden"
      style={{ backgroundColor: C.cream }}>
      <CustomCursor />
      <Navbar />
      <Hero />
      <Ticker />
      <FeaturesStrip />
      <SpenzeeAdvantage />
      <ProductPreview products={{ "oak-chair": oakChair, "lamp": lamp, "coffee-table": coffeeTable, "sofa": sofa }} />
      <ForProviders />
      <TrustAndPrivacy />
      <Footer />
    </div>
  );
}

import React from "react";

// local images

import heroImg from "../../assets/images/landing-hero1.png";
import oakChair from "../../assets/images/chair-for-landing.png";
import lamp from "../../assets/images/lamb-for-landing.png";
import coffeeTable from "../../assets/images/landing-1.png";
import sofa from "../../assets/images/landing-2.png";
import { useNavigate } from "react-router-dom";



/* ---------------- Components ---------------- */

export const Navbar: React.FC = () => {
  const navigate = useNavigate();

  return (
    <nav className="fixed top-0 left-0 right-0 z-[100] flex items-center justify-between px-6 md:px-16 py-5 bg-white/80 backdrop-blur-xl border-b border-gray-100">
      <div
        className="text-xl font-bold tracking-tighter text-black cursor-pointer"
        onClick={() => navigate("/")}
      >
        spenzee
      </div>
      <div className="hidden md:flex items-center gap-8 text-[11px] font-bold uppercase tracking-[0.2em] text-gray-500">
        <a href="#features" className="hover:text-black transition-colors">Features</a>
        <a href="#how-it-works" className="hover:text-black transition-colors">How it Works</a>
        <a href="#for-providers" className="hover:text-black transition-colors">For Providers</a>
        <div className="flex items-center gap-4 ml-4">
          <button className="px-6 py-2.5 bg-black text-white rounded-full text-[10px] font-bold uppercase tracking-widest hover:scale-105 transition-all shadow-lg shadow-black/10" onClick={() => navigate("/login")}>
            Sign In
          </button>
          <button className="px-6 py-2.5 bg-black text-white rounded-full text-[10px] font-bold uppercase tracking-widest hover:scale-105 transition-all shadow-lg shadow-black/10" onClick={() => navigate("/signup")}>
            Sign Up
          </button>
        </div>
      </div>
    </nav>
  );
};

const Hero: React.FC<{ imageUrl: string }> = ({ imageUrl }) => (
  <section className="relative w-full pt-48 pb-28 px-6 md:px-16 bg-[#F9F9F8] overflow-hidden">
    <div className="absolute top-0 right-0 w-1/3 h-full bg-[#F2F2F0]/50 -skew-x-12 transform origin-top translate-x-20" />
    <div className="max-w-[1600px] mx-auto grid grid-cols-1 lg:grid-cols-12 gap-16 items-center relative z-10">
      <div className="lg:col-span-7 animate-in fade-in slide-in-from-left duration-1000">
        <span className="inline-block px-4 py-1.5 bg-black text-white rounded-full text-[10px] font-bold uppercase tracking-[0.2em] mb-8">
          Smart Commerce 2026
        </span>
        <h1 className="text-6xl md:text-7xl lg:text-8xl font-bold text-black leading-[0.95] tracking-tighter mb-8">
          Spend smarter. <br />
          <span className="text-gray-400 italic font-light">Lifestyle matched.</span>
        </h1>
        <p className="text-xl text-gray-500 max-w-xl mb-12 leading-relaxed font-medium">
          Track expenses, understand habits, and get personalized recommendations with rewards.
        </p>
        <div className="flex flex-wrap items-center gap-6">
          <button className="px-10 py-4 bg-black text-white rounded-full text-sm font-bold hover:shadow-2xl hover:-translate-y-1 transition-all">
            Get Started Now
          </button>
          <button className="px-10 py-4 bg-white border-2 border-black text-gray-400 rounded-full text-sm font-bold hover:bg-black hover:text-white transition-all">
            Learn More
          </button>
        </div>
      </div>
      <div className="lg:col-span-5 relative animate-in fade-in zoom-in duration-1000 delay-200">
        <div className="aspect-[4/5] rounded-[3rem] overflow-hidden shadow-xl border-[12px] border-white">
          <img src={imageUrl} alt="Spenzee illustration" className="w-full h-full object-cover" />
        </div>
      </div>
    </div>
  </section>
);

const FeaturesStrip: React.FC = () => {
  const features = [
    { title: "Track expenses", desc: "Log daily spending seamlessly in a distraction-free interface.", icon: "M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2" },
    { title: "Understand spending", desc: "Gain deep insights into where your money goes clearly.", icon: "M15 12a3 3 0 11-6 0 3 3 0 016 0z" },
    { title: "Discover products", desc: "Receive curated suggestions for things you actually need.", icon: "M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" },
    { title: "Earn rewards", desc: "Get exclusive benefits from verified partner brands.", icon: "M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2" }
  ];

  return (
    <section id="features" className="w-full py-20 bg-white px-6 md:px-16 border-b border-gray-100">
      <div className="max-w-[1600px] mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
        {features.map((f, i) => (
          <div key={i} className="group p-8 bg-[#F9F9F8] rounded-[2rem] border border-transparent hover:border-gray-200 transition-all">
            <div className="w-10 h-10 bg-black text-white rounded-xl flex items-center justify-center mb-6">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d={f.icon} />
              </svg>
            </div>
            <h3 className="text-black font-bold text-base mb-3 uppercase tracking-tight">{f.title}</h3>
            <p className="text-gray-500 text-sm leading-relaxed">{f.desc}</p>
          </div>
        ))}
      </div>
    </section>
  );
};

const SpenzeeAdvantage: React.FC = () => {
  const advantages = [
    { title: "Spending clarity", desc: "Understand your lifestyle through the lens of your purchases. No financial jargon, just clarity." },
    { title: "Personalized discovery", desc: "Our intelligence engine matches products to your habits, ensuring you only see what matters." },
    { title: "Rewards & savings", desc: "Unlock premium rewards from partner brands that appreciate your conscious shopping choices." },
    { title: "Privacy-first shopping", desc: "We prioritize your data sovereignty. Your identity stays yours, always." }
  ];

  return (
    <section id="how-it-works" className="w-full py-24 px-6 md:px-16 bg-[#F2F2F0]">
      <div className="max-w-[1600px] mx-auto">
        <div className="mb-16">
          <h2 className="text-4xl font-bold text-black tracking-tight mb-4 leading-tight">The spenzee Advantage</h2>
          <p className="text-gray-500 text-lg font-medium max-w-xl">Elevating the way you interact with your money through high-performance intelligence.</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {advantages.map((adv, i) => (
            <div key={i} className="p-10 bg-white rounded-[2rem] shadow-sm hover:shadow-md transition-all">
              <h3 className="text-black font-bold text-xl mb-4">{adv.title}</h3>
              <p className="text-gray-500 text-base leading-relaxed font-light">{adv.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

const ProductPreview: React.FC<{ products: { [key: string]: string } }> = ({ products }) => {
  const items = [
    { name: "Oak Wood Chair", price: "$290", id: "oak-chair" },
    { name: "Ceramic Table Lamp", price: "$145", id: "lamp" },
    { name: "Minimal Coffee Table", price: "$480", id: "coffee-table" },
    { name: "Linen Lounge Sofa", price: "$1,250", id: "sofa" }
  ];

  return (
    <section id="products" className="w-full py-24 bg-white px-6 md:px-16">
      <div className="max-w-[1600px] mx-auto">
        <div className="flex justify-between items-end mb-12">
          <div className="text-left">
            <h2 className="text-4xl font-bold text-black tracking-tight mb-3">Curated for you.</h2>
            <p className="text-gray-500 text-base">Lifestyle essentials tailored to your habits.</p>
          </div>
          <button className="px-8 py-3 bg-white border-2 border-black text-gray-500 rounded-full font-bold text-xs uppercase hover:bg-black hover:text-white transition-all">
            View all
          </button>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {items.map((item, i) => (
            <div key={i} className="group cursor-pointer">
              <div className="aspect-[3/4] bg-[#F9F9F8] rounded-[2.5rem] mb-6 overflow-hidden flex items-center justify-center p-10 border border-gray-100 group-hover:bg-[#F2F2F0] transition-all">
                <img src={products[item.id]} alt={item.name} className="max-h-full object-contain group-hover:scale-105 transition-transform duration-500" />
              </div>
              <div className="flex justify-between items-center px-2">
                <div>
                  <h4 className="text-black font-bold text-base tracking-tight">{item.name}</h4>
                  <p className="text-gray-400 font-bold text-[10px] uppercase tracking-widest mt-1">{item.price}</p>
                </div>
                <div className="w-10 h-10 rounded-full border border-gray-200 flex items-center justify-center group-hover:bg-black group-hover:text-white transition-all">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" /></svg>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
const ForProviders: React.FC = () => (
  <section
    id="for-providers"
    className="w-full px-4 sm:px-16 my-16"
  >
    <div className="relative w-full bg-gradient-to-br from-[#1a1a1a] via-black to-[#262626] text-white rounded-[3rem] overflow-hidden border border-white/5 shadow-2xl">

      {/* Sophisticated Metallic Overlays */}
      <div className="absolute top-0 right-0 w-full h-full bg-[radial-gradient(circle_at_top_right,_var(--tw-gradient-stops))] from-white/10 via-transparent to-transparent opacity-50" />
      <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-zinc-800/40 rounded-full blur-[100px]" />

      <div className="relative grid grid-cols-1 lg:grid-cols-2 gap-12 items-center px-8 sm:px-16 py-20">

        {/* Left Side: Content */}
        <div className="z-10">
          <span className="inline-block mb-6 px-4 py-1 text-[10px] font-bold uppercase tracking-[0.2em] bg-white/5 border border-white/10 rounded-full text-zinc-400">
            Partnership Access
          </span>

          <h2 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tighter mb-6 leading-[1.1]">
            Become a <br />
            <span className="text-zinc-500">Provider.</span>
          </h2>

          <p className="text-zinc-400 text-lg max-w-md mb-10 leading-relaxed font-light">
            Join a curated marketplace. Reach high-intent customers through our privacy-first intelligence platform.
          </p>

          <button className="group px-10 py-4 rounded-full bg-white text-gray-400 text-sm font-bold hover:bg-zinc-200 transition-all flex items-center gap-3 shadow-lg shadow-black/20">
            Apply Now
            <svg
              className="w-4 h-4 group-hover:translate-x-1 transition-transform"
              fill="none" stroke="currentColor" viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </button>
        </div>

        {/* Right Side: Visual Element */}
        <div className="hidden lg:flex justify-end">
          <div className="relative w-full max-w-md aspect-video bg-gradient-to-tr from-white/5 to-transparent border border-white/10 rounded-[2rem] backdrop-blur-sm flex items-center justify-center group overflow-hidden">
            {/* Animated Brand Background */}
            <div className="absolute inset-0 flex items-center justify-center opacity-[0.03] text-[10rem] font-black tracking-tighter select-none group-hover:scale-110 transition-transform duration-1000">
              SZ
            </div>

            <div className="text-center z-10">
              <div className="text-2xl font-bold tracking-[0.5em] text-white/20 uppercase">
                Spenzee
              </div>
              <div className="h-[1px] w-12 bg-white/20 mx-auto mt-4" />
            </div>
          </div>
        </div>

      </div>
    </div>
  </section>
);
const TrustAndPrivacy: React.FC = () => (
  <section className="w-full py-24 bg-[#F9F9F8] px-6 md:px-16">
    <div className="max-w-[1600px] mx-auto">
      <h2 className="text-4xl font-bold text-center tracking-tight text-black mb-16">Your privacy is our foundation.</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {[
          { title: "No bank linking", desc: "We never ask for or store your bank credentials. Total security." },
          { title: "No financial storage", desc: "Your financial data stays local to your device, under your control." },
          { title: "Private identity", desc: "Shop with confidence knowing your data is strictly anonymous." }
        ].map((item, idx) => (
          <div key={idx} className="bg-white p-10 rounded-[2rem] border border-gray-100 hover:shadow-md transition-all">
            <h3 className="text-black font-bold text-lg mb-4 tracking-tight uppercase">{item.title}</h3>
            <p className="text-gray-500 text-sm leading-relaxed">{item.desc}</p>
          </div>
        ))}
      </div>
    </div>
  </section>
);

const Footer: React.FC = () => (
  <footer className="w-full py-16 px-6 md:px-16 bg-white border-t border-gray-100">
    <div className="max-w-[1600px] mx-auto flex flex-col md:flex-row justify-between items-center gap-8">
      <div className="text-2xl font-bold tracking-tighter text-black">spenzee</div>
      <div className="flex gap-8 text-[11px] font-bold uppercase tracking-widest text-gray-400">
        <a href="#" className="hover:text-black">About</a>
        <a href="#" className="hover:text-black">Privacy</a>
        <a href="#" className="hover:text-black">Terms</a>
        <a href="#" className="hover:text-black">Support</a>
      </div>
      <div className="text-[10px] font-bold text-gray-300 uppercase tracking-widest">© 2026 spenzee. Crafted for Privacy.</div>
    </div>
  </footer>
);

export default function Landing() {
  return (
    <div className="min-h-screen bg-white selection:bg-black selection:text-white overflow-x-hidden">
      <Navbar />
      <Hero imageUrl={heroImg} />
      <FeaturesStrip />
      <SpenzeeAdvantage />
      <ProductPreview
        products={{
          "oak-chair": oakChair,
          "lamp": lamp,
          "coffee-table": coffeeTable,
          "sofa": sofa,
        }}
      />
      <ForProviders />
      <TrustAndPrivacy />
      <Footer />
    </div>
  );
}
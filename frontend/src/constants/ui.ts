export const UI = {
  AUTH: {
    PANEL:
      "min-h-screen bg-[#0a0a0a] flex overflow-hidden",

    LEFT_PANEL:
      "hidden lg:flex flex-col justify-between w-[42%] relative overflow-hidden p-14",

    RIGHT_PANEL:
      "flex-1 flex flex-col justify-center px-8 sm:px-14 lg:px-20 xl:px-28 py-20",

    TITLE:
      "text-[3.5rem] sm:text-[4.5rem] font-black text-white tracking-[-0.03em] uppercase leading-[0.9]",

    SUBTITLE:
      "text-[10px] text-white/25 tracking-[0.35em] uppercase mb-5",

    BUTTON_PRIMARY:
      "group flex items-center gap-5",

    BORDER_TOP:
      "border-t border-white/10",

    LABEL:
      "block text-[9px] font-black uppercase tracking-[0.35em] text-white/35 mb-3",

    INPUT:
      "w-full bg-transparent text-white text-base font-light placeholder-white/20 focus:outline-none",

    ERROR:
      "text-[11px] text-red-400 pb-3",
  },
} as const;
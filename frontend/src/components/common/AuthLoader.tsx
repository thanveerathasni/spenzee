const AuthLoader = () => {
  return (
    <div className="min-h-screen bg-black flex items-center justify-center">
      <div className="flex flex-col items-center gap-6">
        <div className="w-10 h-10 border border-white/20 border-t-white rounded-full animate-spin" />

        <p className="text-[10px] uppercase tracking-[0.35em] text-white/40">
          Loading Session
        </p>
      </div>
    </div>
  );
};

export default AuthLoader;
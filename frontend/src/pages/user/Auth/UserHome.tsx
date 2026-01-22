

export default function UserHome() {
  return (
    <>
      <div className="min-h-screen bg-white text-black">
        <header className="border-b border-black py-8">
          <div className="max-w-7xl mx-auto px-6 flex justify-between items-center">
            <h1 className="text-3xl font-bold">Logo</h1>
            <nav className="space-x-8 text-lg">
              <a href="#" className="hover:underline">Home</a>
              <a href="#" className="hover:underline">About</a>
              <a href="#" className="hover:underline">Services</a>
              <a href="#" className="hover:underline">Contact</a>
            </nav>
          </div>
        </header>

        <section className="py-32 px-6">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-6xl font-bold mb-6">Minimal Black & White</h2>
            <p className="text-xl mb-10">Clean, elegant, timeless design.</p>
            <button className="border-2 border-black px-8 py-4 text-lg hover:bg-black hover:text-white transition">
              Get Started
            </button>
          </div>
        </section>

        <footer className="border-t border-black py-8 text-center">
          <p>&copy; 2026 Your Brand. All rights reserved.</p>
        </footer>
      </div>
    </>
  );
}
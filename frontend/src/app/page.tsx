import Link from 'next/link';

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-neutral-950 text-white selection:bg-emerald-500/30">
      {/* Background decoration */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-emerald-500/10 blur-[120px] rounded-full" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-blue-500/10 blur-[120px] rounded-full" />
      </div>

      {/* Navigation */}
      <nav className="relative z-10 flex items-center justify-between px-8 py-6 max-w-7xl mx-auto">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-emerald-500 rounded-lg flex items-center justify-center font-bold text-black">A</div>
          <span className="text-xl font-bold tracking-tight">Artist OS</span>
        </div>
        <div className="flex items-center gap-8">
          <Link href="/dashboard" className="text-sm font-medium text-neutral-400 hover:text-white transition-colors">
            Portfolio
          </Link>
          <Link href="/dashboard" className="text-sm font-medium text-neutral-400 hover:text-white transition-colors">
            Commissions
          </Link>
          <Link href="/dashboard" className="px-5 py-2.5 bg-neutral-100 text-black text-sm font-bold rounded-full hover:bg-emerald-400 transition-all hover:scale-105 active:scale-95">
            Dashboard
          </Link>
        </div>
      </nav>

      {/* Hero Section */}
      <main className="relative z-10 flex flex-col items-center justify-center pt-32 pb-20 px-4 text-center max-w-4xl mx-auto">
        <span className="inline-block px-4 py-1.5 mb-6 text-xs font-bold tracking-widest text-emerald-400 uppercase bg-emerald-400/10 rounded-full border border-emerald-400/20">
          The Ultimate Creative Operating System
        </span>
        <h1 className="text-6xl md:text-8xl font-extrabold tracking-tighter mb-8 leading-[0.9]">
          Manage your <span className="bg-clip-text text-transparent bg-gradient-to-r from-emerald-400 to-blue-500">art career</span> like a pro.
        </h1>
        <p className="text-xl text-neutral-400 mb-12 max-w-2xl leading-relaxed">
          The all-in-one platform for professional artists. Track commissions, manage your portfolio, and streamline your creative workflow in one elegant interface.
        </p>
        <div className="flex flex-col sm:flex-row gap-4">
          <Link href="/dashboard" className="px-8 py-4 bg-emerald-500 text-black text-lg font-bold rounded-2xl hover:bg-emerald-400 transition-all shadow-[0_0_20px_rgba(16,185,129,0.3)] hover:scale-105 active:scale-95">
            Start Creating Free
          </Link>
          <Link href="/dashboard" className="px-8 py-4 bg-neutral-900 text-white text-lg font-bold rounded-2xl border border-neutral-800 hover:bg-neutral-800 transition-all hover:scale-105 active:scale-95">
            View Live Demo
          </Link>
        </div>

        {/* Floating preview elements */}
        <div className="mt-24 w-full grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            { title: "Smart Commissions", desc: "Automated billing and queue management.", icon: "💎" },
            { title: "Dynamic Portfolio", desc: "Instant sync with your creative cloud.", icon: "🎨" },
            { title: "Insightful Analytics", desc: "Real-time growth tracking and stats.", icon: "📈" }
          ].map((feature, i) => (
            <div key={i} className="group p-8 bg-neutral-900/50 backdrop-blur-xl border border-neutral-800 rounded-3xl hover:border-emerald-500/50 transition-all duration-300">
              <div className="text-4xl mb-4 group-hover:scale-110 transition-transform">{feature.icon}</div>
              <h3 className="text-xl font-bold mb-2">{feature.title}</h3>
              <p className="text-sm text-neutral-400">{feature.desc}</p>
            </div>
          ))}
        </div>
      </main>

      <footer className="relative z-10 py-12 border-t border-neutral-900 text-center">
        <p className="text-sm text-neutral-500">
          &copy; 2026 Artist OS. Designed for the futuristic creator.
        </p>
      </footer>
    </div>
  );
}

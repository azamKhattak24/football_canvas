import { Goal, Move } from "lucide-react";

export default function Home() {
  return (
    <main className="mx-auto flex min-h-screen max-w-5xl flex-col justify-center px-6 py-16">
      <div className="mb-6 flex items-center gap-3 text-emerald-400">
        <Goal size={32} aria-hidden="true" />
        <span className="text-sm font-semibold tracking-widest uppercase">Tactical Board</span>
      </div>
      <h1 className="max-w-2xl text-4xl font-semibold tracking-tight sm:text-6xl">Every great play starts with a plan.</h1>
      <p className="mt-6 max-w-xl text-lg leading-relaxed text-stone-400">
        Your football tactics workspace is ready for development. Build your pitch, arrange your squad, and bring your game plan to life.
      </p>
      <div className="mt-10 flex items-center gap-3 rounded-xl border border-white/10 bg-white/5 p-5 text-sm text-stone-300">
        <Move size={20} className="shrink-0 text-emerald-400" aria-hidden="true" />
        <p>Responsive by design: pitch positions use normalized coordinates from 0 to 1.</p>
      </div>
    </main>
  );
}

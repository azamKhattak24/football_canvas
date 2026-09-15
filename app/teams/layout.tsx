import Link from "next/link";
import { CircleX, ChevronRight } from "lucide-react";
import "@fontsource-variable/geist";
import "@fontsource-variable/inter";

export default function TeamsLayout({ children }: { children: React.ReactNode }) {
  return <div className="min-h-screen bg-slate-900 font-['Geist_Variable',Arial,sans-serif] text-slate-50 selection:bg-blue-500/40">
    <a href="#main-content" className="sr-only z-50 rounded bg-blue-500 p-3 focus:not-sr-only focus:fixed focus:left-4 focus:top-4">Skip to content</a>
    <header className="flex min-h-[70px] flex-wrap items-center justify-between gap-3 border-b border-slate-700 bg-slate-800 px-4 py-4 sm:px-8">
      <div className="flex flex-wrap items-center gap-3"><Link href="/teams" className="flex items-center gap-3 rounded focus-visible:outline-2 focus-visible:outline-blue-400"><span className="flex size-8 items-center justify-center rounded-lg bg-blue-500"><CircleX size={20} /></span><span className="text-lg font-semibold tracking-tight">TacticsBoard Studio</span></Link><ChevronRight size={14} className="text-slate-500" /><span className="text-sm text-slate-400">Club Directory</span></div>
      <span className="text-xs text-slate-400">Club &amp; Roster Manager</span>
    </header>
    {children}
  </div>;
}

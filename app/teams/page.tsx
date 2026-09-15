"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowRight, Plus, Search, Users, LayoutGrid, Shield } from "lucide-react";
import { useTeamStore } from "@/store/team-store";
import { CreateTeamModal } from "@/components/teams/CreateTeamModal";
import { TeamBadge, ColorSwatches } from "@/components/teams/TeamBadge";
import { primaryButton } from "@/components/teams/styles";

export default function TeamsPage() {
  const { teams, players, appearances, clubDetails } = useTeamStore();
  const [query, setQuery] = useState("");
  const [sort, setSort] = useState("default");
  const [creating, setCreating] = useState(false);
  const filtered = teams.filter(team => `${team.name} ${clubDetails[team.id]?.league}`.toLowerCase().includes(query.toLowerCase()));
  if (sort === "name") filtered.sort((a, b) => a.name.localeCompare(b.name));
  else filtered.reverse();
  return <main id="main-content" className="font-['Inter_Variable',Arial,sans-serif]">
    <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-700 px-4 py-5 sm:px-8">
      <div><h1 className="text-xl font-semibold">Club Directory</h1><p className="mt-1 text-[13px] text-slate-400">Your clubs, kits, and squads. All in one place.</p></div>
      <div className="flex w-full flex-wrap gap-3 sm:w-auto"><label className="flex min-w-0 flex-1 items-center gap-2 rounded-lg border border-slate-700 bg-[#131b2e] px-3 sm:w-80"><Search size={16} className="shrink-0 text-slate-500" /><input aria-label="Search clubs" value={query} onChange={event => setQuery(event.target.value)} placeholder="Search clubs by name or league…" className="h-10 min-w-0 w-full bg-transparent text-[13px] outline-none placeholder:text-slate-500 focus-visible:ring-2 focus-visible:ring-blue-400" /></label><button onClick={() => setCreating(true)} className={primaryButton}><Plus size={16} />Create Team</button></div>
    </div>
    <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-800 px-4 py-3 text-[13px] sm:px-8">
      <div className="flex flex-wrap gap-6 text-slate-400"><span>Total Teams Registered: <strong className="font-medium text-slate-50">{teams.length}</strong></span><span>Total Players: <strong className="font-medium text-slate-50">{players.length}</strong></span></div>
      <select aria-label="Sort teams" value={sort} onChange={event => setSort(event.target.value)} className="rounded-md border border-slate-700 bg-slate-800 px-3 py-2 text-xs text-slate-300 focus:outline-blue-400"><option value="default">Sort by: Recently Added</option><option value="name">Sort by: Club Name</option></select>
    </div>
    <div className="grid grid-cols-1 gap-6 p-4 sm:grid-cols-2 sm:p-8 xl:grid-cols-3">
      {filtered.map(team => {
        const roster = players.filter(player => player.team_id === team.id);
        const detail = clubDetails[team.id];
        return <article key={team.id} className="overflow-hidden rounded-xl border border-slate-700 bg-slate-800 transition-colors hover:border-slate-500">
          <div className="flex items-center gap-4 p-5"><TeamBadge team={team} badge={detail?.badge} /><div className="min-w-0"><h2 className="truncate text-lg font-semibold">{team.name}</h2><p className="mt-1 text-xs text-slate-400">{detail?.league}</p></div></div>
          <div className="space-y-4 px-5 pb-5"><div className="flex items-center justify-between"><span className="text-xs text-slate-400">Kit Swatches</span><ColorSwatches team={team} /></div><div className="flex items-center gap-2 text-[13px] text-slate-300"><LayoutGrid size={15} className="text-slate-500" />{detail?.formation}</div><div className="flex items-center gap-2 text-xs text-slate-400"><Users size={15} />{roster.length} Players <span className="text-slate-600">•</span> {roster.filter(player => appearances[player.id]?.role === "Starter").length} Starters</div></div>
          <Link href={`/teams/${team.id}`} aria-label={`Open ${team.name} squad`} className="flex items-center justify-between border-t border-slate-700 bg-[#162033] px-5 py-3 text-[13px] font-medium text-blue-400 hover:bg-slate-700 focus-visible:outline-2 focus-visible:outline-blue-400">Open &amp; Edit Squad<ArrowRight size={16} /></Link>
        </article>;
      })}
      {!filtered.length && <div className="col-span-full py-8 text-center text-slate-400"><Shield className="mx-auto mb-3" /><p>No clubs match “{query}”.</p><button onClick={() => setQuery("")} className="mt-3 text-sm text-blue-400 underline">Clear search</button></div>}
      <button onClick={() => setCreating(true)} className="flex min-h-60 flex-col items-center justify-center gap-3 rounded-xl border border-dashed border-slate-600 p-6 text-center hover:border-blue-400 hover:bg-slate-800/50 focus-visible:outline-2 focus-visible:outline-blue-400"><span className="rounded-full bg-slate-800 p-3 text-blue-400"><Plus size={24} /></span><span className="text-sm font-medium">Add Another Club to Database</span><span className="text-xs text-slate-400">Create a custom team roster and kits</span></button>
    </div>
    {creating && <CreateTeamModal onClose={() => setCreating(false)} />}
  </main>;
}

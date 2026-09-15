"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowLeft, Plus, Search, Pencil, Trash2, Users, Shirt, Star } from "lucide-react";
import type { Player } from "@/lib/supabase/client";
import { useTeamStore } from "@/store/team-store";
import { TeamBadge, ColorSwatches } from "./TeamBadge";
import PlayerModal from "./PlayerModal";
import { Modal } from "@/components/ui/Modal";
import { primaryButton, secondaryButton } from "./styles";

const groups: Record<string, string[]> = { All: [], Goalkeepers: ["GK"], Defenders: ["CB", "LB", "RB"], Midfielders: ["CDM", "CM", "CAM"], Forwards: ["LW", "RW", "ST"] };

export function TeamRoster({ teamId }: { teamId: string }) {
  const { teams, players, appearances, clubDetails, removePlayer } = useTeamStore();
  const [editing, setEditing] = useState<Player | "new" | null>(null);
  const [deleting, setDeleting] = useState<Player | null>(null);
  const [filter, setFilter] = useState("All");
  const [query, setQuery] = useState("");
  const [announcement, setAnnouncement] = useState("");
  const team = teams.find(item => item.id === teamId);
  if (!team) return <main id="main-content" className="p-8"><h1 className="text-2xl font-semibold">Team not found</h1><p className="my-4 text-slate-400">This team is unavailable. Custom teams exist for this session only.</p><Link href="/teams" className={secondaryButton}><ArrowLeft size={16} />Back to Teams</Link></main>;
  const roster = players.filter(player => player.team_id === teamId);
  const visible = roster.filter(player => (filter === "All" || groups[filter].includes(player.position)) && `${player.name} ${player.jersey_number}`.toLowerCase().includes(query.toLowerCase()));
  const detail = clubDetails[teamId];
  const starters = roster.filter(player => appearances[player.id]?.role === "Starter").length;
  return <main id="main-content" className="p-4 sm:p-8">
    <Link href="/teams" className="mb-6 inline-flex items-center gap-2 rounded text-[13px] text-slate-400 hover:text-white focus-visible:outline-2 focus-visible:outline-blue-400"><ArrowLeft size={16} />Back to Teams</Link>
    <header className="mb-8 flex flex-wrap items-center justify-between gap-4"><div className="flex items-center gap-4"><TeamBadge team={team} badge={detail?.badge} /><div><h1 className="text-2xl font-semibold">{team.name}</h1><p className="mt-1 text-[13px] text-slate-400">{detail?.league} <span className="mx-2">/</span> Club &amp; Roster</p></div></div><button onClick={() => setEditing("new")} className={primaryButton}><Plus size={16} />Add Player</button></header>
    <div className="grid gap-6 lg:grid-cols-[300px_minmax(0,1fr)] xl:grid-cols-[360px_minmax(0,1fr)]">
      <aside className="space-y-5">
        <section className="rounded-xl border border-slate-700 bg-slate-800 p-5"><h2 className="mb-5 text-base font-semibold">Club Details</h2><dl className="space-y-4 text-sm"><div><dt className="mb-1 text-xs text-slate-400">Team Name</dt><dd>{team.name}</dd></div><div><dt className="mb-1 text-xs text-slate-400">League</dt><dd>{detail?.league}</dd></div><div><dt className="mb-1 text-xs text-slate-400">Formation</dt><dd>{detail?.formation}</dd></div></dl></section>
        <section className="rounded-xl border border-slate-700 bg-slate-800 p-5"><h2 className="mb-5 flex items-center gap-2 text-base font-semibold"><Shirt size={18} className="text-slate-400" />Team Kit</h2><div className="mb-5 flex items-center justify-between text-sm"><span>Home Colors</span><ColorSwatches team={team} /></div><div className="grid grid-cols-2 gap-3 border-t border-slate-700 pt-4 text-xs text-slate-400"><div>Primary<p className="mt-2 font-mono uppercase text-slate-300">{team.primary_color}</p></div><div>Secondary<p className="mt-2 font-mono uppercase text-slate-300">{team.secondary_color}</p></div></div></section>
        <section className="flex items-center gap-4 rounded-xl border border-slate-700 bg-slate-800 p-5"><Users size={24} className="text-blue-400" /><div><p className="text-xl font-semibold">{roster.length} <span className="text-sm font-normal text-slate-400">Players</span></p><p className="mt-1 text-xs text-slate-400">{starters} starters · {roster.length - starters} substitutes</p></div></section>
      </aside>
      <section aria-labelledby="squad-title" className="min-w-0 overflow-hidden rounded-xl border border-slate-700 bg-slate-800">
        <div className="flex flex-wrap items-center justify-between gap-4 p-5"><div className="flex items-center gap-3"><h2 id="squad-title" className="text-lg font-semibold">Squad List</h2><span className="rounded-full border border-slate-600 px-2 py-1 text-xs text-slate-400">{roster.length} Players</span></div><label className="flex items-center gap-2 rounded-md border border-slate-700 bg-[#131b2e] px-3"><Search size={14} className="text-slate-500" /><input aria-label="Search players" placeholder="Search squad…" value={query} onChange={event => setQuery(event.target.value)} className="h-9 w-36 bg-transparent text-xs outline-none focus-visible:ring-2 focus-visible:ring-blue-400" /></label></div>
        <div aria-label="Filter by position" className="flex overflow-x-auto border-b border-slate-700 px-5">{Object.keys(groups).map(group => <button key={group} onClick={() => setFilter(group)} aria-pressed={filter === group} className={`shrink-0 border-b-2 px-3 py-3 text-[13px] focus-visible:outline-2 focus-visible:outline-blue-400 ${filter === group ? "border-blue-500 text-blue-400" : "border-transparent text-slate-400 hover:text-white"}`}>{group}</button>)}</div>
        <div className="overflow-x-auto"><table className="w-full min-w-[560px] text-left text-[13px]"><caption className="sr-only">{team.name} player roster</caption><thead className="bg-[#131b2e] text-[11px] font-normal uppercase tracking-wide text-slate-400"><tr>{["#", "Player Name", "Position", "Role", "Actions"].map(label => <th key={label} scope="col" className="px-4 py-3 font-medium">{label}</th>)}</tr></thead><tbody>
          {visible.map(player => <tr key={player.id} className="border-b border-slate-700/60 even:bg-[#162033] hover:bg-slate-700/40"><td className="px-4 py-3"><span className="rounded bg-slate-900 px-2 py-1 font-mono text-xs text-blue-400">{player.jersey_number}</span></td><th scope="row" className="px-4 py-3 font-normal"><span className="flex items-center gap-3"><svg width="28" height="28" viewBox="0 0 28 28" aria-hidden="true" className="shrink-0"><circle cx="14" cy="14" r="13" fill={appearances[player.id]?.color ?? team.primary_color} stroke="#64748b" /><circle cx="14" cy="11" r="4" fill="#0f172a" /><path d="M7 22 Q7 15 14 15 Q21 15 21 22" fill="#0f172a" /></svg>{player.name}</span></th><td className="px-4 py-3"><span className="rounded-md border border-emerald-500/20 bg-emerald-500/10 px-2 py-1 font-mono text-xs text-emerald-400">{player.position}</span></td><td className="px-4 py-3"><span className="flex items-center gap-1.5 text-xs text-slate-400">{appearances[player.id]?.role === "Starter" && <Star size={12} className="fill-amber-400 text-amber-400" />}{appearances[player.id]?.role ?? "Substitute"}</span></td><td className="px-4 py-2"><div className="flex"><button aria-label={`Edit ${player.name}`} onClick={() => setEditing(player)} className="rounded p-2 text-slate-400 hover:bg-slate-700 hover:text-blue-400 focus-visible:outline-2 focus-visible:outline-blue-400"><Pencil size={15} /></button><button aria-label={`Delete ${player.name}`} onClick={() => setDeleting(player)} className="rounded p-2 text-slate-400 hover:bg-slate-700 hover:text-red-400 focus-visible:outline-2 focus-visible:outline-blue-400"><Trash2 size={15} /></button></div></td></tr>)}
        </tbody></table></div>
        {!visible.length && <p className="p-10 text-center text-sm text-slate-400">{roster.length ? "No players match your filters." : "Your squad is empty. Add your first player to get started."}</p>}
        <div className="p-4"><button onClick={() => setEditing("new")} className="flex w-full items-center justify-center gap-2 rounded-lg border border-dashed border-slate-600 px-4 py-3 text-[13px] text-blue-400 hover:bg-slate-700 focus-visible:outline-2 focus-visible:outline-blue-400"><Plus size={16} />Add Player to Squad Database</button></div>
      </section>
    </div>
    <p role="status" className="sr-only">{announcement}</p>
    {editing && <PlayerModal team={team} player={editing === "new" ? undefined : editing} onClose={() => { setEditing(null); setFilter("All"); setQuery(""); }} />}
    {deleting && <Modal title="Remove Player" description={`Remove ${deleting.name} from ${team.name}?`} onClose={() => setDeleting(null)}><div className="flex justify-end gap-3 p-6"><button className={secondaryButton} onClick={() => setDeleting(null)}>Cancel</button><button className="rounded-lg bg-red-600 px-4 py-2 text-sm text-white hover:bg-red-500 focus-visible:outline-2 focus-visible:outline-red-300" onClick={() => { removePlayer(deleting.id); setAnnouncement(`${deleting.name} removed from squad.`); setDeleting(null); }}>Remove Player</button></div></Modal>}
  </main>;
}

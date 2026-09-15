"use client";

import { useState, type FormEvent } from "react";
import { Check, UserRound } from "lucide-react";
import type { Player, Team } from "@/lib/supabase/client";
import { positions, type PlayerAppearance } from "@/lib/mock-data";
import { useTeamStore } from "@/store/team-store";
import { Modal } from "@/components/ui/Modal";
import { inputClass, primaryButton, secondaryButton } from "./styles";

export default function PlayerModal({ team, player, onClose }: { team: Team; player?: Player; onClose: () => void }) {
  const savePlayer = useTeamStore(state => state.savePlayer);
  const appearance = useTeamStore(state => player ? state.appearances[player.id] : undefined);
  const [name, setName] = useState(player?.name ?? "");
  const [number, setNumber] = useState(player ? String(player.jersey_number) : "");
  const [position, setPosition] = useState(player?.position ?? "CM");
  const [color, setColor] = useState(appearance?.color ?? team.primary_color);
  const [role, setRole] = useState<PlayerAppearance["role"]>(appearance?.role ?? "Substitute");
  const [error, setError] = useState("");
  function submit(event: FormEvent) {
    event.preventDefault();
    if (!name.trim()) { setError("Enter a player name."); return; }
    if (!/^\d+$/.test(number) || Number(number) < 1 || Number(number) > 2147483647) { setError("Jersey number must be a positive integer (up to 2147483647)."); return; }
    savePlayer({ id: player?.id ?? crypto.randomUUID(), team_id: team.id, name: name.trim(), jersey_number: Number(number), position }, { color, role });
    onClose();
  }
  return <Modal title={player ? "Edit Player" : "Add Player"} description={`${team.name} · Squad database`} onClose={onClose}>
    <form onSubmit={submit} noValidate>
      <div className="space-y-5 p-6">
        {error && <p role="alert" className="rounded-md border border-red-400/30 bg-red-400/10 p-3 text-sm text-red-300">{error}</p>}
        <label className="block text-xs text-slate-400">Player Name<input autoFocus className={inputClass} value={name} onChange={event => setName(event.target.value)} placeholder="e.g. Bukayo Saka" required maxLength={100} /></label>
        <div className="grid grid-cols-2 gap-4">
          <label className="text-xs text-slate-400">Jersey Number<input className={inputClass} type="number" min="1" max="2147483647" step="1" value={number} onChange={event => setNumber(event.target.value)} placeholder="7" required /></label>
          <label className="text-xs text-slate-400">Position<select className={inputClass} value={position} onChange={event => setPosition(event.target.value)}>{positions.map(item => <option key={item}>{item}</option>)}</select></label>
        </div>
        <label className="block text-xs text-slate-400">Role<select className={inputClass} value={role} onChange={event => setRole(event.target.value as PlayerAppearance["role"])}><option>Starter</option><option>Substitute</option></select></label>
        <div className="flex items-center gap-4 rounded-lg border border-slate-700 bg-slate-900 p-4">
          <span className="relative flex size-12 items-center justify-center overflow-hidden rounded-full border border-white/30"><svg viewBox="0 0 48 48" aria-hidden="true" className="absolute inset-0 size-full"><circle cx="24" cy="24" r="24" fill={color} /></svg><UserRound className="relative rounded-full bg-slate-900/70 p-1 text-white" size={30} /></span>
          <label className="flex flex-1 items-center justify-between gap-3 text-sm">Color / Avatar<input aria-label="Avatar color" type="color" value={color} onChange={event => setColor(event.target.value)} className="h-9 w-12 cursor-pointer rounded border border-slate-600 bg-slate-900 p-1" /></label>
        </div>
      </div>
      <footer className="flex justify-end gap-3 border-t border-slate-700 px-6 py-4"><button type="button" onClick={onClose} className={secondaryButton}>Cancel</button><button type="submit" className={primaryButton}><Check size={16} />{player ? "Save Changes" : "Add Player"}</button></footer>
    </form>
  </Modal>;
}

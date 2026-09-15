"use client";

import { useState, type FormEvent } from "react";
import { Plus } from "lucide-react";
import { Modal } from "@/components/ui/Modal";
import { useTeamStore } from "@/store/team-store";
import { inputClass, primaryButton, secondaryButton } from "./styles";

export function CreateTeamModal({ onClose }: { onClose: () => void }) {
  const addTeam = useTeamStore(state => state.addTeam);
  const [name, setName] = useState("");
  const [primary, setPrimary] = useState("#3b82f6");
  const [secondary, setSecondary] = useState("#ffffff");
  const [error, setError] = useState("");
  function submit(event: FormEvent) {
    event.preventDefault();
    if (!name.trim()) { setError("Enter a team name."); return; }
    addTeam({ id: crypto.randomUUID(), name: name.trim(), primary_color: primary, secondary_color: secondary });
    onClose();
  }
  return <Modal title="Create Team" description="Build a new club and start assembling your squad." onClose={onClose}>
    <form onSubmit={submit} noValidate>
      <div className="space-y-5 p-6">
        {error && <p role="alert" className="text-sm text-red-300">{error}</p>}
        <label className="block text-xs text-slate-400">Team Name<input autoFocus required maxLength={100} value={name} onChange={event => setName(event.target.value)} className={inputClass} placeholder="e.g. North London FC" /></label>
        <div className="grid grid-cols-2 gap-4">{[{ label: "Primary Color", value: primary, change: setPrimary }, { label: "Secondary Color", value: secondary, change: setSecondary }].map(field => <label key={field.label} className="text-xs text-slate-400">{field.label}<span className="mt-2 flex items-center gap-3 rounded-md border border-slate-700 bg-slate-900 p-3"><input type="color" value={field.value} onChange={event => field.change(event.target.value)} className="size-8 shrink-0 cursor-pointer bg-transparent" /><span className="text-[11px] uppercase">{field.value}</span></span></label>)}</div>
      </div>
      <footer className="flex justify-end gap-3 border-t border-slate-700 px-6 py-4"><button type="button" onClick={onClose} className={secondaryButton}>Cancel</button><button className={primaryButton}><Plus size={16} />Create Team</button></footer>
    </form>
  </Modal>;
}

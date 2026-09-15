import Image from "next/image";
import { Shield } from "lucide-react";
import type { Team } from "@/lib/supabase/client";

export function TeamBadge({ team, badge }: { team: Team; badge?: string }) {
  return <div className="flex size-14 shrink-0 items-center justify-center overflow-hidden rounded-xl border border-slate-600 bg-slate-900">{badge ? <Image src={badge} alt={`${team.name} crest`} width={56} height={56} /> : <Shield size={30} className="text-blue-400" />}</div>;
}

export function ColorSwatches({ team }: { team: Team }) {
  return <div className="flex items-center gap-2">{[team.primary_color, team.secondary_color].map((color, index) => <svg key={index} width="20" height="20" viewBox="0 0 20 20" role="img" aria-label={`${index ? "Secondary" : "Primary"} color ${color}`}><circle cx="10" cy="10" r="9" fill={color} stroke="#64748b" /></svg>)}</div>;
}

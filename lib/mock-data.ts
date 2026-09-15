import type { Player, Team } from "@/lib/supabase/client";

export const positions = ["GK", "CB", "LB", "RB", "CDM", "CM", "CAM", "LW", "RW", "ST"] as const;
export type PlayerAppearance = { color: string; role: "Starter" | "Substitute" };
export type ClubDetails = { league: string; formation: string; badge?: string };

export const mockTeams: Team[] = [
  { id: "10000000-0000-4000-8000-000000000001", name: "Arsenal", primary_color: "#ef4444", secondary_color: "#ffffff" },
  { id: "10000000-0000-4000-8000-000000000002", name: "Man City", primary_color: "#38bdf8", secondary_color: "#ffffff" },
  { id: "10000000-0000-4000-8000-000000000003", name: "Liverpool", primary_color: "#dc2626", secondary_color: "#facc15" },
];

// Illustrative squads, not a live transfer database.
const squads: [string, number, string][][] = [
  [["David Raya", 1, "GK"], ["Ben White", 4, "RB"], ["William Saliba", 2, "CB"], ["Gabriel Magalhães", 6, "CB"], ["Jurriën Timber", 12, "LB"], ["Declan Rice", 41, "CDM"], ["Thomas Partey", 5, "CM"], ["Martin Ødegaard", 8, "CAM"], ["Bukayo Saka", 7, "RW"], ["Kai Havertz", 29, "ST"], ["Gabriel Martinelli", 11, "LW"], ["Leandro Trossard", 19, "LW"], ["Gabriel Jesus", 9, "ST"]],
  [["Ederson", 31, "GK"], ["Kyle Walker", 2, "RB"], ["Rúben Dias", 3, "CB"], ["John Stones", 5, "CB"], ["Joško Gvardiol", 24, "LB"], ["Rodri", 16, "CDM"], ["Kevin De Bruyne", 17, "CM"], ["Bernardo Silva", 20, "CAM"], ["Phil Foden", 47, "RW"], ["Erling Haaland", 9, "ST"], ["Jérémy Doku", 11, "LW"], ["Jack Grealish", 10, "LW"], ["Stefan Ortega", 18, "GK"]],
  [["Alisson Becker", 1, "GK"], ["Trent Alexander-Arnold", 66, "RB"], ["Virgil van Dijk", 4, "CB"], ["Ibrahima Konaté", 5, "CB"], ["Andy Robertson", 26, "LB"], ["Ryan Gravenberch", 38, "CDM"], ["Alexis Mac Allister", 10, "CM"], ["Dominik Szoboszlai", 8, "CAM"], ["Mohamed Salah", 11, "RW"], ["Darwin Núñez", 9, "ST"], ["Luis Díaz", 7, "LW"], ["Cody Gakpo", 18, "LW"], ["Curtis Jones", 17, "CM"]],
];

export const mockPlayers: Player[] = squads.flatMap((squad, teamIndex) => squad.map(([name, jersey_number, position], index) => ({
  id: `20000000-0000-4000-8000-${String(teamIndex * 100 + index + 1).padStart(12, "0")}`,
  team_id: mockTeams[teamIndex].id, name, jersey_number, position,
})));
export const mockClubDetails: Record<string, ClubDetails> = Object.fromEntries(mockTeams.map((team, i) => [team.id, {
  league: "Premier League", formation: ["4-3-3 Attacking", "4-2-3-1 Possession", "4-3-3 Gegenpressing"][i], badge: `/teams/${["arsenal", "city", "liverpool"][i]}.webp`,
}]));
export const mockAppearances: Record<string, PlayerAppearance> = Object.fromEntries(mockPlayers.map((player, i) => [player.id, {
  color: player.position === "GK" ? "#22c55e" : mockTeams.find(team => team.id === player.team_id)!.primary_color,
  role: i % 13 < 11 ? "Starter" : "Substitute",
}]));

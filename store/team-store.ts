"use client";

import { create } from "zustand";
import type { Player, Team } from "@/lib/supabase/client";
import { mockTeams, mockPlayers, mockAppearances, mockClubDetails, type PlayerAppearance, type ClubDetails } from "@/lib/mock-data";

type TeamState = {
  teams: Team[];
  players: Player[];
  appearances: Record<string, PlayerAppearance>;
  clubDetails: Record<string, ClubDetails>;
  addTeam: (team: Team) => void;
  savePlayer: (player: Player, appearance: PlayerAppearance) => void;
  removePlayer: (id: string) => void;
};

// Shared across App Router navigation; deliberately session-only mock state.
export const useTeamStore = create<TeamState>((set) => ({
  teams: mockTeams, players: mockPlayers, appearances: mockAppearances, clubDetails: mockClubDetails,
  addTeam: (team) => set(state => ({ teams: [...state.teams, team], clubDetails: { ...state.clubDetails, [team.id]: { league: "Custom club", formation: "Not set" } } })),
  savePlayer: (player, appearance) => set(state => ({
    players: state.players.some(item => item.id === player.id) ? state.players.map(item => item.id === player.id ? player : item) : [...state.players, player],
    appearances: { ...state.appearances, [player.id]: appearance },
  })),
  removePlayer: (id) => set(state => {
    const appearances = { ...state.appearances };
    delete appearances[id];
    return { players: state.players.filter(player => player.id !== id), appearances };
  }),
}));

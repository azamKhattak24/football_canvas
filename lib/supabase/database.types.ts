// Schema-derived types for the initial migration. Regenerate with the Supabase CLI
// after applying migrations; see README.md. No live database was introspected.
export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[];

export type Database = {
  public: {
    Tables: {
      teams: {
        Row: {
          id: string;
          name: string;
          primary_color: string;
          secondary_color: string;
        };
        Insert: {
          id?: string;
          name: string;
          primary_color: string;
          secondary_color: string;
        };
        Update: {
          id?: string;
          name?: string;
          primary_color?: string;
          secondary_color?: string;
        };
        Relationships: [
        ];
      };
      players: {
        Row: {
          id: string;
          team_id: string;
          name: string;
          jersey_number: number;
          position: string;
        };
        Insert: {
          id?: string;
          team_id: string;
          name: string;
          jersey_number: number;
          position: string;
        };
        Update: {
          id?: string;
          team_id?: string;
          name?: string;
          jersey_number?: number;
          position?: string;
        };
        Relationships: [
          {
            foreignKeyName: "players_team_id_fkey";
            columns: ["team_id"];
            isOneToOne: false;
            referencedRelation: "teams";
            referencedColumns: ["id"];
          },
        ];
      };
      tactical_boards: {
        Row: {
          id: string;
          title: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          title: string;
          created_at?: string;
        };
        Update: {
          id?: string;
          title?: string;
          created_at?: string;
        };
        Relationships: [
        ];
      };
      board_positions: {
        Row: {
          id: string;
          board_id: string;
          player_id: string;
          rel_x: number;
          rel_y: number;
        };
        Insert: {
          id?: string;
          board_id: string;
          player_id: string;
          rel_x: number;
          rel_y: number;
        };
        Update: {
          id?: string;
          board_id?: string;
          player_id?: string;
          rel_x?: number;
          rel_y?: number;
        };
        Relationships: [
          {
            foreignKeyName: "board_positions_board_id_fkey";
            columns: ["board_id"];
            isOneToOne: false;
            referencedRelation: "tactical_boards";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "board_positions_player_id_fkey";
            columns: ["player_id"];
            isOneToOne: false;
            referencedRelation: "players";
            referencedColumns: ["id"];
          },
        ];
      };
    };
    Views: { [_ in never]: never };
    Functions: { [_ in never]: never };
    Enums: { [_ in never]: never };
    CompositeTypes: { [_ in never]: never };
  };
};

export type Tables<T extends keyof Database["public"]["Tables"]> = Database["public"]["Tables"][T]["Row"];
export type TablesInsert<T extends keyof Database["public"]["Tables"]> = Database["public"]["Tables"][T]["Insert"];
export type TablesUpdate<T extends keyof Database["public"]["Tables"]> = Database["public"]["Tables"][T]["Update"];

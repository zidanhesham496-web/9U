import { createClient, type SupabaseClient } from "@supabase/supabase-js";

export type Database = {
  public: {
    Tables: {
      registrations: {
        Row: {
          id: string;
          name: string;
          national_id: string;
          grade: string;
          college: string;
          phone: string;
          talent: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          national_id: string;
          grade: string;
          college: string;
          phone: string;
          talent: string;
          created_at?: string;
        };
        Update: Partial<{
          id: string;
          name: string;
          national_id: string;
          grade: string;
          college: string;
          phone: string;
          talent: string;
          created_at: string;
        }>;
        Relationships: [];
      };
    };
    Views: Record<string, never>;
    Functions: Record<string, never>;
  };
};

let client: SupabaseClient<Database> | undefined;

export function getSupabaseAdmin() {
  if (client) {
    return client;
  }

  const supabaseUrl = process.env.SUPABASE_URL;
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!supabaseUrl || !serviceRoleKey) {
    throw new Error("Supabase server configuration is missing");
  }

  client = createClient<Database>(supabaseUrl, serviceRoleKey, {
    auth: { autoRefreshToken: false, persistSession: false },
  });

  return client;
}
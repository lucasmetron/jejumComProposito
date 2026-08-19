import { createClient } from "@supabase/supabase-js";

const supabaseUrl =
  process.env.NEXT_PUBLIC_SUPABASE_URL || "https://hdtqqyxgtmiaohsoeupy.supabase.co";
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "";
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || supabaseAnonKey;

// Cliente público para o browser/frontend
export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Cliente com permissões de serviço (usado exclusivamente no backend / rotas de API do Next.js)
export const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    persistSession: false,
    autoRefreshToken: false,
  },
});

export interface UserFastingRecord {
  user_email: string;
  config: any;
  events: any[];
  has_configured: boolean;
  history: any[];
  updated_at?: string;
}

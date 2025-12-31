
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseAnonKey = process.env.SUPABASE_ANON_KEY;

let supabaseClient: any = null;

export const getSupabase = () => {
  if (supabaseClient) return supabaseClient;
  
  if (supabaseUrl && supabaseAnonKey && supabaseUrl !== 'undefined' && supabaseAnonKey !== 'undefined') {
    try {
      supabaseClient = createClient(supabaseUrl, supabaseAnonKey);
      return supabaseClient;
    } catch (e) {
      console.error("Pilot DB: Initialization failure.", e);
      return null;
    }
  }
  return null;
};

// Singleton instance for the app
export const supabase = getSupabase();

export interface MissionLog {
  tool_id: string;
  tool_name: string;
  category: string;
  status: 'SUCCESS' | 'ERROR';
  input_snippet: string;
}

export const logMission = async (log: MissionLog) => {
  if (!supabase) return;

  try {
    const { data: { user } } = await supabase.auth.getUser();
    
    const { error } = await supabase
      .from('mission_logs')
      .insert([
        {
          ...log,
          user_id: user?.id || null, // Associate with user if logged in
          input_snippet: (log.input_snippet || '').substring(0, 500),
          created_at: new Date().toISOString(),
        }
      ]);
      
    if (error) console.warn('Pilot DB: Telemetry sync interrupted.', error.message);
  } catch (err) {
    console.error('Pilot DB: Critical telemetry link error.', err);
  }
};

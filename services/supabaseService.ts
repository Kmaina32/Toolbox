import { createClient } from '@supabase/supabase-js';

// These are injected by Vite's define config at build time
const supabaseUrl = process.env.SUPABASE_URL;
const supabaseAnonKey = process.env.SUPABASE_ANON_KEY;

let supabaseClient: any = null;

/**
 * Lazily initializes and returns the Supabase client.
 * Returns null if the required environment variables are missing.
 */
const getSupabase = () => {
  if (supabaseClient) return supabaseClient;
  
  // Strict check to ensure strings are valid and not just the literal "undefined"
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

export interface MissionLog {
  tool_id: string;
  tool_name: string;
  category: string;
  status: 'SUCCESS' | 'ERROR';
  input_snippet: string;
}

/**
 * Logs mission telemetry to Supabase. 
 * Fails gracefully if the database is not configured.
 */
export const logMission = async (log: MissionLog) => {
  const supabase = getSupabase();
  
  if (!supabase) {
    console.debug('Pilot DB: Telemetry offline (Configuration missing).');
    return;
  }

  try {
    const { error } = await supabase
      .from('mission_logs')
      .insert([
        {
          ...log,
          input_snippet: (log.input_snippet || '').substring(0, 500), // Limit size for safety
          created_at: new Date().toISOString(),
        }
      ]);
      
    if (error) {
      // We don't throw here to avoid interrupting the main tool execution flow
      console.warn('Pilot DB: Telemetry sync interrupted.', error.message);
    }
  } catch (err) {
    console.error('Pilot DB: Critical telemetry link error.', err);
  }
};

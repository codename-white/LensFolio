import AsyncStorage from '@react-native-async-storage/async-storage';
import { createClient } from '@supabase/supabase-js';
import 'react-native-url-polyfill/auto';

const supabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY || '';

// Ultron Debug: Verify URL presence
if (!supabaseUrl || supabaseUrl.includes('your-project-id')) {
  console.error('❌ Supabase URL is invalid or placeholder. Please update .env');
} else {
  console.log('🌐 Connecting to Supabase at:', supabaseUrl);
}

/**
 * LensFolio Supabase Client
 * Managed by Ultron for high-performance and secure data synchronization.
 */
export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    storage: AsyncStorage,
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: false,
  },
});


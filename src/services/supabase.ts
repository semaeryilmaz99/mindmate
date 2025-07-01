import { createClient } from '@supabase/supabase-js';

// TODO: Replace with your actual Supabase project URL and anon key
const SUPABASE_URL = 'https://rhncxnsepuunlddpqahl.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJobmN4bnNlcHV1bmxkZHBxYWhsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTEzNjYzNDgsImV4cCI6MjA2Njk0MjM0OH0.0EJU4Cn2X7CSEb1AKOLTtDzf7dmQxUAVf2jMh-WBHSg';

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY); 
import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = 'https://xeiwsdbikxnwdwobisxm.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InhlaXdzZGJpa3hud2R3b2Jpc3htIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzQyOTQ5MjcsImV4cCI6MjA0OTg3MDkyN30.4dmudHfmVoPmc7FvP7JO938__e4qT6LEktJnHEOiLmg';

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

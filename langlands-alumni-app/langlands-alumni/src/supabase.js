import { createClient } from '@supabase/supabase-js'

const SUPABASE_URL = 'https://jdzjjhadqokulhausjnn.supabase.co'
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImpkempqaGFkcW9rdWxoYXVzam5uIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODA5MDQxNzMsImV4cCI6MjA5NjQ4MDE3M30.k_Ky3rxKovW0xFytWtkpXDvHfvO1BF5_PcKT0E7Yv3o'

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY)

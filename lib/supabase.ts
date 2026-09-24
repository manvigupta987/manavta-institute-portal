import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://mhpmchzegdgotzsbdwuw.supabase.co'
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1ocG1jaHplZ2Rnb3R6c2Jkd3V3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODkzOTUwNzAsImV4cCI6MjEwNDk3MTA3MH0.Fj4FDEIVFQiL04aKA3lnc8OkgnhU7enT-R7YGNKGZs4'

export const supabase = createClient(supabaseUrl, supabaseAnonKey)
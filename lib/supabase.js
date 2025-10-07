import { createClient } from '@supabase/supabase-js'

const getSupabaseClient = () => {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

  if (!supabaseUrl || !supabaseAnonKey) {
    // Return mock client if env vars are missing (during build)
    return {
      auth: {
        getUser: () => Promise.resolve({ data: { user: null }, error: null }),
        signInWithOtp: () => Promise.resolve({ data: null, error: null }),
        verifyOtp: () => Promise.resolve({ data: null, error: null }),
        signOut: () => Promise.resolve({ error: null })
      },
      from: () => ({
        select: function() { return this },
        insert: function() { return this },
        update: function() { return this },
        delete: function() { return this },
        eq: function() { return this },
        single: () => Promise.resolve({ data: null, error: null }),
        order: function() { return this }
      })
    }
  }

  return createClient(supabaseUrl, supabaseAnonKey)
}

export const supabase = getSupabaseClient()

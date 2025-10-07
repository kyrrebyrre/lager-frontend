import { createClient } from '@supabase/supabase-js'

let supabaseInstance = null

export const supabase = (() => {
  if (typeof window === 'undefined') {
    // Server-side: return a mock object
    return {
      auth: {
        getUser: () => Promise.resolve({ data: { user: null }, error: null }),
        signInWithOtp: () => Promise.resolve({ data: null, error: null }),
        verifyOtp: () => Promise.resolve({ data: null, error: null }),
        signOut: () => Promise.resolve({ error: null })
      },
      from: () => ({
        select: () => ({ data: [], error: null }),
        insert: () => ({ data: null, error: null }),
        update: () => ({ data: null, error: null }),
        delete: () => ({ data: null, error: null }),
        eq: function() { return this },
        single: function() { return this },
        order: function() { return this }
      })
    }
  }

  // Client-side: create real Supabase client
  if (!supabaseInstance) {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
    const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
    supabaseInstance = createClient(supabaseUrl, supabaseAnonKey)
  }

  return supabaseInstance
})()

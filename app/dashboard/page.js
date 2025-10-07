'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'
import Navigation from '@/components/Navigation'

export default function Dashboard() {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    checkUser()
  }, [])

  const checkUser = async () => {
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
      router.push('/auth/login')
    } else {
      setUser(user)
      setLoading(false)
    }
  }

  const handleLogout = async () => {
    await supabase.auth.signOut()
    router.push('/auth/login')
  }

  if (loading) {
    return (
      <div style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
      }}>
        <p>Laster...</p>
      </div>
    )
  }

  return (
    <div style={{
      minHeight: '100vh',
      backgroundColor: '#fafafa'
    }}>
      <Navigation />

      {/* Content */}
      <div style={{
        maxWidth: '1200px',
        margin: '40px auto',
        padding: '0 20px'
      }}>
        <div style={{
          backgroundColor: 'white',
          padding: '40px',
          borderRadius: '12px',
          boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
          textAlign: 'center'
        }}>
          <h2 style={{
            fontSize: '28px',
            color: '#333',
            marginBottom: '20px'
          }}>
            Velkommen til Vinlager! 🎉
          </h2>
          <p style={{
            color: '#666',
            fontSize: '16px',
            marginBottom: '10px'
          }}>
            Innlogget som: <strong>{user?.phone}</strong>
          </p>
          <p style={{
            color: '#888',
            fontSize: '14px',
            lineHeight: '1.6'
          }}>
            Her vil du snart kunne administrere din vinsamling!<br />
            Vi jobber med å bygge ut funksjonaliteten.
          </p>
        </div>
      </div>
    </div>
  )
}

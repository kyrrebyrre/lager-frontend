'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'

export default function Login() {
  const [phone, setPhone] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const router = useRouter()

  const handleLogin = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    try {
      const { error } = await supabase.auth.signInWithOtp({
        phone: phone,
      })

      if (error) throw error

      // Redirect to verify page
      router.push(`/auth/verify?phone=${encodeURIComponent(phone)}`)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      background: 'linear-gradient(135deg, #722F37 0%, #8B4049 100%)',
      padding: '20px'
    }}>
      <div style={{
        backgroundColor: 'white',
        padding: '40px',
        borderRadius: '12px',
        boxShadow: '0 8px 32px rgba(0,0,0,0.2)',
        maxWidth: '400px',
        width: '100%'
      }}>
        <div style={{ textAlign: 'center', marginBottom: '30px' }}>
          <h1 style={{
            fontSize: '32px',
            marginBottom: '10px',
            color: '#722F37',
            fontWeight: '700'
          }}>
            🍷 Vinlager
          </h1>
          <p style={{
            color: '#666',
            fontSize: '14px'
          }}>
            Logg inn med telefonnummer
          </p>
        </div>

        <form onSubmit={handleLogin}>
          <div style={{ marginBottom: '20px' }}>
            <label style={{
              display: 'block',
              marginBottom: '8px',
              fontWeight: '500',
              color: '#333',
              fontSize: '14px'
            }}>
              Telefonnummer
            </label>
            <input
              type="tel"
              required
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="+4712345678"
              style={{
                width: '100%',
                padding: '12px',
                fontSize: '16px',
                border: '2px solid #ddd',
                borderRadius: '8px',
                boxSizing: 'border-box',
                transition: 'border-color 0.2s'
              }}
              onFocus={(e) => e.target.style.borderColor = '#722F37'}
              onBlur={(e) => e.target.style.borderColor = '#ddd'}
            />
            <small style={{
              display: 'block',
              marginTop: '6px',
              color: '#888',
              fontSize: '12px'
            }}>
              Inkluder landskode, f.eks. +47
            </small>
          </div>

          {error && (
            <div style={{
              padding: '12px',
              backgroundColor: '#fee',
              color: '#c33',
              borderRadius: '8px',
              marginBottom: '20px',
              fontSize: '14px',
              border: '1px solid #fcc'
            }}>
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            style={{
              width: '100%',
              padding: '14px',
              fontSize: '16px',
              fontWeight: '600',
              color: 'white',
              backgroundColor: loading ? '#999' : '#722F37',
              border: 'none',
              borderRadius: '8px',
              cursor: loading ? 'not-allowed' : 'pointer',
              transition: 'background-color 0.2s',
              boxShadow: '0 2px 8px rgba(114, 47, 55, 0.3)'
            }}
            onMouseOver={(e) => {
              if (!loading) e.target.style.backgroundColor = '#8B4049'
            }}
            onMouseOut={(e) => {
              if (!loading) e.target.style.backgroundColor = '#722F37'
            }}
          >
            {loading ? 'Sender kode...' : 'Send påloggingskode'}
          </button>
        </form>

        <div style={{
          marginTop: '30px',
          paddingTop: '20px',
          borderTop: '1px solid #eee',
          textAlign: 'center'
        }}>
          <p style={{
            fontSize: '13px',
            color: '#888',
            lineHeight: '1.6'
          }}>
            Du vil motta en 6-sifret kode via SMS som brukes for å logge inn.
          </p>
        </div>
      </div>
    </div>
  )
}

'use client'

import { useState, useEffect, Suspense } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { supabase } from '@/lib/supabase'

function VerifyContent() {
  const [code, setCode] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const router = useRouter()
  const searchParams = useSearchParams()
  const phone = searchParams.get('phone')

  const handleVerify = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    try {
      const { data, error } = await supabase.auth.verifyOtp({
        phone: phone,
        token: code,
        type: 'sms'
      })

      if (error) throw error

      // Successfully logged in
      router.push('/dashboard')
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
            fontSize: '14px',
            marginBottom: '5px'
          }}>
            Verifiser telefonnummer
          </p>
          <p style={{
            color: '#999',
            fontSize: '13px'
          }}>
            {phone}
          </p>
        </div>

        <form onSubmit={handleVerify}>
          <div style={{ marginBottom: '20px' }}>
            <label style={{
              display: 'block',
              marginBottom: '8px',
              fontWeight: '500',
              color: '#333',
              fontSize: '14px'
            }}>
              6-sifret kode
            </label>
            <input
              type="text"
              required
              value={code}
              onChange={(e) => setCode(e.target.value.replace(/\D/g, '').slice(0, 6))}
              placeholder="123456"
              maxLength={6}
              style={{
                width: '100%',
                padding: '12px',
                fontSize: '24px',
                letterSpacing: '8px',
                textAlign: 'center',
                border: '2px solid #ddd',
                borderRadius: '8px',
                boxSizing: 'border-box',
                fontWeight: '600',
                transition: 'border-color 0.2s'
              }}
              onFocus={(e) => e.target.style.borderColor = '#722F37'}
              onBlur={(e) => e.target.style.borderColor = '#ddd'}
              autoFocus
            />
            <small style={{
              display: 'block',
              marginTop: '6px',
              color: '#888',
              fontSize: '12px',
              textAlign: 'center'
            }}>
              Sjekk SMS-en din
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
            disabled={loading || code.length !== 6}
            style={{
              width: '100%',
              padding: '14px',
              fontSize: '16px',
              fontWeight: '600',
              color: 'white',
              backgroundColor: (loading || code.length !== 6) ? '#999' : '#722F37',
              border: 'none',
              borderRadius: '8px',
              cursor: (loading || code.length !== 6) ? 'not-allowed' : 'pointer',
              transition: 'background-color 0.2s',
              boxShadow: '0 2px 8px rgba(114, 47, 55, 0.3)',
              marginBottom: '15px'
            }}
            onMouseOver={(e) => {
              if (!loading && code.length === 6) e.target.style.backgroundColor = '#8B4049'
            }}
            onMouseOut={(e) => {
              if (!loading && code.length === 6) e.target.style.backgroundColor = '#722F37'
            }}
          >
            {loading ? 'Verifiserer...' : 'Verifiser og logg inn'}
          </button>

          <button
            type="button"
            onClick={() => router.push('/auth/login')}
            style={{
              width: '100%',
              padding: '12px',
              fontSize: '14px',
              color: '#722F37',
              backgroundColor: 'transparent',
              border: '1px solid #ddd',
              borderRadius: '8px',
              cursor: 'pointer',
              transition: 'all 0.2s'
            }}
            onMouseOver={(e) => {
              e.target.style.borderColor = '#722F37'
              e.target.style.backgroundColor = '#fafafa'
            }}
            onMouseOut={(e) => {
              e.target.style.borderColor = '#ddd'
              e.target.style.backgroundColor = 'transparent'
            }}
          >
            ← Tilbake
          </button>
        </form>
      </div>
    </div>
  )
}

export default function Verify() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <VerifyContent />
    </Suspense>
  )
}

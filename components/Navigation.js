'use client'

import { useRouter, usePathname } from 'next/navigation'
import { supabase } from '@/lib/supabase'

export default function Navigation() {
  const router = useRouter()
  const pathname = usePathname()

  const handleLogout = async () => {
    await supabase.auth.signOut()
    router.push('/auth/login')
  }

  const navItems = [
    { name: 'Dashboard', path: '/dashboard' },
    { name: 'Mine viner', path: '/dashboard/wines' },
    { name: 'Legg til vin', path: '/dashboard/wines/add' },
  ]

  return (
    <nav style={{
      backgroundColor: '#1d3a2d',
      borderBottom: '1px solid #152a21',
      position: 'sticky',
      top: 0,
      zIndex: 1000
    }}>
      <div style={{
        maxWidth: '1400px',
        margin: '0 auto',
        padding: '0 24px'
      }}>
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          height: '72px'
        }}>
          <h1
            onClick={() => router.push('/dashboard')}
            style={{
              fontSize: '22px',
              fontWeight: '600',
              margin: 0,
              color: 'white',
              cursor: 'pointer',
              letterSpacing: '-0.5px'
            }}
          >
            Vinlager
          </h1>

          <div style={{
            display: 'flex',
            gap: '4px',
            alignItems: 'center'
          }}>
            {navItems.map(item => (
              <button
                key={item.path}
                onClick={() => router.push(item.path)}
                style={{
                  background: pathname === item.path ? 'rgba(255,255,255,0.15)' : 'transparent',
                  border: 'none',
                  color: pathname === item.path ? 'white' : 'rgba(255,255,255,0.7)',
                  padding: '10px 16px',
                  borderRadius: '8px',
                  cursor: 'pointer',
                  fontSize: '14px',
                  fontWeight: pathname === item.path ? '500' : '400',
                  transition: 'all 0.2s ease'
                }}
                onMouseOver={(e) => {
                  if (pathname !== item.path) {
                    e.target.style.background = 'rgba(255,255,255,0.1)'
                    e.target.style.color = 'white'
                  }
                }}
                onMouseOut={(e) => {
                  if (pathname !== item.path) {
                    e.target.style.background = 'transparent'
                    e.target.style.color = 'rgba(255,255,255,0.7)'
                  }
                }}
              >
                {item.name}
              </button>
            ))}

            <div style={{ width: '1px', height: '24px', backgroundColor: 'rgba(255,255,255,0.2)', margin: '0 8px' }} />

            <button
              onClick={handleLogout}
              style={{
                padding: '10px 20px',
                backgroundColor: 'transparent',
                border: '1px solid rgba(255,255,255,0.3)',
                borderRadius: '8px',
                color: 'rgba(255,255,255,0.9)',
                cursor: 'pointer',
                fontSize: '14px',
                transition: 'all 0.2s ease'
              }}
              onMouseOver={(e) => {
                e.target.style.backgroundColor = 'rgba(255,255,255,0.1)'
                e.target.style.borderColor = 'rgba(255,255,255,0.4)'
              }}
              onMouseOut={(e) => {
                e.target.style.backgroundColor = 'transparent'
                e.target.style.borderColor = 'rgba(255,255,255,0.3)'
              }}
            >
              Logg ut
            </button>
          </div>
        </div>
      </div>
    </nav>
  )
}

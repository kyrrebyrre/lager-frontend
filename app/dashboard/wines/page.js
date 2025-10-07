'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'
import Navigation from '@/components/Navigation'

export default function WineList() {
  const router = useRouter()
  const [wines, setWines] = useState([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState('all')

  useEffect(() => {
    checkAuthAndFetchWines()
  }, [])

  const checkAuthAndFetchWines = async () => {
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
      router.push('/auth/login')
      return
    }

    fetchWines()
  }

  const fetchWines = async () => {
    try {
      const { data, error } = await supabase
        .from('wines')
        .select('*')
        .order('created_at', { ascending: false })

      if (error) throw error

      setWines(data || [])
    } catch (err) {
      console.error('Error fetching wines:', err)
    } finally {
      setLoading(false)
    }
  }

  const filteredWines = filter === 'all'
    ? wines
    : wines.filter(wine => wine.wine_type === filter)

  const getWineTypeLabel = (type) => {
    const labels = {
      red: '🍷 Rødvin',
      white: '🥂 Hvitvin',
      rose: '🌸 Rosévin',
      sparkling: '🍾 Musserende',
      dessert: '🍯 Dessertvin',
      other: '🍇 Annet'
    }
    return labels[type] || type
  }

  if (loading) {
    return (
      <div style={{ minHeight: '100vh', backgroundColor: '#fafafa' }}>
        <Navigation />
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          minHeight: 'calc(100vh - 64px)'
        }}>
          <p>Laster viner...</p>
        </div>
      </div>
    )
  }

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#ffffff' }}>
      <Navigation />

      <div style={{ maxWidth: '1400px', margin: '0 auto', padding: '48px 24px' }}>
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '32px'
        }}>
          <div>
            <h1 style={{
              fontSize: '32px',
              fontWeight: '600',
              color: '#1a1a1a',
              margin: 0,
              marginBottom: '4px',
              letterSpacing: '-0.5px'
            }}>
              Mine viner
            </h1>
            <p style={{
              fontSize: '15px',
              color: '#666',
              margin: 0
            }}>
              {filteredWines.length} {filteredWines.length === 1 ? 'vin' : 'viner'} i samlingen
            </p>
          </div>

          <button
            onClick={() => router.push('/dashboard/wines/add')}
            style={{
              padding: '12px 24px',
              fontSize: '14px',
              fontWeight: '500',
              color: 'white',
              backgroundColor: '#2d5c3f',
              border: 'none',
              borderRadius: '8px',
              cursor: 'pointer',
              transition: 'all 0.2s ease'
            }}
            onMouseOver={(e) => {
              e.target.style.backgroundColor = '#1f4430'
            }}
            onMouseOut={(e) => {
              e.target.style.backgroundColor = '#2d5c3f'
            }}
          >
            + Legg til vin
          </button>
        </div>

        {/* Filter */}
        <div style={{
          display: 'flex',
          gap: '8px',
          marginBottom: '32px',
          overflowX: 'auto',
          paddingBottom: '4px'
        }}>
          {['all', 'red', 'white', 'rose', 'sparkling', 'dessert', 'other'].map(type => (
            <button
              key={type}
              onClick={() => setFilter(type)}
              style={{
                padding: '10px 20px',
                fontSize: '14px',
                fontWeight: '500',
                color: filter === type ? '#1a1a1a' : '#666',
                backgroundColor: filter === type ? '#f5f5f5' : 'white',
                border: '1px solid #e5e5e5',
                borderRadius: '8px',
                cursor: 'pointer',
                whiteSpace: 'nowrap',
                transition: 'all 0.2s ease'
              }}
              onMouseOver={(e) => {
                if (filter !== type) {
                  e.target.style.backgroundColor = '#fafafa'
                }
              }}
              onMouseOut={(e) => {
                if (filter !== type) {
                  e.target.style.backgroundColor = 'white'
                }
              }}
            >
              {type === 'all' ? 'Alle' : getWineTypeLabel(type)}
            </button>
          ))}
        </div>

        {/* Wine List */}
        {filteredWines.length === 0 ? (
          <div style={{
            backgroundColor: '#fafafa',
            padding: '80px 40px',
            borderRadius: '12px',
            border: '1px solid #e5e5e5',
            textAlign: 'center'
          }}>
            <p style={{
              fontSize: '16px',
              color: '#666',
              marginBottom: '20px'
            }}>
              {filter === 'all'
                ? 'Du har ingen viner ennå'
                : `Ingen ${getWineTypeLabel(filter).toLowerCase()} i samlingen`}
            </p>
            <button
              onClick={() => router.push('/dashboard/wines/add')}
              style={{
                padding: '12px 24px',
                fontSize: '14px',
                fontWeight: '500',
                color: 'white',
                backgroundColor: '#2d5c3f',
                border: 'none',
                borderRadius: '8px',
                cursor: 'pointer',
                transition: 'all 0.2s ease'
              }}
              onMouseOver={(e) => {
                e.target.style.backgroundColor = '#1f4430'
              }}
              onMouseOut={(e) => {
                e.target.style.backgroundColor = '#2d5c3f'
              }}
            >
              Legg til din første vin
            </button>
          </div>
        ) : (
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
            gap: '24px'
          }}>
            {filteredWines.map(wine => (
              <div
                key={wine.id}
                style={{
                  backgroundColor: 'white',
                  padding: '0',
                  borderRadius: '12px',
                  border: '1px solid #e5e5e5',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease',
                  overflow: 'hidden'
                }}
                onClick={() => router.push(`/dashboard/wines/${wine.id}`)}
                onMouseOver={(e) => {
                  e.currentTarget.style.transform = 'translateY(-2px)'
                  e.currentTarget.style.boxShadow = '0 8px 20px rgba(0,0,0,0.08)'
                }}
                onMouseOut={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)'
                  e.currentTarget.style.boxShadow = 'none'
                }}
              >
                <div style={{
                  backgroundColor: '#e8f3ed',
                  height: '120px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '48px',
                  borderBottom: '1px solid #d1e7db'
                }}>
                  {wine.wine_type === 'red' && '🍷'}
                  {wine.wine_type === 'white' && '🥂'}
                  {wine.wine_type === 'rose' && '🌸'}
                  {wine.wine_type === 'sparkling' && '🍾'}
                  {wine.wine_type === 'dessert' && '🍯'}
                  {wine.wine_type === 'other' && '🍇'}
                </div>

                <div style={{ padding: '20px' }}>
                  <div style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    marginBottom: '12px'
                  }}>
                    <span style={{
                      fontSize: '11px',
                      padding: '4px 10px',
                      backgroundColor: '#f5f5f5',
                      borderRadius: '6px',
                      color: '#666',
                      fontWeight: '500',
                      textTransform: 'uppercase',
                      letterSpacing: '0.5px'
                    }}>
                      {wine.wine_type === 'red' && 'Rødvin'}
                      {wine.wine_type === 'white' && 'Hvitvin'}
                      {wine.wine_type === 'rose' && 'Rosévin'}
                      {wine.wine_type === 'sparkling' && 'Musserende'}
                      {wine.wine_type === 'dessert' && 'Dessertvin'}
                      {wine.wine_type === 'other' && 'Annet'}
                    </span>
                    {wine.quantity > 1 && (
                      <span style={{
                        fontSize: '13px',
                        fontWeight: '600',
                        color: '#1a1a1a'
                      }}>
                        {wine.quantity} stk
                      </span>
                    )}
                  </div>

                  <h3 style={{
                    fontSize: '18px',
                    fontWeight: '600',
                    color: '#1a1a1a',
                    marginBottom: '6px',
                    lineHeight: '1.3',
                    letterSpacing: '-0.3px'
                  }}>
                    {wine.name}
                  </h3>

                  {wine.producer && (
                    <p style={{
                      fontSize: '14px',
                      color: '#666',
                      marginBottom: '12px'
                    }}>
                      {wine.producer}
                    </p>
                  )}

                  <div style={{
                    display: 'flex',
                    gap: '12px',
                    fontSize: '13px',
                    color: '#999',
                    marginTop: '12px',
                    paddingTop: '12px',
                    borderTop: '1px solid #f5f5f5'
                  }}>
                    {wine.vintage && <span>{wine.vintage}</span>}
                    {wine.country && <span>• {wine.country}</span>}
                  </div>

                  {wine.rating && (
                    <div style={{ marginTop: '12px', fontSize: '14px' }}>
                      {'⭐'.repeat(wine.rating)}
                    </div>
                  )}

                  {wine.purchase_price && (
                    <div style={{
                      marginTop: '16px',
                      paddingTop: '16px',
                      borderTop: '1px solid #e5e5e5',
                      fontSize: '16px',
                      fontWeight: '600',
                      color: '#2d5c3f'
                    }}>
                      {wine.purchase_price.toLocaleString('nb-NO')} kr
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

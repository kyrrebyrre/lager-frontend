'use client'

import { useState, useEffect } from 'react'
import { useRouter, useParams } from 'next/navigation'
import { supabase } from '@/lib/supabase'
import Navigation from '@/components/Navigation'

export default function WineDetail() {
  const router = useRouter()
  const params = useParams()
  const [wine, setWine] = useState(null)
  const [loading, setLoading] = useState(true)
  const [deleting, setDeleting] = useState(false)

  useEffect(() => {
    fetchWine()
  }, [params.id])

  const fetchWine = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser()

      if (!user) {
        router.push('/auth/login')
        return
      }

      const { data, error } = await supabase
        .from('wines')
        .select('*')
        .eq('id', params.id)
        .single()

      if (error) throw error

      setWine(data)
    } catch (err) {
      console.error('Error fetching wine:', err)
      router.push('/dashboard/wines')
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async () => {
    if (!confirm('Er du sikker på at du vil slette denne vinen?')) {
      return
    }

    setDeleting(true)

    try {
      const { error } = await supabase
        .from('wines')
        .delete()
        .eq('id', params.id)

      if (error) throw error

      router.push('/dashboard/wines')
    } catch (err) {
      alert('Kunne ikke slette vin: ' + err.message)
      setDeleting(false)
    }
  }

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
          <p>Laster...</p>
        </div>
      </div>
    )
  }

  if (!wine) return null

  const InfoRow = ({ label, value, link }) => {
    if (!value) return null

    return (
      <div style={{
        display: 'grid',
        gridTemplateColumns: '180px 1fr',
        gap: '24px',
        padding: '16px 0',
        borderBottom: '1px solid #f5f5f5'
      }}>
        <strong style={{ color: '#666', fontSize: '14px', fontWeight: '500' }}>{label}</strong>
        {link ? (
          <a
            href={link}
            target="_blank"
            rel="noopener noreferrer"
            style={{
              color: '#1a1a1a',
              textDecoration: 'underline',
              fontSize: '15px'
            }}
          >
            {value}
          </a>
        ) : (
          <span style={{ fontSize: '15px', color: '#1a1a1a' }}>{value}</span>
        )}
      </div>
    )
  }

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#ffffff' }}>
      <Navigation />

      <div style={{ maxWidth: '1000px', margin: '0 auto', padding: '48px 24px' }}>
        {/* Back button */}
        <button
          onClick={() => router.push('/dashboard/wines')}
          style={{
            padding: '8px 16px',
            fontSize: '14px',
            color: '#666',
            backgroundColor: 'transparent',
            border: '1px solid #e5e5e5',
            borderRadius: '8px',
            cursor: 'pointer',
            marginBottom: '24px',
            transition: 'all 0.2s ease'
          }}
          onMouseOver={(e) => {
            e.target.style.backgroundColor = '#fafafa'
          }}
          onMouseOut={(e) => {
            e.target.style.backgroundColor = 'transparent'
          }}
        >
          ← Tilbake
        </button>

        {/* Header */}
        <div style={{
          backgroundColor: 'white',
          padding: '48px',
          borderRadius: '12px',
          border: '1px solid #e5e5e5',
          marginBottom: '24px'
        }}>
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'flex-start',
            marginBottom: '24px'
          }}>
            <span style={{
              fontSize: '11px',
              padding: '6px 12px',
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

            <div style={{ display: 'flex', gap: '8px' }}>
              <button
                onClick={() => router.push(`/dashboard/wines/${wine.id}/edit`)}
                style={{
                  padding: '10px 20px',
                  fontSize: '14px',
                  color: '#1a1a1a',
                  backgroundColor: 'white',
                  border: '1px solid #e5e5e5',
                  borderRadius: '8px',
                  cursor: 'pointer',
                  fontWeight: '500',
                  transition: 'all 0.2s ease'
                }}
                onMouseOver={(e) => {
                  e.target.style.backgroundColor = '#fafafa'
                }}
                onMouseOut={(e) => {
                  e.target.style.backgroundColor = 'white'
                }}
              >
                Rediger
              </button>

              <button
                onClick={handleDelete}
                disabled={deleting}
                style={{
                  padding: '10px 20px',
                  fontSize: '14px',
                  color: 'white',
                  backgroundColor: deleting ? '#999' : '#dc3545',
                  border: 'none',
                  borderRadius: '8px',
                  cursor: deleting ? 'not-allowed' : 'pointer',
                  fontWeight: '500',
                  transition: 'all 0.2s ease'
                }}
                onMouseOver={(e) => {
                  if (!deleting) e.target.style.backgroundColor = '#c82333'
                }}
                onMouseOut={(e) => {
                  if (!deleting) e.target.style.backgroundColor = '#dc3545'
                }}
              >
                {deleting ? 'Sletter...' : 'Slett'}
              </button>
            </div>
          </div>

          <h1 style={{
            fontSize: '36px',
            fontWeight: '600',
            color: '#1a1a1a',
            marginBottom: '8px',
            letterSpacing: '-0.5px'
          }}>
            {wine.name}
          </h1>

          {wine.producer && (
            <p style={{
              fontSize: '18px',
              color: '#666',
              marginBottom: '16px'
            }}>
              {wine.producer}
            </p>
          )}

          {wine.rating && (
            <div style={{
              fontSize: '20px',
              marginTop: '12px'
            }}>
              {'⭐'.repeat(wine.rating)}
            </div>
          )}
        </div>

        {/* Details */}
        <div style={{
          backgroundColor: 'white',
          padding: '48px',
          borderRadius: '12px',
          border: '1px solid #e5e5e5'
        }}>
          {/* Grunnleggende info */}
          <h2 style={{
            fontSize: '18px',
            fontWeight: '600',
            color: '#1a1a1a',
            marginBottom: '24px',
            paddingBottom: '12px',
            borderBottom: '1px solid #e5e5e5'
          }}>
            Grunnleggende informasjon
          </h2>

          <div style={{ marginBottom: '40px' }}>
            <InfoRow label="Årgang" value={wine.vintage} />
            <InfoRow label="Land" value={wine.country} />
            <InfoRow label="Region" value={wine.region} />
            <InfoRow label="Druesort" value={wine.grape_variety} />
            <InfoRow label="Alkohol" value={wine.alcohol_percentage ? `${wine.alcohol_percentage}%` : null} />
            <InfoRow label="Flaske størrelse" value={wine.bottle_size} />
          </div>

          {/* Lager */}
          <h2 style={{
            fontSize: '18px',
            fontWeight: '600',
            color: '#1a1a1a',
            marginBottom: '24px',
            paddingBottom: '12px',
            borderBottom: '1px solid #e5e5e5'
          }}>
            Lager
          </h2>

          <div style={{ marginBottom: '40px' }}>
            <InfoRow label="Antall flasker" value={wine.quantity} />
            <InfoRow label="Plassering" value={wine.location} />
          </div>

          {/* Leverandør */}
          {(wine.supplier_name || wine.supplier_url || wine.supplier_sku) && (
            <>
              <h2 style={{
                fontSize: '18px',
                fontWeight: '600',
                color: '#1a1a1a',
                marginBottom: '24px',
                paddingBottom: '12px',
                borderBottom: '1px solid #e5e5e5'
              }}>
                Leverandør
              </h2>

              <div style={{ marginBottom: '40px' }}>
                <InfoRow label="Leverandør" value={wine.supplier_name} />
                <InfoRow label="Produktside" value={wine.supplier_url} link={wine.supplier_url} />
                <InfoRow label="Produktnummer" value={wine.supplier_sku} />
              </div>
            </>
          )}

          {/* Økonomi */}
          {(wine.purchase_price || wine.purchase_date || wine.estimated_value) && (
            <>
              <h2 style={{
                fontSize: '18px',
                fontWeight: '600',
                color: '#1a1a1a',
                marginBottom: '24px',
                paddingBottom: '12px',
                borderBottom: '1px solid #e5e5e5'
              }}>
                Økonomi
              </h2>

              <div style={{ marginBottom: '40px' }}>
                <InfoRow
                  label="Kjøpspris"
                  value={wine.purchase_price ? `${wine.purchase_price.toLocaleString('nb-NO')} kr` : null}
                />
                <InfoRow
                  label="Kjøpsdato"
                  value={wine.purchase_date ? new Date(wine.purchase_date).toLocaleDateString('nb-NO') : null}
                />
                <InfoRow
                  label="Estimert verdi"
                  value={wine.estimated_value ? `${wine.estimated_value.toLocaleString('nb-NO')} kr` : null}
                />
              </div>
            </>
          )}

          {/* Notater */}
          {wine.notes && (
            <>
              <h2 style={{
                fontSize: '18px',
                fontWeight: '600',
                color: '#1a1a1a',
                marginBottom: '24px',
                paddingBottom: '12px',
                borderBottom: '1px solid #e5e5e5'
              }}>
                Notater
              </h2>

              <p style={{
                fontSize: '15px',
                lineHeight: '1.6',
                color: '#555',
                whiteSpace: 'pre-wrap'
              }}>
                {wine.notes}
              </p>
            </>
          )}

        </div>
      </div>
    </div>
  )
}

'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'
import Navigation from '@/components/Navigation'

export default function AddWine() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [success, setSuccess] = useState(false)

  const [formData, setFormData] = useState({
    name: '',
    producer: '',
    vintage: '',
    wine_type: 'red',
    country: '',
    region: '',
    grape_variety: '',
    quantity: 1,
    location: '',
    supplier_name: '',
    supplier_url: '',
    supplier_sku: '',
    purchase_price: '',
    purchase_date: '',
    estimated_value: '',
    alcohol_percentage: '',
    bottle_size: '750ml',
    notes: '',
    rating: ''
  })

  useEffect(() => {
    checkAuth()
  }, [])

  const checkAuth = async () => {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
      router.push('/auth/login')
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError(null)
    setSuccess(false)

    try {
      const { data: { user } } = await supabase.auth.getUser()

      if (!user) {
        throw new Error('Du må være innlogget')
      }

      // Prepare data
      const wineData = {
        user_id: user.id,
        name: formData.name,
        producer: formData.producer || null,
        vintage: formData.vintage ? parseInt(formData.vintage) : null,
        wine_type: formData.wine_type,
        country: formData.country || null,
        region: formData.region || null,
        grape_variety: formData.grape_variety || null,
        quantity: parseInt(formData.quantity),
        location: formData.location || null,
        supplier_name: formData.supplier_name || null,
        supplier_url: formData.supplier_url || null,
        supplier_sku: formData.supplier_sku || null,
        purchase_price: formData.purchase_price ? parseFloat(formData.purchase_price) : null,
        purchase_date: formData.purchase_date || null,
        estimated_value: formData.estimated_value ? parseFloat(formData.estimated_value) : null,
        alcohol_percentage: formData.alcohol_percentage ? parseFloat(formData.alcohol_percentage) : null,
        bottle_size: formData.bottle_size,
        notes: formData.notes || null,
        rating: formData.rating ? parseInt(formData.rating) : null
      }

      const { error } = await supabase
        .from('wines')
        .insert([wineData])

      if (error) throw error

      setSuccess(true)

      // Reset form
      setFormData({
        name: '',
        producer: '',
        vintage: '',
        wine_type: 'red',
        country: '',
        region: '',
        grape_variety: '',
        quantity: 1,
        location: '',
        supplier_name: '',
        supplier_url: '',
        supplier_sku: '',
        purchase_price: '',
        purchase_date: '',
        estimated_value: '',
        alcohol_percentage: '',
        bottle_size: '750ml',
        notes: '',
        rating: ''
      })

      // Redirect after 2 seconds
      setTimeout(() => {
        router.push('/dashboard/wines')
      }, 2000)

    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const inputStyle = {
    width: '100%',
    padding: '12px 14px',
    fontSize: '15px',
    border: '1px solid #e5e5e5',
    borderRadius: '8px',
    boxSizing: 'border-box',
    transition: 'border-color 0.2s ease',
    outline: 'none'
  }

  const labelStyle = {
    display: 'block',
    marginBottom: '8px',
    fontWeight: '500',
    color: '#1a1a1a',
    fontSize: '14px'
  }

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#ffffff' }}>
      <Navigation />

      <div style={{ maxWidth: '900px', margin: '0 auto', padding: '48px 24px' }}>
        {/* Back button */}
        <button
          type="button"
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

        <div style={{
          backgroundColor: 'white',
          padding: '48px',
          borderRadius: '12px',
          border: '1px solid #e5e5e5'
        }}>
          <h1 style={{
            fontSize: '32px',
            fontWeight: '600',
            color: '#1a1a1a',
            marginBottom: '8px',
            letterSpacing: '-0.5px'
          }}>
            Legg til ny vin
          </h1>
          <p style={{
            fontSize: '15px',
            color: '#666',
            marginBottom: '40px'
          }}>
            Fyll ut informasjon om vinen du vil legge til i samlingen
          </p>

          <form onSubmit={handleSubmit}>
            {/* Grunnleggende info */}
            <div style={{ marginBottom: '40px' }}>
              <h3 style={{
                fontSize: '16px',
                fontWeight: '600',
                color: '#1a1a1a',
                marginBottom: '20px',
                paddingBottom: '12px',
                borderBottom: '1px solid #e5e5e5'
              }}>
                Grunnleggende informasjon
              </h3>

              <div style={{ marginBottom: '15px' }}>
                <label style={labelStyle}>Navn *</label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  style={inputStyle}
                  placeholder="F.eks. Château Margaux"
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px', marginBottom: '15px' }}>
                <div>
                  <label style={labelStyle}>Produsent</label>
                  <input
                    type="text"
                    value={formData.producer}
                    onChange={(e) => setFormData({ ...formData, producer: e.target.value })}
                    style={inputStyle}
                  />
                </div>
                <div>
                  <label style={labelStyle}>Årgang</label>
                  <input
                    type="number"
                    value={formData.vintage}
                    onChange={(e) => setFormData({ ...formData, vintage: e.target.value })}
                    style={inputStyle}
                    placeholder="2015"
                  />
                </div>
              </div>

              <div style={{ marginBottom: '15px' }}>
                <label style={labelStyle}>Type *</label>
                <select
                  required
                  value={formData.wine_type}
                  onChange={(e) => setFormData({ ...formData, wine_type: e.target.value })}
                  style={inputStyle}
                >
                  <option value="red">Rødvin</option>
                  <option value="white">Hvitvin</option>
                  <option value="rose">Rosévin</option>
                  <option value="sparkling">Musserende</option>
                  <option value="dessert">Dessertvin</option>
                  <option value="other">Annet</option>
                </select>
              </div>
            </div>

            {/* Opprinnelse */}
            <div style={{ marginBottom: '40px' }}>
              <h3 style={{
                fontSize: '16px',
                fontWeight: '600',
                color: '#1a1a1a',
                marginBottom: '20px',
                paddingBottom: '12px',
                borderBottom: '1px solid #e5e5e5'
              }}>
                Opprinnelse
              </h3>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px', marginBottom: '15px' }}>
                <div>
                  <label style={labelStyle}>Land</label>
                  <input
                    type="text"
                    value={formData.country}
                    onChange={(e) => setFormData({ ...formData, country: e.target.value })}
                    style={inputStyle}
                    placeholder="F.eks. Frankrike"
                  />
                </div>
                <div>
                  <label style={labelStyle}>Region</label>
                  <input
                    type="text"
                    value={formData.region}
                    onChange={(e) => setFormData({ ...formData, region: e.target.value })}
                    style={inputStyle}
                    placeholder="F.eks. Bordeaux"
                  />
                </div>
              </div>

              <div style={{ marginBottom: '15px' }}>
                <label style={labelStyle}>Druesort</label>
                <input
                  type="text"
                  value={formData.grape_variety}
                  onChange={(e) => setFormData({ ...formData, grape_variety: e.target.value })}
                  style={inputStyle}
                  placeholder="F.eks. Cabernet Sauvignon"
                />
              </div>
            </div>

            {/* Lager */}
            <div style={{ marginBottom: '40px' }}>
              <h3 style={{
                fontSize: '16px',
                fontWeight: '600',
                color: '#1a1a1a',
                marginBottom: '20px',
                paddingBottom: '12px',
                borderBottom: '1px solid #e5e5e5'
              }}>
                Lager
              </h3>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' }}>
                <div>
                  <label style={labelStyle}>Antall flasker</label>
                  <input
                    type="number"
                    min="1"
                    value={formData.quantity}
                    onChange={(e) => setFormData({ ...formData, quantity: e.target.value })}
                    style={inputStyle}
                  />
                </div>
                <div>
                  <label style={labelStyle}>Plassering</label>
                  <input
                    type="text"
                    value={formData.location}
                    onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                    style={inputStyle}
                    placeholder="F.eks. Hylle A3"
                  />
                </div>
              </div>
            </div>

            {/* Leverandør */}
            <div style={{ marginBottom: '40px' }}>
              <h3 style={{
                fontSize: '16px',
                fontWeight: '600',
                color: '#1a1a1a',
                marginBottom: '20px',
                paddingBottom: '12px',
                borderBottom: '1px solid #e5e5e5'
              }}>
                Leverandør
              </h3>

              <div style={{ marginBottom: '15px' }}>
                <label style={labelStyle}>Leverandør</label>
                <input
                  type="text"
                  value={formData.supplier_name}
                  onChange={(e) => setFormData({ ...formData, supplier_name: e.target.value })}
                  style={inputStyle}
                  placeholder="F.eks. Vinmonopolet"
                />
              </div>

              <div style={{ marginBottom: '15px' }}>
                <label style={labelStyle}>Link til produkt</label>
                <input
                  type="url"
                  value={formData.supplier_url}
                  onChange={(e) => setFormData({ ...formData, supplier_url: e.target.value })}
                  style={inputStyle}
                  placeholder="https://..."
                />
              </div>

              <div style={{ marginBottom: '15px' }}>
                <label style={labelStyle}>Produktnummer/SKU</label>
                <input
                  type="text"
                  value={formData.supplier_sku}
                  onChange={(e) => setFormData({ ...formData, supplier_sku: e.target.value })}
                  style={inputStyle}
                  placeholder="12345678"
                />
              </div>
            </div>

            {/* Økonomi */}
            <div style={{ marginBottom: '40px' }}>
              <h3 style={{
                fontSize: '16px',
                fontWeight: '600',
                color: '#1a1a1a',
                marginBottom: '20px',
                paddingBottom: '12px',
                borderBottom: '1px solid #e5e5e5'
              }}>
                Økonomi
              </h3>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px', marginBottom: '15px' }}>
                <div>
                  <label style={labelStyle}>Kjøpspris (kr)</label>
                  <input
                    type="number"
                    step="0.01"
                    value={formData.purchase_price}
                    onChange={(e) => setFormData({ ...formData, purchase_price: e.target.value })}
                    style={inputStyle}
                  />
                </div>
                <div>
                  <label style={labelStyle}>Kjøpsdato</label>
                  <input
                    type="date"
                    value={formData.purchase_date}
                    onChange={(e) => setFormData({ ...formData, purchase_date: e.target.value })}
                    style={inputStyle}
                  />
                </div>
              </div>

              <div>
                <label style={labelStyle}>Estimert verdi (kr)</label>
                <input
                  type="number"
                  step="0.01"
                  value={formData.estimated_value}
                  onChange={(e) => setFormData({ ...formData, estimated_value: e.target.value })}
                  style={inputStyle}
                />
              </div>
            </div>

            {/* Detaljer */}
            <div style={{ marginBottom: '40px' }}>
              <h3 style={{
                fontSize: '16px',
                fontWeight: '600',
                color: '#1a1a1a',
                marginBottom: '20px',
                paddingBottom: '12px',
                borderBottom: '1px solid #e5e5e5'
              }}>
                Detaljer
              </h3>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px', marginBottom: '15px' }}>
                <div>
                  <label style={labelStyle}>Alkoholprosent</label>
                  <input
                    type="number"
                    step="0.1"
                    value={formData.alcohol_percentage}
                    onChange={(e) => setFormData({ ...formData, alcohol_percentage: e.target.value })}
                    style={inputStyle}
                    placeholder="13.5"
                  />
                </div>
                <div>
                  <label style={labelStyle}>Flaske størrelse</label>
                  <select
                    value={formData.bottle_size}
                    onChange={(e) => setFormData({ ...formData, bottle_size: e.target.value })}
                    style={inputStyle}
                  >
                    <option value="375ml">375ml (Halv)</option>
                    <option value="750ml">750ml (Standard)</option>
                    <option value="1500ml">1500ml (Magnum)</option>
                    <option value="3000ml">3000ml (Jeroboam)</option>
                  </select>
                </div>
              </div>

              <div style={{ marginBottom: '15px' }}>
                <label style={labelStyle}>Rating (1-5)</label>
                <select
                  value={formData.rating}
                  onChange={(e) => setFormData({ ...formData, rating: e.target.value })}
                  style={inputStyle}
                >
                  <option value="">Ikke vurdert</option>
                  <option value="1">⭐ 1</option>
                  <option value="2">⭐⭐ 2</option>
                  <option value="3">⭐⭐⭐ 3</option>
                  <option value="4">⭐⭐⭐⭐ 4</option>
                  <option value="5">⭐⭐⭐⭐⭐ 5</option>
                </select>
              </div>

              <div>
                <label style={labelStyle}>Notater</label>
                <textarea
                  value={formData.notes}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                  style={{ ...inputStyle, minHeight: '100px', resize: 'vertical' }}
                  placeholder="Smaksnotater, anbefalinger, etc."
                />
              </div>
            </div>

            {error && (
              <div style={{
                padding: '16px',
                backgroundColor: '#fef2f2',
                color: '#dc2626',
                borderRadius: '8px',
                marginBottom: '24px',
                fontSize: '14px',
                border: '1px solid #fecaca'
              }}>
                {error}
              </div>
            )}

            {success && (
              <div style={{
                padding: '16px',
                backgroundColor: '#f0fdf4',
                color: '#16a34a',
                borderRadius: '8px',
                marginBottom: '24px',
                fontSize: '14px',
                border: '1px solid #bbf7d0'
              }}>
                Vin lagt til! Sender deg til vinlisten...
              </div>
            )}

            <div style={{
              display: 'flex',
              gap: '12px',
              paddingTop: '24px',
              borderTop: '1px solid #e5e5e5'
            }}>
              <button
                type="submit"
                disabled={loading}
                style={{
                  flex: 1,
                  padding: '14px',
                  fontSize: '15px',
                  fontWeight: '500',
                  color: 'white',
                  backgroundColor: loading ? '#999' : '#2d5c3f',
                  border: 'none',
                  borderRadius: '8px',
                  cursor: loading ? 'not-allowed' : 'pointer',
                  transition: 'all 0.2s ease'
                }}
                onMouseOver={(e) => {
                  if (!loading) e.target.style.backgroundColor = '#1f4430'
                }}
                onMouseOut={(e) => {
                  if (!loading) e.target.style.backgroundColor = '#2d5c3f'
                }}
              >
                {loading ? 'Lagrer...' : 'Legg til vin'}
              </button>

              <button
                type="button"
                onClick={() => router.push('/dashboard/wines')}
                style={{
                  padding: '14px 28px',
                  fontSize: '15px',
                  fontWeight: '500',
                  color: '#666',
                  backgroundColor: 'transparent',
                  border: '1px solid #e5e5e5',
                  borderRadius: '8px',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease'
                }}
                onMouseOver={(e) => {
                  e.target.style.backgroundColor = '#fafafa'
                }}
                onMouseOut={(e) => {
                  e.target.style.backgroundColor = 'transparent'
                }}
              >
                Avbryt
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}

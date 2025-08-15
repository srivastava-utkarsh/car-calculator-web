'use client'

import React from 'react'

interface SimpleMaterialUIProps {
  carData: {
    carPrice?: number
    downPayment?: number
  }
  updateCarData: (updates: Record<string, any>) => void // eslint-disable-line @typescript-eslint/no-explicit-any
}

export default function SimpleMaterialUI({ carData, updateCarData }: SimpleMaterialUIProps) {
  return (
    <div style={{ 
      padding: '24px', 
      backgroundColor: '#ffffff', 
      borderRadius: '8px',
      boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
      marginBottom: '16px'
    }}>
      <h3 style={{ 
        color: '#06b6d4', 
        marginBottom: '16px',
        fontWeight: '600'
      }}>
        Material UI Style Demo (CSS-only)
      </h3>
      
      <div style={{ 
        display: 'grid', 
        gap: '16px', 
        gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))'
      }}>
        <div>
          <label style={{ 
            display: 'block', 
            marginBottom: '8px', 
            fontSize: '14px',
            fontWeight: '500',
            color: '#374151'
          }}>
            Car Price
          </label>
          <input
            type="text"
            value={carData.carPrice || ''}
            onChange={(e) => updateCarData({ carPrice: parseFloat(e.target.value) || 0 })}
            placeholder="Enter car price"
            style={{
              width: '100%',
              padding: '12px',
              border: '1px solid #d1d5db',
              borderRadius: '4px',
              fontSize: '14px',
              transition: 'border-color 0.2s',
              outline: 'none'
            }}
            onFocus={(e) => e.target.style.borderColor = '#06b6d4'}
            onBlur={(e) => e.target.style.borderColor = '#d1d5db'}
          />
        </div>
        
        <div>
          <label style={{ 
            display: 'block', 
            marginBottom: '8px', 
            fontSize: '14px',
            fontWeight: '500',
            color: '#374151'
          }}>
            Down Payment
          </label>
          <input
            type="text"
            value={carData.downPayment || ''}
            onChange={(e) => updateCarData({ downPayment: parseFloat(e.target.value) || 0 })}
            placeholder="Enter down payment"
            style={{
              width: '100%',
              padding: '12px',
              border: '1px solid #d1d5db',
              borderRadius: '4px',
              fontSize: '14px',
              transition: 'border-color 0.2s',
              outline: 'none'
            }}
            onFocus={(e) => e.target.style.borderColor = '#06b6d4'}
            onBlur={(e) => e.target.style.borderColor = '#d1d5db'}
          />
        </div>
      </div>
      
      <div style={{ marginTop: '16px', display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
        {[
          { label: '5L', value: 500000 },
          { label: '10L', value: 1000000 },
          { label: '20L', value: 2000000 }
        ].map((preset) => (
          <button
            key={preset.value}
            onClick={() => updateCarData({ carPrice: preset.value })}
            style={{
              padding: '6px 12px',
              border: carData.carPrice === preset.value ? '1px solid #06b6d4' : '1px solid #d1d5db',
              borderRadius: '16px',
              backgroundColor: carData.carPrice === preset.value ? '#06b6d4' : '#ffffff',
              color: carData.carPrice === preset.value ? '#ffffff' : '#374151',
              fontSize: '12px',
              cursor: 'pointer',
              transition: 'all 0.2s'
            }}
          >
            ₹{preset.label}
          </button>
        ))}
      </div>
      
      <button
        style={{
          marginTop: '16px',
          padding: '10px 20px',
          backgroundColor: '#06b6d4',
          color: '#ffffff',
          border: 'none',
          borderRadius: '4px',
          cursor: 'pointer',
          fontSize: '14px',
          fontWeight: '500',
          transition: 'background-color 0.2s'
        }}
        onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#0891b2'}
        onMouseOut={(e) => e.currentTarget.style.backgroundColor = '#06b6d4'}
      >
        Material Design Button
      </button>
      
      <p style={{ 
        marginTop: '12px', 
        fontSize: '12px', 
        color: '#6b7280',
        fontStyle: 'italic'
      }}>
        This demonstrates Material Design principles without external dependencies
      </p>
    </div>
  )
}
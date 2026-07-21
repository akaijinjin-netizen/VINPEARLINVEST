'use client'

import Link from 'next/link'
import BottomNav from '@/components/BottomNav'
import { SEED_ABOUT } from '@/lib/data/projects'


export default function AboutPage() {
  return (
    <div className="app-container">
      {/* Header */}
      <div style={{
        background: 'linear-gradient(135deg, #C8102E 0%, #A00D25 100%)',
        padding: '16px 20px',
        display: 'flex', alignItems: 'center', gap: 14
      }}>
        <Link href="/home" style={{
          color: 'white', textDecoration: 'none',
          background: 'rgba(255,255,255,0.2)',
          borderRadius: '50%', width: 36, height: 36,
          display: 'flex', alignItems: 'center', justifyContent: 'center'
        }}>←</Link>
        <span style={{ color: 'white', fontSize: 17, fontWeight: 700 }}>Chi tiết</span>
      </div>

      {/* Hero Image */}
      <div style={{ height: 240, overflow: 'hidden' }}>
        <img
          src={SEED_ABOUT.image_url}
          alt="Vingroup"
          style={{ width: '100%', height: '100%', objectFit: 'cover' }}
        />
      </div>

      {/* Content */}
      <div style={{ padding: '24px 20px 100px', background: 'white' }}>
        <h1 style={{ 
          fontSize: 26, fontWeight: 900, color: '#1A1A1A',
          marginBottom: 20, letterSpacing: '-0.5px'
        }}>
          {SEED_ABOUT.title}
        </h1>

        {SEED_ABOUT.content.split('\n\n').map((paragraph, i) => (
          <p key={i} style={{ 
            fontSize: 15, color: '#374151', lineHeight: 1.8,
            marginBottom: 16
          }}>
            {paragraph.split('\n').map((line, j) => (
              <span key={j}>
                {line.startsWith('•') ? (
                  <span style={{ fontWeight: 600, color: '#C8102E' }}>{line}</span>
                ) : (
                  line
                )}
                {j < paragraph.split('\n').length - 1 && <br />}
              </span>
            ))}
          </p>
        ))}

        {/* Stats */}
        <div style={{
          background: 'linear-gradient(135deg, #C8102E 0%, #A00D25 100%)',
          borderRadius: 16, padding: '20px',
          marginTop: 24,
          color: 'white'
        }}>
          <div style={{ fontSize: 14, fontWeight: 600, marginBottom: 16, opacity: 0.9 }}>
            🏆 Thành tựu nổi bật
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
            {[
              { value: '255M', unit: 'USD', label: 'Đầu tư quốc tế' },
              { value: '30+', unit: 'Năm', label: 'Kinh nghiệm' },
              { value: '10', unit: 'Tỉnh thành', label: 'Hiện diện' },
              { value: '5 sao', unit: '', label: 'Tiêu chuẩn dịch vụ' },
            ].map((stat, i) => (
              <div key={i} style={{ 
                background: 'rgba(255,255,255,0.15)',
                borderRadius: 12, padding: '14px',
                textAlign: 'center'
              }}>
                <div style={{ fontSize: 22, fontWeight: 900 }}>
                  {stat.value} <span style={{ fontSize: 14 }}>{stat.unit}</span>
                </div>
                <div style={{ fontSize: 12, opacity: 0.8, marginTop: 4 }}>{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <BottomNav />
    </div>
  )
}

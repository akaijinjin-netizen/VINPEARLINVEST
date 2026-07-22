'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'

const NAV_LINKS = [
  { label: 'Trang chủ', href: '/' },
  { label: 'Giới thiệu', href: '/about' },
  { label: 'Lĩnh vực hoạt động', href: '/linh-vuc-hoat-dong' },
  { label: 'Phát triển bền vững', href: '/phat-trien-ben-vung' },
  { label: 'Quan hệ cổ đông', href: '/quan-he-co-dong' },
  { label: 'Tin tức sự kiện', href: '/tin-tuc-su-kien' },
  { label: 'Tuyển dụng', href: '/tuyen-dung' },
  { label: 'Liên hệ', href: '/lien-he' }
]

export default function LienHePage() {
  const [isMobile, setIsMobile] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)

  useEffect(() => {
    document.title = 'Liên hệ | Quỹ Huy Động Vốn VINGROUP'
    const check = () => setIsMobile(window.innerWidth <= 768)
    check()
    window.addEventListener('resize', check)
    return () => window.removeEventListener('resize', check)
  }, [])

  const scrollToTop = () => window.scrollTo({ top: 0, behavior: 'smooth' })

  return (
    <div style={{ fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif", background: '#ffffff', minHeight: '100vh', display: 'flex', flexDirection: 'column', color: '#1A1A1A', width: '100%' }}>

      {/* ── HEADER ─────────────────────────────────────────────────── */}
      <div style={{ background: 'rgba(26,26,26,0.9)', backdropFilter: 'blur(12px)', WebkitBackdropFilter: 'blur(12px)', padding: isMobile ? '12px 16px' : '20px 20px', borderBottom: '1px solid rgba(255,255,255,0.1)', position: 'sticky', top: 0, zIndex: 1000, width: '100%', boxSizing: 'border-box' }}>
        {isMobile ? (
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', position: 'relative' }}>
            <button onClick={() => setMenuOpen(!menuOpen)} style={{ background: '#e32823', border: 'none', borderRadius: 4, width: 36, height: 36, color: '#fff', fontSize: 20, cursor: 'pointer', zIndex: 1001 }}>{menuOpen ? '✕' : '☰'}</button>
            <div style={{ position: 'absolute', left: '50%', top: '50%', transform: 'translate(-50%, -50%)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <img src="/logo.png" alt="Vingroup Logo" style={{ height: 42, objectFit: 'contain' }} />
            </div>
            <div style={{ width: 36 }} />
            {menuOpen && (
              <div style={{ position: 'fixed', top: 60, left: 0, right: 0, background: 'rgba(26, 26, 26, 0.97)', padding: '20px 16px', display: 'flex', flexDirection: 'column', gap: 16, zIndex: 999 }}>
                {NAV_LINKS.map((l, i) => (
                  <Link key={i} href={l.href} onClick={() => setMenuOpen(false)} style={{ color: '#fff', fontSize: 15, fontWeight: 700, textDecoration: 'none' }}>{l.label}</Link>
                ))}
              </div>
            )}
          </div>
        ) : (
          <div style={{ maxWidth: 1200, margin: '0 auto', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 16 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
              <img src="/logo.png" alt="Vingroup" style={{ height: 50 }} />
              <div style={{ width: 1.5, height: 30, background: 'rgba(255,255,255,0.2)' }} />
              <span style={{ fontSize: 22, fontWeight: 800, color: '#fff', textTransform: 'uppercase', letterSpacing: 1 }}>QUỸ HUY ĐỘNG VỐN TẬP ĐOÀN VINGROUP</span>
            </div>
            <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: '8px 24px', borderTop: '1px solid rgba(255,255,255,0.1)', paddingTop: 12, width: '100%' }}>
              {NAV_LINKS.map((l, i) => (
                <Link key={i} href={l.href}
                  style={{ color: l.href === '/lien-he' ? '#e32823' : '#E5E7EB', fontSize: 13, fontWeight: 700, textDecoration: 'none' }}
                  onMouseOver={e => e.currentTarget.style.color = '#e32823'} onMouseOut={e => e.currentTarget.style.color = l.href === '/lien-he' ? '#e32823' : '#E5E7EB'}>
                  {l.label}
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* ── MAP CONTAINER WITH FLOATING CARD ─────────────────────────── */}
      <div style={{ position: 'relative', width: '100%', height: isMobile ? 'auto' : '650px', background: '#e5e7eb', display: 'flex', flexDirection: 'column' }}>
        {/* Background Map Image */}
        {!isMobile && (
          <img src="/map_contact.webp" alt="Bản đồ trụ sở chính" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
        )}

        {/* Content Card Overlay */}
        <div style={{
          position: isMobile ? 'relative' : 'absolute',
          top: isMobile ? '0' : '50%',
          right: isMobile ? '0' : '8%',
          transform: isMobile ? 'none' : 'translateY(-50%)',
          width: isMobile ? '100%' : '520px',
          background: '#ffffff',
          boxSizing: 'border-box',
          padding: isMobile ? '40px 20px' : '48px 40px',
          boxShadow: isMobile ? 'none' : '0 10px 30px rgba(0, 0, 0, 0.08)',
          borderRadius: isMobile ? '0' : '12px',
          border: isMobile ? 'none' : '1px solid #f0f0f0',
          zIndex: 10
        }}>
          {isMobile && (
            <img src="/map_contact.webp" alt="Bản đồ trụ sở chính" style={{ width: '100%', height: '220px', objectFit: 'cover', borderRadius: 8, marginBottom: 24 }} />
          )}

          <h1 style={{ fontSize: '1.8rem', fontWeight: 300, color: '#334155', margin: '0 0 12px 0', letterSpacing: '1px' }}>
            TẬP ĐOÀN VINGROUP
          </h1>
          <h2 style={{ fontSize: '0.9rem', fontWeight: 800, color: '#e32823', letterSpacing: '0.5px', textTransform: 'uppercase', marginBottom: 28 }}>
            TRỤ SỞ CHÍNH
          </h2>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
            {/* Địa chỉ */}
            <div style={{ display: 'flex', gap: 16 }}>
              <div style={{ color: '#64748B', fontSize: 18, minWidth: 20 }}>📍</div>
              <div style={{ fontSize: 14.5, lineHeight: 1.6, color: '#475569' }}>
                <span style={{ fontWeight: 700, color: '#1E293B' }}>Địa chỉ:</span><br/>
                Số 7 Đường Bằng Lăng 1, Phường Việt Hưng, Quận Long Biên, Hà Nội
              </div>
            </div>

            {/* Điện thoại */}
            <div style={{ display: 'flex', gap: 16 }}>
              <div style={{ color: '#64748B', fontSize: 18, minWidth: 20 }}>📞</div>
              <div style={{ fontSize: 14.5, lineHeight: 1.6, color: '#475569' }}>
                <span style={{ fontWeight: 700, color: '#1E293B' }}>Điện thoại:</span><br/>
                +84 (24) 3974 9999
              </div>
            </div>

            {/* Fax */}
            <div style={{ display: 'flex', gap: 16 }}>
              <div style={{ color: '#64748B', fontSize: 18, minWidth: 20 }}>📠</div>
              <div style={{ fontSize: 14.5, lineHeight: 1.6, color: '#475569' }}>
                <span style={{ fontWeight: 700, color: '#1E293B' }}>Fax:</span><br/>
                +84 (24) 3974 8888
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ── FOOTER ──────────────────────────────────────────────────── */}
      <div style={{ background: '#F8FAFC', borderTop: '1px solid #E2E8F0', padding: isMobile ? '40px 16px' : '50px 20px 40px', width: '100%', boxSizing: 'border-box', marginTop: 'auto' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto', display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: '30px 40px' }}>
          <div style={{ flex: '1 1 320px' }}>
            <h4 style={{ fontSize: 16, fontWeight: 800, color: '#1E293B', margin: '0 0 10px 0' }}>Tập đoàn Vingroup (Vingroup JSC)</h4>
            <p style={{ fontSize: 12, color: '#64748B', margin: '0 0 16px 0' }}>© Bản quyền Vingroup 2026</p>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <span style={{ fontSize: 12, color: '#64748B', fontWeight: 600 }}>Kết nối với chúng tôi:</span>
              {['f', 'ig', 't', '✉'].map((icon, idx) => (
                <div key={idx} style={{ width: 28, height: 28, borderRadius: '50%', background: '#e32823', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 11, fontWeight: 'bold', cursor: 'pointer' }}>{icon}</div>
              ))}
            </div>
          </div>
          <div style={{ display: 'flex', gap: '40px 60px', flexWrap: 'wrap' }}>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: 10 }}>
              {[['/', 'Trang chủ'], ['/about', 'Giới thiệu Tập đoàn'], ['/linh-vuc-hoat-dong', 'Lĩnh vực hoạt động'], ['/quan-he-co-dong', 'Quan hệ cổ đông']].map(([href, label], i) => (
                <li key={i}><Link href={href} style={{ fontSize: 12, color: '#4B5563', textDecoration: 'none', fontWeight: 600 }}>{label}</Link></li>
              ))}
            </ul>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: 10 }}>
              {[['/phat-trien-ben-vung', 'Phát triển bền vững'], ['/tin-tuc-su-kien', 'Tin tức sự kiện'], ['/tuyen-dung', 'Tuyển dụng'], ['/lien-he', 'Liên hệ']].map(([href, label], i) => (
                <li key={i}><Link href={href} style={{ fontSize: 12, color: '#4B5563', textDecoration: 'none', fontWeight: 600 }}>{label}</Link></li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      <button onClick={scrollToTop} style={{ position: 'fixed', bottom: 20, right: 20, width: 36, height: 36, borderRadius: '50%', background: 'rgba(255,255,255,0.9)', border: '1px solid #E2E8F0', boxShadow: '0 4px 10px rgba(0,0,0,0.1)', fontSize: 16, cursor: 'pointer', zIndex: 100 }}>▲</button>
    </div>
  )
}

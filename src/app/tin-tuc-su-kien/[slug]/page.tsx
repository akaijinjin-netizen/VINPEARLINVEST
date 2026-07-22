'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useParams } from 'next/navigation'
import { NEWS_POSTS } from '../page'

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

export default function NewsDetailPage() {
  const params = useParams()
  const slug = params?.slug as string
  const [isMobile, setIsMobile] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)

  const post = NEWS_POSTS.find(p => p.slug === slug) || NEWS_POSTS[0]
  // Show up to 4 other posts as recommendations
  const otherPosts = NEWS_POSTS.filter(p => p.slug !== post.slug).slice(0, 4)

  useEffect(() => {
    document.title = `${post.title} - Quỹ Huy Động Vốn VINGROUP`
    window.scrollTo({ top: 0 })
    const checkMobile = () => setIsMobile(window.innerWidth <= 768)
    checkMobile()
    window.addEventListener('resize', checkMobile)
    return () => window.removeEventListener('resize', checkMobile)
  }, [post])

  const scrollToTop = () => window.scrollTo({ top: 0, behavior: 'smooth' })

  return (
    <div style={{ fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif", background: '#ffffff', minHeight: '100vh', display: 'flex', flexDirection: 'column', boxSizing: 'border-box', color: '#1A1A1A', width: '100%', position: 'relative' }}>
      {/* Header */}
      <div style={{ background: 'rgba(26, 26, 26, 0.85)', backdropFilter: 'blur(12px)', WebkitBackdropFilter: 'blur(12px)', padding: isMobile ? '12px 16px' : '20px 20px', borderBottom: '1px solid rgba(255, 255, 255, 0.1)', width: '100%', boxSizing: 'border-box', position: 'sticky', top: 0, zIndex: 1000 }}>
        {isMobile ? (
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%', position: 'relative' }}>
            <button onClick={() => setMenuOpen(!menuOpen)} style={{ background: '#e32823', border: 'none', borderRadius: 4, width: 36, height: 36, display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontSize: 20, cursor: 'pointer', outline: 'none', zIndex: 1001 }}>
              {menuOpen ? '✕' : '☰'}
            </button>
            <div style={{ position: 'absolute', left: '50%', top: '50%', transform: 'translate(-50%, -50%)', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
              <img src="/logo.png" alt="Vingroup Logo" style={{ height: 32, objectFit: 'contain' }} />
              <span style={{ fontSize: 8, fontWeight: 900, color: '#e32823', letterSpacing: '1.5px', marginTop: 2, textTransform: 'uppercase' }}>VINGROUP</span>
            </div>
            <div style={{ width: 36 }} />
            {menuOpen && (
              <div style={{ position: 'fixed', top: 60, left: 0, right: 0, background: 'rgba(26, 26, 26, 0.95)', backdropFilter: 'blur(20px)', padding: '20px 16px', borderBottom: '1px solid rgba(255, 255, 255, 0.1)', display: 'flex', flexDirection: 'column', gap: 16, zIndex: 999 }}>
                {NAV_LINKS.map((link, idx) => (
                  <Link key={idx} href={link.href} onClick={() => setMenuOpen(false)} style={{ color: 'white', fontSize: 15, fontWeight: 700, textDecoration: 'none', padding: '10px 0', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>{link.label}</Link>
                ))}
              </div>
            )}
          </div>
        ) : (
          <div style={{ maxWidth: 1200, margin: '0 auto', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 16 }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 16, flexWrap: 'wrap' }}>
              <img src="/logo.png" alt="Vingroup Logo" style={{ height: 50, objectFit: 'contain' }} />
              <div style={{ width: 1.5, height: 30, background: 'rgba(255, 255, 255, 0.2)' }} />
              <h1 style={{ fontSize: 22, fontWeight: 800, color: 'white', margin: 0, textTransform: 'uppercase', letterSpacing: '1px', textAlign: 'center' }}>QUỸ HUY ĐỘNG VỐN TẬP ĐOÀN VINGROUP</h1>
            </div>
            <div style={{ display: 'flex', justifyContent: 'center', flexWrap: 'wrap', gap: '8px 24px', borderTop: '1px solid rgba(255, 255, 255, 0.1)', paddingTop: 12, width: '100%' }}>
              {NAV_LINKS.map((link, idx) => (
                <Link key={idx} href={link.href} style={{ color: '#E5E7EB', fontSize: 13, fontWeight: 700, textDecoration: 'none', transition: 'color 0.2s' }}
                  onMouseOver={e => e.currentTarget.style.color = '#e32823'} onMouseOut={e => e.currentTarget.style.color = '#E5E7EB'}>
                  {link.label}
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Main Content */}
      <div style={{ width: '100%', boxSizing: 'border-box', background: '#ffffff', padding: isMobile ? '30px 16px 60px' : '50px 20px 80px' }}>
        <div style={{ maxWidth: 900, margin: '0 auto' }}>

          {/* Breadcrumb */}
          <div style={{ fontSize: 12, color: '#94A3B8', marginBottom: 16, display: 'flex', alignItems: 'center', gap: 8 }}>
            <Link href="/" style={{ color: '#94A3B8', textDecoration: 'none' }}>Trang chủ</Link>
            <span>›</span>
            <Link href="/tin-tuc-su-kien" style={{ color: '#94A3B8', textDecoration: 'none' }}>Tin tức sự kiện</Link>
            <span>›</span>
            <span style={{ color: '#475569' }}>{post.category}</span>
          </div>

          {/* Category */}
          <div style={{ fontSize: 13, fontWeight: 700, color: '#e32823', marginBottom: 12, textTransform: 'uppercase' }}>
            {post.category}
          </div>

          {/* Title */}
          <h1 style={{ fontSize: isMobile ? '1.8rem' : '2.2rem', fontFamily: "'Georgia', 'Times New Roman', serif", fontWeight: 800, color: '#1E293B', lineHeight: 1.3, marginBottom: 20 }}>
            {post.title}
          </h1>

          {/* Date */}
          <div style={{ fontSize: 12, color: '#64748B', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: 30, borderBottom: '1px solid #E2E8F0', paddingBottom: 16 }}>
            ĐÃ ĐĂNG TRÊN {post.date}
          </div>

          {/* Hero image */}
          <div style={{ position: 'relative', width: '100%', borderRadius: 12, overflow: 'hidden', marginBottom: 40, boxShadow: '0 4px 20px rgba(0,0,0,0.06)' }}>
            <div style={{ position: 'absolute', left: 20, top: 20, width: 52, height: 52, background: '#e32823', color: 'white', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', borderRadius: 6, boxShadow: '0 4px 10px rgba(227,40,35,0.3)', zIndex: 10 }}>
              <span style={{ fontSize: 18, fontWeight: 800, lineHeight: 1 }}>{post.day}</span>
              <span style={{ fontSize: 10, fontWeight: 600, textTransform: 'uppercase', marginTop: 2 }}>{post.month}</span>
            </div>
            <img src={post.image} alt={post.title} style={{ width: '100%', height: 'auto', display: 'block' }} />
          </div>

          {/* Content paragraphs */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 20, marginBottom: 40 }}>
            {post.content.map((paragraph, i) => (
              <p key={i} style={{ fontSize: 15.5, color: '#334155', lineHeight: 1.85, margin: 0 }}>{paragraph}</p>
            ))}
          </div>

          {/* Social share */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, borderBottom: '1px solid #E2E8F0', paddingBottom: 30, marginBottom: 40 }}>
            <span style={{ fontSize: 13, color: '#64748B', fontWeight: 600, marginRight: 4 }}>Chia sẻ:</span>
            {[{icon:'f', color:'#1877F2'}, {icon:'ig', color:'#E4405F'}, {icon:'t', color:'#1DA1F2'}, {icon:'✉', color:'#e32823'}, {icon:'in', color:'#0A66C2'}].map((s, idx) => (
              <div key={idx} style={{ width: 32, height: 32, borderRadius: '50%', background: s.color, color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 12, fontWeight: 'bold', cursor: 'pointer' }}>
                {s.icon}
              </div>
            ))}
          </div>

          {/* Other news */}
          <h3 style={{ fontSize: isMobile ? '1.4rem' : '1.6rem', fontFamily: "'Georgia', 'Times New Roman', serif", fontWeight: 400, color: '#1E293B', textTransform: 'uppercase', marginBottom: 24 }}>
            TIN TỨC KHÁC
          </h3>
          <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr', gap: 30, marginBottom: 60 }}>
            {otherPosts.map((other, idx) => (
              <Link key={idx} href={`/tin-tuc-su-kien/${other.slug}`} style={{ display: 'flex', flexDirection: 'column', textDecoration: 'none', color: 'inherit' }}>
                <div style={{ width: '100%', height: 180, borderRadius: 12, overflow: 'hidden', background: '#f8fafc', marginBottom: 12 }}>
                  <img src={other.image} alt={other.title} style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'transform 0.3s' }}
                    onMouseOver={e => e.currentTarget.style.transform = 'scale(1.05)'} onMouseOut={e => e.currentTarget.style.transform = 'scale(1)'}
                  />
                </div>
                <span style={{ fontSize: 11, fontWeight: 700, color: '#e32823', textTransform: 'uppercase', marginBottom: 6 }}>{other.category}</span>
                <h4 style={{ fontSize: 13, fontWeight: 700, lineHeight: 1.5, color: '#1E293B', margin: '0 0 6px 0', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>{other.title}</h4>
                <span style={{ fontSize: 11, color: '#94A3B8' }}>{other.date}</span>
              </Link>
            ))}
          </div>

          {/* Comment form */}
          <div style={{ borderTop: '1px solid #E2E8F0', paddingTop: 40 }}>
            <h3 style={{ fontSize: isMobile ? '1.4rem' : '1.6rem', fontFamily: "'Georgia', 'Times New Roman', serif", fontWeight: 400, color: '#1E293B', marginBottom: 10 }}>
              Để lại một bình luận
            </h3>
            <p style={{ fontSize: 13, color: '#64748B', marginBottom: 24 }}>
              Email của bạn sẽ không được hiển thị công khai. Các trường bắt buộc được đánh dấu <span style={{ color: '#e32823' }}>*</span>
            </p>
            <form style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                <label style={{ fontSize: 13, fontWeight: 600, color: '#475569' }}>Bình luận *</label>
                <textarea rows={6} style={{ width: '100%', padding: 12, borderRadius: 8, border: '1px solid #CBD5E1', outline: 'none', fontFamily: 'inherit', fontSize: 14, resize: 'vertical', boxSizing: 'border-box' }} required />
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr 1fr', gap: 20 }}>
                {[['text', 'Tên *', true], ['email', 'Email *', true], ['text', 'Trang web', false]].map(([type, label, req], i) => (
                  <div key={i} style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                    <label style={{ fontSize: 13, fontWeight: 600, color: '#475569' }}>{label as string}</label>
                    <input type={type as string} style={{ padding: 10, borderRadius: 8, border: '1px solid #CBD5E1', outline: 'none', fontSize: 14 }} required={req as boolean} />
                  </div>
                ))}
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <input type="checkbox" id="save-info" style={{ cursor: 'pointer' }} />
                <label htmlFor="save-info" style={{ fontSize: 13, color: '#64748B', cursor: 'pointer' }}>
                  Lưu tên của tôi, email và trang web trong trình duyệt này cho lần bình luận kế tiếp.
                </label>
              </div>
              <button type="submit" onClick={e => e.preventDefault()}
                style={{ width: 'fit-content', background: '#1A1A1A', color: 'white', border: 'none', padding: '12px 30px', borderRadius: 6, fontWeight: 700, fontSize: 14, cursor: 'pointer', transition: 'background 0.2s' }}
                onMouseOver={e => e.currentTarget.style.background = '#e32823'} onMouseOut={e => e.currentTarget.style.background = '#1A1A1A'}>
                PHẢN HỒI
              </button>
            </form>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div style={{ background: '#F8FAFC', borderTop: '1px solid #E2E8F0', padding: isMobile ? '40px 16px' : '50px 20px 40px', width: '100%', boxSizing: 'border-box' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto', display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: '30px 40px' }}>
          <div style={{ flex: '1 1 320px' }}>
            <h4 style={{ fontSize: 16, fontWeight: 800, color: '#1E293B', margin: '0 0 10px 0' }}>Tập đoàn Vingroup (Vingroup JSC)</h4>
            <p style={{ fontSize: 12, color: '#64748B', margin: '0 0 16px 0' }}>© Bản quyền Vingroup 2026</p>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <span style={{ fontSize: 12, color: '#64748B', fontWeight: 600 }}>Kết nối với chúng tôi:</span>
              {['f', 'ig', 't', '✉'].map((icon, idx) => (
                <div key={idx} style={{ width: 28, height: 28, borderRadius: '50%', background: '#e32823', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 11, fontWeight: 'bold', cursor: 'pointer' }}>{icon}</div>
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

      <button onClick={scrollToTop} style={{ position: 'fixed', bottom: 20, right: 20, width: 36, height: 36, borderRadius: '50%', background: 'rgba(255,255,255,0.9)', border: '1px solid #E2E8F0', boxShadow: '0 4px 10px rgba(0,0,0,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 16, cursor: 'pointer', zIndex: 100 }}>▲</button>
    </div>
  )
}

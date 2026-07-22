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

export default function AboutPage() {
  const [isMobile, setIsMobile] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)

  useEffect(() => {
    document.title = "Giới thiệu - Quỹ Huy Động Vốn VINGROUP"
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 768)
    }
    checkMobile()
    window.addEventListener('resize', checkMobile)
    return () => window.removeEventListener('resize', checkMobile)
  }, [])

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  return (
    <div style={{ 
      fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
      background: '#ffffff',
      minHeight: '100vh',
      display: 'flex',
      flexDirection: 'column',
      boxSizing: 'border-box',
      color: '#1A1A1A',
      width: '100%',
      position: 'relative'
    }}>

      {/* Header (translucent glassmorphic header bar with blur) */}
      <div style={{
        background: 'rgba(26, 26, 26, 0.85)',
        backdropFilter: 'blur(12px)',
        WebkitBackdropFilter: 'blur(12px)',
        padding: isMobile ? '12px 16px' : '20px 20px',
        borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
        width: '100%',
        boxSizing: 'border-box',
        position: 'sticky',
        top: 0,
        zIndex: 1000
      }}>
        {isMobile ? (
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            width: '100%',
            position: 'relative'
          }}>
            {/* Hamburger button */}
            <button 
              onClick={() => setMenuOpen(!menuOpen)}
              style={{
                background: '#e32823',
                border: 'none',
                borderRadius: 4,
                width: 36,
                height: 36,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'white',
                fontSize: 20,
                cursor: 'pointer',
                outline: 'none',
                zIndex: 1001
              }}
            >
              {menuOpen ? '✕' : '☰'}
            </button>

            {/* Centered Logo */}
                        <div style={{ position: 'absolute', left: '50%', top: '50%', transform: 'translate(-50%, -50%)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <img src="/logo.png" alt="Vingroup Logo" style={{ height: 42, objectFit: 'contain' }} />
            </div>

            {/* Spacer */}
            <div style={{ width: 36 }} />

            {/* Mobile Menu Dropdown */}
            {menuOpen && (
              <div style={{
                position: 'fixed',
                top: 60,
                left: 0,
                right: 0,
                background: 'rgba(26, 26, 26, 0.95)',
                backdropFilter: 'blur(20px)',
                padding: '20px 16px',
                borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
                display: 'flex',
                flexDirection: 'column',
                gap: 16,
                zIndex: 999
              }}>
                {NAV_LINKS.map((link, idx) => (
                  <Link 
                    key={idx}
                    href={link.href}
                    onClick={() => setMenuOpen(false)}
                    style={{
                      color: 'white',
                      fontSize: 15,
                      fontWeight: 700,
                      textDecoration: 'none',
                      padding: '10px 0',
                      borderBottom: '1px solid rgba(255,255,255,0.05)'
                    }}
                  >
                    {link.label}
                  </Link>
                ))}
              </div>
            )}
          </div>
        ) : (
          <div style={{
            maxWidth: 1200,
            margin: '0 auto',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: 16
          }}>
            {/* Logo & Title centered row */}
            <div style={{ 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'center', 
              gap: 16,
              flexWrap: 'wrap'
            }}>
              <img 
                src="/logo.png" 
                alt="Vingroup Logo" 
                style={{ height: 50, objectFit: 'contain' }}
              />
              <div style={{ width: 1.5, height: 30, background: 'rgba(255, 255, 255, 0.2)' }} />
              <h1 style={{ 
                fontSize: 22, 
                fontWeight: 800, 
                color: 'white', 
                margin: 0,
                textTransform: 'uppercase',
                letterSpacing: '1px',
                textAlign: 'center'
              }}>
                QUỸ HUY ĐỘNG VỐN TẬP ĐOÀN VINGROUP
              </h1>
            </div>

            {/* Navigation menu links */}
            <div style={{
              display: 'flex',
              justifyContent: 'center',
              flexWrap: 'wrap',
              gap: '8px 24px',
              borderTop: '1px solid rgba(255, 255, 255, 0.1)',
              paddingTop: 12,
              width: '100%'
            }}>
              {NAV_LINKS.map((link, idx) => (
                <Link 
                  key={idx}
                  href={link.href}
                  style={{
                    color: '#E5E7EB',
                    fontSize: 13,
                    fontWeight: 700,
                    textDecoration: 'none',
                    transition: 'color 0.2s'
                  }}
                  onMouseOver={e => e.currentTarget.style.color = '#e32823'}
                  onMouseOut={e => e.currentTarget.style.color = '#E5E7EB'}
                >
                  {link.label}
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Main Content Area */}
      <div style={{ width: '100%', boxSizing: 'border-box', background: '#ffffff', padding: isMobile ? '30px 16px' : '50px 20px' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto' }}>
          
          {/* Breadcrumb / Section Title */}
          <h2 style={{
            fontSize: isMobile ? '1.8rem' : '2.5rem',
            fontFamily: "'Georgia', 'Times New Roman', serif",
            fontWeight: 400,
            color: '#1E293B',
            marginBottom: 24,
            textTransform: 'uppercase'
          }}>
            GIỚI THIỆU CHUNG
          </h2>

          {/* Large Hero Image of Landmark 81 */}
          <div style={{ 
            width: '100%', 
            height: isMobile ? 220 : 540, 
            borderRadius: 12, 
            overflow: 'hidden', 
            marginBottom: 40,
            boxShadow: '0 4px 20px rgba(0,0,0,0.06)'
          }}>
            <img 
              src="/about_hero.webp" 
              alt="Landmark 81 Vinhomes Central Park" 
              style={{ width: '100%', height: '100%', objectFit: 'cover' }}
            />
          </div>

          {/* Corporate Title & Profile */}
          <h3 style={{
            fontSize: isMobile ? '1.6rem' : '2.2rem',
            fontWeight: 800,
            color: '#1E293B',
            textTransform: 'uppercase',
            marginBottom: 20,
            letterSpacing: '-0.5px'
          }}>
            TẬP ĐOÀN VINGROUP – CÔNG TY CP
          </h3>

          <p style={{ fontSize: 15, color: '#4B5563', lineHeight: 1.8, marginBottom: 16 }}>
            Tiền thân của Vingroup là Tập đoàn Technocom, thành lập năm 1993 tại Ucraina. Đầu những năm 2000, Technocom trở về Việt Nam, tập trung đầu tư vào lĩnh vực du lịch và bất động sản với hai thương hiệu chiến lược ban đầu là Vinpearl và Vincom. Đến tháng 1/2012, công ty CP Vincom và Công ty CP Vinpearl sáp nhập, chính thức hoạt động dưới mô hình Tập đoàn với tên gọi Tập đoàn Vingroup – Công ty CP.
          </p>

          <p style={{ fontSize: 15, color: '#4B5563', lineHeight: 1.8, marginBottom: 16 }}>
            3 nhóm hoạt động trọng tâm của Tập đoàn bao gồm:
          </p>
          <ul style={{ fontSize: 15, color: '#4B5563', lineHeight: 1.8, paddingLeft: 24, marginBottom: 24 }}>
            <li>– Công nghệ – Công nghiệp</li>
            <li>– Thương mại Dịch vụ</li>
            <li>– Thiện nguyện Xã hội</li>
          </ul>

          <p style={{ fontSize: 15, color: '#4B5563', lineHeight: 1.8, marginBottom: 40 }}>
            Với mong muốn đem đến cho thị trường những sản phẩm – dịch vụ theo tiêu chuẩn quốc tế và những trải nghiệm hoàn toàn mới về phong cách sống hiện đại, ở bất cứ lĩnh vực nào Vingroup cũng chứng tỏ vai trò tiên phong, dẫn dắt sự thay đổi xu hướng tiêu dùng.
          </p>

          {/* Three pillars blocks grid */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr 1fr',
            gap: 32,
            marginBottom: 60
          }}>
            {/* Col 1 */}
            <div>
              <h4 style={{ fontSize: 20, fontWeight: 'bold', color: '#e32823', marginBottom: 12 }}>
                Đội ngũ<br />Nhân sự
              </h4>
              <p style={{ fontSize: 13.5, color: '#4B5563', lineHeight: 1.7, marginBottom: 16 }}>
                Trải qua chặng đường dài trưởng thành và phát triển, chính những con người Vingroup đã làm nên những giá trị tốt đẹp, đóng góp vào thành công của Tập đoàn hôm nay.
              </p>
              <Link href="/dang-nhap" style={{ fontSize: 13, fontWeight: 'bold', color: '#e32823', textDecoration: 'none' }}>
                XEM CHI TIẾT →
              </Link>
            </div>

            {/* Col 2 */}
            <div>
              <h4 style={{ fontSize: 20, fontWeight: 'bold', color: '#e32823', marginBottom: 12 }}>
                Tầm nhìn, Sứ mệnh<br />và Giá trị cốt lõi
              </h4>
              <p style={{ fontSize: 13.5, color: '#4B5563', lineHeight: 1.7, marginBottom: 16 }}>
                Vingroup đặt cho mình sứ mệnh “Vì một cuộc sống tốt đẹp hơn cho mọi người”, với 3 trụ cột cốt lõi là Công nghệ – Công nghiệp, Thương mại Dịch vụ, Thiện nguyện Xã hội.
              </p>
              <Link href="/dang-nhap" style={{ fontSize: 13, fontWeight: 'bold', color: '#e32823', textDecoration: 'none' }}>
                XEM CHI TIẾT →
              </Link>
            </div>

            {/* Col 3 */}
            <div>
              <h4 style={{ fontSize: 20, fontWeight: 'bold', color: '#e32823', marginBottom: 12 }}>
                Đối với<br />Khách hàng
              </h4>
              <p style={{ fontSize: 13.5, color: '#4B5563', lineHeight: 1.7, marginBottom: 16 }}>
                Tạo nên những sản phẩm, dịch vụ có chất lượng tối ưu, mang lại sự hài lòng cho khách hàng ở mức độ cao nhất
              </p>
              <Link href="/dang-nhap" style={{ fontSize: 13, fontWeight: 'bold', color: '#e32823', textDecoration: 'none' }}>
                XEM CHI TIẾT →
              </Link>
            </div>
          </div>

          <hr style={{ border: 'none', borderTop: '1px solid #E5E7EB', marginBottom: 50 }} />

          {/* Section: CÁC THƯƠNG HIỆU */}
          <h2 style={{
            fontSize: isMobile ? '1.8rem' : '2.5rem',
            fontFamily: "'Georgia', 'Times New Roman', serif",
            fontWeight: 400,
            color: '#1E293B',
            marginBottom: 20,
            textTransform: 'uppercase'
          }}>
            CÁC THƯƠNG HIỆU
          </h2>

          <p style={{ fontSize: 15, color: '#4B5563', lineHeight: 1.8, marginBottom: 30, maxWidth: 900 }}>
            Với mong muốn đem đến cho thị trường những sản phẩm – dịch vụ theo tiêu chuẩn quốc tế và những trải nghiệm hoàn toàn mới về phong cách sống hiện đại, ở bất cứ lĩnh vực nào Vingroup cũng chứng tỏ vai trò tiên phong, dẫn dắt sự thay đổi xu hướng tiêu dùng.
          </p>

          {/* Brands Collage Image */}
          <div style={{ 
            width: '100%', 
            borderRadius: 12, 
            overflow: 'hidden', 
            marginBottom: 40,
            boxShadow: '0 4px 20px rgba(0,0,0,0.05)'
          }}>
            <img 
              src="/about_brands.webp" 
              alt="Các thương hiệu của Vingroup" 
              style={{ width: '100%', height: 'auto', display: 'block' }}
            />
          </div>

        </div>
      </div>

      {/* Footer */}
      <div style={{
        background: '#F8FAFC',
        borderTop: '1px solid #E2E8F0',
        padding: isMobile ? '40px 16px' : '50px 20px 40px',
        width: '100%',
        boxSizing: 'border-box'
      }}>
        <div style={{
          maxWidth: 1200,
          margin: '0 auto',
          display: 'flex',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '30px 40px'
        }}>
          {/* Left Column: Brand name, copyright, social icons */}
          <div style={{ flex: '1 1 320px' }}>
            <h4 style={{ fontSize: 16, fontWeight: 800, color: '#1E293B', margin: '0 0 10px 0' }}>
              Tập đoàn Vingroup (Vingroup JSC)
            </h4>
            <p style={{ fontSize: 12, color: '#64748B', margin: '0 0 16px 0' }}>
              © Bản quyền Vingroup 2026
            </p>

            {/* Social media connect icons */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <span style={{ fontSize: 12, color: '#64748B', fontWeight: 600 }}>Kết nối với chúng tôi:</span>
              {['f', 'ig', 't', '✉'].map((icon, idx) => (
                <div 
                  key={idx}
                  style={{
                    width: 28, height: 28, borderRadius: '50%',
                    background: '#e32823', color: 'white',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: 11, fontWeight: 'bold', cursor: 'pointer',
                    boxShadow: '0 2px 4px rgba(227, 40, 35, 0.2)'
                  }}
                >
                  {icon}
                </div>
              ))}
            </div>
          </div>

          {/* Right Columns: Footer menus */}
          <div style={{ display: 'flex', gap: '40px 60px', flexWrap: 'wrap' }}>
            {/* Col 1 */}
            <div>
              <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: 10 }}>
                <li>
                  <Link href="/" style={{ fontSize: 12, color: '#4B5563', textDecoration: 'none', fontWeight: 600 }}>Trang chủ</Link>
                </li>
                <li>
                  <Link href="/about" style={{ fontSize: 12, color: '#4B5563', textDecoration: 'none', fontWeight: 600 }}>Giới thiệu Tập đoàn</Link>
                </li>
                <li>
                  <Link href="/linh-vuc-hoat-dong" style={{ fontSize: 12, color: '#4B5563', textDecoration: 'none', fontWeight: 600 }}>Lĩnh vực hoạt động</Link>
                </li>
                <li>
                  <Link href="/linh-vuc-hoat-dong" style={{ fontSize: 12, color: '#4B5563', textDecoration: 'none', fontWeight: 600 }}>Quan hệ cổ đông</Link>
                </li>
              </ul>
            </div>

            {/* Col 2 */}
            <div>
              <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: 10 }}>
                <li>
                  <Link href="/phat-trien-ben-vung" style={{ fontSize: 12, color: '#4B5563', textDecoration: 'none', fontWeight: 600 }}>Phát triển bền vững</Link>
                </li>
                <li>
                  <Link href="/tin-tuc-su-kien" style={{ fontSize: 12, color: '#4B5563', textDecoration: 'none', fontWeight: 600 }}>Tin tức sự kiện</Link>
                </li>
                <li>
                  <Link href="/tuyen-dung" style={{ fontSize: 12, color: '#4B5563', textDecoration: 'none', fontWeight: 600 }}>Tuyển dụng</Link>
                </li>
                <li>
                  <Link href="/lien-he" style={{ fontSize: 12, color: '#4B5563', textDecoration: 'none', fontWeight: 600 }}>Liên hệ</Link>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* Floating Scroll to Top button on bottom right */}
      <button
        onClick={scrollToTop}
        style={{
          position: 'fixed',
          bottom: 20,
          right: 20,
          width: 36,
          height: 36,
          borderRadius: '50%',
          background: 'rgba(255,255,255,0.9)',
          border: '1px solid #E2E8F0',
          boxShadow: '0 4px 10px rgba(0,0,0,0.1)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: 16,
          cursor: 'pointer',
          zIndex: 100
        }}
      >
        ▲
      </button>
    </div>
  )
}

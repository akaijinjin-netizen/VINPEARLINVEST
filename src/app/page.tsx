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

const HERO_SLIDES = [
  '/landmark81.png', // Landmark 81 Vingroup
  '/vinhomes.png',   // Vinhomes Residential & Smart Cities
  '/city3.png',      // Modern waterfront city view
  '/city4.png'       // Urban skyscrapers view at dusk
]

export default function VingroupQplLandingPage() {
  const [showRewards, setShowRewards] = useState(false)
  const [currentSlide, setCurrentSlide] = useState(0)
  const [startX, setStartX] = useState<number | null>(null)
  const [dragOffset, setDragOffset] = useState(0)
  const [isDragging, setIsDragging] = useState(false)
  const [isMobile, setIsMobile] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)

  useEffect(() => {
    document.title = "Quỹ Huy Động Vốn VINGROUP"
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 768)
    }
    checkMobile()
    window.addEventListener('resize', checkMobile)
    return () => window.removeEventListener('resize', checkMobile)
  }, [])

  useEffect(() => {
    if (isDragging) return
    const timer = setInterval(() => {
      setCurrentSlide(prev => (prev + 1) % HERO_SLIDES.length)
    }, 5000)
    return () => clearInterval(timer)
  }, [isDragging])

  const handleStart = (clientX: number) => {
    setStartX(clientX)
    setIsDragging(true)
  }

  const handleMove = (clientX: number) => {
    if (startX === null || !isDragging) return
    setDragOffset(clientX - startX)
  }

  const handleEnd = () => {
    if (startX === null) return
    const threshold = 80
    if (dragOffset < -threshold) {
      setCurrentSlide(prev => (prev + 1) % HERO_SLIDES.length)
    } else if (dragOffset > threshold) {
      setCurrentSlide(prev => (prev - 1 + HERO_SLIDES.length) % HERO_SLIDES.length)
    }
    setStartX(null)
    setDragOffset(0)
    setIsDragging(false)
  }

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

      {/* Header exactly like competitor (translucent glassmorphic header bar with blur) */}
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
              <img src="/top-brand-logo.png" alt="Vingroup Logo" style={{ height: 56, objectFit: 'contain' }} />
            </div>

            {/* Spacer / Right column for centering logo */}
            <div style={{ width: 36 }} />

            {/* Mobile Menu Dropdown/Drawer overlay */}
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
                zIndex: 999,
                animation: 'fadeIn 0.2s ease'
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
                src="/top-brand-logo.png" 
                alt="Vingroup Logo" 
                style={{ height: 65, objectFit: 'contain' }}
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

      {/* Hero Banner with swipeable touch/mouse draggable carousel container */}
      <div 
        onMouseDown={e => handleStart(e.clientX)}
        onMouseMove={e => handleMove(e.clientX)}
        onMouseUp={handleEnd}
        onMouseLeave={handleEnd}
        onTouchStart={e => handleStart(e.touches[0].clientX)}
        onTouchMove={e => handleMove(e.touches[0].clientX)}
        onTouchEnd={handleEnd}
        style={{
          position: 'relative',
          height: '65vh',
          minHeight: 480,
          overflow: 'hidden',
          width: '100%',
          background: '#000',
          cursor: isDragging ? 'grabbing' : 'grab',
          userSelect: 'none'
        }}
      >
        {/* Horizontal flex slides track */}
        <div style={{
          display: 'flex',
          width: `${HERO_SLIDES.length * 100}%`,
          height: '100%',
          transform: `translateX(calc(-${currentSlide * (100 / HERO_SLIDES.length)}% + ${dragOffset}px))`,
          transition: isDragging ? 'none' : 'transform 0.6s cubic-bezier(0.25, 0.46, 0.45, 0.94)'
        }}>
          {HERO_SLIDES.map((slideUrl, idx) => (
            <div
              key={idx}
              style={{
                width: `${100 / HERO_SLIDES.length}%`,
                height: '100%',
                backgroundImage: `url(${slideUrl})`,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                position: 'relative'
              }}
            >
              {/* Overlay inside slide */}
              <div style={{
                position: 'absolute', inset: 0,
                background: 'rgba(0, 0, 0, 0.25)'
              }} />
            </div>
          ))}
        </div>

        {/* Content container (Slogan, buttons, dots indicators) positioned absolutely */}
        <div style={{
          position: 'absolute',
          inset: 0,
          zIndex: 5,
          pointerEvents: 'none'
        }}>
          <div style={{
            maxWidth: 1200,
            margin: '0 auto',
            position: 'relative',
            height: '100%',
            width: '100%'
          }}>
            <div style={{
              position: 'absolute',
              bottom: isMobile ? 40 : 80,
              left: 20,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'flex-start',
              pointerEvents: 'auto'
            }}>
              <h2 style={{ 
                fontFamily: "'Times New Roman', Times, serif",
                fontSize: isMobile ? '1.8rem' : '3rem', 
                fontWeight: 'bold', 
                color: 'white', 
                margin: 0, 
                lineHeight: 1.2,
                textTransform: 'uppercase',
                textShadow: '0 2px 10px rgba(0,0,0,0.6)',
                marginBottom: 16,
                letterSpacing: '1px'
              }}>
                MÃI MÃI TINH THẦN<br />KHỞI NGHIỆP
              </h2>

              <Link 
                href="/dang-nhap" 
                style={{
                  backgroundColor: '#e32823',
                  color: 'white',
                  border: 'none',
                  borderRadius: 4,
                  padding: '10px 24px',
                  fontSize: 12,
                  fontWeight: 'bold',
                  textDecoration: 'none',
                  textTransform: 'uppercase',
                  boxShadow: '0 4px 10px rgba(0,0,0,0.2)'
                }}
              >
                XEM THÊM
              </Link>
            </div>

            {/* Dots Indicator */}
            <div style={{
              position: 'absolute',
              bottom: 24,
              left: '50%',
              transform: 'translateX(-50%)',
              display: 'flex',
              gap: 10,
              pointerEvents: 'auto'
            }}>
              {HERO_SLIDES.map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => setCurrentSlide(idx)}
                  style={{
                    width: 10,
                    height: 10,
                    borderRadius: '50%',
                    border: 'none',
                    background: idx === currentSlide ? '#e32823' : 'rgba(255,255,255,0.5)',
                    cursor: 'pointer',
                    padding: 0,
                    transition: 'background-color 0.3s'
                  }}
                />
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Section 1: Tin Tức Sự Kiện & Tài Khoản Nội Bộ */}
      <div style={{ background: 'white', padding: isMobile ? '40px 16px' : '60px 20px', width: '100%', boxSizing: 'border-box' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto' }}>
          
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: isMobile ? 'stretch' : 'center',
            flexDirection: isMobile ? 'column' : 'row',
            borderBottom: '1px solid #E5E7EB',
            paddingBottom: 20,
            marginBottom: 24,
            gap: 16
          }}>
            <h2 style={{ 
              fontSize: isMobile ? '1.8rem' : '2.2rem', 
              fontWeight: 800, 
              color: '#0F172A', 
              margin: 0, 
              textTransform: 'uppercase',
              letterSpacing: '-0.5px',
              textAlign: isMobile ? 'center' : 'left'
            }}>
              TIN TỨC SỰ KIỆN
            </h2>
            <Link 
              href="/dang-nhap" 
              style={{
                background: 'linear-gradient(135deg, #e32823, #b82424)',
                color: 'white',
                borderRadius: 4,
                padding: '12px 24px',
                fontSize: 12,
                fontWeight: 'bold',
                textDecoration: 'none',
                textTransform: 'uppercase',
                textAlign: 'center',
                boxShadow: '0 4px 12px rgba(227, 40, 35, 0.25)'
              }}
            >
              TÀI KHOẢN NỘI BỘ
            </Link>
          </div>

          {/* Collapse toggle row */}
          <div style={{ marginBottom: 30 }}>
            <button 
              onClick={() => setShowRewards(!showRewards)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 8,
                background: 'none',
                border: 'none',
                fontSize: 14,
                fontWeight: 'bold',
                color: '#374151',
                cursor: 'pointer',
                outline: 'none',
                padding: 0
              }}
            >
              <span style={{ fontSize: 10, transition: 'transform 0.2s', transform: showRewards ? 'rotate(90deg)' : 'rotate(0deg)' }}>
                ▶
              </span>
              Chi tiết phần thưởng tham gia
            </button>

            {showRewards && (
              <div style={{ 
                marginTop: 16, 
                padding: 20, 
                background: '#F8FAFC', 
                borderRadius: 8, 
                border: '1px solid #E5E7EB',
                fontSize: 13,
                color: '#4B5563',
                lineHeight: 1.7,
                animation: 'fadeIn 0.2s ease'
              }}>
                <ul style={{ paddingLeft: 20, margin: 0, display: 'flex', flexDirection: 'column', gap: 8 }}>
                  <li>
                    <strong>Sử dụng thẻ thành viên VIP</strong>: Nhận siêu giải thưởng ưu đãi giảm giá khi mua bất động sản Vinhomes, hoặc các dòng xe của VinFast...
                  </li>
                  <li>
                    <strong>Thời gian sử dụng</strong>: Từ 1 đến 5 năm miễn phí tùy theo cấp độ của gói tham gia đầu tư của khách hàng.
                  </li>
                  <li>
                    Quà tặng dành cho thành viên may mắn nhận thẻ thành viên nhanh nhất ưu đãi giảm giá từ 5% đến 15%.
                  </li>
                  <li>
                    Khách hàng đăng ký thành công tham gia quỹ huy động vốn nhận thẻ cổ phần phổ thông giảm giá các sản phẩm của tập đoàn VINGROUP.
                  </li>
                  <li>
                    Điền thông tin được in trên thẻ thành viên miễn phí không cần cọc.
                  </li>
                  <li>
                    Cách nhận thẻ thành viên, khách hàng đăng ký tài khoản bằng cách nhận mã tham dự của tập đoàn VINGROUP đã cấp phát sau đó mở tài khoản online bằng điện thoại.
                  </li>
                  <li>
                    Tài khoản tham gia đầu tư với giá trị gói đầu tư phù hợp với quy định của tập đoàn mới có thể nhận được thẻ cổ phần phổ thông.
                  </li>
                </ul>
              </div>
            )}
          </div>

          {/* Three columns grid of news */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: isMobile ? '1fr' : 'repeat(auto-fit, minmax(320px, 1fr))',
            gap: 24,
            marginBottom: 40
          }}>
            {/* Card 1 */}
            <div style={{ background: 'white', borderRadius: 8, border: '1px solid #E5E7EB', overflow: 'hidden', boxShadow: '0 2px 6px rgba(0,0,0,0.02)' }}>
              <div style={{ height: 180, background: 'url(/news1.webp) center/cover' }} />
              <div style={{ padding: 16 }}>
                <h3 style={{ fontSize: 13, fontWeight: 700, color: '#1A1A1A', lineHeight: 1.4, margin: '0 0 12px 0' }}>
                  Giải thưởng VinFuture 2023 vinh danh 4 công trình khoa học “Chung sức toàn cầu”
                </h3>
                <div style={{ fontSize: 11, color: '#9CA3AF', fontWeight: 600 }}>20-12-2023</div>
              </div>
            </div>

            {/* Card 2 */}
            <div style={{ background: 'white', borderRadius: 8, border: '1px solid #E5E7EB', overflow: 'hidden', boxShadow: '0 2px 6px rgba(0,0,0,0.02)' }}>
              <div style={{ height: 180, background: 'url(/news2.webp) center/cover' }} />
              <div style={{ padding: 16 }}>
                <h3 style={{ fontSize: 13, fontWeight: 700, color: '#1A1A1A', lineHeight: 1.4, margin: '0 0 12px 0', textTransform: 'uppercase' }}>
                  VINFAST VÀ MARUBENI HỢP TÁC TÁI SỬ DỤNG PIN XE ĐIỆN
                </h3>
                <div style={{ fontSize: 11, color: '#9CA3AF', fontWeight: 600 }}>18-12-2023</div>
              </div>
            </div>

            {/* Card 3 */}
            <div style={{ background: 'white', borderRadius: 8, border: '1px solid #E5E7EB', overflow: 'hidden', boxShadow: '0 2px 6px rgba(0,0,0,0.02)' }}>
              <div style={{ height: 180, background: 'url(/news3.webp) center/cover' }} />
              <div style={{ padding: 16 }}>
                <h3 style={{ fontSize: 13, fontWeight: 700, color: '#1A1A1A', lineHeight: 1.4, margin: '0 0 12px 0', textTransform: 'uppercase' }}>
                  HUMAN ACT PRIZE 2023 VINH DANH DỰ ÁN THIỆN NGUYỆN “THUỐC ĐÚNG CHO EM” CỦA GENESTORY
                </h3>
                <div style={{ fontSize: 11, color: '#9CA3AF', fontWeight: 600 }}>12-12-2023</div>
              </div>
            </div>
          </div>

          {/* Centered red "Xem tất cả" button */}
          <div style={{ textAlign: 'center' }}>
            <Link 
              href="/linh-vuc-hoat-dong" 
              style={{
                display: 'inline-block',
                backgroundColor: '#e32823',
                color: 'white',
                padding: '10px 32px',
                borderRadius: 4,
                fontSize: 12,
                fontWeight: 'bold',
                textDecoration: 'none',
                textTransform: 'uppercase'
              }}
            >
              XEM TẤT CẢ →
            </Link>
          </div>
        </div>
      </div>

      {/* Section 2: Lĩnh vực Tiên phong */}
      <div style={{ background: '#ffffff', padding: isMobile ? '40px 16px' : '60px 20px', width: '100%', boxSizing: 'border-box', borderTop: '1px solid #F1F5F9' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto', textAlign: 'center' }}>
          <h2 style={{ 
            fontFamily: "'Georgia', 'Times New Roman', serif",
            fontSize: isMobile ? '1.8rem' : '2.5rem', 
            fontWeight: 400, 
            color: '#1E293B', 
            margin: 0 
          }}>
            Lĩnh vực <span style={{ color: '#e32823', fontWeight: 'bold' }}>Tiên phong</span>
          </h2>
          <p style={{ 
            fontSize: 14, 
            color: '#64748B', 
            maxWidth: 900, 
            margin: '16px auto 32px', 
            lineHeight: 1.7 
          }}>
            Với mong muốn đem đến cho thị trường những sản phẩm – dịch vụ theo tiêu chuẩn quốc tế và những trải nghiệm hoàn toàn mới về phong cách sống hiện đại, ở bất cứ lĩnh vực nào Vingroup cũng chứng tỏ vai trò tiên phong, dẫn dắt sự thay đổi xu hướng tiêu dùng.
          </p>

          <div style={{
            display: 'grid',
            gridTemplateColumns: isMobile ? '1fr' : 'repeat(auto-fit, minmax(280px, 1fr))',
            gap: 32
          }}>
            {/* Column 1 */}
            <div>
              <div style={{ height: 210, borderRadius: 10, overflow: 'hidden', border: '1px solid #E5E7EB' }}>
                <img 
                  src="/pioneer1.webp" 
                  alt="Tech" 
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                />
              </div>
              <h3 style={{ fontSize: 15, fontWeight: 700, color: '#e32823', marginTop: 16 }}>
                Công nghệ – Công nghiệp
              </h3>
            </div>

            {/* Column 2 */}
            <div>
              <div style={{ height: 210, borderRadius: 10, overflow: 'hidden', border: '1px solid #E5E7EB' }}>
                <img 
                  src="/pioneer2.webp" 
                  alt="Commerce" 
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                />
              </div>
              <h3 style={{ fontSize: 15, fontWeight: 700, color: '#e32823', marginTop: 16 }}>
                Thương mại dịch vụ
              </h3>
            </div>

            {/* Column 3 */}
            <div>
              <div style={{ height: 210, borderRadius: 10, overflow: 'hidden', border: '1px solid #E5E7EB' }}>
                <img 
                  src="/pioneer3.webp" 
                  alt="Social" 
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                />
              </div>
              <h3 style={{ fontSize: 15, fontWeight: 700, color: '#e32823', marginTop: 16 }}>
                Thiện nguyện xã hội
              </h3>
            </div>
          </div>
        </div>
      </div>

      {/* Section 3: Quan Hệ Cổ Đông */}
      <div style={{ background: '#ffffff', padding: isMobile ? '40px 16px' : '60px 20px', width: '100%', boxSizing: 'border-box', borderTop: '1px solid #F1F5F9' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto' }}>
          
          <h2 style={{ 
            fontFamily: "'Georgia', 'Times New Roman', serif",
            fontSize: isMobile ? '1.8rem' : '2.5rem', 
            fontWeight: 'bold', 
            color: '#1E293B', 
            textTransform: 'uppercase',
            marginBottom: isMobile ? 24 : 40
          }}>
            QUAN HỆ CỔ ĐÔNG
          </h2>

          <div style={{
            display: 'grid',
            gridTemplateColumns: isMobile ? '1fr' : 'repeat(auto-fit, minmax(320px, 1fr))',
            gap: 40
          }}>
            {/* Col 1: GIỚI THIỆU TẬP ĐOÀN */}
            <div>
              <div style={{ marginBottom: 20 }}>
                <h3 style={{ fontSize: 15, fontWeight: 800, color: '#1E293B', textTransform: 'uppercase', margin: 0, paddingBottom: 6 }}>
                  GIỚI THIỆU TẬP ĐOÀN
                </h3>
                <div style={{ width: 150, height: 2.5, background: '#e32823' }} />
              </div>

              <div style={{ height: 240, borderRadius: 10, overflow: 'hidden', marginBottom: 16 }}>
                <img 
                  src="/intro.webp" 
                  alt="Vinhomes Riverside" 
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                />
              </div>
              <p style={{ fontSize: 13, color: '#4B5563', lineHeight: 1.7, margin: 0 }}>
                Tiền thân của Vingroup là Tập đoàn Technocom, thành lập năm 1993 tại Ucraina. Đầu những năm 2000, Technocom trở về Việt Nam, tập trung đầu tư vào lĩnh vực du lịch và bất động sản với hai thương hiệu chiến lược ban đầu là Vingroup QPL và Vincom. Đến tháng 1/2012, công ty CP Vincom và Công ty CP Vingroup QPL sáp nhập, chính thức hoạt động dưới mô hình Tập đoàn với tên gọi Tập đoàn Vingroup – Công ty CP.
              </p>
            </div>

            {/* Col 2: TIN TỨC NỔI BẬT */}
            <div>
              <div style={{ marginBottom: 20 }}>
                <h3 style={{ fontSize: 15, fontWeight: 800, color: '#1E293B', textTransform: 'uppercase', margin: 0, paddingBottom: 6 }}>
                  TIN TỨC NỔI BẬT
                </h3>
                <div style={{ width: 130, height: 2.5, background: '#e32823' }} />
              </div>

              <div style={{ height: 240, borderRadius: 10, overflow: 'hidden', marginBottom: 16 }}>
                <img 
                  src="/highlight.webp" 
                  alt="Tin tức nổi bật" 
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                />
              </div>

              <p style={{ fontSize: 13, fontWeight: 700, color: '#1e293b', lineHeight: 1.5, marginBottom: 14 }}>
                Tham gia góp vốn nhận ngay thẻ VIP nhiều quyền lợi đa tiện ích cùng các Voucher của Vingroup
              </p>
              
              <Link 
                href="/dang-nhap" 
                style={{ 
                  fontSize: 13, 
                  color: '#e32823', 
                  fontWeight: 800, 
                  textDecoration: 'none',
                  textTransform: 'uppercase'
                }}
              >
                Xem chi tiết
              </Link>
            </div>
          </div>

        </div>
      </div>

      {/* Footer (Full layout with lists and circular connect buttons) */}
      <div style={{
        background: '#F8FAFC',
        borderTop: '1px solid #E2E8F0',
        padding: '50px 20px 40px',
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
                  <Link href="/linh-vuc-hoat-dong" style={{ fontSize: 12, color: '#4B5563', textDecoration: 'none', fontWeight: 600 }}>Giới thiệu Tập đoàn</Link>
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

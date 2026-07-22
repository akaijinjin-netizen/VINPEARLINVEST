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

// 18 brand logos từ trang gốc
const BRANDS = [
  { src: '/td_image.png',     label: 'VINFAST' },
  { src: '/td_image-1.png',   label: 'VINHOMES' },
  { src: '/td_image-49.webp', label: 'VINCOM RETAIL' },
  { src: '/td_image-50.webp', label: 'VINMEC' },
  { src: '/td_image-51.webp', label: 'VinCSS' },
  { src: '/td_image-52.webp', label: 'VINBIOCARE' },
  { src: '/td_image-53.webp', label: 'VINSCHOOL' },
  { src: '/td_image-54.webp', label: 'QUỸ THIỆN TÂM' },
  { src: '/td_image-55.webp', label: 'VINSMART' },
  { src: '/td_image-56.webp', label: 'VINBRAIN' },
  { src: '/td_image-57.webp', label: 'VINFUTURE' },
  { src: '/td_image-58.webp', label: 'VINIF' },
  { src: '/td_image-59.webp', label: 'VINAI' },
  { src: '/td_image-60.webp', label: 'VINBUS' },
  { src: '/td_image-61.webp', label: 'VINHMS' },
  { src: '/td_image-62.webp', label: 'VINPEARL' },
  { src: '/td_image-63.webp', label: 'VINSAVE' },
  { src: '/td_image-64.webp', label: 'VINDS' },
]

const CORE_VALUES = [
  {
    highlight: 'TÍN',
    label: '"TÍN – TÂM – TRÍ – TỐC – TINH – NHÂN"',
    img: '/td_image-67.webp',
    bullets: [
      'Vingroup đặt chữ TÍN lên vị trí hàng đầu, lấy chữ TÍN làm vũ khí cạnh tranh và bảo vệ chữ TÍN như bảo vệ danh dự của chính mình.',
      'Vingroup luôn cố gắng chuẩn bị đầy đủ năng lực thực thi, nỗ lực hết mình để đảm bảo đúng và cao hơn các cam kết của mình với khách hàng, đối tác; đặc biệt là các cam kết về chất lượng sản phẩm – dịch vụ và tiến độ thực hiện.'
    ]
  },
  {
    highlight: 'TÂM',
    label: '"TÍN – TÂM – TRÍ – TỐC – TINH – NHÂN"',
    img: '/td_image-68.webp',
    bullets: [
      'Vingroup đặt chữ TÂM là một trong những nền tảng quan trọng của việc kinh doanh. Chúng ta thượng tôn pháp luật và duy trì đạo đức nghề nghiệp, đạo đức xã hội ở tiêu chuẩn cao nhất.',
      'Vingroup coi trọng khách hàng và luôn lấy khách hàng làm trung tâm, đặt lợi ích và mong muốn của khách hàng lên hàng đầu; nỗ lực mang đến cho khách hàng những sản phẩm – dịch vụ hoàn hảo nhất.'
    ]
  },
  {
    highlight: 'TRÍ',
    label: '"TÍN – TÂM – TRÍ – TỐC – TINH – NHÂN"',
    img: '/td_image-69.webp',
    bullets: [
      'Vingroup coi sáng tạo là sức sống, là đòn bẩy phát triển, nhằm tạo ra giá trị khác biệt và bản sắc riêng trong mỗi gói sản phẩm – dịch vụ.',
      'Vingroup đề cao tinh thần dám nghĩ dám làm; khuyến khích tìm tòi, ứng dụng những tiến bộ khoa học, kỹ thuật và công nghệ mới vào quản lý, sản xuất.'
    ]
  },
  {
    highlight: 'TỐC',
    label: '"TÍN – TÂM – TRÍ – TỐC – TINH – NHÂN"',
    img: '/td_image-70.webp',
    bullets: [
      'Vingroup lấy "Tốc độ, hiệu quả trong từng hành động" làm tôn chỉ và lấy "Quyết định nhanh – Đầu tư nhanh – Triển khai nhanh – Bán hàng nhanh – Thay đổi và thích ứng nhanh…" làm giá trị bản sắc.',
      'Vingroup đề cao khát vọng tiên phong và xác định "Vinh quang thuộc về người về đích đúng hẹn".'
    ]
  },
  {
    highlight: 'TINH',
    label: '"TÍN – TÂM – TRÍ – TỐC – TINH – NHÂN"',
    img: '/td_image-71.webp',
    bullets: [
      'Vingroup có mục tiêu: Tập hợp những con người tinh hoa để làm nên những sản phẩm – dịch vụ tinh hoa; mọi thành viên được thụ hưởng cuộc sống tinh hoa.',
      'Vingroup mong muốn xây dựng một đội ngũ nhân sự tinh gọn, có đủ cả Đức và Tài, nơi mỗi thành viên đều là những nhân tố xuất sắc trong lĩnh vực công việc của mình.'
    ]
  },
  {
    highlight: 'NHÂN',
    label: '"TÍN – TÂM – TRÍ – TỐC – TINH – NHÂN"',
    img: '/td_image-72.webp',
    bullets: [
      'Vingroup xây dựng các mối quan hệ với khách hàng, đối tác, đồng nghiệp, nhà đầu tư và xã hội bằng sự thiện chí, tình thân ái, tinh thần nhân văn.',
      'Vingroup luôn coi trọng người lao động như là tài sản quý giá nhất; xây dựng môi trường làm việc chuyên nghiệp, năng động, sáng tạo và nhân văn; thực hành các chính sách phúc lợi ưu việt, tạo điều kiện thu nhập cao và cơ hội phát triển công bằng cho tất cả CBNV.'
    ]
  },
]

export default function TuyenDungPage() {
  const [isMobile, setIsMobile] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)

  useEffect(() => {
    document.title = 'Tuyển dụng – Cơ hội việc làm tại Vingroup | Quỹ Huy Động Vốn VINGROUP'
    const check = () => setIsMobile(window.innerWidth <= 768)
    check()
    window.addEventListener('resize', check)
    return () => window.removeEventListener('resize', check)
  }, [])

  const scrollToTop = () => window.scrollTo({ top: 0, behavior: 'smooth' })

  return (
    <div style={{ fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif", background: '#fff', minHeight: '100vh', color: '#1A1A1A', width: '100%', display: 'flex', flexDirection: 'column' }}>

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
              <div style={{ position: 'fixed', top: 60, left: 0, right: 0, background: 'rgba(26,26,26,0.97)', padding: '20px 16px', display: 'flex', flexDirection: 'column', gap: 16, zIndex: 999 }}>
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
                  style={{ color: l.href === '/tuyen-dung' ? '#e32823' : '#E5E7EB', fontSize: 13, fontWeight: 700, textDecoration: 'none' }}
                  onMouseOver={e => e.currentTarget.style.color = '#e32823'} onMouseOut={e => e.currentTarget.style.color = l.href === '/tuyen-dung' ? '#e32823' : '#E5E7EB'}>
                  {l.label}
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* ── HERO BANNER ────────────────────────────────────────────── */}
      <div style={{ position: 'relative', width: '100%', height: isMobile ? 220 : 480, overflow: 'hidden', background: '#111' }}>
        <img src="/td_image-48.webp" alt="Cơ hội việc làm tại Vingroup" style={{ width: '100%', height: '100%', objectFit: 'cover', opacity: 0.75, position: 'absolute', inset: 0 }} />
        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to bottom, rgba(0,0,0,0.2) 0%, rgba(0,0,0,0.55) 100%)' }} />
        <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'flex-end', paddingBottom: isMobile ? 24 : 65, paddingLeft: isMobile ? 16 : 20, paddingRight: isMobile ? 16 : 20 }}>
          <div style={{ maxWidth: 1200, width: '100%', margin: '0 auto', boxSizing: 'border-box' }}>
            <h1 style={{ fontSize: isMobile ? '1.5rem' : '2.8rem', fontWeight: 900, color: '#fff', margin: 0, textTransform: 'uppercase', textShadow: '0 2px 12px rgba(0,0,0,0.5)', letterSpacing: '0.5px' }}>CƠ HỘI VIỆC LÀM TẠI VINGROUP</h1>
            <p style={{ fontSize: isMobile ? 14 : 20, color: '#fff', marginTop: 10, fontWeight: 600, textShadow: '0 1px 6px rgba(0,0,0,0.4)', margin: '10px 0 0 0' }}>5 Công Việc Đang Chờ Bạn</p>
          </div>
        </div>
      </div>

      {/* ── BRAND LOGOS ────────────────────────────────────────────── */}
      <section style={{ padding: isMobile ? '40px 16px' : '70px 20px', background: '#fff' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 16, marginBottom: 40 }}>
            <h2 style={{ fontSize: isMobile ? '1.3rem' : '1.8rem', fontWeight: 800, color: '#1E293B', textTransform: 'uppercase', margin: 0, letterSpacing: '0.5px' }}>VIỆC LÀM THEO THƯƠNG HIỆU</h2>
            <Link href="/dang-nhap" style={{ background: '#e32823', color: '#fff', padding: '12px 28px', borderRadius: 6, fontWeight: 700, fontSize: 14, textDecoration: 'none', transition: 'background 0.2s' }}
              onMouseOver={e => e.currentTarget.style.background = '#b81d19'} onMouseOut={e => e.currentTarget.style.background = '#e32823'}>
              Đăng nhập
            </Link>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: isMobile ? 'repeat(2,1fr)' : 'repeat(6,1fr)', gap: isMobile ? 20 : 30 }}>
            {BRANDS.map((b, i) => (
              <div key={i} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 12, padding: '20px 10px', borderRadius: 10, background: '#fafafa', border: '1px solid #f0f0f0', cursor: 'pointer', transition: 'all 0.2s ease-in-out' }}
                onMouseOver={e => {
                  (e.currentTarget as HTMLElement).style.boxShadow = '0 6px 20px rgba(0,0,0,0.06)';
                  (e.currentTarget as HTMLElement).style.transform = 'translateY(-2px)';
                  (e.currentTarget as HTMLElement).style.background = '#ffffff';
                }}
                onMouseOut={e => {
                  (e.currentTarget as HTMLElement).style.boxShadow = 'none';
                  (e.currentTarget as HTMLElement).style.transform = 'none';
                  (e.currentTarget as HTMLElement).style.background = '#fafafa';
                }}>
                <div style={{ width: '100%', height: 75, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <img src={b.src} alt={b.label} style={{ maxWidth: '85%', maxHeight: '100%', objectFit: 'contain' }} />
                </div>
                <span style={{ fontSize: 11, fontWeight: 800, color: '#475569', textAlign: 'center', textTransform: 'uppercase', letterSpacing: '0.5px' }}>{b.label}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── TẦM NHÌN & SỨ MỆNH ─────────────────────────────────────── */}
      <section style={{ padding: isMobile ? '36px 16px' : '60px 20px', background: '#F7F7F7' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto' }}>
          <h2 style={{ textAlign: 'center', fontSize: isMobile ? '1.4rem' : '2rem', fontWeight: 900, color: '#1E293B', textTransform: 'uppercase', marginBottom: 50 }}>TẦM NHÌN, SỨ MỆNH VÀ GIÁ TRỊ CỐT LÕI</h2>

          {/* Tầm nhìn */}
          <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr', gap: 40, marginBottom: 50, alignItems: 'center' }}>
            <div style={{ borderRadius: 12, overflow: 'hidden', boxShadow: '0 4px 20px rgba(0,0,0,0.08)' }}>
              <img src="/td_image-65.webp" alt="Tầm nhìn Vingroup" style={{ width: '100%', height: 'auto', display: 'block' }} />
            </div>
            <div>
              <h3 style={{ color: '#e32823', fontSize: '1.4rem', fontWeight: 800, marginBottom: 12 }}>Tầm nhìn</h3>
              <p style={{ fontSize: 15, fontStyle: 'italic', fontWeight: 700, color: '#1E293B', marginBottom: 14 }}>
                "Vingroup định hướng phát triển thành tập đoàn Công nghệ – Công nghiệp – thương mại dịch vụ hàng đầu khu vực"
              </p>
              <p style={{ fontSize: 14, color: '#475569', lineHeight: 1.8, marginBottom: 24 }}>
                Bằng khát vọng tiên phong cùng chiến lược đầu tư – phát triển bền vững, Vingroup định hướng phát triển thành một Tập đoàn Công nghệ – Công nghiệp – Thương mại Dịch vụ hàng đầu khu vực, không ngừng đổi mới, sáng tạo để kiến tạo hệ sinh thái các sản phẩm dịch vụ đẳng cấp, góp phần nâng cao chất lượng cuộc sống của Nhân loại và nâng tầm vị thế của thương hiệu Việt trên trường quốc tế.
              </p>
              <h3 style={{ color: '#e32823', fontSize: '1.4rem', fontWeight: 800, marginBottom: 8 }}>Sứ mệnh</h3>
              <p style={{ fontSize: 15, fontStyle: 'italic', fontWeight: 700, color: '#1E293B' }}>
                "Vì một cuộc sống tốt đẹp hơn cho mọi người"
              </p>
            </div>
          </div>

          {/* Đội ngũ nhân sự */}
          <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr', gap: 40, alignItems: 'center' }}>
            <div>
              <h3 style={{ color: '#e32823', fontSize: '1.4rem', fontWeight: 800, marginBottom: 12 }}>Đội ngũ nhân sự</h3>
              <p style={{ fontSize: 14, color: '#475569', lineHeight: 1.8, marginBottom: 20 }}>
                Trải qua chặng đường dài trưởng thành và phát triển, chính những con người Vingroup đã làm nên những giá trị tốt đẹp, đóng góp vào thành công của Tập đoàn hôm nay.
              </p>
              <a href="#core-values" style={{ color: '#e32823', fontWeight: 700, fontSize: 14, textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: 6 }}>
                Xem chi tiết ›
              </a>
            </div>
            <div style={{ borderRadius: 12, overflow: 'hidden', boxShadow: '0 4px 20px rgba(0,0,0,0.08)' }}>
              <img src="/td_image-73.webp" alt="Đội ngũ nhân sự Vingroup" style={{ width: '100%', height: 'auto', display: 'block' }} />
            </div>
          </div>
        </div>
      </section>

      {/* ── GIÁ TRỊ CỐT LÕI: TÍN TÂM TRÍ TỐC TINH ─────────────────── */}
      <section id="core-values" style={{ padding: isMobile ? '36px 16px' : '60px 20px', background: '#fff' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto' }}>
          <h3 style={{ color: '#e32823', fontSize: '1.3rem', fontWeight: 800, marginBottom: 40 }}>Giá trị cốt lõi</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 64 }}>
            {CORE_VALUES.map((v, i) => (
              <div key={i} style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr', gap: 40, alignItems: 'center', flexDirection: i % 2 === 1 ? 'row-reverse' : 'row' }}>
                {i % 2 === 0 ? (
                  <>
                    <div>
                      <h4 style={{ fontSize: isMobile ? '1.1rem' : '1.3rem', fontStyle: 'italic', color: '#1E293B', textAlign: 'center', marginBottom: 20 }}>
                        {v.label.replace(v.highlight, `<span style="color:#e32823">${v.highlight}</span>`).split(`<span style="color:#e32823">${v.highlight}</span>`).map((part, pi) => (
                          <span key={pi}>{pi === 0 ? '"' : ''}{part}{pi === 0 ? <span key="hl" style={{ color: '#e32823' }}>{v.highlight}</span> : '"'}</span>
                        ))}
                      </h4>
                      {v.bullets.map((b, bi) => <p key={bi} style={{ fontSize: 14, color: '#475569', lineHeight: 1.8, marginBottom: 10 }}>• {b}</p>)}
                    </div>
                    <div style={{ borderRadius: 12, overflow: 'hidden', boxShadow: '0 4px 20px rgba(0,0,0,0.07)' }}>
                      <img src={v.img} alt={v.highlight} style={{ width: '100%', height: 'auto', display: 'block' }} />
                    </div>
                  </>
                ) : (
                  <>
                    <div style={{ borderRadius: 12, overflow: 'hidden', boxShadow: '0 4px 20px rgba(0,0,0,0.07)', order: isMobile ? 2 : 1 }}>
                      <img src={v.img} alt={v.highlight} style={{ width: '100%', height: 'auto', display: 'block' }} />
                    </div>
                    <div style={{ order: isMobile ? 1 : 2 }}>
                      <h4 style={{ fontSize: isMobile ? '1.1rem' : '1.3rem', fontStyle: 'italic', color: '#1E293B', textAlign: 'center', marginBottom: 20 }}>
                        <em>"{v.label}"</em>
                      </h4>
                      {v.bullets.map((b, bi) => <p key={bi} style={{ fontSize: 14, color: '#475569', lineHeight: 1.8, marginBottom: 10 }}>• {b}</p>)}
                    </div>
                  </>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── ĐỘI NGŨ NHÂN SỰ (CHI TIẾT) ─────────────────────────────── */}
      <section id="doingu" style={{ padding: isMobile ? '40px 16px' : '70px 20px', background: '#F7F7F7', borderTop: '1px solid #E2E8F0' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto' }}>
          <h2 style={{ fontSize: isMobile ? '1.5rem' : '2.2rem', fontWeight: 900, color: '#1E293B', textTransform: 'uppercase', marginBottom: 24, textAlign: 'center', letterSpacing: '0.5px' }}>
            ĐỘI NGŨ NHÂN SỰ
          </h2>
          <h3 style={{ fontSize: '1.2rem', fontWeight: 800, color: '#e32823', marginBottom: 20 }}>
            Đội ngũ nhân sự
          </h3>
          <p style={{ fontSize: 15, color: '#334155', lineHeight: 1.85, marginBottom: 30 }}>
            Tại Vingroup, tùy theo từng vị trí cụ thể sẽ có những tiêu chuẩn bắt buộc riêng, song tất cả các thành viên đều đáp ứng yêu cầu: có trình độ chuyên môn, có quyết tâm phát triển nghề nghiệp, có tinh thần trách nhiệm và tinh thần kỉ luật cao. Cán bộ quản lý tại Tập đoàn là những người phát huy được đầy đủ các giá trị cốt lõi của Vingroup: "Tín – Tâm – Trí – Tốc – Tinh – Nhân", thể hiện tâm huyết, bản lĩnh vững vàng, dám nghĩ, dám làm, dám chịu trách nhiệm, có năng lực tổ chức và quản lý tốt. Đối với các vị trí quản lý cấp cao, các yêu cầu tuyển dụng khá khắt khe với các tiêu chuẩn bắt buộc về kinh nghiệm công tác, khả năng tư duy logic, phán đoán nhanh nhạy, phân tích và giải quyết vấn đề hiệu quả. Những thành viên đó đã hợp thành một đội ngũ mạnh cùng chung mục tiêu là sự phát triển chung của Tập đoàn.
          </p>

          <div style={{ borderRadius: 12, overflow: 'hidden', boxShadow: '0 4px 20px rgba(0,0,0,0.08)', marginBottom: 30 }}>
            <img src="/td_image-73.webp" alt="Đội ngũ nhân sự Vingroup" style={{ width: '100%', height: 'auto', display: 'block' }} />
          </div>

          <p style={{ fontSize: 15, color: '#334155', lineHeight: 1.85, marginBottom: 20 }}>
            Các cán bộ nhân viên Vingroup luôn có sự chủ động quyết liệt và sáng tạo trong lao động dưới sự dẫn dắt của đội ngũ cán bộ Lãnh đạo nhạy bén, có khả năng quản trị doanh nghiệp vừa linh hoạt vừa bài bản, tạo nên sự uy tín, đẳng cấp của Vingroup trên thị trường.
          </p>
          <p style={{ fontSize: 15, color: '#334155', lineHeight: 1.85, marginBottom: 20 }}>
            Dưới sự dẫn dắt của Tập đoàn, con người Vingroup luôn mang trong mình nét văn hóa với bản sắc riêng. Văn hóa ấy mang đậm tính nhân văn, tình thân ái, tinh thần kỷ luật; được xây dựng và vun đắp bằng trí tuệ và sức sáng tạo không ngừng của tập thể cán bộ nhân viên.
          </p>
          <p style={{ fontSize: 15, color: '#334155', lineHeight: 1.85, marginBottom: 0 }}>
            Trải qua chặng đường dài trưởng thành và phát triển, chính những con người Vingroup đã làm nên những giá trị tốt đẹp, đóng góp vào thành công của Tập đoàn hôm nay.
          </p>
        </div>
      </section>

      {/* ── ĐẠI DIỆN VĂN PHÒNG ────────────────────────────────────────── */}
      <section style={{ padding: isMobile ? '40px 16px' : '60px 20px', background: '#fff', borderTop: '1px solid #E2E8F0' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto' }}>
          <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : '1fr 3fr', gap: 30, alignItems: 'center', background: '#fafafa', padding: isMobile ? '24px 16px' : '36px', borderRadius: 12, border: '1px solid #f0f0f0' }}>
            <div style={{ borderRadius: 8, overflow: 'hidden', boxShadow: '0 4px 15px rgba(0,0,0,0.06)' }}>
              <img src="/td_image-11.jpg" alt="Trụ sở Vingroup" style={{ width: '100%', height: 'auto', display: 'block' }} />
            </div>
            <div>
              <h3 style={{ color: '#e32823', fontSize: '1.4rem', fontWeight: 800, margin: '0 0 16px 0' }}>
                Đại diện Văn phòng
              </h3>
              <p style={{ fontSize: 15, color: '#334155', lineHeight: 1.7, margin: '0 0 10px 0' }}>
                <strong>Địa chỉ:</strong> Số 7 đường Bằng Lăng 1, khu đô thị Vinhomes Riverside, phường Việt Hưng, quận Long Biên, thành phố Hà Nội.
              </p>
              <p style={{ fontSize: 15, color: '#334155', lineHeight: 1.7, margin: '0 0 10px 0' }}>
                <strong>Điện thoại:</strong> +84 (24) 3974 9999
              </p>
              <p style={{ fontSize: 15, color: '#334155', lineHeight: 1.7, margin: 0 }}>
                <strong>Fax:</strong> +84 (24) 3974 8888
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ── CTA: NỘP ĐƠN ────────────────────────────────────────────── */}
      <section style={{ background: 'linear-gradient(135deg, #1A1A1A 0%, #2D2D2D 100%)', padding: isMobile ? '48px 16px' : '72px 20px', textAlign: 'center' }}>
        <h2 style={{ fontSize: isMobile ? '1.6rem' : '2.2rem', fontWeight: 900, color: '#fff', textTransform: 'uppercase', marginBottom: 16 }}>THAM GIA ĐỘI NGŨ VINGROUP</h2>
        <p style={{ fontSize: 15, color: '#CBD5E1', marginBottom: 32, maxWidth: 520, margin: '0 auto 32px' }}>
          Hàng nghìn cơ hội việc làm hấp dẫn đang chờ bạn tại hệ sinh thái Vingroup – nơi nuôi dưỡng tài năng và kiến tạo tương lai.
        </p>
        <Link href="/dang-nhap" style={{ background: '#e32823', color: '#fff', padding: '14px 40px', borderRadius: 8, fontWeight: 800, fontSize: 16, textDecoration: 'none', display: 'inline-block' }}>
          Ứng tuyển ngay
        </Link>
      </section>

      {/* ── FOOTER ──────────────────────────────────────────────────── */}
      <div style={{ background: '#F8FAFC', borderTop: '1px solid #E2E8F0', padding: isMobile ? '40px 16px' : '50px 20px 40px', width: '100%', boxSizing: 'border-box' }}>
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

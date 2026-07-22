'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'

const NAV_LINKS = [
  { label: 'Trang chủ', href: '/' },
  { label: 'Giới thiệu', href: '/about' },
  { label: 'Lĩnh vực hoạt động', href: '/linh-vuc-hoat-dong' },
  { label: 'Phát triển bền vững', href: '/phat-trien-ben-vung' },
  { label: 'Quan hệ cổ đông', href: '/linh-vuc-hoat-dong' },
  { label: 'Tin tức sự kiện', href: '/tin-tuc-su-kien' },
  { label: 'Tuyển dụng', href: '/tuyen-dung' },
  { label: 'Liên hệ', href: '/lien-he' }
]

export default function PhatTrienBenVungPage() {
  const [isMobile, setIsMobile] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)

  useEffect(() => {
    document.title = "Phát triển bền vững - Quỹ Huy Động Vốn VINGROUP"
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
        <div style={{ maxWidth: 1000, margin: '0 auto' }}>
          
          {/* Section Title */}
          <h2 style={{
            fontSize: isMobile ? '1.8rem' : '2.5rem',
            fontFamily: "'Georgia', 'Times New Roman', serif",
            fontWeight: 400,
            color: '#e32823',
            marginBottom: 24
          }}>
            Phát triển bền vững
          </h2>

          {/* Large Hero Image */}
          <div style={{ 
            width: '100%', 
            borderRadius: 12, 
            overflow: 'hidden', 
            marginBottom: 40,
            boxShadow: '0 4px 20px rgba(0,0,0,0.06)'
          }}>
            <img 
              src="/sustainability_hero.jpg" 
              alt="Vingroup Phát triển bền vững" 
              style={{ width: '100%', height: 'auto', display: 'block' }}
            />
          </div>

          {/* Section: KHÁT VỌNG TIÊN PHONG */}
          <h3 style={{
            fontSize: isMobile ? '1.6rem' : '2.2rem',
            fontFamily: "'Georgia', 'Times New Roman', serif",
            fontWeight: 400,
            color: '#1E293B',
            textTransform: 'uppercase',
            marginTop: 40,
            marginBottom: 20,
            letterSpacing: '-0.5px'
          }}>
            KHÁT VỌNG TIÊN PHONG
          </h3>

          <p style={{ fontSize: 15, color: '#4B5563', lineHeight: 1.8, marginBottom: 30 }}>
            Vingroup đặt cho mình sứ mệnh “Vì một cuộc sống tốt đẹp hơn cho mọi người”, với 3 nhóm hoạt động trọng tâm là Công nghệ – Công nghiệp, Thương mại Dịch vụ, Thiện nguyện Xã hội.
          </p>

          <hr style={{ border: 'none', borderTop: '1px solid #E5E7EB', margin: '40px 0' }} />

          {/* Section: VĂN HÓA DOANH NGHIỆP */}
          <h3 style={{
            fontSize: isMobile ? '1.6rem' : '2.2rem',
            fontFamily: "'Georgia', 'Times New Roman', serif",
            fontWeight: 400,
            color: '#e32823',
            textTransform: 'uppercase',
            marginBottom: 20,
            letterSpacing: '-0.5px'
          }}>
            VĂN HÓA DOANH NGHIỆP
          </h3>

          <p style={{ fontSize: 15, color: '#4B5563', lineHeight: 1.8, marginBottom: 16 }}>
            Vingroup là nơi tập trung những con người ưu tú của Dân tộc Việt Nam và các bạn đồng nghiệp Quốc tế – những người có tư tưởng và hành động kỷ luật, có tài năng và bản lĩnh, có lòng yêu nước và tự tôn dân tộc, hướng thiện và có tính thần làm việc quyết liệt, triệt để vì những mục đích tốt đẹp.
          </p>

          <p style={{ fontSize: 15, color: '#4B5563', lineHeight: 1.8, marginBottom: 16 }}>
            Mỗi thành viên của Vingroup luôn chủ động, nỗ lực học hỏi, phấn đấu không ngừng để hoàn thiện bản thân, luôn lấy Văn hóa Tập đoàn và 6 giá trị cốt lõi của Tập đoàn làm kim chỉ nam để điều chỉnh mọi hành vi của mình.
          </p>

          <p style={{ fontSize: 15, color: '#4B5563', lineHeight: 1.8, marginBottom: 16 }}>
            Chúng tôi không ngừng sáng tạo để hướng tới mục tiêu “Con người tinh hoa – Sản phẩm/dịch vụ tinh hoa – Cuộc sống tinh hoa – Xã hội tinh hoa”. Và mỗi ngày trôi qua, khắp nơi trên đất nước Việt Nam, bất kể ngày đêm, nắng mưa, các công trình mang thương hiệu Vingroup vẫn vươn cao mãi. Tất cả vẫn ngày đêm nỗ lực vì một Vingroup phát triển bền vững, vì một cuộc sống tốt đẹp hơn cho thế hệ tương lai.
          </p>

          <p style={{ fontSize: 15, color: '#4B5563', lineHeight: 1.8, marginBottom: 16 }}>
            Với tinh thần thượng tôn kỷ luật, văn hóa Vingroup, trước hết chính là văn hóa của sự chuyên nghiệp thể hiện qua 6 giá trị cốt lõi “ TÍN – TÂM – TRÍ – TỐC – TINH – NHÂN”. Văn hóa làm việc tốc độ cao, hiệu quả và tuân thủ kỷ luật đã thấm nhuần trong mọi hành động của Cán bộ nhân viên (CBNV), tạo nên sức mạnh tổng hợp đưa Vingroup phát triển vượt bậc trong mọi lĩnh vực tham gia.
          </p>

          <p style={{ fontSize: 15, color: '#4B5563', lineHeight: 1.8, marginBottom: 16 }}>
            Phát huy 6 giá trị cốt lõi, Tập đoàn đã phát động các chương trình thi đua như phong trào “Người tốt việc tốt”, phong trào thi đua thực hành tiết kiệm hiệu quả, chiến dịch đào tạo 12 giờ chuyển đổi để thành công... Các chương trình giúp cho CBNV thay đổi cách nghĩ, cách làm việc, tiết kiệm thời gian và nâng cao hiệu quả công việc.
          </p>

          <p style={{ fontSize: 15, color: '#4B5563', lineHeight: 1.8, marginBottom: 30 }}>
            Tại Vingroup, mỗi thành viên đều xác định và coi nơi đây là ngôi nhà thứ 2, nơi mình gắn bó và dành phần lớn thời gian hàng ngày để sống và làm việc. Ở bất cứ vai trò và vị trí nào, chúng tôi luôn tự hào là Người Vingroup.
          </p>

          <hr style={{ border: 'none', borderTop: '1px solid #E5E7EB', margin: '40px 0' }} />

          {/* Section: CHIẾN LƯỢC CON NGƯỜI */}
          <h3 style={{
            fontSize: isMobile ? '1.6rem' : '2.2rem',
            fontFamily: "'Georgia', 'Times New Roman', serif",
            fontWeight: 400,
            color: '#e32823',
            textTransform: 'uppercase',
            marginBottom: 20,
            letterSpacing: '-0.5px'
          }}>
            CHIẾN LƯỢC CON NGƯỜI
          </h3>

          <p style={{ fontSize: 15, color: '#4B5563', lineHeight: 1.8, marginBottom: 16 }}>
            Vingroup luôn coi nguồn nhân lực là yếu tố cốt lõi và là tài sản quý giá. Với khẩu hiệu: “Vingroup – Mãi mãi tinh thần khởi nghiệp”, Tập đoàn đã xây dựng một đội ngũ nhân sự tinh gọn, có đủ cả Đức và Tài. Mục tiêu tuyển dụng của Tập đoàn là thu hút và chào đón tất cả những ứng viên mong muốn làm việc trong môi trường năng động, tốc độ, sáng tạo và hiệu quả – nơi mỗi cá nhân có thể phát huy tối đa khả năng và kiến thức chuyên môn.
          </p>

          <p style={{ fontSize: 15, color: '#4B5563', lineHeight: 1.8, marginBottom: 16 }}>
            Tập đoàn luôn tạo một môi trường làm việc chuyên nghiệp, hiện đại, phát huy tối đa quyền được làm việc, cống hiến, phát triển, tôn vinh của người lao động và sự kết hợp hài hòa giữa lợi ích của doanh nghiệp với lợi ích của cán bộ, người lao động.
          </p>

          <p style={{ fontSize: 15, color: '#4B5563', lineHeight: 1.8, marginBottom: 30 }}>
            Vingroup đặc biệt chú trọng đến công tác phát triển nguồn nhân lực thông qua việc triển khai hiệu quả chính sách đào tạo, nâng cao hiểu biết, trình độ nghiệp vụ cho CBNV. Đào tạo không chỉ với mục đích nâng cao trình độ cho CBNV, để mỗi thành viên đều trở thành một đại diện xứng đáng của Vingroup trong bất cứ hoàn cảnh nào mà thông qua hệ thống đào tạo, Vingroup sẽ góp phần vào việc nâng cao chất lượng nhân sự của các doanh nghiệp Việt Nam nói chung.
          </p>

          <hr style={{ border: 'none', borderTop: '1px solid #E5E7EB', margin: '40px 0' }} />

          {/* Section: MÔI TRƯỜNG VÀ CỘNG ĐỒNG */}
          <h3 style={{
            fontSize: isMobile ? '1.6rem' : '2.2rem',
            fontFamily: "'Georgia', 'Times New Roman', serif",
            fontWeight: 400,
            color: '#e32823',
            textTransform: 'uppercase',
            marginBottom: 20,
            letterSpacing: '-0.5px'
          }}>
            MÔI TRƯỜNG VÀ CỘNG ĐỒNG
          </h3>

          <h4 style={{ fontSize: 17, fontWeight: 700, color: '#1E293B', marginBottom: 12 }}>
            Vingroup với môi trường
          </h4>
          <p style={{ fontSize: 15, color: '#4B5563', lineHeight: 1.8, marginBottom: 16 }}>
            Với mục tiêu phát triển bền vững, Vingroup hiểu rõ tầm quan trọng của việc bảo vệ môi trường trong quá trình thiết kế, xây dựng và khai thác các tổ hợp du lịch, TTTM, khu đô thị, văn phòng và căn hộ. Những công trình đầu tiên Vingroup xây dựng như Vinpearl Resort Nha Trang, tòa tháp Vincom Center Bà Triệu đến các khu đô thị như: Royal City hay Times City, Vinhomes Riverside... đều là những khu du lịch xanh, khu đô thị sinh thái, tòa nhà tiết kiệm năng lượng. Những công trình kiến trúc “xanh” nổi bật gắn với từng dấu ấn phát triển của Vingroup.
          </p>
          <p style={{ fontSize: 15, color: '#4B5563', lineHeight: 1.8, marginBottom: 24 }}>
            Coi nguyên tắc “xanh” là sợi chỉ đỏ xuyên suốt quá trình hoạt động sản xuất kinh doanh cũng như phát triển các dự án, Tập đoàn Vingroup không chỉ luôn nỗ lực hết mình trong việc giữ gìn và bảo vệ môi trường, mà còn chú trọng việc tuyên truyền ý thức này tới khách hàng, cộng đồng để cùng nhau xây dựng và gìn giữ môi trường trong lành, xứng đáng với đẳng cấp thương hiệu 5 sao của Tập đoàn đã đề ra.
          </p>

          <h4 style={{ fontSize: 17, fontWeight: 700, color: '#1E293B', marginBottom: 12 }}>
            Vingroup với cộng đồng
          </h4>
          <p style={{ fontSize: 15, color: '#4B5563', lineHeight: 1.8, marginBottom: 40 }}>
            Tập đoàn xây dựng văn hóa doanh nghiệp trên khát vọng tiên phong với niềm tự hào về giá trị trí tuệ, bản lĩnh và truyền thống nhân văn của người Việt. Văn hóa này không chỉ thể hiện trong chính sách phúc lợi dành cho người lao động, mà còn trong các hoạt động vì sự phát triển chung của cộng đồng xã hội.
          </p>

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

'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import BottomNav from '@/components/BottomNav'

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

const TABS = [
  {
    id: 'technology',
    title: 'CÔNG NGHỆ - CÔNG NGHIỆP',
    year: '2022',
    heading: 'CÔNG NGHỆ-\nCÔNG NGHIỆP',
    image: '/sector_tech.webp',
    intro: 'Vingroup đặt cho mình sứ mệnh “Vì một cuộc sống tốt đẹp hơn cho mọi người”, với 3 nhóm hoạt động trọng tâm là Công nghệ – Công nghiệp, Thương mại Dịch vụ, Thiện nguyện Xã hội.',
    brands: [
      {
        name: 'VinFast',
        image: '/tech_brand1.webp',
        desc: 'Là thương hiệu ô tô Việt Nam, VinFast hướng tầm nhìn trở thành hãng xe điện thông minh toàn cầu. VinFast đã đặt nền móng cho ngành công nghiệp sản xuất ô tô – xe máy điện tại Việt Nam, đồng thời đang nỗ lực góp phần thúc đẩy cuộc cách mạng xe điện trên toàn thế giới.\n\nVới triết lý “Khách hàng là trung tâm”, VinFast luôn không ngừng sáng tạo để tạo ra những sản phẩm đẳng cấp với mức giá tốt nhất và dịch vụ hậu mãi vượt trội, mang lại cơ hội sử dụng xe điện thông minh cho mọi người, góp phần kiến tạo một tương lai xanh, thông minh và bền vững.'
      },
      {
        name: 'VinSmart',
        image: '/tech_brand2.webp',
        desc: 'Được thành lập vào tháng 6/2018, Công ty Nghiên cứu và Sản xuất VinSmart là đơn vị tiên phong trong lĩnh vực công nghệ với sứ mệnh trở thành công ty công nghệ toàn cầu, kiến tạo những sản phẩm điện tử và công nghệ thông minh, chất lượng, ứng dụng trí tuệ nhân tạo AI và kết nối với các thiết bị trên nền tảng IoT.\n\nVinSmart tập trung phát triển các tính năng thông tin – giải trí – dịch vụ (Infotainment) và sản xuất linh kiện điện tử... phục vụ cho ngành công nghiệp ô tô điện thông minh; đồng thời đẩy mạnh việc nghiên cứu phát triển ứng dụng nhà thông minh, hệ thống thiết bị thông minh... cho các đô thị và thành phố thông minh.'
      },
      {
        name: 'VinAI',
        image: '/tech_brand3.webp',
        desc: 'Công ty Cổ phần Nghiên cứu và Ứng dụng Trí tuệ nhân tạo VinAI, tiền thân là Viện nghiên cứu Trí tuệ nhân tạo VinAI (thuộc Tập đoàn Vingroup), là đơn vị nghiên cứu AI hàng đầu thế giới có trụ sở chính tại thành phố Hà Nội, Việt Nam. VinAI có mạng lưới chuyên gia rộng khắp tại Hoa Kỳ, Úc, Pháp và khu vực Châu Á – Thái Bình Dương.\n\nSứ mệnh của VinAI là tiến hành nghiên cứu chuyên sâu về AI, xây dựng và phát triển các ứng dụng AI tại Việt Nam và thị trường toàn cầu.'
      },
      {
        name: 'VinBigdata',
        image: '/tech_brand4.webp',
        desc: 'Công ty Cổ phần VinBigData được thành lập trên nền tảng thành tựu nghiên cứu khoa học của Viện Nghiên cứu Dữ liệu lớn (thuộc Tập đoàn Vingroup) trong lĩnh vực Khoa Học Dữ Liệu và Trí Tuệ Nhân Tạo, đặc biệt về xử lý hình ảnh và ngôn ngữ. Một số sản phẩm nổi bật của công ty là Trợ lý ảo tiếng Việt ViVi, Camera thông minh, hệ thống hỗ trợ chẩn đoán ảnh y tế bằng AI - VinDr...\n\nTầm nhìn của VinBigData là trở thành công ty công nghệ cung cấp các giải pháp nền tảng và các sản phẩm tiên tiến dựa trên Dữ liệu lớn và Trí tuệ nhân tạo với sứ mệnh “Công nghệ Việt – Vì tương lai Việt”.'
      },
      {
        name: 'VinCSS',
        image: '/tech_brand5.webp',
        desc: 'Công ty TNHH Dịch vụ An ninh mạng VinCSS hoạt động chính trong lĩnh vực nghiên cứu – phát triển, sản xuất và cung cấp các sản phẩm, dịch vụ an ninh mạng toàn diện – thông minh – tự động và xác thực mạnh không mật khẩu.\n\nHiện tại, VinCSS đang cung cấp sản phẩm, dịch vụ trong bốn mảng: IT Security Services, VinCSS FIDO2 Ecosystem, IoT Security và Connected Car Security.'
      },
      {
        name: 'VinHMS',
        image: '/tech_brand6.webp',
        desc: 'VinHMS là công ty sản xuất và kinh doanh phần mềm, chuyên cung cấp những sản phẩm công nghệ chất lượng cao nhằm tối ưu hóa hoạt động kinh doanh của doanh nghiệp.\n\nMục tiêu của VinHMS là xây dựng những giải pháp mang tính đột phá về công nghệ, góp phần thúc đẩy chuyển đổi số trong nhiều lĩnh vực khác nhau.\n\nVinHMS hiện là đối tác chính thức của Expedia, Traveloka, Agoda, TripAdvisor, Google, Amazon Web Services... và là công ty đầu tiên tại Việt Nam trở thành hội viên của HTNG – Hiệp hội quốc tế định chuẩn giao thức cho các phần mềm của khách sạn.'
      }
    ]
  },
  {
    id: 'commerce',
    title: 'THƯƠNG MẠI DỊCH VỤ',
    year: '2022',
    heading: 'THƯƠNG MẠI\nDỊCH VỤ',
    image: '/sector_commerce.webp',
    intro: 'Với mảng Thương mại Dịch vụ – Vingroup tiếp tục đẩy mạnh, hoàn thiện và nâng cấp chất lượng cũng như hiệu quả hoạt động. Thương mại dịch vụ là hệ sinh thái quan trọng để hỗ trợ công tác nghiên cứu và thương mại hóa các sản phẩm công nghệ – công nghiệp.',
    brands: [
      {
        name: 'Vinhomes',
        desc: 'VINHOMES – HỆ THỐNG CĂN HỘ, BIỆT THỰ VÀ NHÀ PHỐ THƯƠMI MẠI VỚI DỊCH VỤ ĐẲNG CẤP\n\nVinhomes là thương hiệu bất động sản số 1 Việt Nam, hoạt động trong lĩnh vực phát triển, chuyển nhượng và vận hành bất động sản nhà ở phức hợp phân khúc trung và cao cấp. Các dự án của Vinhomes đều có vị trí đắc địa tại các tỉnh thành trọng điểm trên toàn quốc.\n\nVinhomes hướng tới mục tiêu không chỉ xây nhà mà còn kiến tạo môi trường sống văn minh, đẳng cấp để mỗi ngôi nhà ở Vinhomes thực sự là “Nơi hạnh phúc ngập tràn”.',
        image: '/commerce_brand1.webp'
      },
      {
        name: 'Vinpearl',
        desc: 'Tự hào là thương hiệu dẫn đầu, đại diện cho ngành khách sạn du lịch nghỉ dưỡng tại Việt Nam, Vinpearl mang trong mình sứ mệnh nâng tầm trải nghiệm nghỉ dưỡng, mang đến những kỳ nghỉ 5 sao cho du khách Việt Nam và du khách quốc tế. Các cơ sở khách sạn, biệt thự nghỉ dưỡng, các khu vui chơi giải trí của Vinpearl trải dài trên mảnh đất hơn 3000 km đường bờ biển. Mỗi lựa chọn điểm đến tại Vinpearl sẽ là một điểm dừng chân lý tưởng để nhận trọn vẹn vẻ đẹp của từng thắng cảnh địa phương.',
        image: '/commerce_brand2.webp'
      }
    ]
  },
  {
    id: 'social',
    title: 'THIỆN NGUYỆN XÃ HỘI',
    year: '2022',
    heading: 'THIỆN NGUYỆN\nXÃ HỘI',
    image: '/sector_social.webp',
    intro: 'Vingroup đặt cho mình sứ mệnh “Vì một cuộc sống tốt đẹp hơn cho mọi người”, với 3 nhóm hoạt động trọng tâm là Công nghệ – Công nghiệp, Thương mại Dịch vụ, Thiện nguyện Xã hội.',
    brands: [
      {
        name: 'Vinschool',
        image: '/social_brand1.webp',
        desc: 'Vinschool là hệ thống giáo dục không vì lợi nhuận, liên cấp từ bậc mầm non đến Trung học phổ thông do Tập đoàn Vingroup dẫn đầu tư phát triển, hướng đến một ngôi trường Việt Nam mang đẳng cấp quốc tế. Ra đời từ năm 2013, Vinschool được đầu tư bài bản về cơ sở hạ tầng, chất lượng giáo viên và chương trình học, trở thành hệ thống giáo dục tư thục lớn nhất Việt Nam.\n\nVinschool mang sứ mệnh ươm mầm tinh hoa, đào tạo học sinh trở thành những công dân có trách nhiệm, có hoài bão với đầy đủ phẩm chất và năng lực để sống hạnh phúc, thành công, góp phần tích cực xây dựng đất nước và hội nhập quốc tế.'
      },
      {
        name: 'Vinmec',
        image: '/social_brand2.webp',
        desc: 'Vinmec là hệ thống y tế không vì lợi nhuận do Tập đoàn Vingroup đầu tư phát triển, với tầm nhìn trở thành một hệ thống y tế hàn lâm vươn tầm quốc tế thông qua những nghiên cứu đột phá, nhằm mang lại chất lượng điều trị xuất sắc và dịch vụ chăm sóc hoàn hảo.\n\nRa đời năm 2012, Vinmec có đội ngũ Giáo sư, Tiến sĩ, Bác sĩ giàu kinh nghiệm, cơ sở hạ tầng vượt trội, hệ thống thiết bị tối tân, công nghệ khám chữa bệnh hiện đại. Hiện Vinmec sở hữu hệ thống bệnh viện và phòng khám đa khoa tiêu chuẩn quốc tế tại nhiều tỉnh, thành phố lớn trên cả nước như Hà Nội, TP.HCM, Nha Trang, Phú Quốc... Vinmec Central Park đạt JCI (Joint Commission International) - chứng chỉ an toàn bệnh viện khắt khe nhất thế giới, tạo ra giá trị khác biệt trong chăm sóc sức khỏe tiêu chuẩn quốc tế tại Việt Nam.'
      },
      {
        name: 'VinUni',
        image: '/social_brand3.webp',
        desc: 'Trường Đại học VinUniversity (VinUni) là trường đại học tinh hoa, tư thục, không vì lợi nhuận do Tập đoàn Vingroup sáng lập với khát vọng đào tạo nhân tài cho tương lai và đóng góp cho đất nước một đại học xuất sắc mang đẳng cấp thế giới.\n\nMục tiêu của VinUni là trở thành một trong 50 trường Đại học trẻ hàng đầu thế giới. Trường đã hợp tác chiến lược toàn diện với 2 trong số Top 20 Đại học tốt nhất toàn cầu là Đại học Cornell và Đại học Pennsylvania, đồng thời có thỏa thuận đào tạo tích hợp song bằng với các đại học lớn về các chuyên ngành như quản trị kinh doanh và y khoa.'
      },
      {
        name: 'VinFuture',
        image: '/social_brand4.webp',
        desc: 'Quỹ VinFuture là một quỹ độc lập, không vì lợi nhuận tại Việt Nam, do ông Phạm Nhật Vượng – Chủ tịch Tập đoàn Vingroup và phu nhân – bà Phạm Thu Hương sáng lập và tài trợ. Sứ mệnh của Quỹ VinFuture là xây dựng một tương lai tươi đẹp, nơi nghiên cứu khoa học và đổi mới công nghệ có mục tiêu phụng sự con người, thúc đẩy các thay đổi tíchrx cực cho cuộc sống và tạo ra một thế giới công bằng và bền vững hơn cho các thế hệ sau.\n\nHoạt động cốt lõi của Quỹ là tổ chức Giải thưởng VinFuture – giải thưởng Khoa học và Công nghệ toàn cầu đầu tiên do người Việt Nam khởi xướng và là một trong những giải thưởng niên có giá trị lớn nhất thế giới.'
      },
      {
        name: 'Quỹ Thiện Tâm',
        image: '/social_brand5.webp',
        desc: 'Quỹ Thiện Tâm là một tổ chức phi lợi nhuận thuộc Tập đoàn Vingroup, hoạt động vì mục đích nhân đạo, từ thiện, nhằm “chuyển tải một cách nhanh chóng và hiệu quả nhất tấm lòng của người Vingroup đến với cộng đồng”.\n\nRa đời từ năm 2006, với toàn bộ chi phí hoạt động được tài trợ bởi Tập đoàn Vingroup và các nhà hảo tâm là lãnh đạo Tập đoàn Vingroup, đến nay Quỹ Thiện Tâm đã triển khai nhiều dự án, chương trình hành động thiết thực vì sự phát triển của cộng đồng, trong đó ưu tiên giúp đỡ các gia đình có hoàn cảnh đặc biệt khó khăn, gia đình có công với cách mạng như: Phụng dưỡng Mẹ Việt Nam anh hùng; Chăm lo các gia đình chính sách, gia đình có hoàn cảnh đặc biệt khó khăn; Giúp đỡ học sinh nghèo hiếu học; Hỗ trợ phát triển kinh tế cho các địa phương nghèo;'
      },
      {
        name: 'VinIF',
        image: '/social_brand6.webp',
        desc: 'Quỹ Đổi mới sáng tạo Vingroup (VINIF) thuộc Viện Nghiên cứu Dữ liệu lớn (VNCDLL) có mục tiêu hỗ trợ các nhà khoa học và các tài năng trẻ thuộc các Trường đại học và các Viện nghiên cứu đầu ngành tiến hành nghiên cứu khoa học công nghệ, kỹ thuật, y dược, kinh tế và giáo dục nhằm tạo ra những thay đổi tích cực và bền vững cho Việt Nam. Quỹ VinIF sẽ tài trợ cho các dự án và hoạt động nghiên cứu khoa học và đào tạo với định hướng đưa ra các sản phẩm, các giải pháp công nghệ mang lại lợi ích thiết thực cho cộng đồng.'
      },
      {
        name: 'VinBioCare',
        image: '/social_brand7.webp',
        desc: 'VinBioCare thành lập vào tháng 6 năm 2021 với sứ mệnh “Vì một tương lai an toàn cho cộng đồng”.\n\nTầm nhìn của VinBioCare là tiến tới xây dựng và tự chủ hệ sinh thái Nghiên cứu – Sản xuất – Đào tạo về Công nghệ Sinh học, dược phẩm công nghệ cao phục vụ cộng đồng.'
      },
      {
        name: 'VinBus',
        image: '/social_brand8.webp',
        desc: 'Công ty TNHH Dịch vụ vận tải VinBus được thành lập năm 2019, hoạt động trong lĩnh vực vận tải hành khách công cộng theo mô hình phi lợi nhuận.\n\nCông ty vận hành hệ thống giao thông công cộng bằng xe buýt điện đầu tiên tại Việt Nam, góp phần xây dựng hệ thống giao thông công cộng văn minh, hiện đại, giảm ô nhiễm không khí và tiếng ồn cho các đô thị lớn của Việt Nam.'
      }
    ]
  }
]

export default function LinhVucHoatDongPage() {
  const [activeTab, setActiveTab] = useState('technology')
  const [isMobile, setIsMobile] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  const [mounted, setMounted] = useState(false)
  const [isAppMode, setIsAppMode] = useState(false)

  useEffect(() => {
    setMounted(true)
    const loggedIn = localStorage.getItem('isLoggedIn') === 'true'
    setIsAppMode(loggedIn)

    document.title = "Lĩnh vực hoạt động - Quỹ Huy Động Vốn VINGROUP"
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 768)
    }
    checkMobile()
    window.addEventListener('resize', checkMobile)
    return () => window.removeEventListener('resize', checkMobile)
  }, [])

  const currentTab = TABS.find(t => t.id === activeTab) || TABS[0]

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  if (!mounted) {
    return null
  }

  if (isAppMode) {
    return (
      <div className="app-container" style={{ background: '#F8FAFC', minHeight: '100vh', paddingBottom: 90 }}>
        {/* Header */}
        <div style={{
          background: 'linear-gradient(135deg, #C8102E 0%, #A00D25 100%)',
          padding: '50px 20px 20px',
          color: 'white',
          position: 'sticky',
          top: 0,
          zIndex: 100
        }}>
          <div style={{ fontSize: 18, fontWeight: 800, textAlign: 'center' }}>Lĩnh Vực Hoạt Động</div>
          <div style={{ fontSize: 11, opacity: 0.8, textAlign: 'center', marginTop: 4 }}>
            Hệ sinh thái đa ngành Tập đoàn Vingroup
          </div>
        </div>

        {/* Tab switcher */}
        <div style={{
          display: 'flex',
          background: 'white',
          padding: '4px',
          margin: '16px',
          borderRadius: 12,
          border: '1px solid #E2E8F0',
          gap: 4
        }}>
          {TABS.map((tab) => {
            const isTabActive = tab.id === activeTab
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                style={{
                  flex: 1,
                  padding: '10px 4px',
                  border: 'none',
                  borderRadius: 10,
                  fontSize: 10,
                  fontWeight: 800,
                  background: isTabActive ? '#C8102E' : 'transparent',
                  color: isTabActive ? 'white' : '#64748B',
                  cursor: 'pointer',
                  transition: 'all 0.15s ease'
                }}
              >
                {tab.id === 'technology' ? '⚙️ CÔNG NGHỆ' : tab.id === 'commerce' ? '🏢 DỊCH VỤ' : '❤️ XÃ HỘI'}
              </button>
            )
          })}
        </div>

        {/* Intro */}
        <div style={{
          margin: '0 16px 16px',
          padding: '14px',
          background: '#F1F5F9',
          borderRadius: 12,
          fontSize: 12,
          color: '#475569',
          lineHeight: 1.5
        }}>
          {currentTab.intro}
        </div>

        {/* Brand list */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 14, padding: '0 16px' }}>
          {currentTab.brands.map((brand, bIdx) => (
            <div key={bIdx} style={{
              background: 'white',
              borderRadius: 14,
              padding: '16px',
              border: '1px solid #E2E8F0',
              boxShadow: '0 2px 4px rgba(0,0,0,0.02)'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 12 }}>
                {brand.image && (
                  <div style={{
                    width: 44,
                    height: 44,
                    borderRadius: 8,
                    overflow: 'hidden',
                    background: '#F8FAFC',
                    border: '1px solid #F1F5F9',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0
                  }}>
                    <img src={brand.image} alt={brand.name} style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
                  </div>
                )}
                <div>
                  <div style={{ fontSize: 15, fontWeight: 800, color: '#0F172A' }}>{brand.name}</div>
                  <div style={{ fontSize: 11, color: '#C8102E', fontWeight: 600, marginTop: 2 }}>Thương hiệu trực thuộc</div>
                </div>
              </div>
              <p style={{
                fontSize: 12,
                color: '#475569',
                lineHeight: 1.6,
                whiteSpace: 'pre-wrap',
                margin: 0
              }}>
                {brand.desc}
              </p>
            </div>
          ))}
        </div>

        <BottomNav />
      </div>
    )
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

      {/* Large Hero Image of Landmark 81 */}
      <div style={{ 
        width: '100%', 
        height: isMobile ? 220 : 540, 
        overflow: 'hidden',
        background: '#000'
      }}>
        <img 
          src="/sectors_hero.webp" 
          alt="Landmark 81 Vingroup sectors" 
          style={{ width: '100%', height: '100%', objectFit: 'cover' }}
        />
      </div>

      {/* Tab Menu Header Bar */}
      <div style={{
        background: '#F1F5F9',
        borderBottom: '1px solid #E2E8F0',
        width: '100%',
        boxSizing: 'border-box',
        padding: '0 20px'
      }}>
        <div style={{
          maxWidth: 1200,
          margin: '0 auto',
          display: 'flex',
          justifyContent: 'center',
          flexWrap: 'wrap',
          gap: isMobile ? 12 : 60
        }}>
          {TABS.map(tab => {
            const isActive = activeTab === tab.id
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                style={{
                  background: 'none',
                  border: 'none',
                  padding: isMobile ? '16px 8px' : '24px 20px',
                  fontSize: isMobile ? 12 : 14,
                  fontWeight: 700,
                  color: isActive ? '#e32823' : '#475569',
                  borderBottom: isActive ? '3px solid #e32823' : '3px solid transparent',
                  cursor: 'pointer',
                  outline: 'none',
                  transition: 'all 0.2s ease',
                  textTransform: 'uppercase'
                }}
              >
                {tab.title}
              </button>
            )
          })}
        </div>
      </div>

      {/* Detail Content Section */}
      <div style={{ 
        width: '100%', 
        boxSizing: 'border-box', 
        background: '#ffffff', 
        padding: isMobile ? '30px 16px 40px' : '60px 20px 60px' 
      }}>
        <div style={{ maxWidth: 1200, margin: '0 auto' }}>
          
          <h2 style={{
            fontSize: isMobile ? '1.8rem' : '2.5rem',
            fontFamily: "'Georgia', 'Times New Roman', serif",
            fontWeight: 400,
            color: '#1E293B',
            marginBottom: 40,
            textTransform: 'uppercase'
          }}>
            THÔNG TIN CHI TIẾT
          </h2>

          <div style={{
            display: 'grid',
            gridTemplateColumns: isMobile ? '1fr' : '55% 40%',
            gap: isMobile ? 32 : '5%',
            alignItems: 'start'
          }}>
            {/* Left side: Sector Image */}
            <div style={{ 
              width: '100%', 
              height: isMobile ? 220 : 380, 
              borderRadius: 12, 
              overflow: 'hidden',
              boxShadow: '0 4px 20px rgba(0,0,0,0.06)'
            }}>
              <img 
                src={currentTab.image} 
                alt={currentTab.title} 
                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
              />
            </div>

            {/* Right side: Title & Description */}
            <div style={{ display: 'flex', flexDirection: 'column' }}>
              <div style={{ 
                fontSize: isMobile ? 56 : 72, 
                fontWeight: 900, 
                color: '#E2E8F0', 
                lineHeight: 1,
                fontFamily: "'Georgia', 'Times New Roman', serif"
              }}>
                {currentTab.year}
              </div>
              <h3 style={{ 
                fontSize: isMobile ? '1.8rem' : '2.4rem', 
                fontWeight: 800, 
                color: '#1E293B', 
                lineHeight: 1.2,
                marginTop: 8,
                marginBottom: 20,
                textTransform: 'uppercase',
                whiteSpace: 'pre-line'
              }}>
                {currentTab.heading}
              </h3>
              <p style={{ 
                fontSize: 14.5, 
                color: '#4B5563', 
                lineHeight: 1.8,
                margin: 0
              }}>
                {currentTab.intro}
              </p>
            </div>
          </div>

        </div>
      </div>

      {/* Brands List Section */}
      <div style={{ 
        width: '100%', 
        boxSizing: 'border-box', 
        background: '#ffffff', 
        borderTop: '1px solid #F1F5F9',
        padding: isMobile ? '40px 16px 60px' : '60px 20px 100px' 
      }}>
        <div style={{ maxWidth: 1200, margin: '0 auto' }}>
          
          <h2 style={{
            fontSize: isMobile ? '1.8rem' : '2.5rem',
            fontFamily: "'Georgia', 'Times New Roman', serif",
            fontWeight: 400,
            color: '#1E293B',
            marginBottom: 40,
            textTransform: 'uppercase'
          }}>
            CÁC THƯƠNG HIỆU
          </h2>

          <div style={{
            display: 'grid',
            gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr 1fr',
            gap: 40
          }}>
            {currentTab.brands.map((brand, idx) => (
              <div 
                key={idx} 
                style={{ 
                  display: 'flex', 
                  flexDirection: 'column', 
                  alignItems: 'flex-start',
                  background: 'white',
                  borderRadius: 12,
                  overflow: 'hidden'
                }}
              >
                {/* Brand Logo/Image */}
                <div style={{ 
                  width: '100%', 
                  height: 240, 
                  borderRadius: 12,
                  overflow: 'hidden',
                  background: '#f8fafc',
                  marginBottom: 16,
                  boxShadow: '0 4px 12px rgba(0,0,0,0.04)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}>
                  <img 
                    src={brand.image} 
                    alt={brand.name} 
                    style={{ 
                      width: '100%', 
                      height: '100%', 
                      objectFit: (brand.name === 'VinFuture' || brand.name === 'Quỹ Thiện Tâm' || brand.name === 'VinIF' || brand.name === 'VinBus' || brand.name === 'VinAI' || brand.name === 'VinBigdata' || brand.name === 'VinCSS' || brand.name === 'VinHMS') ? 'contain' : 'cover',
                      padding: (brand.name === 'VinFuture' || brand.name === 'Quỹ Thiện Tâm' || brand.name === 'VinIF' || brand.name === 'VinBus' || brand.name === 'VinAI' || brand.name === 'VinBigdata' || brand.name === 'VinCSS' || brand.name === 'VinHMS') ? '20px' : '0'
                    }}
                  />
                </div>

                {/* Brand Name */}
                <h3 style={{ 
                  fontSize: 22, 
                  fontWeight: 'bold', 
                  color: '#475569', 
                  margin: '0 0 12px 0',
                  textAlign: 'center',
                  width: '100%'
                }}>
                  {brand.name}
                </h3>

                {/* Brand Description */}
                <p style={{ 
                  fontSize: 13.5, 
                  color: '#64748B', 
                  lineHeight: 1.8, 
                  margin: 0,
                  whiteSpace: 'pre-line'
                }}>
                  {brand.desc}
                </p>
              </div>
            ))}
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

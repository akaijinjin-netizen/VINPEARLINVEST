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

export const NEWS_POSTS = [
  {
    slug: 'giai-thuong-vinfuture-2023-vinh-danh-4-cong-trinh-khoa-hoc-chung-suc-toan-cau',
    title: 'GIẢI THƯỞNG VINFUTURE 2023 VINH DANH 4 CÔNG TRÌNH KHOA HỌC "CHUNG SỨC TOÀN CẦU" – QUỸ HUY ĐỘNG VỐN VINGROUP',
    category: 'Tin Vingroup',
    date: '25/12/2025',
    day: '25', month: 'Th12',
    image: '/news_tt99.webp',
    excerpt: 'Lễ trao giải thưởng Khoa học Công nghệ Toàn cầu VinFuture lần thứ 3 với chủ đề "Chung sức toàn cầu" đã chính thức diễn ra tại Nhà hát Hồ Gươm, Hà Nội.',
    content: [
      'Tối ngày 20/12/2023, Lễ trao giải thưởng Khoa học Công nghệ Toàn cầu VinFuture lần thứ 3 (VinFuture 2023) với chủ đề "Chung sức toàn cầu" đã chính thức diễn ra tại Nhà hát Hồ Gươm, Hà Nội.',
      'Giải thưởng Chính VinFuture 2023 vinh danh các nhà khoa học xuất sắc với công trình nghiên cứu đột phá, mang lại giá trị nhân văn sâu sắc cho nhân loại, góp phần giải quyết các thách thức toàn cầu như biến đổi khí hậu, an ninh năng lượng và sức khỏe cộng đồng.',
      'Sự kiện thu hút sự quan tâm lớn từ giới khoa học trong nước và quốc tế, khẳng định uy tín và tầm vóc của Việt Nam trên bản đồ khoa học công nghệ thế giới.'
    ]
  },
  {
    slug: 'vinfast-va-marubeni-hop-tac-tai-su-dung-pin-xe-dien',
    title: 'VINFAST VÀ MARUBENI HỢP TÁC TÁI SỬ DỤNG PIN XE ĐIỆN',
    category: 'Tin Vingroup',
    date: '25/12/2025',
    day: '25', month: 'Th12',
    image: '/news_tt8.webp',
    excerpt: 'Công ty TNHH Kinh doanh Thương mại và Dịch vụ VinFast và Tập đoàn Marubeni chính thức công bố ký kết Biên bản ghi nhớ hợp tác về việc nghiên cứu, tái sử dụng pin xe điện.',
    content: [
      'Công ty TNHH Kinh doanh Thương mại và Dịch vụ VinFast và Tập đoàn Marubeni (Nhật Bản) chính thức công bố ký kết Biên bản ghi nhớ hợp tác (MOU) về việc nghiên cứu, tái sử dụng pin xe điện.',
      'Sự hợp tác này nhằm mục đích xây dựng nền kinh tế tuần hoàn, tối ưu hóa vòng đời sản phẩm pin xe điện và góp phần giảm thiểu rác thải carbon trên toàn cầu.',
      'Theo thỏa thuận, VinFast và Marubeni sẽ hợp tác phát triển các hệ thống lưu trữ năng lượng bằng pin tái chế (BESS), mở ra cơ hội thương mại hóa và ứng dụng rộng rãi công nghệ xanh.'
    ]
  },
  {
    slug: 'human-act-prize-2023-vinh-danh-du-an-thien-nguyen-thuoc-dung-cho-em-cua-genestory',
    title: 'HUMAN ACT PRIZE 2023 VINH DANH DỰ ÁN THIỆN NGUYỆN "THUỐC ĐÚNG CHO EM" CỦA GENESTORY',
    category: 'Tin Vingroup',
    date: '25/12/2025',
    day: '25', month: 'Th12',
    image: '/news_tt7.webp',
    excerpt: 'Giải thưởng Hành động vì Cộng đồng – Human Act Prize 2023 đã chính thức vinh danh dự án thiện nguyện "Thuốc đúng cho em" do GeneStory nghiên cứu phát triển.',
    content: [
      'Giải thưởng Hành động vì Cộng đồng – Human Act Prize 2023 đã chính thức vinh danh dự án thiện nguyện "Thuốc đúng cho em" do GeneStory nghiên cứu phát triển.',
      'Dự án giúp phổ cập các xét nghiệm gen y học cá thể hóa, giúp trẻ em nghèo và người có hoàn cảnh khó khăn tiếp cận đúng loại thuốc điều trị bệnh phù hợp nhất, hạn chế tác dụng phụ và tối ưu hóa chi phí chữa trị.',
      'GeneStory cam kết đồng hành cùng cộng đồng để mang lại những giải pháp y tế số thông minh, nhân bản vì một tương lai an toàn cho tất cả mọi người.'
    ]
  },
  {
    slug: 'vinhomes-cong-bo-chien-luoc-nang-tam-chuan-song-cho-cu-dan',
    title: 'VINHOMES CÔNG BỐ CHIẾN LƯỢC NÂNG TẦM CHUẨN SỐNG CHO CƯ DÂN',
    category: 'Tin Vingroup',
    date: '25/12/2025',
    day: '25', month: 'Th12',
    image: '/news_tt6.webp',
    excerpt: 'Vinhomes chính thức công bố chiến lược "Sống vui khỏe" – một bước ngoặt trong hành trình nâng cao chất lượng cuộc sống cho cư dân tại các khu đô thị Vinhomes.',
    content: [
      'Vinhomes chính thức công bố chiến lược "Sống vui khỏe" – một bước ngoặt trong hành trình nâng cao chất lượng cuộc sống cho cư dân tại các khu đô thị Vinhomes trên khắp cả nước.',
      'Chiến lược này tập trung vào việc phát triển hệ sinh thái toàn diện bao gồm các tiện ích thể thao, sức khỏe, giải trí và cộng đồng – hướng đến trải nghiệm sống chất lượng cao, bền vững.',
      'Đây là cam kết dài hạn của Vinhomes trong việc kiến tạo môi trường sống xanh, thông minh và hài hòa cho hàng triệu cư dân trên khắp Việt Nam.'
    ]
  },
  {
    slug: 'vinfast-dai-dien-duy-nhat-cua-dong-nam-a-tham-luan-tai-dien-dan-thuong-mai-ben-vung-cop28',
    title: 'VINFAST – ĐẠI DIỆN DUY NHẤT CỦA ĐÔNG NAM Á – THAM LUẬN TẠI DIỄN ĐÀN THƯƠNG MẠI BỀN VỮNG – COP28',
    category: 'Tin Vingroup',
    date: '25/12/2025',
    day: '25', month: 'Th12',
    image: '/news_tt5.webp',
    excerpt: 'VinFast vinh dự là đại diện duy nhất của Đông Nam Á tham luận tại Diễn đàn Thương mại Bền vững trong khuôn khổ Hội nghị COP28 tổ chức tại Dubai.',
    content: [
      'VinFast vinh dự là đại diện duy nhất của Đông Nam Á tham luận tại Diễn đàn Thương mại Bền vững trong khuôn khổ Hội nghị COP28 tổ chức tại Dubai, UAE.',
      'Tại diễn đàn, đại diện VinFast đã trình bày về lộ trình chuyển đổi xanh của doanh nghiệp Việt Nam, cũng như tầm nhìn phát triển xe điện bền vững phục vụ thị trường toàn cầu.',
      'Sự hiện diện của VinFast tại COP28 khẳng định vị thế của thương hiệu xe điện Việt Nam trên trường quốc tế, đồng thời minh chứng cho cam kết của Tập đoàn Vingroup đối với phát triển bền vững.'
    ]
  },
  {
    slug: 'xanh-sm-ra-mat-dich-vu-giao-hang-xanh-express',
    title: 'XANH SM RA MẮT DỊCH VỤ GIAO HÀNG XANH EXPRESS',
    category: 'Tin Vingroup',
    date: '25/12/2025',
    day: '25', month: 'Th12',
    image: '/news_tt3.webp',
    excerpt: 'Xanh SM chính thức ra mắt dịch vụ giao hàng Xanh Express – sử dụng 100% xe điện, góp phần giảm phát thải khí carbon và nâng cao trải nghiệm giao hàng nhanh chóng, thân thiện môi trường.',
    content: [
      'Xanh SM chính thức ra mắt dịch vụ giao hàng Xanh Express – sử dụng 100% xe điện, góp phần giảm phát thải khí carbon và nâng cao trải nghiệm giao hàng nhanh chóng, thân thiện môi trường.',
      'Dịch vụ Xanh Express hướng đến phục vụ nhu cầu giao hàng nhanh trong nội đô, với thời gian giao hàng cam kết tối thiểu và chi phí cạnh tranh, hoàn toàn sử dụng đội xe máy điện VinFast.',
      'Đây là một trong những bước đi chiến lược của Xanh SM nhằm mở rộng hệ sinh thái di chuyển xanh, đóng góp vào mục tiêu phát thải ròng bằng 0 của Tập đoàn Vingroup.'
    ]
  },
  {
    slug: 'tap-doan-tai-chinh-phat-trien-quoc-te-my-ky-y-dinh-thu-tai-tro-500-trieu-usd-cho-vinfast',
    title: 'TẬP ĐOÀN TÀI CHÍNH PHÁT TRIỂN QUỐC TẾ MỸ KÝ Ý ĐỊNH THƯ TÀI TRỢ 500 TRIỆU USD CHO VINFAST',
    category: 'Tin Vingroup',
    date: '25/12/2025',
    day: '25', month: 'Th12',
    image: '/news_tt4.webp',
    excerpt: 'Tập đoàn Tài chính Phát triển Quốc tế Mỹ (DFC) đã ký kết Ý định thư tài trợ 500 triệu USD cho VinFast, đánh dấu bước đột phá trong hành trình chinh phục thị trường Mỹ.',
    content: [
      'Tập đoàn Tài chính Phát triển Quốc tế Mỹ (DFC) đã ký kết Ý định thư tài trợ 500 triệu USD cho VinFast, đánh dấu bước đột phá trong hành trình chinh phục thị trường Mỹ của thương hiệu xe điện Việt Nam.',
      'Khoản tài trợ này sẽ hỗ trợ VinFast xây dựng nhà máy sản xuất xe điện tại Bắc Carolina, Mỹ – một dự án có quy mô lên đến 4 tỷ USD và dự kiến tạo ra hàng nghìn việc làm.',
      'Đây là một trong những khoản đầu tư lớn nhất mà DFC dành cho doanh nghiệp Đông Nam Á, thể hiện sự tin tưởng của các nhà đầu tư Mỹ vào tiềm năng phát triển của VinFast trên thị trường toàn cầu.'
    ]
  },
  {
    slug: 'vinfast-chinh-thuc-nhan-dat-coc-xe-vf-7-uu-dai-30-trieu-cho-khach-hang-tien-phong',
    title: 'VINFAST CHÍNH THỨC NHẬN ĐẶT CỌC XE VF 7 – ƯU ĐÃI 30 TRIỆU CHO KHÁCH HÀNG TIÊN PHONG',
    category: 'Tin Vingroup',
    date: '25/12/2025',
    day: '25', month: 'Th12',
    image: '/news_tt2.webp',
    excerpt: 'VinFast chính thức mở đặt cọc xe VF 7 – mẫu SUV điện đa dụng với thiết kế hiện đại cùng nhiều ưu đãi hấp dẫn lên đến 30 triệu đồng dành cho khách hàng tiên phong.',
    content: [
      'VinFast chính thức mở đặt cọc xe VF 7 – mẫu SUV điện đa dụng với thiết kế hiện đại cùng nhiều ưu đãi hấp dẫn lên đến 30 triệu đồng dành cho khách hàng tiên phong.',
      'VF 7 sở hữu thiết kế thể thao, không gian rộng rãi và hệ thống công nghệ thông minh tiên tiến, phù hợp với nhu cầu di chuyển đô thị hiện đại của người Việt Nam.',
      'Chương trình ưu đãi 30 triệu đồng áp dụng cho các khách hàng đặt cọc trong giai đoạn đầu, kèm theo nhiều quyền lợi chăm sóc khách hàng đặc biệt khác từ VinFast.'
    ]
  },
  {
    slug: 'vinfast-la-dai-dien-doanh-nghiep-viet-nam-duy-nhat-phat-bieu-va-trung-bay-mau-xe-vinfast-vf-9-tai-cop28',
    title: 'VINFAST LÀ ĐẠI DIỆN DOANH NGHIỆP VIỆT NAM DUY NHẤT PHÁT BIỂU VÀ TRƯNG BÀY MẪU XE VINFAST VF 9 TẠI COP28',
    category: 'Tin Vingroup',
    date: '25/12/2025',
    day: '25', month: 'Th12',
    image: '/news_tt1.webp',
    excerpt: 'VinFast là doanh nghiệp Việt Nam duy nhất được mời phát biểu và trưng bày sản phẩm tại COP28, với mẫu xe SUV điện VF 9 thu hút sự chú ý đặc biệt từ các nhà lãnh đạo thế giới.',
    content: [
      'VinFast là doanh nghiệp Việt Nam duy nhất được mời phát biểu và trưng bày sản phẩm tại COP28 – Hội nghị Khí hậu Liên Hợp Quốc tổ chức tại Dubai, UAE.',
      'Mẫu xe SUV điện hạng sang VF 9 đã thu hút sự chú ý đặc biệt từ các nhà lãnh đạo thế giới và các đoàn đại biểu quốc tế tham dự hội nghị.',
      'Sự kiện này là cơ hội để VinFast giới thiệu cam kết của mình đối với phát triển bền vững và chiến lược xe điện toàn cầu, nâng cao hình ảnh Việt Nam trên trường quốc tế.'
    ]
  },
  {
    slug: 'gsm-khai-truong-dich-vu-taxi-dien-tai-lao-huong-toi-pho-cap-phuong-thuc-di-chuyen-xanh-tai-dong-nam-a',
    title: 'GSM KHAI TRƯƠNG DỊCH VỤ TAXI ĐIỆN TẠI LÀO, HƯỚNG TỚI PHỔ CẬP PHƯƠNG THỨC DI CHUYỂN XANH TẠI ĐÔNG NAM Á',
    category: 'Tin Vingroup',
    date: '25/12/2025',
    day: '25', month: 'Th12',
    image: '/news_tt12.webp',
    excerpt: 'GSM (Green and Smart Mobility) chính thức khai trương dịch vụ taxi điện tại Lào, đánh dấu bước mở rộng quan trọng của thương hiệu taxi điện Việt Nam ra thị trường Đông Nam Á.',
    content: [
      'GSM (Green and Smart Mobility) chính thức khai trương dịch vụ taxi điện tại Lào, đánh dấu bước mở rộng quan trọng của thương hiệu taxi điện Việt Nam ra thị trường Đông Nam Á.',
      'Với đội ngũ 100% xe điện VinFast, GSM Lào mang đến dịch vụ di chuyển xanh, thân thiện với môi trường, đồng thời góp phần giảm phát thải khí CO2 tại quốc gia láng giềng.',
      'Đây là bước tiếp nối sau thành công tại Việt Nam, thể hiện tầm nhìn dài hạn của GSM trong việc phổ cập phương thức di chuyển xanh trên toàn khu vực Đông Nam Á.'
    ]
  },
  {
    slug: 'vinfuture-cong-bo-tuan-le-khoa-hoc-cong-nghe-va-le-trao-giai-2023',
    title: 'VINFUTURE CÔNG BỐ TUẦN LỄ KHOA HỌC CÔNG NGHỆ VÀ LỄ TRAO GIẢI 2023',
    category: 'Tin Vingroup',
    date: '25/12/2025',
    day: '25', month: 'Th12',
    image: '/news_tt10.webp',
    excerpt: 'VinFuture chính thức công bố chương trình Tuần lễ Khoa học Công nghệ và Lễ trao giải VinFuture 2023, quy tụ hàng trăm nhà khoa học hàng đầu thế giới.',
    content: [
      'VinFuture chính thức công bố chương trình Tuần lễ Khoa học Công nghệ và Lễ trao giải VinFuture 2023, quy tụ hàng trăm nhà khoa học, nhà nghiên cứu hàng đầu thế giới.',
      'Sự kiện bao gồm nhiều tọa đàm khoa học, triển lãm công nghệ và các hoạt động giao lưu giữa các nhà khoa học quốc tế và cộng đồng khoa học Việt Nam.',
      'VinFuture Prize được xem là một trong những giải thưởng khoa học có giá trị lớn nhất châu Á, hướng đến tôn vinh các công trình nghiên cứu có tác động tích cực đến cuộc sống của hàng triệu người.'
    ]
  },
  {
    slug: 'vingroup-phat-dong-cuoc-thi-hung-bien-tranh-bien-tieng-noi-xanh',
    title: 'VINGROUP PHÁT ĐỘNG CUỘC THI HÙNG BIỆN – TRANH BIỆN "TIẾNG NÓI XANH"',
    category: 'Tin Vingroup',
    date: '25/12/2025',
    day: '25', month: 'Th12',
    image: '/news_tt11.webp',
    excerpt: 'Vingroup phát động cuộc thi hùng biện – tranh biện mang chủ đề "Tiếng nói xanh" dành cho học sinh, sinh viên trên toàn quốc, nhằm lan tỏa thông điệp về phát triển bền vững.',
    content: [
      'Vingroup phát động cuộc thi hùng biện – tranh biện mang chủ đề "Tiếng nói xanh" dành cho học sinh, sinh viên trên toàn quốc, nhằm lan tỏa thông điệp về phát triển bền vững và bảo vệ môi trường.',
      'Cuộc thi thu hút sự tham gia của hàng nghìn thí sinh đến từ các trường đại học, cao đẳng và phổ thông trên cả nước, thể hiện sự quan tâm mạnh mẽ của giới trẻ đối với các vấn đề về môi trường.',
      'Đây là một trong những hoạt động nằm trong chương trình trách nhiệm xã hội của Vingroup, hướng đến xây dựng thế hệ trẻ có ý thức và trách nhiệm với môi trường và cộng đồng.'
    ]
  }
]

export default function TinTucSuKienPage() {
  const [isMobile, setIsMobile] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)

  useEffect(() => {
    document.title = "Tin tức sự kiện - Quỹ Huy Động Vốn VINGROUP"
    const checkMobile = () => setIsMobile(window.innerWidth <= 768)
    checkMobile()
    window.addEventListener('resize', checkMobile)
    return () => window.removeEventListener('resize', checkMobile)
  }, [])

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
                        <div style={{ position: 'absolute', left: '50%', top: '50%', transform: 'translate(-50%, -50%)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <img src="/logo.png" alt="Vingroup Logo" style={{ height: 42, objectFit: 'contain' }} />
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
        <div style={{ maxWidth: 1200, margin: '0 auto' }}>
          <h2 style={{ fontSize: isMobile ? '1.8rem' : '2.5rem', fontFamily: "'Georgia', 'Times New Roman', serif", fontWeight: 400, color: '#1E293B', marginBottom: 30, textTransform: 'uppercase' }}>
            TIN TỨC SỰ KIỆN
          </h2>
          <h3 style={{ fontSize: isMobile ? '1.4rem' : '1.8rem', fontFamily: "'Georgia', 'Times New Roman', serif", fontWeight: 400, color: '#e32823', textTransform: 'uppercase', marginBottom: 30, borderBottom: '1px solid #E2E8F0', paddingBottom: 12 }}>
            SỰ KIỆN NỔI BẬT
          </h3>

          {/* Grid – 12 bài chia 3 cột */}
          <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr 1fr', gap: 40 }}>
            {NEWS_POSTS.map((post, idx) => (
              <Link key={idx} href={`/tin-tuc-su-kien/${post.slug}`}
                style={{ display: 'flex', flexDirection: 'column', textDecoration: 'none', color: 'inherit', cursor: 'pointer' }}>
                <div style={{ width: '100%', height: 220, borderRadius: 12, overflow: 'hidden', background: '#f8fafc', marginBottom: 16, boxShadow: '0 4px 12px rgba(0,0,0,0.04)' }}>
                  <img src={post.image} alt={post.title}
                    style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'transform 0.3s ease' }}
                    onMouseOver={e => e.currentTarget.style.transform = 'scale(1.05)'}
                    onMouseOut={e => e.currentTarget.style.transform = 'scale(1)'}
                  />
                </div>
                <span style={{ fontSize: 12, fontWeight: 700, color: '#e32823', marginBottom: 8, textTransform: 'uppercase' }}>{post.category}</span>
                <h4 style={{ fontSize: 14, fontWeight: 700, lineHeight: 1.5, color: '#1E293B', margin: '0 0 10px 0', minHeight: 44, display: '-webkit-box', WebkitLineClamp: 3, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                  {post.title}
                </h4>
                <span style={{ fontSize: 11, color: '#94A3B8' }}>{post.date}</span>
              </Link>
            ))}
          </div>
        </div>
      </div>

      {/* Footer */}
      <div style={{ background: '#F8FAFC', borderTop: '1px solid #E2E8F0', padding: isMobile ? '40px 16px' : '50px 20px 40px', width: '100%', boxSizing: 'border-box', marginTop: 'auto' }}>
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

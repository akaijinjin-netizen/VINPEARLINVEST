'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'

const HomeIcon = ({ active }: { active: boolean }) => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M3 9.5L12 3L21 9.5V20C21 20.5523 20.5523 21 20 21H15V15H9V21H4C3.44772 21 3 20.5523 3 20V9.5Z"
      fill={active ? '#C8102E' : 'none'}
      stroke={active ? '#C8102E' : '#9CA3AF'}
      strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M9 21V15H15V21" stroke={active ? '#C8102E' : '#9CA3AF'} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
)

const ChartIcon = ({ active }: { active: boolean }) => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect x="3" y="13" width="4" height="8" rx="1"
      fill={active ? '#C8102E' : 'none'}
      stroke={active ? '#C8102E' : '#9CA3AF'} strokeWidth="1.8"/>
    <rect x="10" y="8" width="4" height="13" rx="1"
      fill={active ? '#C8102E' : 'none'}
      stroke={active ? '#C8102E' : '#9CA3AF'} strokeWidth="1.8"/>
    <rect x="17" y="3" width="4" height="18" rx="1"
      fill={active ? '#C8102E' : 'none'}
      stroke={active ? '#C8102E' : '#9CA3AF'} strokeWidth="1.8"/>
  </svg>
)

const InfoIcon = ({ active }: { active: boolean }) => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <circle cx="12" cy="12" r="9"
      fill={active ? '#C8102E' : 'none'}
      stroke={active ? '#C8102E' : '#9CA3AF'} strokeWidth="1.8"/>
    <path d="M12 11V16" stroke={active ? 'white' : '#9CA3AF'} strokeWidth="2" strokeLinecap="round"/>
    <circle cx="12" cy="8" r="1" fill={active ? 'white' : '#9CA3AF'}/>
  </svg>
)

const UserIcon = ({ active }: { active: boolean }) => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <circle cx="12" cy="8" r="4"
      fill={active ? '#C8102E' : 'none'}
      stroke={active ? '#C8102E' : '#9CA3AF'} strokeWidth="1.8"/>
    <path d="M4 20C4 17 7.58172 15 12 15C16.4183 15 20 17 20 20"
      stroke={active ? '#C8102E' : '#9CA3AF'} strokeWidth="1.8" strokeLinecap="round"/>
  </svg>
)

const NAV_ITEMS = [
  { href: '/trang-chu', label: 'Trang Chủ', Icon: HomeIcon },
  { href: '/dau-tu', label: 'Đầu Tư', Icon: ChartIcon },
  { href: '/linh-vuc-hoat-dong', label: 'Lĩnh Vực', Icon: InfoIcon },
  { href: '/cua-toi', label: 'Của Tôi', Icon: UserIcon },
]

export default function BottomNav() {
  const pathname = usePathname()

  if (pathname === '/cskh' || pathname.startsWith('/admin')) {
    return null
  }

  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: `
        @keyframes pulseChat {
          0% { box-shadow: 0 0 0 0 rgba(0, 104, 255, 0.4); }
          70% { box-shadow: 0 0 0 12px rgba(0, 104, 255, 0); }
          100% { box-shadow: 0 0 0 0 rgba(0, 104, 255, 0); }
        }
      ` }} />

      {/* Floating Chat Bubble */}
      <Link
        href="/cskh"
        style={{
          position: 'fixed',
          bottom: 80,
          right: 'max(16px, calc(50% - 215px + 16px))',
          width: 56,
          height: 56,
          borderRadius: '50%',
          background: 'linear-gradient(135deg, #0068ff 0%, #0053cc 100%)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          boxShadow: '0 6px 20px rgba(0, 104, 255, 0.4)',
          zIndex: 9998,
          cursor: 'pointer',
          transition: 'transform 0.2s ease, box-shadow 0.2s ease',
          animation: 'pulseChat 2s infinite'
        }}
      >
        <span style={{ fontSize: 11, fontWeight: 900, color: 'white', letterSpacing: '0.2px' }}>CSKH</span>
        {/* Pulsing online dot */}
        <span style={{
          position: 'absolute',
          top: 2,
          right: 2,
          width: 12,
          height: 12,
          borderRadius: '50%',
          background: '#22C55E',
          border: '2px solid white'
        }} />
      </Link>

      <nav style={{
      position: 'fixed',
      bottom: 0,
      left: '50%',
      transform: 'translateX(-50%)',
      width: '100%',
      maxWidth: 430,
      height: 64,
      background: 'rgba(255, 255, 255, 0.95)',
      backdropFilter: 'blur(10px)',
      display: 'flex',
      justifyContent: 'space-around',
      alignItems: 'center',
      borderTop: '1px solid #E2E8F0',
      boxShadow: '0 -4px 20px rgba(0, 0, 0, 0.04)',
      zIndex: 9999,
      paddingBottom: 'safe',
    }}>
      {NAV_ITEMS.map((item) => {
        const isActive = pathname === item.href || (item.href !== '/trang-chu' && pathname.startsWith(item.href))
        return (
          <Link
            key={item.href}
            href={item.href}
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              textDecoration: 'none',
              gap: 4,
              flex: 1,
              height: '100%',
            }}
          >
            <item.Icon active={isActive} />
            <span style={{
              fontSize: 10,
              fontWeight: isActive ? 800 : 500,
              color: isActive ? '#C8102E' : '#9CA3AF',
              transition: 'color 0.15s ease',
            }}>
              {item.label}
            </span>
          </Link>
        )
      })}
    </nav>
    </>
  )
}

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
  { href: '/home', label: 'Trang Chủ', Icon: HomeIcon },
  { href: '/invest', label: 'Đầu Tư', Icon: ChartIcon },
  { href: '/about', label: 'Giới Thiệu', Icon: InfoIcon },
  { href: '/profile', label: 'Của Tôi', Icon: UserIcon },
]

export default function BottomNav() {
  const pathname = usePathname()

  return (
    <nav style={{
      position: 'fixed',
      bottom: 0,
      left: '50%',
      transform: 'translateX(-50%)',
      width: '100%',
      maxWidth: 430,
      background: 'white',
      borderTop: '1px solid #F0F0F0',
      display: 'flex',
      zIndex: 100,
      boxShadow: '0 -2px 16px rgba(0,0,0,0.06)',
      paddingBottom: 'env(safe-area-inset-bottom, 0px)',
    }}>
      {NAV_ITEMS.map(({ href, label, Icon }) => {
        const active = pathname === href || pathname.startsWith(href + '/')
        return (
          <Link
            key={href}
            href={href}
            style={{
              flex: 1,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              padding: '10px 4px 12px',
              textDecoration: 'none',
              gap: 4,
              position: 'relative',
            }}
          >
            {/* Active indicator */}
            {active && (
              <div style={{
                position: 'absolute',
                top: 0,
                left: '50%',
                transform: 'translateX(-50%)',
                width: 32,
                height: 3,
                background: '#C8102E',
                borderRadius: '0 0 4px 4px',
              }} />
            )}
            <Icon active={active} />
            <span style={{
              fontSize: 10,
              fontWeight: active ? 700 : 500,
              color: active ? '#C8102E' : '#9CA3AF',
              letterSpacing: 0.2,
              fontFamily: 'inherit',
            }}>
              {label}
            </span>
          </Link>
        )
      })}
    </nav>
  )
}

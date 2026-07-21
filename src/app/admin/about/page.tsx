'use client'

import { useState } from 'react'
import { SEED_ABOUT } from '@/lib/data/projects'

export default function AdminAboutPage() {
  const [title, setTitle] = useState(SEED_ABOUT.title)
  const [content, setContent] = useState(SEED_ABOUT.content)
  const [imageUrl, setImageUrl] = useState(SEED_ABOUT.image_url)
  const [saved, setSaved] = useState(false)

  const handleSave = () => {
    setSaved(true)
    setTimeout(() => setSaved(false), 3000)
  }

  return (
    <div>
      <div style={{ marginBottom: 24 }}>
        <h1 style={{ fontSize: 24, fontWeight: 800, color: '#0F172A' }}>Quản lý Trang giới thiệu</h1>
        <p style={{ fontSize: 14, color: '#6B7280', marginTop: 4 }}>Chỉnh sửa bài viết giới thiệu Tập đoàn hiển thị trên App người dùng</p>
      </div>

      {saved && (
        <div style={{
          background: '#ECFDF5', border: '1px solid #A7F3D0',
          borderRadius: 10, padding: '14px 20px', marginBottom: 24,
          color: '#059669', fontSize: 14, fontWeight: 600
        }}>
          ✓ Đã cập nhật nội dung bài viết thành công!
        </div>
      )}

      <div style={{ background: 'white', borderRadius: 16, padding: '24px', border: '1px solid #E5E7EB', maxWidth: 800 }}>
        {/* Title */}
        <div style={{ marginBottom: 20 }}>
          <label style={{ fontSize: 13, fontWeight: 600, color: '#374151', display: 'block', marginBottom: 8 }}>
            Tiêu đề bài viết
          </label>
          <input
            value={title}
            onChange={e => setTitle(e.target.value)}
            style={{
              width: '100%', padding: '10px 14px', border: '1.5px solid #E5E7EB',
              borderRadius: 10, fontSize: 16, fontWeight: 700, outline: 'none', boxSizing: 'border-box'
            }}
          />
        </div>

        {/* Image URL */}
        <div style={{ marginBottom: 20 }}>
          <label style={{ fontSize: 13, fontWeight: 600, color: '#374151', display: 'block', marginBottom: 8 }}>
            URL Ảnh đại diện
          </label>
          <input
            value={imageUrl}
            onChange={e => setImageUrl(e.target.value)}
            style={{
              width: '100%', padding: '10px 14px', border: '1.5px solid #E5E7EB',
              borderRadius: 10, fontSize: 14, outline: 'none', boxSizing: 'border-box'
            }}
          />
        </div>

        {/* Content */}
        <div style={{ marginBottom: 24 }}>
          <label style={{ fontSize: 13, fontWeight: 600, color: '#374151', display: 'block', marginBottom: 8 }}>
            Nội dung bài viết (Hỗ trợ xuống dòng)
          </label>
          <textarea
            value={content}
            onChange={e => setContent(e.target.value)}
            rows={12}
            style={{
              width: '100%', padding: '12px 14px', border: '1.5px solid #E5E7EB',
              borderRadius: 10, fontSize: 14, lineHeight: 1.6, outline: 'none',
              resize: 'vertical', fontFamily: 'inherit', boxSizing: 'border-box'
            }}
          />
        </div>

        {/* Submit */}
        <button
          onClick={handleSave}
          style={{
            background: 'linear-gradient(135deg, #C8102E, #A00D25)',
            color: 'white', border: 'none', borderRadius: 10,
            padding: '14px 28px', fontSize: 15, fontWeight: 700,
            cursor: 'pointer', boxShadow: '0 4px 14px rgba(200,16,46,0.25)'
          }}
        >
          💾 Lưu thay đổi
        </button>
      </div>
    </div>
  )
}

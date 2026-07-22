'use client'

import { useState, useEffect, useRef, Suspense } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/client'

type ChatMessage = {
  id: string
  sender_phone: string
  sender_type: 'user' | 'admin'
  message: string
  image_url?: string
  created_at: string
}

function ChatContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [messages, setMessages] = useState<ChatMessage[]>([])
  const [inputText, setInputText] = useState('')
  const [phone, setPhone] = useState('')
  const [isUploading, setIsUploading] = useState(false)
  
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  // 1. Get phone number of user or redirect
  useEffect(() => {
    const urlPhone = searchParams.get('phone') || ''
    const storedCskhPhone = localStorage.getItem('cskhPhone') || ''
    const storedUserPhone = localStorage.getItem('userPhone') || ''
    
    const activePhone = urlPhone || storedCskhPhone || storedUserPhone
    
    if (activePhone) {
      setPhone(activePhone)
      localStorage.setItem('cskhPhone', activePhone)
    } else {
      router.push('/dang-nhap')
    }
  }, [searchParams, router])

  // 2. Fetch history and setup Supabase Realtime listener
  useEffect(() => {
    if (!phone) return

    const supabase = createClient()

    async function loadChatHistory() {
      const { data, error } = await supabase
        .from('chat_messages')
        .select('*')
        .eq('sender_phone', phone)
        .order('created_at', { ascending: true })

      if (!error && data) {
        setMessages(data)
      }
    }

    loadChatHistory()

    // Setup realtime subscription
    const channel = supabase
      .channel(`chat_messages_${phone}`)
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'chat_messages',
          filter: `sender_phone=eq.${phone}`,
        },
        (payload) => {
          const newMsg = payload.new as ChatMessage
          setMessages((prev) => {
            // Prevent duplicate messages in state
            if (prev.some((m) => m.id === newMsg.id)) return prev
            return [...prev, newMsg]
          })
        }
      )
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [phone])

  // 3. Scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  // 4. Handle text message send
  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!inputText.trim() || !phone) return

    const messageContent = inputText.trim()
    setInputText('')

    const supabase = createClient()
    const { error } = await supabase
      .from('chat_messages')
      .insert({
        sender_phone: phone,
        sender_type: 'user',
        message: messageContent,
      })

    if (error) {
      console.error('Error sending message:', error)
    }
  }

  // 5. Handle image upload
  const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file || !phone) return

    setIsUploading(true)
    const reader = new FileReader()
    reader.onloadend = async () => {
      const base64String = reader.result as string
      const supabase = createClient()
      
      const { error } = await supabase
        .from('chat_messages')
        .insert({
          sender_phone: phone,
          sender_type: 'user',
          message: '📷 Gửi một ảnh đính kèm',
          image_url: base64String
        })

      setIsUploading(false)
      if (error) {
        console.error('Error sending image:', error)
      }
    }
    reader.readAsDataURL(file)
  }

  return (
    <div style={{
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      minHeight: '100vh',
      background: '#F1F5F9',
      fontFamily: "'Segoe UI', Roboto, Helvetica, Arial, sans-serif",
      padding: '10px',
      width: '100%'
    }}>
      <div style={{
        width: '100%',
        maxWidth: 550,
        height: '92vh',
        background: 'white',
        borderRadius: 16,
        boxShadow: '0 10px 25px rgba(0,0,0,0.1)',
        display: 'flex',
        flexDirection: 'column',
        overflow: 'hidden',
        position: 'relative'
      }}>
        {/* Header */}
        <div style={{
          background: '#0068ff',
          padding: '16px 20px',
          display: 'flex',
          alignItems: 'center',
          gap: 12,
          color: 'white',
          position: 'relative',
          boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
        }}>
          {/* Back button */}
          <Link href="/trang-chu" style={{
            color: 'white',
            textDecoration: 'none',
            fontSize: 20,
            cursor: 'pointer',
            padding: '2px 8px',
            background: 'rgba(255,255,255,0.15)',
            borderRadius: 8
          }}>
            ←
          </Link>
          <div style={{
            width: 40,
            height: 40,
            borderRadius: '50%',
            background: '#e32823',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            border: '2px solid white',
            flexShrink: 0
          }}>
            <img src="/top-brand-logo.png" alt="Logo" style={{ width: 24, height: 24, objectFit: 'contain' }} />
          </div>
          <div>
            <div style={{ fontSize: 16, fontWeight: 800 }}>Vingroup CSKH</div>
            <div style={{ fontSize: 11, opacity: 0.85 }}>Hỗ trợ khách hàng trực tuyến 24/7</div>
          </div>
        </div>

        {/* Message List Area */}
        <div style={{
          flex: 1,
          padding: '20px',
          overflowY: 'auto',
          background: '#F8FAFC',
          display: 'flex',
          flexDirection: 'column',
          gap: 16
        }}>
          {messages.length === 0 ? (
            <div style={{
              margin: 'auto',
              textAlign: 'center',
              color: '#64748B',
              padding: '20px',
              maxWidth: 320
            }}>
              <div style={{ fontSize: 44, marginBottom: 12 }}>💬</div>
              <div style={{ fontSize: 14, fontWeight: 700, marginBottom: 6 }}>Chào mừng bạn đến với Vingroup CSKH!</div>
              <div style={{ fontSize: 12, lineHeight: 1.5, opacity: 0.8 }}>
                Vui lòng gửi câu hỏi của bạn tại đây. Đội ngũ kỹ thuật và CSKH của Vingroup sẽ phản hồi bạn trong chốc lát.
              </div>
            </div>
          ) : (
            messages.map((msg) => {
              const isAdmin = msg.sender_type === 'admin'
              return (
                <div
                  key={msg.id}
                  style={{
                    display: 'flex',
                    flexDirection: isAdmin ? 'row' : 'row-reverse',
                    alignItems: 'flex-end',
                    gap: 8,
                    alignSelf: isAdmin ? 'flex-start' : 'flex-end',
                    maxWidth: '85%'
                  }}
                >
                  {isAdmin && (
                    <div style={{
                      width: 32,
                      height: 32,
                      borderRadius: '50%',
                      background: '#e32823',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      flexShrink: 0,
                      marginBottom: 2
                    }}>
                      <img src="/top-brand-logo.png" alt="Logo" style={{ width: 18, height: 18, objectFit: 'contain' }} />
                    </div>
                  )}
                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: isAdmin ? 'flex-start' : 'flex-end' }}>
                    <div style={{
                      background: isAdmin ? 'white' : '#E0F2FE',
                      color: '#0F172A',
                      padding: '12px 16px',
                      borderRadius: isAdmin ? '16px 16px 16px 4px' : '16px 16px 4px 16px',
                      boxShadow: '0 2px 4px rgba(0,0,0,0.02)',
                      fontSize: 14,
                      lineHeight: 1.5,
                      wordBreak: 'break-word'
                    }}>
                      {msg.image_url ? (
                        <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                          <img
                            src={msg.image_url}
                            alt="Hình ảnh đính kèm"
                            style={{ maxWidth: '100%', maxHeight: 240, borderRadius: 8, objectFit: 'contain' }}
                          />
                          {msg.message !== '📷 Gửi một ảnh đính kèm' && <div>{msg.message}</div>}
                        </div>
                      ) : (
                        msg.message
                      )}
                    </div>
                    <span style={{ fontSize: 9, color: '#94A3B8', marginTop: 4, padding: '0 4px' }}>
                      {new Date(msg.created_at).toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>
                </div>
              )
            })
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Loading Indicator */}
        {isUploading && (
          <div style={{
            position: 'absolute',
            bottom: 80,
            left: 20,
            background: 'rgba(0,0,0,0.7)',
            color: 'white',
            padding: '6px 12px',
            borderRadius: 20,
            fontSize: 12,
            zIndex: 10
          }}>
            ⏳ Đang tải ảnh lên...
          </div>
        )}

        {/* Message Input Form */}
        <form
          onSubmit={handleSendMessage}
          style={{
            padding: '16px',
            background: 'white',
            borderTop: '1px solid #F1F5F9',
            display: 'flex',
            alignItems: 'center',
            gap: 12
          }}
        >
          {/* Hidden Image Input */}
          <input
            type="file"
            accept="image/*"
            ref={fileInputRef}
            onChange={handleImageChange}
            style={{ display: 'none' }}
          />

          {/* Emoji button */}
          <button
            type="button"
            style={{
              background: 'none',
              border: 'none',
              fontSize: 22,
              cursor: 'pointer',
              opacity: 0.6
            }}
            onClick={() => setInputText((prev) => prev + '😊')}
          >
            😊
          </button>

          {/* Image Upload button */}
          <button
            type="button"
            style={{
              background: 'none',
              border: 'none',
              fontSize: 22,
              cursor: 'pointer',
              opacity: 0.6
            }}
            onClick={() => fileInputRef.current?.click()}
          >
            📷
          </button>

          <input
            type="text"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            placeholder="Vui lòng nhập..."
            style={{
              flex: 1,
              padding: '12px 16px',
              border: '1px solid #E2E8F0',
              borderRadius: 24,
              fontSize: 14,
              outline: 'none',
              background: '#F8FAFC'
            }}
          />

          <button
            type="submit"
            style={{
              background: '#0068ff',
              color: 'white',
              border: 'none',
              borderRadius: 24,
              padding: '10px 20px',
              fontSize: 14,
              fontWeight: 700,
              cursor: 'pointer',
              boxShadow: '0 4px 10px rgba(0,104,255,0.2)'
            }}
          >
            Gửi đi
          </button>
        </form>
      </div>
    </div>
  )
}

export default function CustomerCskhPage() {
  return (
    <Suspense fallback={
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        minHeight: '100vh',
        background: '#F1F5F9'
      }}>
        ⏳ Đang tải khung chát...
      </div>
    }>
      <ChatContent />
    </Suspense>
  )
}

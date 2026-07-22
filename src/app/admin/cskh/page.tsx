'use client'

import { useState, useEffect, useRef } from 'react'
import { createClient } from '@/lib/supabase/client'

type ChatMessage = {
  id: string
  sender_phone: string
  sender_type: 'user' | 'admin'
  message: string
  image_url?: string
  created_at: string
}

type Conversation = {
  phone: string
  lastMessage: string
  lastTime: string
  unreadCount: number
}

export default function AdminCskhPage() {
  const [conversations, setConversations] = useState<Conversation[]>([])
  const [activePhone, setActivePhone] = useState<string>('')
  const [messages, setMessages] = useState<ChatMessage[]>([])
  const [inputText, setInputText] = useState('')
  const [loading, setLoading] = useState(true)

  const messagesEndRef = useRef<HTMLDivElement>(null)

  // 1. Fetch conversations and load initial list
  useEffect(() => {
    const supabase = createClient()

    async function loadAllMessages() {
      const { data, error } = await supabase
        .from('chat_messages')
        .select('*')
        .order('created_at', { ascending: false })

      if (!error && data) {
        // Group by sender_phone
        const convoMap: { [key: string]: { msg: string; time: string } } = {}
        data.forEach((msg: ChatMessage) => {
          if (!convoMap[msg.sender_phone]) {
            convoMap[msg.sender_phone] = {
              msg: msg.image_url ? '📷 [Hình ảnh]' : msg.message,
              time: msg.created_at
            }
          }
        })

        const convoList = Object.keys(convoMap).map((phone) => ({
          phone,
          lastMessage: convoMap[phone].msg,
          lastTime: convoMap[phone].time,
          unreadCount: 0 // Simplification
        }))

        // Sort by lastTime desc
        convoList.sort((a, b) => new Date(b.lastTime).getTime() - new Date(a.lastTime).getTime())
        setConversations(convoList)
      }
      setLoading(false)
    }

    loadAllMessages()

    // Subscribe to all incoming messages
    const channel = supabase
      .channel('admin_global_chat')
      .on(
        'postgres_changes',
        { event: 'INSERT', schema: 'public', table: 'chat_messages' },
        (payload) => {
          const newMsg = payload.new as ChatMessage
          
          // Update conversation list
          setConversations((prev) => {
            const filtered = prev.filter((c) => c.phone !== newMsg.sender_phone)
            const updatedConvo: Conversation = {
              phone: newMsg.sender_phone,
              lastMessage: newMsg.image_url ? '📷 [Hình ảnh]' : newMsg.message,
              lastTime: newMsg.created_at,
              unreadCount: 0
            }
            return [updatedConvo, ...filtered]
          })

          // Append to active message screen if matches
          if (activePhone && newMsg.sender_phone === activePhone) {
            setMessages((prev) => {
              if (prev.some((m) => m.id === newMsg.id)) return prev
              return [...prev, newMsg]
            })
          }
        }
      )
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [activePhone])

  // 2. Fetch history for the active conversation
  useEffect(() => {
    if (!activePhone) {
      setMessages([])
      return
    }

    const supabase = createClient()

    async function loadActiveChatHistory() {
      const { data, error } = await supabase
        .from('chat_messages')
        .select('*')
        .eq('sender_phone', activePhone)
        .order('created_at', { ascending: true })

      if (!error && data) {
        setMessages(data)
      }
    }

    loadActiveChatHistory()
  }, [activePhone])

  // 3. Scroll to bottom when active conversation messages load or update
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  // 4. Send admin response
  const handleSendResponse = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!inputText.trim() || !activePhone) return

    const messageContent = inputText.trim()
    setInputText('')

    const supabase = createClient()
    const { error } = await supabase
      .from('chat_messages')
      .insert({
        sender_phone: activePhone,
        sender_type: 'admin',
        message: messageContent
      })

    if (error) {
      console.error('Error sending admin response:', error)
    }
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '80vh', width: '100%' }}>
      <div style={{ marginBottom: 16 }}>
        <h1 style={{ fontSize: 22, fontWeight: 800, color: '#0F172A' }}>🎧 Tổng đài CSKH Trực tuyến</h1>
        <p style={{ fontSize: 13, color: '#64748B', marginTop: 4 }}>
          Nhận và trả lời tin nhắn hỗ trợ từ khách hàng theo thời gian thực (Real-time).
        </p>
      </div>

      <div style={{
        display: 'flex',
        flex: 1,
        background: 'white',
        border: '1px solid #E2E8F0',
        borderRadius: 16,
        overflow: 'hidden',
        boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)'
      }}>
        {/* Left Sidebar: Conversations List */}
        <div style={{
          width: '320px',
          borderRight: '1px solid #E2E8F0',
          display: 'flex',
          flexDirection: 'column',
          background: '#F8FAFC'
        }}>
          <div style={{
            padding: '16px',
            borderBottom: '1px solid #E2E8F0',
            fontWeight: 800,
            fontSize: 14,
            color: '#0F172A'
          }}>
            Danh sách cuộc hội thoại ({conversations.length})
          </div>

          <div style={{ flex: 1, overflowY: 'auto', display: 'flex', flexDirection: 'column' }}>
            {loading ? (
              <div style={{ padding: 24, textAlign: 'center', color: '#64748B', fontSize: 13 }}>
                ⏳ Đang tải cuộc hội thoại...
              </div>
            ) : conversations.length === 0 ? (
              <div style={{ padding: 24, textAlign: 'center', color: '#94A3B8', fontSize: 13 }}>
                📭 Chưa có cuộc hội thoại nào.
              </div>
            ) : (
              conversations.map((convo) => (
                <div
                  key={convo.phone}
                  onClick={() => setActivePhone(convo.phone)}
                  style={{
                    padding: '14px 16px',
                    borderBottom: '1px solid #F1F5F9',
                    cursor: 'pointer',
                    background: activePhone === convo.phone ? '#EFF6FF' : 'transparent',
                    borderLeft: `3px solid ${activePhone === convo.phone ? '#2563EB' : 'transparent'}`,
                    transition: 'all 0.15s ease'
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 4 }}>
                    <span style={{ fontSize: 13, fontWeight: 700, color: '#1E293B' }}>📱 {convo.phone}</span>
                    <span style={{ fontSize: 10, color: '#94A3B8' }}>
                      {new Date(convo.lastTime).toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>
                  <div style={{
                    fontSize: 12,
                    color: '#64748B',
                    whiteSpace: 'nowrap',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis'
                  }}>
                    {convo.lastMessage}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Right Area: Messages Screen */}
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', background: '#FFFFFF' }}>
          {activePhone ? (
            <>
              {/* Chat Window Header */}
              <div style={{
                padding: '16px 20px',
                borderBottom: '1px solid #E2E8F0',
                display: 'flex',
                alignItems: 'center',
                background: '#FFFFFF'
              }}>
                <div>
                  <div style={{ fontSize: 15, fontWeight: 800, color: '#0F172A' }}>Hội thoại: {activePhone}</div>
                  <div style={{ fontSize: 11, color: '#22C55E', fontWeight: 600, display: 'flex', alignItems: 'center', gap: 4 }}>
                    <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#22C55E', display: 'inline-block' }}></span>
                    Khách hàng đang kết nối
                  </div>
                </div>
              </div>

              {/* Messages Container */}
              <div style={{
                flex: 1,
                padding: '20px',
                overflowY: 'auto',
                background: '#F8FAFC',
                display: 'flex',
                flexDirection: 'column',
                gap: 14
              }}>
                {messages.map((msg) => {
                  const isUser = msg.sender_type === 'user'
                  return (
                    <div
                      key={msg.id}
                      style={{
                        display: 'flex',
                        flexDirection: isUser ? 'row' : 'row-reverse',
                        alignItems: 'flex-end',
                        gap: 8,
                        alignSelf: isUser ? 'flex-start' : 'flex-end',
                        maxWidth: '75%'
                      }}
                    >
                      <div style={{ display: 'flex', flexDirection: 'column', alignItems: isUser ? 'flex-start' : 'flex-end' }}>
                        <div style={{
                          background: isUser ? '#E0F2FE' : '#F1F5F9',
                          color: '#0F172A',
                          padding: '10px 14px',
                          borderRadius: isUser ? '14px 14px 14px 2px' : '14px 14px 2px 14px',
                          fontSize: 13,
                          lineHeight: 1.5,
                          wordBreak: 'break-word'
                        }}>
                          {msg.image_url ? (
                            <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                              <img
                                src={msg.image_url}
                                alt="Ảnh đính kèm"
                                style={{ maxWidth: '100%', maxHeight: 200, borderRadius: 8 }}
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
                })}
                <div ref={messagesEndRef} />
              </div>

              {/* Reply Form */}
              <form
                onSubmit={handleSendResponse}
                style={{
                  padding: '16px',
                  background: 'white',
                  borderTop: '1px solid #E2E8F0',
                  display: 'flex',
                  gap: 12
                }}
              >
                <input
                  type="text"
                  value={inputText}
                  onChange={(e) => setInputText(e.target.value)}
                  placeholder={`Phản hồi số điện thoại ${activePhone}...`}
                  style={{
                    flex: 1,
                    padding: '12px 16px',
                    border: '1px solid #E2E8F0',
                    borderRadius: 8,
                    fontSize: 13,
                    outline: 'none',
                    background: '#F8FAFC'
                  }}
                />
                <button
                  type="submit"
                  style={{
                    background: '#2563EB',
                    color: 'white',
                    border: 'none',
                    borderRadius: 8,
                    padding: '10px 20px',
                    fontSize: 13,
                    fontWeight: 700,
                    cursor: 'pointer'
                  }}
                >
                  Gửi phản hồi
                </button>
              </form>
            </>
          ) : (
            <div style={{
              margin: 'auto',
              textAlign: 'center',
              color: '#94A3B8',
              padding: '24px'
            }}>
              <div style={{ fontSize: 50, marginBottom: 12 }}>🎧</div>
              <div style={{ fontSize: 14, fontWeight: 700, color: '#64748B' }}>Chưa chọn cuộc trò chuyện</div>
              <div style={{ fontSize: 12, marginTop: 4 }}>
                Chọn một số điện thoại từ danh sách bên trái để bắt đầu chát hỗ trợ khách hàng.
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

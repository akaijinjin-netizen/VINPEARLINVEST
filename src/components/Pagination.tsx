'use client'

interface PaginationProps {
  currentPage: number
  totalPages: number
  totalItems: number
  itemsPerPage: number
  onPageChange: (page: number) => void
}

export default function Pagination({
  currentPage,
  totalPages,
  totalItems,
  itemsPerPage,
  onPageChange,
}: PaginationProps) {
  if (totalPages <= 1) return null

  const startItem = (currentPage - 1) * itemsPerPage + 1
  const endItem = Math.min(currentPage * itemsPerPage, totalItems)

  return (
    <div style={{
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: '14px 20px',
      background: 'white',
      borderTop: '1px solid #E5E7EB',
      fontSize: 13,
      color: '#6B7280',
    }}>
      <div>
        Hiển thị <span style={{ fontWeight: 700, color: '#0F172A' }}>{startItem}</span> - <span style={{ fontWeight: 700, color: '#0F172A' }}>{endItem}</span> trên tổng số <span style={{ fontWeight: 700, color: '#0F172A' }}>{totalItems}</span> mục (10 dòng/trang)
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
        <button
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 1}
          style={{
            padding: '6px 12px',
            border: '1px solid #E5E7EB',
            borderRadius: 6,
            background: currentPage === 1 ? '#F9FAFB' : 'white',
            color: currentPage === 1 ? '#9CA3AF' : '#374151',
            cursor: currentPage === 1 ? 'not-allowed' : 'pointer',
            fontSize: 13,
            fontWeight: 600,
          }}
        >
          ← Trước
        </button>

        {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
          <button
            key={page}
            onClick={() => onPageChange(page)}
            style={{
              width: 32,
              height: 32,
              border: page === currentPage ? 'none' : '1px solid #E5E7EB',
              borderRadius: 6,
              background: page === currentPage ? '#C8102E' : 'white',
              color: page === currentPage ? 'white' : '#374151',
              cursor: 'pointer',
              fontSize: 13,
              fontWeight: page === currentPage ? 700 : 500,
            }}
          >
            {page}
          </button>
        ))}

        <button
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          style={{
            padding: '6px 12px',
            border: '1px solid #E5E7EB',
            borderRadius: 6,
            background: currentPage === totalPages ? '#F9FAFB' : 'white',
            color: currentPage === totalPages ? '#9CA3AF' : '#374151',
            cursor: currentPage === totalPages ? 'not-allowed' : 'pointer',
            fontSize: 13,
            fontWeight: 600,
          }}
        >
          Sau →
        </button>
      </div>
    </div>
  )
}

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
      justify: 'space-between',
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
            background: currentPage === 1 ? '#F3F4F6' : 'white',
            color: currentPage === 1 ? '#9CA3AF' : '#374151',
            border: '1px solid #E5E7EB',
            borderRadius: 8,
            padding: '6px 12px',
            fontWeight: 600,
            cursor: currentPage === 1 ? 'not-allowed' : 'pointer',
            transition: 'all 0.2s',
          }}
        >
          ‹ Trước
        </button>

        {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
          <button
            key={page}
            onClick={() => onPageChange(page)}
            style={{
              background: currentPage === page ? '#C8102E' : 'white',
              color: currentPage === page ? 'white' : '#374151',
              border: currentPage === page ? 'none' : '1px solid #E5E7EB',
              borderRadius: 8,
              minWidth: 32,
              height: 32,
              fontWeight: 700,
              cursor: 'pointer',
              transition: 'all 0.2s',
            }}
          >
            {page}
          </button>
        ))}

        <button
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          style={{
            background: currentPage === totalPages ? '#F3F4F6' : 'white',
            color: currentPage === totalPages ? '#9CA3AF' : '#374151',
            border: '1px solid #E5E7EB',
            borderRadius: 8,
            padding: '6px 12px',
            fontWeight: 600,
            cursor: currentPage === totalPages ? 'not-allowed' : 'pointer',
            transition: 'all 0.2s',
          }}
        >
          Sau ›
        </button>
      </div>
    </div>
  )
}

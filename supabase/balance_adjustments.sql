-- BƯỚC 1: Tạo bảng lưu trữ lịch sử điều chỉnh số dư từ Admin
CREATE TABLE IF NOT EXISTS public.balance_adjustments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
    amount NUMERIC NOT NULL,
    type TEXT NOT NULL, -- 'add' (cộng) hoặc 'subtract' (trừ)
    reason TEXT, -- Lý do cộng/trừ (ví dụ: Tri ân khách hàng...)
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- BƯỚC 2: Tắt RLS để ứng dụng có thể đọc/ghi trực tiếp
ALTER TABLE public.balance_adjustments DISABLE ROW LEVEL SECURITY;

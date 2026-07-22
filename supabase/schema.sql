-- =========================================================================
-- VINPEARL INVEST - FULL DATABASE SCHEMA FOR SUPABASE
-- Hướng dẫn: Copy toàn bộ nội dung dán vào SQL Editor trên Supabase và nhấn RUN
-- =========================================================================

-- 1. Tải các tiện ích mở rộng cần thiết
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 2. Tạo bảng PROFILES (Thông tin cá nhân & Tài khoản)
CREATE TABLE IF NOT EXISTS public.profiles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    phone TEXT UNIQUE NOT NULL,
    full_name TEXT,
    role TEXT DEFAULT 'user', -- 'user' hoặc 'admin'
    password TEXT,
    address TEXT,
    id_card TEXT,
    bank_name TEXT,
    bank_account_name TEXT,
    bank_account_number TEXT,
    referral_code TEXT UNIQUE,
    referrer_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
    vip_level INTEGER DEFAULT 0,
    status TEXT DEFAULT 'active', -- 'active' hoặc 'locked'
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Gỡ bỏ khóa ngoại profiles_id_fkey mặc định đòi hỏi tài khoản phải liên kết với auth.users của Supabase
-- Điều này cho phép đăng ký trực tiếp và quản lý mật khẩu dễ dàng qua admin
ALTER TABLE public.profiles DROP CONSTRAINT IF EXISTS profiles_id_fkey;

-- 3. Tạo bảng WALLETS (Ví số dư)
CREATE TABLE IF NOT EXISTS public.wallets (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID UNIQUE REFERENCES public.profiles(id) ON DELETE CASCADE,
    balance NUMERIC DEFAULT 0,
    total_deposited NUMERIC DEFAULT 0,
    total_withdrawn NUMERIC DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- 4. Tạo bảng DEPOSITS (Lệnh nạp tiền)
CREATE TABLE IF NOT EXISTS public.deposits (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
    amount NUMERIC NOT NULL,
    bank_name TEXT,
    transfer_content TEXT,
    status TEXT DEFAULT 'pending', -- 'pending', 'approved', 'rejected'
    bill_image TEXT, -- Lưu ảnh hóa đơn chuyển khoản ở dạng Base64
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- 5. Tạo bảng WITHDRAWALS (Lệnh rút tiền)
CREATE TABLE IF NOT EXISTS public.withdrawals (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
    amount NUMERIC NOT NULL,
    bank_name TEXT,
    bank_account_name TEXT,
    bank_account_number TEXT,
    status TEXT DEFAULT 'pending', -- 'pending', 'approved', 'rejected'
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- 6. Tạo bảng PROJECTS (Dự án đầu tư góp vốn)
CREATE TABLE IF NOT EXISTS public.projects (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title TEXT NOT NULL,
    category TEXT,
    interest_rate NUMERIC, -- Lợi nhuận định kỳ (%)
    duration_days INTEGER, -- Kỳ hạn (ngày)
    min_investment NUMERIC, -- Mức đầu tư tối thiểu
    max_investment NUMERIC, -- Mức đầu tư tối đa
    total_capacity NUMERIC, -- Tổng hạn mức dự án
    current_investment NUMERIC DEFAULT 0, -- Số tiền đã huy động
    image_url TEXT,
    status TEXT DEFAULT 'active', -- 'active', 'ended'
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- 7. Tạo bảng INVESTMENTS (Lệnh góp vốn của khách)
CREATE TABLE IF NOT EXISTS public.investments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
    project_id UUID REFERENCES public.projects(id) ON DELETE CASCADE,
    amount NUMERIC NOT NULL,
    interest_rate NUMERIC,
    duration_days INTEGER,
    status TEXT DEFAULT 'active', -- 'active' (đang góp), 'ended' (đã kết thúc nhận lãi)
    start_date TIMESTAMP WITH TIME ZONE DEFAULT now(),
    end_date TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- 8. Tạo bảng CHAT_MESSAGES (Trò chuyện CSKH Trực tuyến)
CREATE TABLE IF NOT EXISTS public.chat_messages (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    sender_phone TEXT NOT NULL,
    sender_type TEXT NOT NULL, -- 'user' hoặc 'admin'
    message TEXT NOT NULL,
    image_url TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- =========================================================================
-- 9. TẮT ROW LEVEL SECURITY (RLS) để cho phép kết nối trực tiếp
-- =========================================================================
ALTER TABLE public.profiles DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.wallets DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.deposits DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.withdrawals DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.projects DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.investments DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.chat_messages DISABLE ROW LEVEL SECURITY;

-- =========================================================================
-- 10. THIẾT LẬP TÀI KHOẢN ADMIN CHÍNH MẶC ĐỊNH
-- =========================================================================
INSERT INTO public.profiles (id, phone, full_name, role, password, referral_code, vip_level)
VALUES (
    'd3b07384-d113-4c92-bf39-2a996c97a5da', 
    'admin', 
    'Admin Chính', 
    'admin', 
    '668899@.', 
    'VINSYSTEM', 
    5
)
ON CONFLICT (phone) DO NOTHING;

-- Tự động tạo ví trống cho tài khoản Admin chính nếu chưa có
INSERT INTO public.wallets (user_id, balance, total_deposited, total_withdrawn)
VALUES ('d3b07384-d113-4c92-bf39-2a996c97a5da', 0, 0, 0)
ON CONFLICT (user_id) DO NOTHING;

-- =========================================================================
-- 11. HÀM TỰ ĐỘNG PHÂN PHỐI LÃI VÀ VỐN KHI HẾT CHU KỲ (Tính bằng phút/giờ/ngày)
-- =========================================================================
CREATE OR REPLACE FUNCTION public.process_expired_investments()
RETURNS void AS $$
DECLARE
    r RECORD;
    v_profit NUMERIC;
    v_total_return NUMERIC;
BEGIN
    -- Lặp qua các hợp đồng đầu tư đang hoạt động và đã đến hạn
    FOR r IN 
        SELECT 
            i.id AS investment_id,
            i.user_id,
            i.amount,
            p.daily_profit_rate,
            p.investment_cycle_minutes
        FROM public.investments i
        JOIN public.projects p ON i.project_id = p.id
        WHERE i.status IN ('active', 'running', 'contributing')
          AND now() >= (COALESCE(i.start_time, i.created_at, now()) + (COALESCE(p.investment_cycle_minutes, 1440) * interval '1 minute'))
    LOOP
        -- Tính toán lợi nhuận: Gốc * (Phần trăm lãi / 100)
        v_profit := ROUND(r.amount * (r.daily_profit_rate / 100.0));
        v_total_return := r.amount + v_profit;

        -- 1. Cộng tiền gốc và lãi vào ví người dùng
        UPDATE public.wallets
        SET 
            balance = COALESCE(balance, 0) + v_total_return
        WHERE user_id = r.user_id;

        -- 2. Cập nhật trạng thái hợp đồng thành đã kết thúc
        UPDATE public.investments
        SET 
            status = 'ended',
            profit_earned = v_profit,
            end_time = now()
        WHERE id = r.investment_id;

    END LOOP;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;


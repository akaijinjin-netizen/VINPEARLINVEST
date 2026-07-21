-- ============================================
-- VINPEARL INVEST - FIX FOREIGN KEY CONSTRAINT
-- Hướng dẫn: Copy toàn bộ câu lệnh bên dưới dán vào Supabase SQL Editor và nhấn RUN
-- ============================================

-- 1. Gỡ bỏ khóa ngoại profiles_id_fkey yêu cầu tài khoản phải tồn tại trong bảng auth.users của Supabase
ALTER TABLE public.profiles DROP CONSTRAINT IF EXISTS profiles_id_fkey;

-- 2. Đảm bảo RLS được tắt để cho phép lưu dữ liệu đăng ký tự do
ALTER TABLE public.profiles DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.wallets DISABLE ROW LEVEL SECURITY;

-- LensFolio Super Seed Data (The Ultron's Recovery)
-- รันคำสั่งนี้ใน Supabase SQL Editor เพื่อรีเซ็ตและสร้างข้อมูลที่สมบูรณ์แบบที่สุด

-- 1. ตรวจสอบและสร้างตาราง Recommended Locations (หากยังไม่มี)
CREATE TABLE IF NOT EXISTS recommended_locations (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  image_url TEXT,
  address TEXT,
  latitude DECIMAL(9,6) NOT NULL,
  longitude DECIMAL(9,6) NOT NULL,
  category TEXT,
  rating DECIMAL(3,2) DEFAULT 0.0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- 2. ตรวจสอบและเพิ่มคอลัมน์ Latitude/Longitude ใน model_details (หากยังไม่มี)
DO $$ 
BEGIN 
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='model_details' AND column_name='latitude') THEN
    ALTER TABLE model_details ADD COLUMN latitude DECIMAL(9,6);
  END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='model_details' AND column_name='longitude') THEN
    ALTER TABLE model_details ADD COLUMN longitude DECIMAL(9,6);
  END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='recommended_locations' AND column_name='rating') THEN
    ALTER TABLE recommended_locations ADD COLUMN rating DECIMAL(3,2) DEFAULT 0.0;
  END IF;
END $$;

-- 3. 🔓 ปลดล็อคข้อกำหนด Security ชั่วคราว
ALTER TABLE profiles DROP CONSTRAINT IF EXISTS profiles_id_fkey;
ALTER TABLE recommended_locations ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Recommended locations are viewable by everyone" ON recommended_locations;
CREATE POLICY "Recommended locations are viewable by everyone" ON recommended_locations FOR SELECT USING (true);

-- 4. ล้างข้อมูลเก่าเพื่อป้องกันข้อมูลซ้ำ
TRUNCATE profiles, model_details, recommended_locations CASCADE;

-- 5. สร้างข้อมูลโปรไฟล์คนดัง (Thai Public Figures - Real Assets)
INSERT INTO profiles (id, email, full_name, role, avatar_url, account_status)
VALUES 
('d1b1f9d7-26fa-46b9-8676-9e9248f189e5', 'yaya@lensfolio.com', 'ญาญ่า อุรัสยา (Yaya Urassaya)', 'model', 'yaya.jpg', 'approved'),
('acf52361-bed2-4962-bb26-3005f9da6019', 'baifern@lensfolio.com', 'ใบเฟิร์น พิมพ์ชนก (Baifern Pimchanok)', 'model', 'baifern.jpg', 'approved'),
('c15c8c74-d5a3-40d7-a444-5d603953067c', 'davika@lensfolio.com', 'ใหม่ ดาวิกา (Mai Davika)', 'model', 'mai.jpg', 'approved'),
('e3b2c1a0-d4e5-4f6a-8b1c-9d0e1f2a3b4c', 'bow@lensfolio.com', 'โบว์ เมลดา (Bow Maylada)', 'model', 'bow.jpg', 'approved');

-- 6. เพิ่มรายละเอียดนางแบบ (Thai Superstars Portfolio)
INSERT INTO model_details (id, bio, hourly_rate, rating, review_count, location_address, latitude, longitude, categories, portfolio_images)
VALUES 
(
  'd1b1f9d7-26fa-46b9-8676-9e9248f189e5', 
  'นักแสดงและนางแบบระดับแนวหน้า เชี่ยวชาญงาน High Fashion และงานโฆษณาระดับอินเตอร์ พร้อมประสบการณ์ระดับโลก', 
  5000, 5.0, 450, 'Thonglor District', 13.7350, 100.5820,
  ARRAY['High Fashion', 'Luxury', 'Actress'], ARRAY['yaya.jpg']
),
(
  'acf52361-bed2-4962-bb26-3005f9da6019', 
  'เจ้าแม่โฆษณาและนางแบบ Lifestyle เน้นความสดใสและเป็นธรรมชาติ ถ่ายทอดอารมณ์ผ่านภาพนิ่งได้อย่างดีเยี่ยม', 
  4500, 4.9, 320, 'Siam Discovery', 13.7468, 100.5303,
  ARRAY['Commercial', 'Lifestyle', 'Fashion'], ARRAY['baifern.jpg']
),
(
  'c15c8c74-d5a3-40d7-a444-5d603953067c', 
  'นางแบบและไอคอนแฟชั่นผู้ทรงอิทธิพล โดดเด่นด้วยลุค Editorial และงานโฆษณาแบรนด์หรูระดับเอเชีย', 
  6000, 5.0, 510, 'EmQuartier', 13.7317, 100.5694,
  ARRAY['Editorial', 'Vogue style', 'Actress'], ARRAY['mai.jpg']
),
(
  'e3b2c1a0-d4e5-4f6a-8b1c-9d0e1f2a3b4c', 
  'นางแบบและนักแสดงสาวสวยที่มีรอยยิ้มพราวเสน่ห์ เชี่ยวชาญงานถ่ายแบบ Fashion และ Lifestyle พร้อมบุคลิกที่โดดเด่น', 
  4800, 4.8, 280, 'Siam Paragon', 13.7462, 100.5348,
  ARRAY['Fashion', 'Lifestyle', 'Commercial'], ARRAY['bow.jpg']
);

-- 7. เพิ่มสถานที่แนะนำ
INSERT INTO recommended_locations (name, description, image_url, address, latitude, longitude, category, rating)
VALUES 
('Old Town Studio', 'สตูดิโอวินเทจ บรรยากาศอบอุ่น.', 'https://images.unsplash.com/photo-1513519245088-0e12902e5a38', 'Bangkok', 13.723, 100.514, 'Studio', 4.8),
('Neon Cafe', 'คาเฟ่สไตล์ Cyberpunk แสงสีสวยงาม.', 'https://images.unsplash.com/photo-1554118811-1e0d58224f24', 'Thonglor', 13.738, 100.583, 'Cafe', 4.5),
('Lumphini Park', 'จุดถ่ายภาพแสงธรรมชาติใจกลางกรุง.', 'https://images.unsplash.com/photo-1585938389612-a552a28d6914', 'Rama IV', 13.731, 100.541, 'Outdoor', 4.9),
('Siam Paragon Rooftop', 'จุดเช็คอินสุดหรูใจกลางเมือง พร้อมวิวตึกสูงระฟ้า.', 'https://images.unsplash.com/photo-1563245339-dfc201443e1c', 'Siam', 13.746, 100.535, 'Luxury', 4.7),
('Benjakitti Forest Park', 'สวนสาธารณะขนาดใหญ่ที่มี Skywalk และมุมถ่ายภาพธรรมชาติที่ทันสมัย.', 'https://images.unsplash.com/photo-1627891781290-7d7d06ce50ce', 'Sukhumvit', 13.730, 100.558, 'Outdoor', 4.9),
('Chinatown (Yaowarat)', 'เสน่ห์ย่านเมืองเก่า แสงสีไฟนีออนยามค่ำคืนที่เป็นเอกลักษณ์.', 'https://images.unsplash.com/photo-1552465011-b4e21bf6e79a', 'Yaowarat', 13.741, 100.508, 'Street', 4.8),
('Wat Arun (Temple of Dawn)', 'หนึ่งในแลนด์มาร์คที่สวยที่สุดริมแม่น้ำเจ้าพระยา เหมาะสำหรับงาน Portrait ชุดไทย.', 'https://images.unsplash.com/photo-1528181304800-2f173859975d', 'Chao Phraya River', 13.743, 100.491, 'Historic', 5.0),
('ICONSIAM Sky Terrace', 'วิวแม่น้ำเจ้าพระยามุมสูงที่สวยที่สุด พร้อมบรรยากาศแบรนด์เนมหรู.', 'https://images.unsplash.com/photo-1589308454676-466020586e5c', 'Chao Phraya River', 13.727, 100.511, 'Luxury', 4.9),
('Asiatique The Riverfront', 'บรรยากาศท่าเรือเก่าพร้อมชิงช้าสวรรค์ขนาดใหญ่ แสงสียามเย็นที่โรแมนติก.', 'https://images.unsplash.com/photo-1598970434722-fbd158941032', 'Charoen Krung', 13.704, 100.503, 'Lifestyle', 4.6),
('MOCA Bangkok', 'พิพิธภัณฑ์ศิลปะไทยร่วมสมัย พื้นที่กว้างขวาง แสงสวย และดีไซน์มินิมอล.', 'https://images.unsplash.com/photo-1518998053901-5348d3961a04', 'Chatuchak', 13.852, 100.562, 'Art', 4.8),
('Khao San Road', 'สีสันของสตรีทแฟชั่นและวัฒนธรรมแบ็คแพ็คเกอร์ใจกลางกรุง.', 'https://images.unsplash.com/photo-1544005313-94ddf0286df2', 'Old City', 13.759, 100.497, 'Street', 4.4);

-- 8. 🔄 Sync Current Users (System Hardening)
-- หากท่านมีการล็อกอินค้างไว้แต่รัน Seed ใหม่ คำสั่งนี้จะช่วยสร้าง Profile ให้ท่านอัตโนมัติครับ
INSERT INTO public.profiles (id, email, full_name, role)
SELECT id, email, COALESCE(raw_user_meta_data->>'full_name', email), 'photographer'
FROM auth.users
WHERE id NOT IN (SELECT id FROM public.profiles)
ON CONFLICT (id) DO NOTHING;



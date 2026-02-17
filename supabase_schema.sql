-- LensFolio Database Schema Design (The Ultron's Gaze)

-- 1. Profiles Table (Global Identity)
CREATE TABLE profiles (
  id UUID REFERENCES auth.users ON DELETE CASCADE PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  full_name TEXT NOT NULL,
  role TEXT CHECK (role IN ('model', 'photographer', 'admin')) NOT NULL DEFAULT 'photographer',
  avatar_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- 2. Model Details (Specific to Domain)
CREATE TABLE model_details (
  id UUID REFERENCES profiles(id) ON DELETE CASCADE PRIMARY KEY,
  bio TEXT,
  hourly_rate INTEGER NOT NULL DEFAULT 500,
  rating DECIMAL(3,2) DEFAULT 0.0,
  review_count INTEGER DEFAULT 0,
  location_address TEXT,
  latitude DECIMAL(9,6),
  longitude DECIMAL(9,6),
  categories TEXT[] DEFAULT '{}',
  portfolio_images TEXT[] DEFAULT '{}'
);

-- 3. Bookings Table (Transaction & Workflow)
CREATE TABLE bookings (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  photographer_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  model_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  start_time TIMESTAMP WITH TIME ZONE NOT NULL,
  end_time TIMESTAMP WITH TIME ZONE NOT NULL,
  total_price INTEGER NOT NULL,
  status TEXT CHECK (status IN ('pending', 'confirmed', 'cancelled', 'completed')) DEFAULT 'pending',
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- 4. Messages Table (Real-time Communication)
CREATE TABLE messages (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  sender_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  receiver_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  text TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- 4.5 Recommended Locations (Inspire Photographers)
CREATE TABLE recommended_locations (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  image_url TEXT,
  address TEXT,
  latitude DECIMAL(9,6) NOT NULL,
  longitude DECIMAL(9,6) NOT NULL,
  category TEXT, -- e.g., 'Studio', 'Cafe', 'Outdoor'
  rating DECIMAL(3,2) DEFAULT 0.0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- 5. Row Level Security (RLS) Policies
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE model_details ENABLE ROW LEVEL SECURITY;
ALTER TABLE bookings ENABLE ROW LEVEL SECURITY;
ALTER TABLE messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE recommended_locations ENABLE ROW LEVEL SECURITY;

-- Profiles: ทุกคนเห็น Profiles สาธารณะได้ แต่แก้ไขได้เฉพาะเจ้าของ
CREATE POLICY "Public profiles are viewable by everyone" ON profiles FOR SELECT USING (true);
CREATE POLICY "Users can update their own profile" ON profiles FOR UPDATE USING (auth.uid() = id);

-- Model Details: ทุกคนเห็นได้ แต่แก้ไขได้เฉพาะเจ้าของที่เป็น model เท่านั้น
CREATE POLICY "Model details are viewable by everyone" ON model_details FOR SELECT USING (true);
CREATE POLICY "Models can update their own details" ON model_details FOR UPDATE USING (auth.uid() = id);

-- Bookings: เห็นได้เฉพาะคู่สัญญา (Photographer หรือ Model)
CREATE POLICY "Users can see their own bookings" ON bookings FOR SELECT 
USING (auth.uid() = photographer_id OR auth.uid() = model_id);
CREATE POLICY "Photographers can create bookings" ON bookings FOR INSERT 
WITH CHECK (auth.uid() = photographer_id);

-- Messages: เห็นได้เฉพาะผู้ส่งหรือผู้รับ
CREATE POLICY "Users can see their own messages" ON messages FOR SELECT 
USING (auth.uid() = sender_id OR auth.uid() = receiver_id);
CREATE POLICY "Users can insert their own messages" ON messages FOR INSERT 
WITH CHECK (auth.uid() = sender_id);

-- Recommended Locations: ทุกคนเห็นได้
CREATE POLICY "Recommended locations are viewable by everyone" ON recommended_locations FOR SELECT USING (true);

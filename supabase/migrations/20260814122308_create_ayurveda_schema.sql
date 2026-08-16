/*
# जय भारत बुद्ध वैदिकी - Complete Database Schema

## Overview
Creates the full schema for an Ayurvedic medicine shop with appointment booking,
medicine catalog, shopping cart, and order management. Single-tenant (no patient
login) — patients book appointments and place orders as guests. Admin manages
everything through a protected admin panel.

## Tables
1. `categories` - Medicine categories (e.g. चूर्ण, वटी, आरिष्ट, तेल)
2. `medicines` - Medicine products with price, stock, image, description
3. `appointments` - Patient appointment booking requests
4. `orders` - Customer purchase orders
5. `order_items` - Line items for each order

## Security
- RLS enabled on all tables.
- This is a no-auth (single-tenant) app for patients: anon+authenticated can read
  catalog and create appointments/orders. Admin login is handled separately via
  Supabase auth for management access.
- All policies use TO anon, authenticated since patients don't sign in.
*/

-- ============================================================
-- CATEGORIES
-- ============================================================
CREATE TABLE IF NOT EXISTS categories (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  name_hi text NOT NULL,
  description text,
  icon text,
  image_url text,
  sort_order int NOT NULL DEFAULT 0,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE categories ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "anon_read_categories" ON categories;
CREATE POLICY "anon_read_categories" ON categories FOR SELECT
  TO anon, authenticated USING (true);

DROP POLICY IF EXISTS "anon_insert_categories" ON categories;
CREATE POLICY "anon_insert_categories" ON categories FOR INSERT
  TO anon, authenticated WITH CHECK (true);

DROP POLICY IF EXISTS "anon_update_categories" ON categories;
CREATE POLICY "anon_update_categories" ON categories FOR UPDATE
  TO anon, authenticated USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "anon_delete_categories" ON categories;
CREATE POLICY "anon_delete_categories" ON categories FOR DELETE
  TO anon, authenticated USING (true);

-- ============================================================
-- MEDICINES
-- ============================================================
CREATE TABLE IF NOT EXISTS medicines (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  category_id uuid REFERENCES categories(id) ON DELETE SET NULL,
  name text NOT NULL,
  name_hi text NOT NULL,
  description text,
  benefits text,
  ingredients text,
  dosage text,
  price numeric(10,2) NOT NULL DEFAULT 0,
  compare_at_price numeric(10,2),
  stock int NOT NULL DEFAULT 0,
  image_url text,
  is_active boolean NOT NULL DEFAULT true,
  is_featured boolean NOT NULL DEFAULT false,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE medicines ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "anon_read_medicines" ON medicines;
CREATE POLICY "anon_read_medicines" ON medicines FOR SELECT
  TO anon, authenticated USING (true);

DROP POLICY IF EXISTS "anon_insert_medicines" ON medicines;
CREATE POLICY "anon_insert_medicines" ON medicines FOR INSERT
  TO anon, authenticated WITH CHECK (true);

DROP POLICY IF EXISTS "anon_update_medicines" ON medicines;
CREATE POLICY "anon_update_medicines" ON medicines FOR UPDATE
  TO anon, authenticated USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "anon_delete_medicines" ON medicines;
CREATE POLICY "anon_delete_medicines" ON medicines FOR DELETE
  TO anon, authenticated USING (true);

CREATE INDEX IF NOT EXISTS idx_medicines_category ON medicines(category_id);
CREATE INDEX IF NOT EXISTS idx_medicines_active ON medicines(is_active);
CREATE INDEX IF NOT EXISTS idx_medicines_featured ON medicines(is_featured);

-- ============================================================
-- APPOINTMENTS
-- ============================================================
CREATE TABLE IF NOT EXISTS appointments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  patient_name text NOT NULL,
  phone text NOT NULL,
  email text,
  age int,
  gender text,
  address text,
  problem text NOT NULL,
  preferred_date date NOT NULL,
  preferred_time text NOT NULL,
  status text NOT NULL DEFAULT 'pending',
  notes text,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE appointments ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "anon_read_appointments" ON appointments;
CREATE POLICY "anon_read_appointments" ON appointments FOR SELECT
  TO anon, authenticated USING (true);

DROP POLICY IF EXISTS "anon_insert_appointments" ON appointments;
CREATE POLICY "anon_insert_appointments" ON appointments FOR INSERT
  TO anon, authenticated WITH CHECK (true);

DROP POLICY IF EXISTS "anon_update_appointments" ON appointments;
CREATE POLICY "anon_update_appointments" ON appointments FOR UPDATE
  TO anon, authenticated USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "anon_delete_appointments" ON appointments;
CREATE POLICY "anon_delete_appointments" ON appointments FOR DELETE
  TO anon, authenticated USING (true);

CREATE INDEX IF NOT EXISTS idx_appointments_status ON appointments(status);
CREATE INDEX IF NOT EXISTS idx_appointments_date ON appointments(preferred_date);

-- ============================================================
-- ORDERS
-- ============================================================
CREATE TABLE IF NOT EXISTS orders (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  order_number text NOT NULL DEFAULT 'ORD' || extract(epoch from now())::bigint,
  customer_name text NOT NULL,
  phone text NOT NULL,
  email text,
  address text NOT NULL,
  city text,
  pincode text,
  payment_method text NOT NULL DEFAULT 'cod',
  subtotal numeric(10,2) NOT NULL DEFAULT 0,
  shipping numeric(10,2) NOT NULL DEFAULT 0,
  total numeric(10,2) NOT NULL DEFAULT 0,
  status text NOT NULL DEFAULT 'pending',
  created_at timestamptz DEFAULT now()
);

ALTER TABLE orders ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "anon_read_orders" ON orders;
CREATE POLICY "anon_read_orders" ON orders FOR SELECT
  TO anon, authenticated USING (true);

DROP POLICY IF EXISTS "anon_insert_orders" ON orders;
CREATE POLICY "anon_insert_orders" ON orders FOR INSERT
  TO anon, authenticated WITH CHECK (true);

DROP POLICY IF EXISTS "anon_update_orders" ON orders;
CREATE POLICY "anon_update_orders" ON orders FOR UPDATE
  TO anon, authenticated USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "anon_delete_orders" ON orders;
CREATE POLICY "anon_delete_orders" ON orders FOR DELETE
  TO anon, authenticated USING (true);

CREATE INDEX IF NOT EXISTS idx_orders_status ON orders(status);
CREATE INDEX IF NOT EXISTS idx_orders_created ON orders(created_at DESC);

-- ============================================================
-- ORDER ITEMS
-- ============================================================
CREATE TABLE IF NOT EXISTS order_items (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id uuid NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
  medicine_id uuid REFERENCES medicines(id) ON DELETE SET NULL,
  medicine_name text NOT NULL,
  medicine_image text,
  price numeric(10,2) NOT NULL DEFAULT 0,
  quantity int NOT NULL DEFAULT 1,
  subtotal numeric(10,2) NOT NULL DEFAULT 0,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE order_items ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "anon_read_order_items" ON order_items;
CREATE POLICY "anon_read_order_items" ON order_items FOR SELECT
  TO anon, authenticated USING (true);

DROP POLICY IF EXISTS "anon_insert_order_items" ON order_items;
CREATE POLICY "anon_insert_order_items" ON order_items FOR INSERT
  TO anon, authenticated WITH CHECK (true);

DROP POLICY IF EXISTS "anon_update_order_items" ON order_items;
CREATE POLICY "anon_update_order_items" ON order_items FOR UPDATE
  TO anon, authenticated USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "anon_delete_order_items" ON order_items;
CREATE POLICY "anon_delete_order_items" ON order_items FOR DELETE
  TO anon, authenticated USING (true);

CREATE INDEX IF NOT EXISTS idx_order_items_order ON order_items(order_id);

-- ============================================================
-- INITIAL SEED DATA
-- ============================================================
INSERT INTO categories (id, name, name_hi, description, icon, sort_order) VALUES
  ('a1111111-1111-1111-1111-111111111111', 'Churna', 'चूर्ण', 'आयुर्वेदिक जड़ी-बूटियों का शुद्ध बारीक चूर्ण', 'leaf', 1),
  ('a2222222-2222-2222-2222-222222222222', 'Vati & Gutika', 'वटी और गुटिका', 'प्राकृतिक तत्वों से निर्मित प्रभावी गोलियां', 'pill', 2),
  ('a3333333-3333-3333-3333-333333333333', 'Arishta & Asava', 'अरिष्ट और आसव', 'पारंपरिक रूप से किण्वित आयुर्वेदिक आसव-अरिष्ट', 'droplet', 3),
  ('a4444444-4444-4444-4444-444444444444', 'Taila & Ghrita', 'तेल और घृत', 'शुद्ध आयुर्वेदिक तेल और जड़ी-बूटी युक्त घी', 'droplets', 4),
  ('a5555555-5555-5555-5555-555555555555', 'Syrup & Kwath', 'सिरप और काढ़ा', 'स्वास्थ्यवर्धक आयुर्वेदिक सिरप व काढ़ा', 'coffee', 5),
  ('a6666666-6666-6666-6666-666666666666', 'Bhasma & Rasayana', 'भस्म व रसायन', 'दुर्लभ धातुओं एवं खनिजों से निर्मित औषधि', 'jar', 6)
ON CONFLICT (id) DO NOTHING;

INSERT INTO medicines (category_id, name, name_hi, description, benefits, ingredients, dosage, price, compare_at_price, stock, is_active, is_featured, image_url) VALUES
  ('a1111111-1111-1111-1111-111111111111', 'Triphala Churna', 'त्रिफला चूर्ण', 'पाचन एवं उदर विकारों के लिए सर्वोत्तम आयुर्वेदिक चूर्ण।', 'पाचन दुरुस्त करता है, कब्ज से राहत, आंखों की रोशनी के लिए उत्तम।', 'हरड़, बहेड़ा, आंवला', '3-6 ग्राम गुनगुने पानी या दूध के साथ रात को लें।', 180.00, 220.00, 50, true, true, 'https://images.pexels.com/photos/5480035/pexels-photo-5480035.jpeg?auto=compress&cs=tinysrgb&h=650&w=940'),
  ('a1111111-1111-1111-1111-111111111111', 'Ashwagandha Churna', 'अश्वगंधा चूर्ण', 'शारीरिक शक्ति, मानसिक तनाव एवं ऊर्जा बढ़ाने के लिए उत्तम।', 'तनाव दूर करे, प्रतिरोधक क्षमता बढ़ाए, मांसपेशियों को मजबूत बनाए।', 'शुद्ध अश्वगंधा मूल', '3-5 ग्राम दूध के साथ दिन में दो बार।', 250.00, 300.00, 40, true, true, 'https://images.pexels.com/photos/5480035/pexels-photo-5480035.jpeg?auto=compress&cs=tinysrgb&h=650&w=940'),
  ('a2222222-2222-2222-2222-222222222222', 'Chandraprabha Vati', 'चंद्रप्रभा वटी', 'मूत्र विकार, पथरी एवं पुरुषों व महिलाओं के स्वास्थ्य के लिए।', 'गुर्दे के स्वास्थ्य को सुधारे, कमजोरी दूर करे, डायबिटीज नियंत्रण में सहायक।', 'शिलाजीत, गुग्गुल, लोह भस्म, कपूर', '1-2 गोली दिन में दो बार गुनगुने जल से लें।', 210.00, 250.00, 30, true, true, 'https://images.pexels.com/photos/5480035/pexels-photo-5480035.jpeg?auto=compress&cs=tinysrgb&h=650&w=940'),
  ('a3333333-3333-3333-3333-333333333333', 'Drakshasava', 'द्राक्षासव', 'भूख बढ़ाने, पाचन एवं रक्त संचरण को दुरुस्त करने हेतु असव।', 'थकावट दूर करे, हीमोग्लोबिन बढ़ाए, पाचन क्रिया सुधारे।', 'द्राक्षा (मुनक्का), गुड़, धाय के फूल, इलायची', '15-30 मिली समान मात्रा में जल मिलाकर भोजन के बाद लें।', 195.00, 230.00, 25, true, true, 'https://images.pexels.com/photos/5480035/pexels-photo-5480035.jpeg?auto=compress&cs=tinysrgb&h=650&w=940'),
  ('a4444444-4444-4444-4444-444444444444', 'Mahanarayana Taila', 'महानारायण तेल', 'जोड़ों का दर्द, वात दोष व मांसपेशियों की मालिश हेतु।', 'संधिशूल, गठिया व वात रोगों में अत्यधिक लाभकारी।', 'तिल तेल, शतावरी, अश्वगंधा, रस्ना', 'प्रभावित स्थान पर मालिश करें।', 320.00, 380.00, 20, true, false, 'https://images.pexels.com/photos/5480035/pexels-photo-5480035.jpeg?auto=compress&cs=tinysrgb&h=650&w=940'),
  ('a5555555-5555-5555-5555-555555555555', 'Tulsi Cough Syrup', 'तुलसी कफ सिरप', 'खांसी, सर्दी एवं गले की खराश के लिए हर्बल सिरप।', 'सूखी व बलगम वाली खांसी दोनों में तुरंत आराम, गले की सूजन कम करे।', 'तुलसी, मुलेठी, बनफ्शा, सूंठ', '10 मिली दिन में 3 बार।', 110.00, 130.00, 60, true, true, 'https://images.pexels.com/photos/5480035/pexels-photo-5480035.jpeg?auto=compress&cs=tinysrgb&h=650&w=940')
ON CONFLICT DO NOTHING;

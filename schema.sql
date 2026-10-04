-- ==========================================
-- CityTransit ET - Supabase Database Schema
-- ==========================================

-- 1. Create Locations Table
CREATE TABLE IF NOT EXISTS locations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL UNIQUE,
  sub_city TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- 2. Create Routes Table
CREATE TABLE IF NOT EXISTS routes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  route_name TEXT NOT NULL,
  vehicle_type TEXT NOT NULL CHECK (vehicle_type IN ('Minibus Taxi', 'Anbessa Bus', 'Sheger Bus', 'Light Rail')),
  created_at TIMESTAMPTZ DEFAULT now()
);

-- 3. Create Route Stops Table
CREATE TABLE IF NOT EXISTS route_stops (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  route_id UUID REFERENCES routes(id) ON DELETE CASCADE,
  location_id UUID REFERENCES locations(id) ON DELETE CASCADE,
  stop_order INT NOT NULL,
  fare_from_start NUMERIC(6, 2) NOT NULL DEFAULT 0.00,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- 4. Seed Initial Addis Ababa Locations
INSERT INTO locations (name, sub_city) VALUES
  ('Bole', 'Bole'),
  ('Megenagna', 'Yeka'),
  ('Piazza', 'Arada'),
  ('Mexico', 'Kirkos'),
  ('4 Kilo', 'Arada'),
  ('Saris', 'Akaki-Kality'),
  ('Kality', 'Akaki-Kality'),
  ('Gotera', 'Nifas Silk-Lafto'),
  ('CMC', 'Yeka'),
  ('Ayat', 'Yeka')
ON CONFLICT (name) DO NOTHING;

-- 5. Seed Initial Transit Routes
INSERT INTO routes (id, route_name, vehicle_type) VALUES
  ('a1b2c3d4-0001-0000-0000-000000000001', 'Bole to Piazza Direct', 'Minibus Taxi'),
  ('a1b2c3d4-0002-0000-0000-000000000002', 'Megenagna to Mexico Express', 'Sheger Bus'),
  ('a1b2c3d4-0003-0000-0000-000000000003', 'Kality to 4 Kilo Rail Line', 'Light Rail'),
  ('a1b2c3d4-0004-0000-0000-000000000004', 'Ayat to Mexico Commuter', 'Anbessa Bus')
ON CONFLICT (id) DO NOTHING;

-- 6. Seed Route Stops with Fares (ETB)
INSERT INTO route_stops (route_id, location_id, stop_order, fare_from_start) VALUES
  -- Bole to Piazza Direct (Taxi)
  ('a1b2c3d4-0001-0000-0000-000000000001', (SELECT id FROM locations WHERE name = 'Bole'), 1, 0.00),
  ('a1b2c3d4-0001-0000-0000-000000000001', (SELECT id FROM locations WHERE name = 'Gotera'), 2, 10.00),
  ('a1b2c3d4-0001-0000-0000-000000000001', (SELECT id FROM locations WHERE name = 'Mexico'), 3, 15.00),
  ('a1b2c3d4-0001-0000-0000-000000000001', (SELECT id FROM locations WHERE name = 'Piazza'), 4, 25.00),

  -- Megenagna to Mexico Express (Sheger Bus)
  ('a1b2c3d4-0002-0000-0000-000000000002', (SELECT id FROM locations WHERE name = 'Megenagna'), 1, 0.00),
  ('a1b2c3d4-0002-0000-0000-000000000002', (SELECT id FROM locations WHERE name = '4 Kilo'), 2, 7.00),
  ('a1b2c3d4-0002-0000-0000-000000000002', (SELECT id FROM locations WHERE name = 'Mexico'), 3, 12.00),

  -- Kality to 4 Kilo Rail Line (Light Rail)
  ('a1b2c3d4-0003-0000-0000-000000000003', (SELECT id FROM locations WHERE name = 'Kality'), 1, 0.00),
  ('a1b2c3d4-0003-0000-0000-000000000003', (SELECT id FROM locations WHERE name = 'Saris'), 2, 5.00),
  ('a1b2c3d4-0003-0000-0000-000000000003', (SELECT id FROM locations WHERE name = 'Gotera'), 3, 10.00),
  ('a1b2c3d4-0003-0000-0000-000000000003', (SELECT id FROM locations WHERE name = 'Mexico'), 4, 15.00),
  ('a1b2c3d4-0003-0000-0000-000000000003', (SELECT id FROM locations WHERE name = '4 Kilo'), 5, 20.00),

  -- Ayat to Mexico Commuter (Anbessa Bus)
  ('a1b2c3d4-0004-0000-0000-000000000004', (SELECT id FROM locations WHERE name = 'Ayat'), 1, 0.00),
  ('a1b2c3d4-0004-0000-0000-000000000004', (SELECT id FROM locations WHERE name = 'CMC'), 2, 6.00),
  ('a1b2c3d4-0004-0000-0000-000000000004', (SELECT id FROM locations WHERE name = 'Megenagna'), 3, 10.00),
  ('a1b2c3d4-0004-0000-0000-000000000004', (SELECT id FROM locations WHERE name = 'Mexico'), 4, 18.00)
ON CONFLICT DO NOTHING;

-- 7. Row Level Security Policies
ALTER TABLE locations ENABLE ROW LEVEL SECURITY;
ALTER TABLE routes ENABLE ROW LEVEL SECURITY;
ALTER TABLE route_stops ENABLE ROW LEVEL SECURITY;

-- Allow public read access
CREATE POLICY "Public read locations" ON locations FOR SELECT USING (true);
CREATE POLICY "Public read routes" ON routes FOR SELECT USING (true);
CREATE POLICY "Public read route_stops" ON route_stops FOR SELECT USING (true);

-- Allow anonymous & public writes for testing/admin portal
CREATE POLICY "Allow public insert locations" ON locations FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public update locations" ON locations FOR UPDATE USING (true);
CREATE POLICY "Allow public delete locations" ON locations FOR DELETE USING (true);

CREATE POLICY "Allow public insert routes" ON routes FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public update routes" ON routes FOR UPDATE USING (true);
CREATE POLICY "Allow public delete routes" ON routes FOR DELETE USING (true);

CREATE POLICY "Allow public insert route_stops" ON route_stops FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public update route_stops" ON route_stops FOR UPDATE USING (true);
CREATE POLICY "Allow public delete route_stops" ON route_stops FOR DELETE USING (true);
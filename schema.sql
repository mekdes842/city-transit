-- Create locations table
CREATE TABLE IF NOT EXISTS locations (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  sub_city TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create routes table
CREATE TABLE IF NOT EXISTS routes (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  route_name TEXT NOT NULL,
  vehicle_type TEXT NOT NULL,
  base_fare NUMERIC(10, 2) NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create route stops mapping table
CREATE TABLE IF NOT EXISTS route_stops (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  route_id UUID REFERENCES routes(id) ON DELETE CASCADE,
  location_id UUID REFERENCES locations(id) ON DELETE CASCADE,
  stop_order INT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Seed initial Addis Ababa locations
INSERT INTO locations (name, sub_city) VALUES
  ('Bole', 'Bole'),
  ('Megenagna', 'Yeka'),
  ('Piazza', 'Arada'),
  ('Mexico', 'Kirkos'),
  ('4 Kilo', 'Arada'),
  ('Gotera', 'Nifas Silk-Lafto'),
  ('Kality', 'Akaki-Kality');
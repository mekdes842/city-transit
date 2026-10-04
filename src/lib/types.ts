export interface Location {
  id: string;
  name: string;
  sub_city: string;
  created_at?: string;
}

export interface Route {
  id: string;
  route_name: string;
  vehicle_type: string;
  created_at?: string;
}

export interface RouteStop {
  id: string;
  route_id: string;
  location_id: string;
  stop_order: number;
  fare_from_start: number;
  created_at?: string;
  locations?: Location;
}

export interface RouteResult {
  route_id: string;
  route_name: string;
  vehicle_type: string;
  origin_stop: string;
  destination_stop: string;
  total_fare: number;
  stops_breakdown: string[];
  is_transfer?: boolean;
  transfer_point?: string;
}
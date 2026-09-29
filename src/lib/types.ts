export interface Location {
  id: string;
  name: string;
  sub_city: string;
}

export interface RouteResult {
  route_id: string;
  route_name: string;
  vehicle_type: string;
  origin_stop: string;
  destination_stop: string;
  total_fare: number;
  stops_breakdown: string[];
}
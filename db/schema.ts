export interface Trip {
  id: number;
  name: string;
  start_date: string | null;
  status: 'active' | 'archived';
  is_default: number; // 0 or 1 (SQLite boolean)
  created_at: string;
}

export interface Log {
  id: number;
  trip_id: number;
  latitude: number;
  longitude: number;
  address: string | null;
  notes: string | null;
  created_at: string;
}

export interface Photo {
  id: number;
  log_id: number;
  uri: string;
  thumbnail_uri: string;
  created_at: string;
}

export interface CreateLogInput {
  trip_id: number;
  latitude: number;
  longitude: number;
  notes?: string | null;
}

export interface CreatePhotoInput {
  log_id: number;
  uri: string;
  thumbnail_uri: string;
}

export interface CreateTripInput {
  name: string;
  is_default?: number;
}

export type UserRole = 'model' | 'photographer' | 'admin';

export interface User {
  id: string;
  email: string;
  full_name: string;
  avatar_url?: string;
  role: UserRole;
  account_status: 'pending' | 'approved' | 'rejected';
  created_at: string;
}

export interface ModelProfile {
  id: string;
  user_id: string;
  full_name?: string;
  avatar_url?: string;
  bio: string;
  hourly_rate: number;
  portfolio_images: string[];
  height?: number;
  categories: string[];
  rating: number;
  review_count: number;
  latitude?: number;
  longitude?: number;
  location: {
    latitude: number;
    longitude: number;
    address: string;
  };
}

export interface RecommendedLocation {
  id: string;
  name: string;
  description?: string;
  image_url: string;
  address: string;
  latitude: number;
  longitude: number;
  category: string;
  rating: number;
}

export type BookingStatus = 'pending' | 'confirmed' | 'completed' | 'cancelled';

export interface Booking {
  id: string;
  photographer_id: string;
  model_id: string;
  start_time: string;
  end_time: string;
  status: BookingStatus;
  total_price: number;
  notes?: string;
  created_at: string;
}

export interface ChatMessage {
  id: string;
  conversation_id: string;
  sender_id: string;
  receiver_id: string;
  text: string;
  image_url?: string;
  created_at: string;
}

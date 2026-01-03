// User types
export interface User {
  id: string;
  created_at: string;
  updated_at: string;
}

// Preferences types
export type PriceSensitivity = 'budget' | 'moderate' | 'premium';

export interface Preferences {
  id: string;
  user_id: string;
  cuisine_styles: string[];
  price_sensitivity: PriceSensitivity;
  allergies: string[];
  dislikes: string[];
  created_at: string;
  updated_at: string;
}

export interface PreferencesInput {
  cuisine_styles: string[];
  price_sensitivity: PriceSensitivity;
  allergies: string[];
  dislikes: string[];
}

// Match session types
export interface MatchSession {
  id: string;
  user_id: string;
  menu_image_url: string;
  winelist_image_url: string;
  occasion_note?: string;
  created_at: string;
}

// Recommendation types
export type PriceIndicator = '£' | '££' | '£££';

export interface Recommendation {
  id: string;
  session_id: string;
  food_name: string;
  wine_name: string;
  reasoning: string;
  price_indicator: PriceIndicator;
  rank: 1 | 2 | 3;
  created_at: string;
}

// API request/response types
export interface PairingRequest {
  menuImageUrl: string;
  wineListImageUrl: string;
  preferences: PreferencesInput;
  occasion?: string;
}

export interface PairingResponse {
  recommendations: Omit<Recommendation, 'id' | 'session_id' | 'created_at'>[];
  sessionId: string;
}

export interface RefinementRequest {
  sessionId: string;
  refinement: string;
  previousRecommendations: Omit<Recommendation, 'id' | 'session_id' | 'created_at'>[];
}

// UI state types
export interface CapturedImages {
  menu: string | null;
  wineList: string | null;
}

export type AppScreen = 'capture' | 'loading' | 'results' | 'preferences';

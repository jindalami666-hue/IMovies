export type UserRole = 'user' | 'admin';

export interface User {
  _id: string;
  name: string;
  email: string;
  role: UserRole;
  phone?: string;
}

export interface Movie {
  _id: string;
  title: string;
  synopsis: string;
  poster: string;
  backdrop: string;
  trailerUrl?: string;
  genres: string[];
  duration: number; // minutes
  rating: number; // e.g. 8.8
  ageRating: string; // 'PG-13', 'R'
  releaseDate: string;
  language: string;
  director: string;
  cast: string[];
  isFeatured: boolean;
  status: 'now_showing' | 'coming_soon';
}

export interface Cinema {
  name: string;
  hall: string;
  city: string;
  experience: 'IMAX Laser' | 'Dolby Cinema' | 'VIP Recliner Suite' | 'Standard 4K';
}

export interface Show {
  _id: string;
  movie: Movie;
  cinema: Cinema;
  date: string;
  time: string;
  tierPrices: {
    standard: number;
    premium: number;
    vipRecliner: number;
  };
  seatLayout: {
    rows: number;
    cols: number;
    vipRows: string[];
    premiumRows: string[];
    standardRows: string[];
  };
  bookedSeats: string[];
  isActive: boolean;
}

export interface BookedSeatDetail {
  seatId: string;
  row: string;
  number: number;
  tier: 'VIP' | 'Premium' | 'Standard';
  price: number;
}

export interface Booking {
  _id: string;
  bookingId: string;
  user: string;
  show: string;
  movie: string;
  movieTitle: string;
  moviePoster: string;
  cinemaName: string;
  cinemaHall: string;
  cinemaExperience: string;
  showDate: string;
  showTime: string;
  seats: BookedSeatDetail[];
  subtotal: number;
  bookingFee: number;
  totalAmount: number;
  status: 'confirmed' | 'cancelled';
  customerName: string;
  customerEmail: string;
  paymentMethod: string;
  paymentStatus: 'paid' | 'pending' | 'refunded';
  qrData: string;
  createdAt: string;
}

export interface SystemStatusResponse {
  success: boolean;
  service: string;
  timestamp: string;
  database: {
    status: 'healthy' | 'degraded';
    type: string;
    atlasConnected: boolean;
    uriConfigured: boolean;
    databaseName: string;
    host: string;
    error: string | null;
    instruction: string;
  };
  stats: {
    moviesCount: number;
    showsCount: number;
    bookingsCount: number;
    usersCount: number;
    storage: string;
  };
}

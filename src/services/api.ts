import { Movie, Show, Booking, User, SystemStatusResponse, BookedSeatDetail } from '../types/index.ts';

const TOKEN_KEY = 'imovies_token';

export const authStorage = {
  getToken(): string | null {
    return localStorage.getItem(TOKEN_KEY);
  },
  setToken(token: string): void {
    localStorage.setItem(TOKEN_KEY, token);
  },
  removeToken(): void {
    localStorage.removeItem(TOKEN_KEY);
  },
};

async function request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
  const token = authStorage.getToken();
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(options.headers as Record<string, string>),
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const response = await fetch(endpoint, {
    ...options,
    headers,
  });

  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    throw new Error(data.message || `Request failed with status ${response.status}`);
  }

  return data as T;
}

export const api = {
  // Auth
  async register(body: { name: string; email: string; password: string; phone?: string }) {
    return request<{ success: boolean; token: string; user: User }>('/api/auth/register', {
      method: 'POST',
      body: JSON.stringify(body),
    });
  },

  async login(body: { email: string; password: string }) {
    return request<{ success: boolean; token: string; user: User }>('/api/auth/login', {
      method: 'POST',
      body: JSON.stringify(body),
    });
  },

  async getMe() {
    return request<{ success: boolean; user: User }>('/api/auth/me');
  },

  // Movies
  async getMovies(params?: { genre?: string; search?: string; status?: string }) {
    const query = new URLSearchParams();
    if (params?.genre) query.append('genre', params.genre);
    if (params?.search) query.append('search', params.search);
    if (params?.status) query.append('status', params.status);
    const qs = query.toString() ? `?${query.toString()}` : '';
    return request<{ success: boolean; count: number; movies: Movie[] }>(`/api/movies${qs}`);
  },

  async getMovieById(id: string) {
    return request<{ success: boolean; movie: Movie }>(`/api/movies/${id}`);
  },

  async createMovie(data: Partial<Movie>) {
    return request<{ success: boolean; movie: Movie }>('/api/movies', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  async updateMovie(id: string, data: Partial<Movie>) {
    return request<{ success: boolean; movie: Movie }>(`/api/movies/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  },

  async deleteMovie(id: string) {
    return request<{ success: boolean; message: string }>(`/api/movies/${id}`, {
      method: 'DELETE',
    });
  },

  // Shows
  async getShows(params?: { movieId?: string; date?: string; cinemaName?: string }) {
    const query = new URLSearchParams();
    if (params?.movieId) query.append('movieId', params.movieId);
    if (params?.date) query.append('date', params.date);
    if (params?.cinemaName) query.append('cinemaName', params.cinemaName);
    const qs = query.toString() ? `?${query.toString()}` : '';
    return request<{ success: boolean; count: number; shows: Show[] }>(`/api/shows${qs}`);
  },

  async getShowById(id: string) {
    return request<{ success: boolean; show: Show }>(`/api/shows/${id}`);
  },

  async createShow(data: any) {
    return request<{ success: boolean; show: Show }>('/api/shows', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  async deleteShow(id: string) {
    return request<{ success: boolean; message: string }>(`/api/shows/${id}`, {
      method: 'DELETE',
    });
  },

  // Bookings
  async createBooking(data: {
    showId: string;
    seats: BookedSeatDetail[];
    customerName?: string;
    customerEmail?: string;
    paymentMethod?: string;
  }) {
    return request<{ success: boolean; message: string; booking: Booking }>('/api/bookings', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  async getMyBookings() {
    return request<{ success: boolean; count: number; bookings: Booking[] }>('/api/bookings/my');
  },

  async getBookingById(id: string) {
    return request<{ success: boolean; booking: Booking }>(`/api/bookings/${id}`);
  },

  async cancelBooking(id: string) {
    return request<{ success: boolean; message: string; booking: Booking }>(`/api/bookings/${id}`, {
      method: 'DELETE',
    });
  },

  async getAllBookings() {
    return request<{ success: boolean; count: number; bookings: Booking[] }>('/api/bookings/admin/all');
  },

  // System
  async getStatus() {
    return request<SystemStatusResponse>('/api/status');
  },

  async resetSeedData() {
    return request<{ success: boolean; message: string; stats: any }>('/api/seed', {
      method: 'POST',
    });
  },
};

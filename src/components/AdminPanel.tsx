import React, { useState, useEffect } from 'react';
import {
  Film,
  Calendar,
  Ticket,
  Plus,
  Trash2,
  AlertCircle,
  CheckCircle2,
  DollarSign,
  TrendingUp,
  RefreshCw,
  Database,
  ExternalLink,
} from 'lucide-react';
import { Movie, Show, Booking, SystemStatusResponse } from '../types/index.ts';
import { api } from '../services/api.ts';

export function AdminPanel() {
  const [activeTab, setActiveTab] = useState<'overview' | 'movies' | 'shows' | 'bookings' | 'database'>('overview');
  const [movies, setMovies] = useState<Movie[]>([]);
  const [shows, setShows] = useState<Show[]>([]);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [dbStatus, setDbStatus] = useState<SystemStatusResponse | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [statusMessage, setStatusMessage] = useState<{ text: string; type: 'success' | 'error' } | null>(null);

  // Form states for Add Movie
  const [newMovie, setNewMovie] = useState({
    title: '',
    synopsis: '',
    poster: '/src/assets/images/movie_celestial_horizon_1793195912321.jpg',
    backdrop: '/src/assets/images/hero_cinema_imax_1793195911656.jpg',
    genres: 'Sci-Fi, Action',
    duration: 135,
    rating: 8.5,
    ageRating: 'PG-13',
    language: 'English (Dolby Atmos)',
    director: 'Denis Villeneuve',
    status: 'now_showing' as 'now_showing' | 'coming_soon',
  });

  // Form states for Add Show
  const [newShow, setNewShow] = useState({
    movieId: '',
    cinemaName: 'Starlight IMAX Grand Theatre',
    cinemaHall: 'Auditorium 1 - IMAX Laser',
    city: 'Downtown Core',
    experience: 'IMAX Laser' as const,
    date: '2026-10-28',
    time: '19:30',
    standardPrice: 14.5,
    premiumPrice: 18.5,
    vipPrice: 24.0,
  });

  const loadAllData = async () => {
    setLoading(true);
    try {
      const [moviesRes, showsRes, bookingsRes, statusRes] = await Promise.all([
        api.getMovies(),
        api.getShows(),
        api.getAllBookings(),
        api.getStatus(),
      ]);

      if (moviesRes.success) {
        setMovies(moviesRes.movies);
        if (moviesRes.movies.length > 0 && !newShow.movieId) {
          setNewShow((prev) => ({ ...prev, movieId: moviesRes.movies[0]._id }));
        }
      }
      if (showsRes.success) setShows(showsRes.shows);
      if (bookingsRes.success) setBookings(bookingsRes.bookings);
      if (statusRes.success) setDbStatus(statusRes);
    } catch (err: any) {
      setStatusMessage({ text: err.message || 'Failed to load administrative data', type: 'error' });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAllData();
  }, []);

  const handleCreateMovie = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const genresArray = newMovie.genres.split(',').map((g) => g.trim()).filter(Boolean);
      const res = await api.createMovie({
        ...newMovie,
        genres: genresArray,
      });

      if (res.success) {
        setStatusMessage({ text: `Movie "${res.movie.title}" created successfully!`, type: 'success' });
        setNewMovie({
          title: '',
          synopsis: '',
          poster: '/src/assets/images/movie_celestial_horizon_1793195912321.jpg',
          backdrop: '/src/assets/images/hero_cinema_imax_1793195911656.jpg',
          genres: 'Sci-Fi, Action',
          duration: 135,
          rating: 8.5,
          ageRating: 'PG-13',
          language: 'English (Dolby Atmos)',
          director: 'Christopher Nolan',
          status: 'now_showing',
        });
        await loadAllData();
      }
    } catch (err: any) {
      setStatusMessage({ text: err.message || 'Failed to create movie', type: 'error' });
    }
  };

  const handleDeleteMovie = async (movieId: string, title: string) => {
    if (!window.confirm(`Delete movie "${title}" and its associated schedule?`)) return;
    try {
      const res = await api.deleteMovie(movieId);
      if (res.success) {
        setStatusMessage({ text: `Movie "${title}" removed successfully.`, type: 'success' });
        await loadAllData();
      }
    } catch (err: any) {
      setStatusMessage({ text: err.message || 'Failed to delete movie', type: 'error' });
    }
  };

  const handleCreateShow = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await api.createShow({
        movie: newShow.movieId,
        cinema: {
          name: newShow.cinemaName,
          hall: newShow.cinemaHall,
          city: newShow.city,
          experience: newShow.experience,
        },
        date: newShow.date,
        time: newShow.time,
        tierPrices: {
          standard: Number(newShow.standardPrice),
          premium: Number(newShow.premiumPrice),
          vipRecliner: Number(newShow.vipPrice),
        },
      });

      if (res.success) {
        setStatusMessage({ text: 'Screening showtime scheduled successfully!', type: 'success' });
        await loadAllData();
      }
    } catch (err: any) {
      setStatusMessage({ text: err.message || 'Failed to schedule showtime', type: 'error' });
    }
  };

  const handleDeleteShow = async (showId: string) => {
    if (!window.confirm('Delete this showtime screening?')) return;
    try {
      const res = await api.deleteShow(showId);
      if (res.success) {
        setStatusMessage({ text: 'Showtime deleted.', type: 'success' });
        await loadAllData();
      }
    } catch (err: any) {
      setStatusMessage({ text: err.message || 'Failed to delete show', type: 'error' });
    }
  };

  const handleResetSeed = async () => {
    if (!window.confirm('Reset all movies, shows, and bookings back to initial sample seed data?')) return;
    try {
      const res = await api.resetSeedData();
      if (res.success) {
        setStatusMessage({ text: 'Database reset to clean sample seed data.', type: 'success' });
        await loadAllData();
      }
    } catch (err: any) {
      setStatusMessage({ text: err.message, type: 'error' });
    }
  };

  const totalRevenue = bookings
    .filter((b) => b.status === 'confirmed')
    .reduce((acc, curr) => acc + curr.totalAmount, 0);

  const totalTicketsSold = bookings
    .filter((b) => b.status === 'confirmed')
    .reduce((acc, curr) => acc + curr.seats.length, 0);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      {/* Admin Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-800">
        <div>
          <span className="text-xs text-rose-400 font-mono font-semibold tracking-wider uppercase block">
            Executive Portal
          </span>
          <h1 className="text-2xl sm:text-3xl font-bold text-white font-display">
            IMovies Cinema Administration
          </h1>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={handleResetSeed}
            className="px-3.5 py-2 bg-slate-900 hover:bg-slate-800 border border-slate-700 text-slate-300 text-xs font-mono rounded-xl flex items-center gap-1.5 transition-colors cursor-pointer"
          >
            <RefreshCw className="w-3.5 h-3.5 text-amber-400" />
            <span>Reset Sample Data</span>
          </button>
        </div>
      </div>

      {/* Status Alert Banner */}
      {statusMessage && (
        <div
          className={`p-4 rounded-xl text-xs flex items-center justify-between gap-2 ${
            statusMessage.type === 'success'
              ? 'bg-emerald-950/60 border border-emerald-800 text-emerald-300'
              : 'bg-red-950/60 border border-red-800 text-rose-300'
          }`}
        >
          <div className="flex items-center gap-2">
            {statusMessage.type === 'success' ? (
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
            ) : (
              <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />
            )}
            <span>{statusMessage.text}</span>
          </div>
          <button
            onClick={() => setStatusMessage(null)}
            className="text-slate-400 hover:text-white font-bold"
          >
            ×
          </button>
        </div>
      )}

      {/* Navigation Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 border-b border-slate-800">
        <button
          onClick={() => setActiveTab('overview')}
          className={`px-4 py-2 text-xs font-semibold rounded-lg transition-colors whitespace-nowrap cursor-pointer ${
            activeTab === 'overview'
              ? 'bg-amber-400 text-slate-950 font-bold'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          Overview & KPI
        </button>
        <button
          onClick={() => setActiveTab('movies')}
          className={`px-4 py-2 text-xs font-semibold rounded-lg transition-colors whitespace-nowrap cursor-pointer ${
            activeTab === 'movies'
              ? 'bg-amber-400 text-slate-950 font-bold'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          Movies Catalog ({movies.length})
        </button>
        <button
          onClick={() => setActiveTab('shows')}
          className={`px-4 py-2 text-xs font-semibold rounded-lg transition-colors whitespace-nowrap cursor-pointer ${
            activeTab === 'shows'
              ? 'bg-amber-400 text-slate-950 font-bold'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          Showtimes Scheduler ({shows.length})
        </button>
        <button
          onClick={() => setActiveTab('bookings')}
          className={`px-4 py-2 text-xs font-semibold rounded-lg transition-colors whitespace-nowrap cursor-pointer ${
            activeTab === 'bookings'
              ? 'bg-amber-400 text-slate-950 font-bold'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          All Bookings ({bookings.length})
        </button>
        <button
          onClick={() => setActiveTab('database')}
          className={`px-4 py-2 text-xs font-semibold rounded-lg transition-colors whitespace-nowrap cursor-pointer flex items-center gap-1.5 ${
            activeTab === 'database'
              ? 'bg-amber-400 text-slate-950 font-bold'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <Database className="w-3.5 h-3.5" />
          <span>MongoDB Atlas Sync</span>
        </button>
      </div>

      {/* Tab 1: Overview */}
      {activeTab === 'overview' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="p-5 bg-[#121620] border border-slate-800 rounded-2xl space-y-1">
              <span className="text-xs text-slate-400 font-mono uppercase">Total Gross Revenue</span>
              <p className="text-2xl font-bold text-white font-mono tabular-nums">
                ${totalRevenue.toFixed(2)}
              </p>
              <span className="text-[11px] text-emerald-400 flex items-center gap-1 font-mono">
                <TrendingUp className="w-3 h-3" />
                Live bookings stream
              </span>
            </div>

            <div className="p-5 bg-[#121620] border border-slate-800 rounded-2xl space-y-1">
              <span className="text-xs text-slate-400 font-mono uppercase">Tickets Reserved</span>
              <p className="text-2xl font-bold text-amber-400 font-mono tabular-nums">
                {totalTicketsSold}
              </p>
              <span className="text-[11px] text-slate-400 font-mono">Across all auditorium screenings</span>
            </div>

            <div className="p-5 bg-[#121620] border border-slate-800 rounded-2xl space-y-1">
              <span className="text-xs text-slate-400 font-mono uppercase">Active Movies</span>
              <p className="text-2xl font-bold text-white font-mono tabular-nums">{movies.length}</p>
              <span className="text-[11px] text-slate-400 font-mono">In cinema catalog</span>
            </div>

            <div className="p-5 bg-[#121620] border border-slate-800 rounded-2xl space-y-1">
              <span className="text-xs text-slate-400 font-mono uppercase">Active Shows Scheduled</span>
              <p className="text-2xl font-bold text-white font-mono tabular-nums">{shows.length}</p>
              <span className="text-[11px] text-slate-400 font-mono">With seat layouts ready</span>
            </div>
          </div>

          {/* Quick Database Status Summary Card */}
          <div className="p-6 bg-[#141A26] border border-slate-800 rounded-2xl space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Database className="w-5 h-5 text-amber-400" />
                <h3 className="text-base font-bold text-white font-display">MongoDB Atlas Engine</h3>
              </div>
              <span
                className={`px-2.5 py-1 text-xs font-mono font-semibold rounded-md ${
                  dbStatus?.database.atlasConnected
                    ? 'bg-emerald-950 text-emerald-300 border border-emerald-800'
                    : 'bg-amber-950/80 text-amber-300 border border-amber-800'
                }`}
              >
                {dbStatus?.database.type}
              </span>
            </div>
            <p className="text-xs text-slate-300 leading-relaxed">
              {dbStatus?.database.instruction}
            </p>
            <div className="pt-2 flex items-center gap-3">
              <button
                onClick={() => setActiveTab('database')}
                className="px-4 py-2 bg-slate-900 hover:bg-slate-800 border border-slate-700 text-slate-200 text-xs font-medium rounded-lg transition-colors cursor-pointer"
              >
                View MongoDB Connection Guide
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Tab 2: Movies Catalog */}
      {activeTab === 'movies' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Add Movie Form */}
          <div className="lg:col-span-1 bg-[#121620] border border-slate-800 rounded-2xl p-5 space-y-4">
            <h3 className="text-base font-bold text-white font-display flex items-center gap-2">
              <Plus className="w-4 h-4 text-amber-400" />
              Add New Movie
            </h3>

            <form onSubmit={handleCreateMovie} className="space-y-3 text-xs">
              <div>
                <label className="text-slate-400 block mb-1">Movie Title</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Dune: Part Three"
                  value={newMovie.title}
                  onChange={(e) => setNewMovie({ ...newMovie, title: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-900 border border-slate-800 rounded-lg text-white focus:outline-none focus:border-amber-400"
                />
              </div>

              <div>
                <label className="text-slate-400 block mb-1">Synopsis</label>
                <textarea
                  required
                  rows={3}
                  placeholder="Compelling plot summary..."
                  value={newMovie.synopsis}
                  onChange={(e) => setNewMovie({ ...newMovie, synopsis: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-900 border border-slate-800 rounded-lg text-white focus:outline-none focus:border-amber-400"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-slate-400 block mb-1">Duration (min)</label>
                  <input
                    type="number"
                    required
                    value={newMovie.duration}
                    onChange={(e) => setNewMovie({ ...newMovie, duration: Number(e.target.value) })}
                    className="w-full px-3 py-2 bg-slate-900 border border-slate-800 rounded-lg text-white focus:outline-none focus:border-amber-400"
                  />
                </div>
                <div>
                  <label className="text-slate-400 block mb-1">Rating (0-10)</label>
                  <input
                    type="number"
                    step="0.1"
                    value={newMovie.rating}
                    onChange={(e) => setNewMovie({ ...newMovie, rating: Number(e.target.value) })}
                    className="w-full px-3 py-2 bg-slate-900 border border-slate-800 rounded-lg text-white focus:outline-none focus:border-amber-400"
                  />
                </div>
              </div>

              <div>
                <label className="text-slate-400 block mb-1">Genres (comma separated)</label>
                <input
                  type="text"
                  placeholder="Sci-Fi, Action, Thriller"
                  value={newMovie.genres}
                  onChange={(e) => setNewMovie({ ...newMovie, genres: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-900 border border-slate-800 rounded-lg text-white focus:outline-none focus:border-amber-400"
                />
              </div>

              <div>
                <label className="text-slate-400 block mb-1">Director</label>
                <input
                  type="text"
                  value={newMovie.director}
                  onChange={(e) => setNewMovie({ ...newMovie, director: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-900 border border-slate-800 rounded-lg text-white focus:outline-none focus:border-amber-400"
                />
              </div>

              <div>
                <label className="text-slate-400 block mb-1">Poster Image URL or Path</label>
                <input
                  type="text"
                  value={newMovie.poster}
                  onChange={(e) => setNewMovie({ ...newMovie, poster: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-900 border border-slate-800 rounded-lg text-white font-mono text-[11px] focus:outline-none focus:border-amber-400"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-slate-400 block mb-1">Age Rating</label>
                  <select
                    value={newMovie.ageRating}
                    onChange={(e) => setNewMovie({ ...newMovie, ageRating: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-900 border border-slate-800 rounded-lg text-white focus:outline-none focus:border-amber-400"
                  >
                    <option value="G">G</option>
                    <option value="PG">PG</option>
                    <option value="PG-13">PG-13</option>
                    <option value="R">R</option>
                  </select>
                </div>
                <div>
                  <label className="text-slate-400 block mb-1">Status</label>
                  <select
                    value={newMovie.status}
                    onChange={(e) => setNewMovie({ ...newMovie, status: e.target.value as any })}
                    className="w-full px-3 py-2 bg-slate-900 border border-slate-800 rounded-lg text-white focus:outline-none focus:border-amber-400"
                  >
                    <option value="now_showing">Now Showing</option>
                    <option value="coming_soon">Coming Soon</option>
                  </select>
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-2.5 bg-red-600 hover:bg-red-500 text-white font-bold rounded-xl transition-colors mt-2 cursor-pointer uppercase tracking-wider font-display"
              >
                Add Movie to MongoDB
              </button>
            </form>
          </div>

          {/* Existing Movies List */}
          <div className="lg:col-span-2 space-y-3">
            <h3 className="text-base font-bold text-white font-display">Existing Movies ({movies.length})</h3>
            <div className="space-y-3">
              {movies.map((m) => (
                <div
                  key={m._id}
                  className="p-4 bg-[#121620] border border-slate-800 rounded-2xl flex items-center justify-between gap-4"
                >
                  <div className="flex items-center gap-3">
                    <img
                      src={m.poster}
                      alt={m.title}
                      className="w-12 h-16 object-cover rounded-lg border border-slate-800 shrink-0"
                    />
                    <div>
                      <h4 className="text-sm font-bold text-white font-display">{m.title}</h4>
                      <p className="text-xs text-slate-400 font-mono">
                        {m.genres.join(', ')} · {m.duration}m · {m.rating}★
                      </p>
                      <span className="text-[10px] text-amber-400 font-mono uppercase">{m.status}</span>
                    </div>
                  </div>

                  <button
                    onClick={() => handleDeleteMovie(m._id, m.title)}
                    className="p-2 text-slate-400 hover:text-rose-400 rounded-lg bg-slate-900 border border-slate-800 transition-colors cursor-pointer"
                    title="Delete Movie"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Tab 3: Shows Scheduler */}
      {activeTab === 'shows' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Add Show Form */}
          <div className="lg:col-span-1 bg-[#121620] border border-slate-800 rounded-2xl p-5 space-y-4">
            <h3 className="text-base font-bold text-white font-display flex items-center gap-2">
              <Calendar className="w-4 h-4 text-amber-400" />
              Schedule Showtime
            </h3>

            <form onSubmit={handleCreateShow} className="space-y-3 text-xs">
              <div>
                <label className="text-slate-400 block mb-1">Movie</label>
                <select
                  required
                  value={newShow.movieId}
                  onChange={(e) => setNewShow({ ...newShow, movieId: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-900 border border-slate-800 rounded-lg text-white focus:outline-none focus:border-amber-400"
                >
                  {movies.map((m) => (
                    <option key={m._id} value={m._id}>
                      {m.title}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-slate-400 block mb-1">Cinema Venue</label>
                <select
                  value={newShow.cinemaName}
                  onChange={(e) => setNewShow({ ...newShow, cinemaName: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-900 border border-slate-800 rounded-lg text-white focus:outline-none focus:border-amber-400"
                >
                  <option value="Starlight IMAX Grand Theatre">Starlight IMAX Grand Theatre</option>
                  <option value="CineLuxe Dolby Cinema">CineLuxe Dolby Cinema</option>
                  <option value="Onyx VIP Club Cinema">Onyx VIP Club Cinema</option>
                </select>
              </div>

              <div>
                <label className="text-slate-400 block mb-1">Hall / Screen Name</label>
                <input
                  type="text"
                  value={newShow.cinemaHall}
                  onChange={(e) => setNewShow({ ...newShow, cinemaHall: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-900 border border-slate-800 rounded-lg text-white focus:outline-none focus:border-amber-400"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-slate-400 block mb-1">Date</label>
                  <input
                    type="date"
                    required
                    value={newShow.date}
                    onChange={(e) => setNewShow({ ...newShow, date: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-900 border border-slate-800 rounded-lg text-white focus:outline-none focus:border-amber-400"
                  />
                </div>
                <div>
                  <label className="text-slate-400 block mb-1">Time</label>
                  <input
                    type="time"
                    required
                    value={newShow.time}
                    onChange={(e) => setNewShow({ ...newShow, time: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-900 border border-slate-800 rounded-lg text-white focus:outline-none focus:border-amber-400"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-2">
                <div>
                  <label className="text-slate-400 block mb-1">Standard $</label>
                  <input
                    type="number"
                    step="0.5"
                    value={newShow.standardPrice}
                    onChange={(e) => setNewShow({ ...newShow, standardPrice: Number(e.target.value) })}
                    className="w-full px-3 py-2 bg-slate-900 border border-slate-800 rounded-lg text-white focus:outline-none focus:border-amber-400"
                  />
                </div>
                <div>
                  <label className="text-slate-400 block mb-1">Premium $</label>
                  <input
                    type="number"
                    step="0.5"
                    value={newShow.premiumPrice}
                    onChange={(e) => setNewShow({ ...newShow, premiumPrice: Number(e.target.value) })}
                    className="w-full px-3 py-2 bg-slate-900 border border-slate-800 rounded-lg text-white focus:outline-none focus:border-amber-400"
                  />
                </div>
                <div>
                  <label className="text-slate-400 block mb-1">VIP $</label>
                  <input
                    type="number"
                    step="0.5"
                    value={newShow.vipPrice}
                    onChange={(e) => setNewShow({ ...newShow, vipPrice: Number(e.target.value) })}
                    className="w-full px-3 py-2 bg-slate-900 border border-slate-800 rounded-lg text-white focus:outline-none focus:border-amber-400"
                  />
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-2.5 bg-red-600 hover:bg-red-500 text-white font-bold rounded-xl transition-colors mt-2 cursor-pointer uppercase tracking-wider font-display"
              >
                Schedule Screening
              </button>
            </form>
          </div>

          {/* Existing Shows List */}
          <div className="lg:col-span-2 space-y-3">
            <h3 className="text-base font-bold text-white font-display">Active Screenings ({shows.length})</h3>
            <div className="space-y-3">
              {shows.map((s) => (
                <div
                  key={s._id}
                  className="p-4 bg-[#121620] border border-slate-800 rounded-2xl flex items-center justify-between gap-4"
                >
                  <div>
                    <h4 className="text-sm font-bold text-white font-display">
                      {s.movie?.title || 'Screening'}
                    </h4>
                    <p className="text-xs text-amber-400 font-mono">
                      {s.cinema.name} ({s.cinema.hall})
                    </p>
                    <p className="text-xs text-slate-400 font-mono mt-0.5">
                      {s.date} at {s.time} · {s.bookedSeats.length} / {s.seatLayout.rows * s.seatLayout.cols} seats booked
                    </p>
                  </div>

                  <button
                    onClick={() => handleDeleteShow(s._id)}
                    className="p-2 text-slate-400 hover:text-rose-400 rounded-lg bg-slate-900 border border-slate-800 transition-colors cursor-pointer"
                    title="Cancel Screening"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Tab 4: All Bookings */}
      {activeTab === 'bookings' && (
        <div className="bg-[#121620] border border-slate-800 rounded-2xl overflow-hidden">
          <div className="p-4 border-b border-slate-800 flex items-center justify-between">
            <h3 className="text-base font-bold text-white font-display">All Platform Reservations</h3>
            <span className="text-xs text-slate-400 font-mono">{bookings.length} total records</span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-900 text-slate-400 font-mono uppercase tracking-wider border-b border-slate-800">
                <tr>
                  <th className="p-3">Reference</th>
                  <th className="p-3">Customer</th>
                  <th className="p-3">Movie & Cinema</th>
                  <th className="p-3">Date & Time</th>
                  <th className="p-3">Seats</th>
                  <th className="p-3 text-right">Amount</th>
                  <th className="p-3 text-center">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800 font-mono">
                {bookings.map((b) => (
                  <tr key={b._id} className="hover:bg-slate-900/40">
                    <td className="p-3 font-bold text-amber-400">{b.bookingId}</td>
                    <td className="p-3 text-slate-200">
                      <div>{b.customerName}</div>
                      <div className="text-[10px] text-slate-500">{b.customerEmail}</div>
                    </td>
                    <td className="p-3 text-slate-300">
                      <div className="font-bold text-white">{b.movieTitle}</div>
                      <div className="text-[10px] text-slate-500">{b.cinemaName}</div>
                    </td>
                    <td className="p-3 text-slate-400">
                      {b.showDate} {b.showTime}
                    </td>
                    <td className="p-3">
                      <div className="flex flex-wrap gap-1">
                        {b.seats.map((s) => (
                          <span
                            key={s.seatId}
                            className="px-1.5 py-0.5 bg-slate-900 border border-slate-700 rounded text-[10px] text-slate-300"
                          >
                            {s.seatId}
                          </span>
                        ))}
                      </div>
                    </td>
                    <td className="p-3 text-right font-bold text-white tabular-nums">
                      ${b.totalAmount.toFixed(2)}
                    </td>
                    <td className="p-3 text-center">
                      <span
                        className={`px-2 py-0.5 rounded text-[10px] font-semibold uppercase ${
                          b.status === 'confirmed'
                            ? 'bg-emerald-950 text-emerald-300 border border-emerald-800'
                            : 'bg-slate-800 text-slate-400'
                        }`}
                      >
                        {b.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Tab 5: MongoDB Atlas Connection Guide */}
      {activeTab === 'database' && (
        <div className="space-y-6">
          <div className="p-6 bg-[#121620] border border-slate-800 rounded-3xl space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-600/20 border border-emerald-500/30 flex items-center justify-center">
                <Database className="w-5 h-5 text-emerald-400" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-white font-display">MongoDB Atlas Architecture</h3>
                <p className="text-xs text-slate-400 font-mono">
                  Engine: {dbStatus?.database.type} · Database: {dbStatus?.database.databaseName}
                </p>
              </div>
            </div>

            <div className="p-4 bg-slate-900/80 rounded-2xl border border-slate-800 space-y-2 text-xs text-slate-300">
              <p className="font-semibold text-white">How MERN Persistence Works in IMovies:</p>
              <ul className="list-disc pl-5 space-y-1.5 text-slate-400">
                <li>
                  <strong className="text-slate-200">Mongoose Models:</strong> Defined in <code className="text-amber-400">/server/models/</code> with strict schemas for Users, Movies, Shows, and Bookings.
                </li>
                <li>
                  <strong className="text-slate-200">Atomic Seat Locking:</strong> When booking seats, MongoDB executes an atomic <code className="text-amber-400">findOneAndUpdate</code> with a <code className="text-amber-400">$nin</code> filter to guarantee no duplicate seat reservations can ever take place.
                </li>
                <li>
                  <strong className="text-slate-200">Zero-Downtime Sandbox:</strong> If you are testing before adding your Atlas credentials, the built-in repository stores everything seamlessly and lets you test booking flows instantly.
                </li>
              </ul>
            </div>

            <div className="space-y-3">
              <h4 className="text-sm font-bold text-white font-display">
                Connecting Your Free MongoDB Atlas Database:
              </h4>

              <div className="space-y-2 text-xs text-slate-300">
                <div className="p-3 bg-slate-900 rounded-xl border border-slate-800 flex items-start gap-3">
                  <span className="w-5 h-5 rounded-full bg-amber-400/20 text-amber-300 flex items-center justify-center font-mono font-bold shrink-0">1</span>
                  <div>
                    <strong className="text-white">Create a Free M0 Cluster:</strong> Go to <span className="text-amber-400">mongodb.com/cloud/atlas</span> and sign up for a free Shared cluster (M0).
                  </div>
                </div>

                <div className="p-3 bg-slate-900 rounded-xl border border-slate-800 flex items-start gap-3">
                  <span className="w-5 h-5 rounded-full bg-amber-400/20 text-amber-300 flex items-center justify-center font-mono font-bold shrink-0">2</span>
                  <div>
                    <strong className="text-white">Configure Network Access:</strong> In Atlas Security → Network Access, add IP address <code className="text-amber-400">0.0.0.0/0</code> (Allow Access from Anywhere) so Cloud Run / web servers can connect.
                  </div>
                </div>

                <div className="p-3 bg-slate-900 rounded-xl border border-slate-800 flex items-start gap-3">
                  <span className="w-5 h-5 rounded-full bg-amber-400/20 text-amber-300 flex items-center justify-center font-mono font-bold shrink-0">3</span>
                  <div>
                    <strong className="text-white">Create Database User:</strong> In Security → Database Access, create a user (e.g. <code className="text-amber-400">imovies_user</code>) with read and write privileges.
                  </div>
                </div>

                <div className="p-3 bg-slate-900 rounded-xl border border-slate-800 flex items-start gap-3">
                  <span className="w-5 h-5 rounded-full bg-amber-400/20 text-amber-300 flex items-center justify-center font-mono font-bold shrink-0">4</span>
                  <div>
                    <strong className="text-white">Get Connection String:</strong> Click "Connect" → "Drivers" (Node.js) and copy your URI:
                    <div className="mt-2 p-2.5 bg-black/60 rounded-lg font-mono text-[11px] text-amber-300 select-all border border-slate-800">
                      mongodb+srv://&lt;username&gt;:&lt;password&gt;@cluster0.abcde.mongodb.net/imovies?retryWrites=true&amp;w=majority
                    </div>
                  </div>
                </div>

                <div className="p-3 bg-slate-900 rounded-xl border border-slate-800 flex items-start gap-3">
                  <span className="w-5 h-5 rounded-full bg-amber-400/20 text-amber-300 flex items-center justify-center font-mono font-bold shrink-0">5</span>
                  <div>
                    <strong className="text-white">Set Environment Secret:</strong> Add <code className="text-amber-400">MONGODB_URI</code> to your environment or Google Cloud Run revision variables. The server will automatically connect to Atlas on start!
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

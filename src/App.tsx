import React, { useState, useEffect } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext.tsx';
import { Navbar } from './components/Navbar.tsx';
import { HeroBanner } from './components/HeroBanner.tsx';
import { MovieFilter } from './components/MovieFilter.tsx';
import { MovieCard } from './components/MovieCard.tsx';
import { MovieDetailsModal } from './components/MovieDetailsModal.tsx';
import { SeatBookingModal } from './components/SeatBookingModal.tsx';
import { TicketPassModal } from './components/TicketPassModal.tsx';
import { MyBookingsView } from './components/MyBookingsView.tsx';
import { AdminPanel } from './components/AdminPanel.tsx';
import { CinemasView } from './components/CinemasView.tsx';
import { DatabaseStatusView } from './components/DatabaseStatusView.tsx';
import { AuthModal } from './components/AuthModal.tsx';
import { Movie, Booking } from './types/index.ts';
import { api } from './services/api.ts';
import { Film, Sparkles, Shield, Heart, ArrowRight } from 'lucide-react';

function MainApp() {
  const [activeTab, setActiveTab] = useState<'movies' | 'cinemas' | 'bookings' | 'admin' | 'db-status'>('movies');
  const [movies, setMovies] = useState<Movie[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedGenre, setSelectedGenre] = useState<string>('All');
  const [selectedDate, setSelectedDate] = useState<string>('2026-10-28');
  const [selectedCinema, setSelectedCinema] = useState<string>('All Cinemas');
  const [isAtlasConnected, setIsAtlasConnected] = useState<boolean>(false);

  // Modals state
  const [selectedMovieForDetails, setSelectedMovieForDetails] = useState<Movie | null>(null);
  const [selectedMovieForBooking, setSelectedMovieForBooking] = useState<Movie | null>(null);
  const [confirmedBooking, setConfirmedBooking] = useState<Booking | null>(null);

  const loadMovies = async () => {
    setLoading(true);
    try {
      const res = await api.getMovies({
        genre: selectedGenre !== 'All' ? selectedGenre : undefined,
        search: searchQuery.trim() || undefined,
      });
      if (res.success) {
        setMovies(res.movies);
      }
    } catch (err) {
      console.error('Failed to load movies:', err);
    } finally {
      setLoading(false);
    }
  };

  const checkDbStatus = async () => {
    try {
      const statusRes = await api.getStatus();
      if (statusRes.success) {
        setIsAtlasConnected(statusRes.database.atlasConnected);
      }
    } catch {
      // ignore
    }
  };

  useEffect(() => {
    loadMovies();
  }, [selectedGenre, searchQuery]);

  useEffect(() => {
    checkDbStatus();
  }, []);

  const featuredMovie = movies.find((m) => m.isFeatured) || movies[0] || null;

  const handleBookNow = (movie: Movie) => {
    setSelectedMovieForBooking(movie);
  };

  const handleViewDetails = (movie: Movie) => {
    setSelectedMovieForDetails(movie);
  };

  const handleBookingSuccess = (booking: Booking) => {
    setSelectedMovieForBooking(null);
    setConfirmedBooking(booking);
  };

  const handleSelectCinemaForBooking = (cinemaName: string) => {
    setSelectedCinema(cinemaName);
    setActiveTab('movies');
  };

  return (
    <div className="min-h-screen bg-[#0B0E14] text-slate-100 flex flex-col selection:bg-red-600 selection:text-white">
      {/* 3-Zone Top Navigation */}
      <Navbar
        activeTab={activeTab}
        onSelectTab={(tab) => {
          setActiveTab(tab);
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
        isAtlasConnected={isAtlasConnected}
      />

      {/* Main View Router */}
      <main className="flex-1">
        {activeTab === 'movies' && (
          <div className="space-y-6 pb-20">
            {/* Cinematic Hero Showcase */}
            <HeroBanner
              movie={featuredMovie}
              onBookNow={handleBookNow}
              onViewDetails={handleViewDetails}
            />

            {/* Filter Controls: Search, Genres, Dates, Venues */}
            <MovieFilter
              searchQuery={searchQuery}
              onSearchChange={setSearchQuery}
              selectedGenre={selectedGenre}
              onSelectGenre={setSelectedGenre}
              selectedDate={selectedDate}
              onSelectDate={setSelectedDate}
              selectedCinema={selectedCinema}
              onSelectCinema={setSelectedCinema}
            />

            {/* Movies Catalog Grid */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-4 space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-xl sm:text-2xl font-bold text-white font-display">
                    Now Showing in Auditoriums
                  </h2>
                  <p className="text-xs text-slate-400 font-mono mt-0.5">
                    {selectedCinema !== 'All Cinemas' ? `Filtered by ${selectedCinema} · ` : ''}
                    {movies.length} titles available
                  </p>
                </div>
              </div>

              {loading ? (
                <div className="py-24 text-center text-slate-500 text-sm">
                  Loading movies catalog from MongoDB...
                </div>
              ) : movies.length === 0 ? (
                <div className="py-16 text-center space-y-3 bg-[#111520] border border-slate-800 rounded-3xl p-8">
                  <Film className="w-12 h-12 text-slate-600 mx-auto" />
                  <h3 className="text-lg font-bold text-white font-display">No Movies Found</h3>
                  <p className="text-xs text-slate-400 max-w-sm mx-auto">
                    No movies match "{searchQuery}" with genre "{selectedGenre}". Try resetting filters.
                  </p>
                  <button
                    onClick={() => {
                      setSearchQuery('');
                      setSelectedGenre('All');
                    }}
                    className="mt-2 px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold rounded-xl transition-colors cursor-pointer"
                  >
                    Reset Filters
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                  {movies.map((movie) => (
                    <MovieCard
                      key={movie._id}
                      movie={movie}
                      onSelectMovie={handleViewDetails}
                      onBookMovie={handleBookNow}
                    />
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {activeTab === 'cinemas' && (
          <CinemasView
            onSelectCinemaForBooking={handleSelectCinemaForBooking}
            movies={movies}
          />
        )}

        {activeTab === 'bookings' && (
          <MyBookingsView onExploreMovies={() => setActiveTab('movies')} />
        )}

        {activeTab === 'admin' && <AdminPanel />}

        {activeTab === 'db-status' && <DatabaseStatusView />}
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-800/80 bg-[#0B0E14] py-10 px-4 sm:px-6 lg:px-8 text-xs text-slate-500">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-red-600 flex items-center justify-center text-white font-bold font-display text-sm">
              I
            </div>
            <span className="font-bold text-slate-300 font-display text-sm tracking-wide">
              IMOVIES TICKET SYSTEM
            </span>
            <span className="text-slate-600">·</span>
            <span>MERN Stack (MongoDB Atlas · Express · React · Node.js)</span>
          </div>

          <div className="flex flex-wrap items-center gap-6 text-slate-400">
            <button
              onClick={() => setActiveTab('movies')}
              className="hover:text-white transition-colors cursor-pointer"
            >
              Movies
            </button>
            <button
              onClick={() => setActiveTab('cinemas')}
              className="hover:text-white transition-colors cursor-pointer"
            >
              Cinemas
            </button>
            <button
              onClick={() => setActiveTab('bookings')}
              className="hover:text-white transition-colors cursor-pointer"
            >
              My Bookings
            </button>
            <button
              onClick={() => setActiveTab('db-status')}
              className="hover:text-amber-400 transition-colors cursor-pointer font-mono"
            >
              MongoDB Atlas Config
            </button>
          </div>

          <p className="text-[11px] font-mono text-slate-600">
            © 2026 IMovies Inc. All rights reserved.
          </p>
        </div>
      </footer>

      {/* Interactive Modals */}
      {selectedMovieForBooking && (
        <SeatBookingModal
          movie={selectedMovieForBooking}
          selectedDate={selectedDate}
          onClose={() => setSelectedMovieForBooking(null)}
          onBookingSuccess={handleBookingSuccess}
        />
      )}

      {selectedMovieForDetails && (
        <MovieDetailsModal
          movie={selectedMovieForDetails}
          onClose={() => setSelectedMovieForDetails(null)}
          onBookNow={handleBookNow}
        />
      )}

      {confirmedBooking && (
        <TicketPassModal
          booking={confirmedBooking}
          onClose={() => setConfirmedBooking(null)}
        />
      )}

      {/* Login & Register Modal */}
      <AuthModal />
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <MainApp />
    </AuthProvider>
  );
}

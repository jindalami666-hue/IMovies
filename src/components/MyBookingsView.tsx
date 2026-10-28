import React, { useState, useEffect } from 'react';
import { Ticket, Calendar, Clock, MapPin, AlertCircle, XCircle, ArrowRight, Eye } from 'lucide-react';
import { Booking } from '../types/index.ts';
import { api } from '../services/api.ts';
import { useAuth } from '../context/AuthContext.tsx';
import { TicketPassModal } from './TicketPassModal.tsx';

interface MyBookingsViewProps {
  onExploreMovies: () => void;
}

export function MyBookingsView({ onExploreMovies }: MyBookingsViewProps) {
  const { user, isAuthenticated, openAuthModal } = useAuth();
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedPass, setSelectedPass] = useState<Booking | null>(null);
  const [cancellingId, setCancellingId] = useState<string | null>(null);

  const fetchBookings = async () => {
    if (!isAuthenticated) {
      setLoading(false);
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const res = await api.getMyBookings();
      if (res.success) {
        setBookings(res.bookings);
      }
    } catch (err: any) {
      setError(err.message || 'Failed to retrieve your bookings');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBookings();
  }, [isAuthenticated]);

  const handleCancel = async (bookingId: string) => {
    if (!window.confirm(`Are you sure you want to cancel booking ${bookingId}? Seats will be released immediately.`)) {
      return;
    }

    setCancellingId(bookingId);
    try {
      const res = await api.cancelBooking(bookingId);
      if (res.success) {
        await fetchBookings();
      }
    } catch (err: any) {
      alert(`Cancellation failed: ${err.message}`);
    } finally {
      setCancellingId(null);
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-16 text-center">
        <div className="w-16 h-16 bg-red-600/10 border border-red-500/20 rounded-2xl flex items-center justify-center mx-auto mb-4">
          <Ticket className="w-8 h-8 text-amber-400" />
        </div>
        <h2 className="text-2xl font-bold text-white font-display">Sign In to View Your Bookings</h2>
        <p className="text-sm text-slate-400 max-w-md mx-auto mt-2">
          Your confirmed reservations, e-tickets, and seat details are securely stored in MongoDB under your account.
        </p>
        <button
          onClick={() => openAuthModal('login')}
          className="mt-6 px-6 py-3 bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold text-xs uppercase tracking-wider rounded-xl transition-colors cursor-pointer font-display"
        >
          Sign In / Create Account
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-6">
      {/* View Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-800">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-white font-display">My Cinema Bookings</h1>
          <p className="text-xs text-slate-400 mt-1 font-mono">
            Account: {user?.email} · {bookings.length} reservations
          </p>
        </div>

        <button
          onClick={onExploreMovies}
          className="px-4 py-2 bg-slate-900 hover:bg-slate-800 border border-slate-700 text-slate-200 text-xs font-medium rounded-xl flex items-center gap-1.5 transition-colors cursor-pointer self-start sm:self-auto"
        >
          <span>Explore More Movies</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>

      {error && (
        <div className="p-4 bg-red-950/60 border border-red-800 rounded-xl text-rose-300 text-xs flex items-center gap-2">
          <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {loading ? (
        <div className="py-20 text-center text-slate-500 text-sm">
          Loading your booking history...
        </div>
      ) : bookings.length === 0 ? (
        <div className="py-16 text-center space-y-3 bg-[#111520] border border-slate-800/80 rounded-3xl p-8">
          <Ticket className="w-12 h-12 text-slate-600 mx-auto" />
          <h3 className="text-lg font-bold text-white font-display">No Bookings Found</h3>
          <p className="text-xs text-slate-400 max-w-sm mx-auto">
            You haven't reserved any movie seats yet. Check out the latest movies and pick your favorite auditorium!
          </p>
          <button
            onClick={onExploreMovies}
            className="mt-3 px-5 py-2.5 bg-red-600 hover:bg-red-500 text-white text-xs font-bold uppercase tracking-wider rounded-xl transition-colors cursor-pointer"
          >
            Browse Movies Now
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          {bookings.map((booking) => {
            const isCancelled = booking.status === 'cancelled';
            return (
              <div
                key={booking._id}
                className={`p-5 rounded-2xl border transition-all ${
                  isCancelled
                    ? 'bg-slate-900/40 border-slate-800 opacity-75'
                    : 'bg-[#121724] border-slate-800 hover:border-slate-700 shadow-lg'
                }`}
              >
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-5">
                  {/* Left: Poster + Movie Details */}
                  <div className="flex items-start gap-4">
                    <img
                      src={booking.moviePoster}
                      alt={booking.movieTitle}
                      className="w-18 h-24 object-cover rounded-xl border border-slate-800 shrink-0"
                      onError={(e) => {
                        (e.target as HTMLElement).style.display = 'none';
                      }}
                    />
                    <div className="space-y-1.5">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-mono font-bold text-amber-400">
                          {booking.bookingId}
                        </span>
                        <span
                          className={`text-[10px] font-mono px-2 py-0.5 rounded uppercase font-semibold ${
                            isCancelled
                              ? 'bg-slate-800 text-slate-400'
                              : 'bg-emerald-950/80 text-emerald-400 border border-emerald-800/60'
                          }`}
                        >
                          {booking.status}
                        </span>
                      </div>

                      <h3 className="text-lg font-bold text-white font-display">
                        {booking.movieTitle}
                      </h3>

                      <p className="text-xs text-slate-300 flex items-center gap-1 font-mono">
                        <MapPin className="w-3.5 h-3.5 text-amber-400" />
                        {booking.cinemaName} · {booking.cinemaHall}
                      </p>

                      <div className="flex flex-wrap items-center gap-2 text-xs text-slate-400 font-mono">
                        <span className="flex items-center gap-1">
                          <Calendar className="w-3 h-3 text-rose-400" />
                          {booking.showDate}
                        </span>
                        <span aria-hidden="true">·</span>
                        <span className="flex items-center gap-1">
                          <Clock className="w-3 h-3 text-rose-400" />
                          {booking.showTime}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Middle: Seats & Total */}
                  <div className="flex flex-row md:flex-col md:items-end justify-between border-t md:border-t-0 pt-3 md:pt-0 border-slate-800">
                    <div>
                      <span className="text-[11px] text-slate-400 block md:text-right">Seats Booked:</span>
                      <div className="flex flex-wrap gap-1 mt-0.5 md:justify-end">
                        {booking.seats.map((s) => (
                          <span
                            key={s.seatId}
                            className="px-2 py-0.5 bg-slate-900 border border-slate-700/80 text-amber-300 font-mono text-xs font-semibold rounded"
                          >
                            {s.seatId}
                          </span>
                        ))}
                      </div>
                    </div>

                    <div className="md:mt-2 text-right">
                      <span className="text-[11px] text-slate-400 block">Total Paid:</span>
                      <span className="text-base font-bold font-mono text-white tabular-nums">
                        ${booking.totalAmount.toFixed(2)}
                      </span>
                    </div>
                  </div>

                  {/* Right: Actions */}
                  <div className="flex items-center gap-2 shrink-0 border-t md:border-t-0 pt-3 md:pt-0 border-slate-800 justify-end">
                    <button
                      onClick={() => setSelectedPass(booking)}
                      className="px-3.5 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium rounded-xl flex items-center gap-1.5 transition-colors cursor-pointer"
                    >
                      <Eye className="w-3.5 h-3.5" />
                      <span>View Pass</span>
                    </button>

                    {!isCancelled && (
                      <button
                        onClick={() => handleCancel(booking.bookingId)}
                        disabled={cancellingId === booking.bookingId}
                        className="px-3.5 py-2 bg-red-950/60 hover:bg-red-900/60 border border-red-800/80 text-rose-300 text-xs font-medium rounded-xl flex items-center gap-1.5 transition-colors cursor-pointer disabled:opacity-50"
                      >
                        <XCircle className="w-3.5 h-3.5" />
                        <span>{cancellingId === booking.bookingId ? 'Cancelling...' : 'Cancel'}</span>
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Ticket Pass Modal */}
      {selectedPass && (
        <TicketPassModal booking={selectedPass} onClose={() => setSelectedPass(null)} />
      )}
    </div>
  );
}

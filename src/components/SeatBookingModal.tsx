import React, { useState, useEffect } from 'react';
import { X, Ticket, AlertCircle, ShieldCheck, Check, Clock, MapPin, Sparkles } from 'lucide-react';
import { Movie, Show, BookedSeatDetail, Booking } from '../types/index.ts';
import { api } from '../services/api.ts';
import { useAuth } from '../context/AuthContext.tsx';

interface SeatBookingModalProps {
  movie: Movie;
  selectedDate: string;
  onClose: () => void;
  onBookingSuccess: (booking: Booking) => void;
}

export function SeatBookingModal({ movie, selectedDate, onClose, onBookingSuccess }: SeatBookingModalProps) {
  const { user, isAuthenticated, openAuthModal } = useAuth();
  const [shows, setShows] = useState<Show[]>([]);
  const [selectedShow, setSelectedShow] = useState<Show | null>(null);
  const [selectedSeats, setSelectedSeats] = useState<BookedSeatDetail[]>([]);
  const [loadingShows, setLoadingShows] = useState<boolean>(true);
  const [submitting, setSubmitting] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Guest checkout inputs if not logged in
  const [guestName, setGuestName] = useState<string>(user?.name || '');
  const [guestEmail, setGuestEmail] = useState<string>(user?.email || '');
  const [paymentMethod, setPaymentMethod] = useState<string>('Credit / Debit Card');

  useEffect(() => {
    async function loadMovieShows() {
      setLoadingShows(true);
      setErrorMessage(null);
      try {
        const res = await api.getShows({ movieId: movie._id, date: selectedDate });
        if (res.success && res.shows.length > 0) {
          setShows(res.shows);
          setSelectedShow(res.shows[0]);
        } else {
          // Check any date for this movie
          const allShowsRes = await api.getShows({ movieId: movie._id });
          if (allShowsRes.success && allShowsRes.shows.length > 0) {
            setShows(allShowsRes.shows);
            setSelectedShow(allShowsRes.shows[0]);
          } else {
            setShows([]);
            setSelectedShow(null);
          }
        }
      } catch (err: any) {
        setErrorMessage(err.message || 'Failed to load showtimes');
      } finally {
        setLoadingShows(false);
      }
    }
    loadMovieShows();
  }, [movie._id, selectedDate]);

  // Update guest fields if user changes
  useEffect(() => {
    if (user) {
      setGuestName(user.name);
      setGuestEmail(user.email);
    }
  }, [user]);

  // Handle seat click
  const handleToggleSeat = (row: string, colNum: number, tier: 'VIP' | 'Premium' | 'Standard', price: number) => {
    if (!selectedShow) return;
    const seatId = `${row}${colNum}`;

    // Check if seat is already booked in backend
    if (selectedShow.bookedSeats.includes(seatId)) return;

    setErrorMessage(null);

    const existsIndex = selectedSeats.findIndex((s) => s.seatId === seatId);
    if (existsIndex > -1) {
      setSelectedSeats(selectedSeats.filter((_, idx) => idx !== existsIndex));
    } else {
      if (selectedSeats.length >= 8) {
        setErrorMessage('Maximum 8 tickets per transaction');
        return;
      }
      setSelectedSeats([...selectedSeats, { seatId, row, number: colNum, tier, price }]);
    }
  };

  const getSeatTier = (row: string): { tier: 'VIP' | 'Premium' | 'Standard'; price: number; label: string } => {
    if (!selectedShow) {
      return { tier: 'Standard', price: 14.5, label: 'Standard' };
    }
    const layout = selectedShow.seatLayout;
    if (layout.vipRows.includes(row)) {
      return { tier: 'VIP', price: selectedShow.tierPrices.vipRecliner, label: 'VIP Recliner' };
    }
    if (layout.premiumRows.includes(row)) {
      return { tier: 'Premium', price: selectedShow.tierPrices.premium, label: 'Premium' };
    }
    return { tier: 'Standard', price: selectedShow.tierPrices.standard, label: 'Standard' };
  };

  const subtotal = selectedSeats.reduce((acc, curr) => acc + curr.price, 0);
  const bookingFee = selectedSeats.length > 0 ? 1.5 : 0;
  const totalAmount = Number((subtotal + bookingFee).toFixed(2));

  const handleCheckout = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedShow) return;

    if (selectedSeats.length === 0) {
      setErrorMessage('Please pick at least one seat to proceed.');
      return;
    }

    if (!isAuthenticated && !user) {
      // Must prompt user to login or register
      openAuthModal('login');
      return;
    }

    setSubmitting(true);
    setErrorMessage(null);

    try {
      const res = await api.createBooking({
        showId: selectedShow._id,
        seats: selectedSeats,
        customerName: user?.name || guestName || 'Valued Guest',
        customerEmail: user?.email || guestEmail || 'guest@example.com',
        paymentMethod,
      });

      if (res.success && res.booking) {
        onBookingSuccess(res.booking);
      }
    } catch (err: any) {
      setErrorMessage(err.message || 'Booking reservation could not be completed.');
      // Refresh current show to show updated booked seats
      try {
        const freshShow = await api.getShowById(selectedShow._id);
        if (freshShow.success) {
          setSelectedShow(freshShow.show);
          // Deselect seats that are now occupied
          setSelectedSeats((prev) => prev.filter((s) => !freshShow.show.bookedSeats.includes(s.seatId)));
        }
      } catch {
        // ignore
      }
    } finally {
      setSubmitting(false);
    }
  };

  const rows = ['A', 'B', 'C', 'D', 'E', 'F', 'G'];
  const colsCount = selectedShow?.seatLayout.cols || 10;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/85 backdrop-blur-md overflow-y-auto">
      <div className="relative w-full max-w-5xl bg-[#0F131C] border border-slate-800 rounded-3xl shadow-2xl overflow-hidden my-auto max-h-[92vh] flex flex-col">
        {/* Modal Top Bar */}
        <div className="p-4 sm:p-6 border-b border-slate-800/80 flex items-center justify-between gap-4 bg-[#141A26]">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-red-600/20 border border-red-500/30 flex items-center justify-center shrink-0">
              <Ticket className="w-5 h-5 text-red-400" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-lg sm:text-xl font-bold text-white font-display">{movie.title}</h2>
                <span className="text-xs text-amber-400 font-mono">({movie.ageRating})</span>
              </div>
              <p className="text-xs text-slate-400">
                {movie.genres.join(', ')} · {movie.duration} min · {movie.language}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-4 sm:p-6 overflow-y-auto flex-1 space-y-6">
          {/* Show Selection Section */}
          <div className="space-y-2">
            <label className="text-xs font-semibold text-slate-300 uppercase tracking-wider font-mono">
              1. Select Cinema & Showtime
            </label>
            {loadingShows ? (
              <div className="h-16 flex items-center justify-center text-slate-500 text-sm">
                Loading showtimes...
              </div>
            ) : shows.length === 0 ? (
              <div className="p-4 bg-slate-900/60 border border-slate-800 rounded-xl text-center text-slate-400 text-sm">
                No active showtimes found for this date. Switch date or choose another movie.
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                {shows.map((show) => {
                  const isSelected = selectedShow?._id === show._id;
                  const availableCount =
                    show.seatLayout.rows * show.seatLayout.cols - show.bookedSeats.length;
                  return (
                    <button
                      key={show._id}
                      type="button"
                      onClick={() => {
                        setSelectedShow(show);
                        setSelectedSeats([]);
                        setErrorMessage(null);
                      }}
                      className={`p-3 rounded-xl border text-left transition-all cursor-pointer ${
                        isSelected
                          ? 'bg-red-950/40 border-red-500 ring-1 ring-red-500'
                          : 'bg-slate-900/60 border-slate-800 hover:border-slate-700'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-white flex items-center gap-1.5">
                          <MapPin className="w-3.5 h-3.5 text-amber-400" />
                          {show.cinema.name}
                        </span>
                        <span className="text-xs font-mono font-semibold text-rose-400 bg-rose-950/60 px-2 py-0.5 rounded">
                          {show.time}
                        </span>
                      </div>
                      <div className="mt-1 flex items-center justify-between text-[11px] text-slate-400 font-mono">
                        <span>{show.cinema.hall}</span>
                        <span>{availableCount} seats left</span>
                      </div>
                    </button>
                  );
                })}
              </div>
            )}
          </div>

          {selectedShow && (
            <>
              {/* Cinema Seat Matrix Section */}
              <div className="space-y-4 pt-2">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-semibold text-slate-300 uppercase tracking-wider font-mono">
                    2. Choose Your Seats
                  </label>
                  <span className="text-xs text-amber-400/90 font-mono">
                    {selectedSeats.length} / 8 seats selected
                  </span>
                </div>

                {/* Cinema Screen Visual */}
                <div className="flex flex-col items-center justify-center pt-2 pb-6">
                  <div className="w-3/4 max-w-lg h-2.5 bg-gradient-to-r from-slate-700 via-amber-400 to-slate-700 rounded-t-full shadow-lg shadow-amber-400/20" />
                  <span className="text-[10px] text-slate-500 uppercase tracking-widest font-mono mt-1">
                    IMAX Curved Projection Screen
                  </span>
                </div>

                {/* Seat Grid */}
                <div className="overflow-x-auto pb-4 flex justify-center">
                  <div className="space-y-2.5 min-w-[340px]">
                    {rows.map((row) => {
                      const tierInfo = getSeatTier(row);
                      return (
                        <div key={row} className="flex items-center gap-2 sm:gap-3">
                          {/* Row label */}
                          <span className="w-5 text-center text-xs font-mono font-bold text-slate-500">
                            {row}
                          </span>

                          {/* Seats in row */}
                          <div className="flex items-center gap-1.5 sm:gap-2">
                            {Array.from({ length: colsCount }, (_, i) => i + 1).map((colNum) => {
                              const seatId = `${row}${colNum}`;
                              const isBooked = selectedShow.bookedSeats.includes(seatId);
                              const isSelected = selectedSeats.some((s) => s.seatId === seatId);

                              // Seat styling based on tier and state
                              let seatClasses = '';
                              if (isBooked) {
                                seatClasses = 'bg-slate-800 text-slate-600 border-slate-800 cursor-not-allowed';
                              } else if (isSelected) {
                                seatClasses =
                                  'bg-amber-400 text-slate-950 font-bold border-amber-300 ring-2 ring-amber-300 shadow-md shadow-amber-400/30 scale-105';
                              } else if (tierInfo.tier === 'VIP') {
                                seatClasses =
                                  'bg-rose-950/60 text-rose-300 border-rose-800/80 hover:bg-rose-900/60 hover:border-rose-700';
                              } else if (tierInfo.tier === 'Premium') {
                                seatClasses =
                                  'bg-indigo-950/60 text-indigo-300 border-indigo-800/80 hover:bg-indigo-900/60 hover:border-indigo-700';
                              } else {
                                seatClasses =
                                  'bg-slate-900 text-slate-300 border-slate-800 hover:bg-slate-800 hover:border-slate-700';
                              }

                              return (
                                <button
                                  key={seatId}
                                  type="button"
                                  disabled={isBooked}
                                  onClick={() => handleToggleSeat(row, colNum, tierInfo.tier, tierInfo.price)}
                                  title={`${seatId} - ${tierInfo.label} ($${tierInfo.price.toFixed(2)})`}
                                  className={`w-7 h-7 sm:w-8 sm:h-8 rounded-lg border text-[11px] font-mono flex items-center justify-center transition-all cursor-pointer ${seatClasses}`}
                                >
                                  {isBooked ? '×' : isSelected ? <Check className="w-3.5 h-3.5 stroke-[3]" /> : colNum}
                                </button>
                              );
                            })}
                          </div>

                          {/* Row label right */}
                          <span className="w-5 text-center text-xs font-mono font-bold text-slate-500">
                            {row}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Seat Legend */}
                <div className="flex flex-wrap items-center justify-center gap-4 sm:gap-6 pt-2 pb-3 text-xs border-y border-slate-800/80">
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 rounded bg-rose-950 border border-rose-800/80" />
                    <span className="text-slate-300">VIP Recliner (${selectedShow.tierPrices.vipRecliner.toFixed(2)})</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 rounded bg-indigo-950 border border-indigo-800/80" />
                    <span className="text-slate-300">Premium (${selectedShow.tierPrices.premium.toFixed(2)})</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 rounded bg-slate-900 border border-slate-800" />
                    <span className="text-slate-300">Standard (${selectedShow.tierPrices.standard.toFixed(2)})</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 rounded bg-amber-400 border border-amber-300" />
                    <span className="text-slate-200 font-medium">Selected</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 rounded bg-slate-800 border border-slate-800 text-slate-600 flex items-center justify-center text-[10px]">×</div>
                    <span className="text-slate-500">Occupied</span>
                  </div>
                </div>

                {/* Error Banner */}
                {errorMessage && (
                  <div className="p-3 bg-red-950/60 border border-red-800 rounded-xl flex items-center gap-2 text-rose-300 text-xs">
                    <AlertCircle className="w-4 h-4 shrink-0 text-rose-400" />
                    <span>{errorMessage}</span>
                  </div>
                )}

                {/* Order Summary & Live Calculation */}
                <div className="bg-[#141A26] border border-slate-800 rounded-2xl p-4 space-y-4">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-800">
                    <div>
                      <span className="text-xs text-slate-400 block">Selected Seats:</span>
                      <div className="flex flex-wrap gap-1.5 mt-1">
                        {selectedSeats.length === 0 ? (
                          <span className="text-xs text-slate-500 italic">No seats selected yet</span>
                        ) : (
                          selectedSeats.map((s) => (
                            <span
                              key={s.seatId}
                              className="px-2 py-0.5 bg-amber-400/10 border border-amber-400/40 text-amber-300 text-xs font-mono font-semibold rounded"
                            >
                              {s.seatId} ({s.tier} ${s.price.toFixed(2)})
                            </span>
                          ))
                        )}
                      </div>
                    </div>

                    <div className="flex items-center gap-6">
                      <div className="text-right">
                        <span className="text-xs text-slate-400">Subtotal:</span>
                        <p className="text-sm font-mono tabular-nums text-slate-200 font-semibold">
                          ${subtotal.toFixed(2)}
                        </p>
                      </div>
                      <div className="text-right">
                        <span className="text-xs text-slate-400">Booking Fee:</span>
                        <p className="text-sm font-mono tabular-nums text-slate-200 font-semibold">
                          ${bookingFee.toFixed(2)}
                        </p>
                      </div>
                      <div className="text-right pl-4 border-l border-slate-700">
                        <span className="text-xs text-amber-400 uppercase font-mono tracking-wider font-semibold">
                          Total Amount:
                        </span>
                        <p className="text-xl font-bold font-mono tabular-nums text-white">
                          ${totalAmount.toFixed(2)}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Payment and Submission */}
                  <form onSubmit={handleCheckout} className="space-y-4">
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                      <div>
                        <label className="text-xs text-slate-400 block mb-1">Customer Name</label>
                        <input
                          type="text"
                          required
                          value={user?.name || guestName}
                          onChange={(e) => setGuestName(e.target.value)}
                          placeholder="Your full name"
                          className="w-full px-3 py-2 bg-slate-900 border border-slate-800 rounded-lg text-xs text-white placeholder-slate-500 focus:outline-none focus:border-amber-400"
                        />
                      </div>

                      <div>
                        <label className="text-xs text-slate-400 block mb-1">Email (for E-Ticket)</label>
                        <input
                          type="email"
                          required
                          value={user?.email || guestEmail}
                          onChange={(e) => setGuestEmail(e.target.value)}
                          placeholder="your.email@example.com"
                          className="w-full px-3 py-2 bg-slate-900 border border-slate-800 rounded-lg text-xs text-white placeholder-slate-500 focus:outline-none focus:border-amber-400"
                        />
                      </div>

                      <div>
                        <label className="text-xs text-slate-400 block mb-1">Payment Method</label>
                        <select
                          value={paymentMethod}
                          onChange={(e) => setPaymentMethod(e.target.value)}
                          className="w-full px-3 py-2 bg-slate-900 border border-slate-800 rounded-lg text-xs text-white focus:outline-none focus:border-amber-400"
                        >
                          <option value="Credit / Debit Card">Credit / Debit Card (Instant Mock)</option>
                          <option value="Apple Pay / Google Pay">Apple Pay / Google Pay</option>
                          <option value="IMovies Cinema Pass">IMovies VIP Pass</option>
                        </select>
                      </div>
                    </div>

                    <div className="flex items-center justify-between pt-2">
                      <div className="flex items-center gap-1.5 text-xs text-slate-400">
                        <ShieldCheck className="w-4 h-4 text-emerald-400" />
                        <span>MongoDB Atlas Atomic Concurrency Protected</span>
                      </div>

                      <button
                        type="submit"
                        disabled={submitting || selectedSeats.length === 0}
                        className="px-6 py-3 bg-gradient-to-r from-red-600 via-rose-600 to-amber-500 hover:from-red-500 hover:to-amber-400 text-white font-semibold text-sm rounded-xl transition-all shadow-lg shadow-red-900/30 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 cursor-pointer font-display uppercase tracking-wide"
                      >
                        {submitting ? (
                          <>
                            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                            <span>Confirming Seats...</span>
                          </>
                        ) : !isAuthenticated ? (
                          <>
                            <Sparkles className="w-4 h-4" />
                            <span>Sign In to Book (${totalAmount.toFixed(2)})</span>
                          </>
                        ) : (
                          <>
                            <Ticket className="w-4 h-4" />
                            <span>Confirm & Pay ${totalAmount.toFixed(2)}</span>
                          </>
                        )}
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

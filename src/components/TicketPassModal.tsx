import React from 'react';
import { X, CheckCircle2, QrCode, Printer, Share2, Ticket, Calendar, Clock, MapPin } from 'lucide-react';
import { Booking } from '../types/index.ts';

interface TicketPassModalProps {
  booking: Booking;
  onClose: () => void;
}

export function TicketPassModal({ booking, onClose }: TicketPassModalProps) {
  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md overflow-y-auto">
      <div className="relative w-full max-w-md bg-[#121620] border border-amber-500/40 rounded-3xl shadow-2xl overflow-hidden my-auto animate-in fade-in zoom-in-95 duration-200">
        {/* Header confirmation banner */}
        <div className="bg-gradient-to-r from-red-600 to-rose-600 p-5 text-center text-white relative">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-1.5 rounded-full bg-black/20 hover:bg-black/40 text-white transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
          <div className="w-12 h-12 bg-white/10 rounded-full flex items-center justify-center mx-auto mb-2 backdrop-blur-sm">
            <CheckCircle2 className="w-7 h-7 text-amber-300" />
          </div>
          <h2 className="text-xl font-bold font-display uppercase tracking-wide">Booking Confirmed!</h2>
          <p className="text-xs text-rose-100 font-mono mt-0.5">Reservation stored in MongoDB</p>
        </div>

        {/* Boarding Pass / Ticket Body */}
        <div className="p-6 space-y-5 bg-[#0F131C]">
          {/* Booking ID and Date Tag */}
          <div className="flex items-center justify-between pb-3 border-b border-slate-800">
            <div>
              <span className="text-[10px] text-slate-400 uppercase font-mono tracking-wider block">
                Booking Reference
              </span>
              <span className="text-sm font-bold font-mono text-amber-400">{booking.bookingId}</span>
            </div>
            <div className="text-right">
              <span className="text-[10px] text-slate-400 uppercase font-mono tracking-wider block">
                Payment Status
              </span>
              <span className="text-xs font-semibold text-emerald-400 bg-emerald-950/60 px-2 py-0.5 rounded border border-emerald-800/60">
                {booking.paymentStatus.toUpperCase()}
              </span>
            </div>
          </div>

          {/* Movie Details */}
          <div className="flex gap-4 items-center">
            <img
              src={booking.moviePoster}
              alt={booking.movieTitle}
              className="w-16 h-22 object-cover rounded-xl border border-slate-800 shrink-0"
              onError={(e) => {
                (e.target as HTMLElement).style.display = 'none';
              }}
            />
            <div className="space-y-1">
              <h3 className="text-base font-bold text-white font-display leading-snug">
                {booking.movieTitle}
              </h3>
              <p className="text-xs text-amber-400/90 font-mono flex items-center gap-1">
                <MapPin className="w-3 h-3" />
                {booking.cinemaName}
              </p>
              <p className="text-xs text-slate-400 font-mono">
                {booking.cinemaHall} · {booking.cinemaExperience}
              </p>
            </div>
          </div>

          {/* Screening Metadata */}
          <div className="grid grid-cols-2 gap-3 p-3 bg-slate-900/60 rounded-xl border border-slate-800 text-xs">
            <div>
              <span className="text-[10px] text-slate-500 uppercase font-mono block">Date</span>
              <span className="font-semibold text-slate-200 flex items-center gap-1 mt-0.5 font-mono">
                <Calendar className="w-3 h-3 text-rose-400" />
                {booking.showDate}
              </span>
            </div>
            <div>
              <span className="text-[10px] text-slate-500 uppercase font-mono block">Showtime</span>
              <span className="font-semibold text-slate-200 flex items-center gap-1 mt-0.5 font-mono">
                <Clock className="w-3 h-3 text-rose-400" />
                {booking.showTime}
              </span>
            </div>
          </div>

          {/* Seats Detail */}
          <div className="p-3 bg-slate-900/60 rounded-xl border border-slate-800 space-y-2">
            <span className="text-[10px] text-slate-500 uppercase font-mono block">Reserved Seats</span>
            <div className="flex flex-wrap gap-2">
              {booking.seats.map((s) => (
                <span
                  key={s.seatId}
                  className="px-2.5 py-1 bg-amber-400/10 border border-amber-400/40 text-amber-300 font-mono text-xs font-bold rounded-lg"
                >
                  {s.seatId} ({s.tier})
                </span>
              ))}
            </div>
          </div>

          {/* Total Price */}
          <div className="flex items-center justify-between text-sm pt-1">
            <span className="text-slate-400 text-xs">Total Amount Paid:</span>
            <span className="text-lg font-bold font-mono text-white tabular-nums">
              ${booking.totalAmount.toFixed(2)}
            </span>
          </div>

          {/* Barcode & QR Code Representation */}
          <div className="pt-2 border-t border-dashed border-slate-800 flex flex-col items-center justify-center space-y-2">
            <div className="p-3 bg-white rounded-xl shadow-inner">
              <QrCode className="w-24 h-24 text-slate-950" />
            </div>
            <p className="text-[10px] text-slate-500 font-mono tracking-widest text-center">
              SCAN AT CINEMA TURNSTILE GATE
            </p>
          </div>

          {/* Actions */}
          <div className="grid grid-cols-2 gap-3 pt-2">
            <button
              onClick={handlePrint}
              className="py-2.5 px-3 bg-slate-900 hover:bg-slate-800 border border-slate-700 text-slate-200 text-xs font-medium rounded-xl flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Print Pass</span>
            </button>

            <button
              onClick={onClose}
              className="py-2.5 px-3 bg-amber-400 hover:bg-amber-300 text-slate-950 text-xs font-bold rounded-xl flex items-center justify-center gap-1.5 transition-colors cursor-pointer font-display uppercase tracking-wider"
            >
              <span>Done</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

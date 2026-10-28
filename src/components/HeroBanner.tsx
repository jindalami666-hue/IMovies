import React from 'react';
import { Play, Ticket, Star, Clock } from 'lucide-react';
import { Movie } from '../types/index.ts';

interface HeroBannerProps {
  movie: Movie | null;
  onBookNow: (movie: Movie) => void;
  onViewDetails: (movie: Movie) => void;
}

export function HeroBanner({ movie, onBookNow, onViewDetails }: HeroBannerProps) {
  if (!movie) return null;

  return (
    <div className="relative w-full h-[540px] md:h-[600px] overflow-hidden bg-slate-950">
      {/* Background with measured contrast scrim */}
      <img
        src={movie.backdrop || '/src/assets/images/hero_cinema_imax_1793195911656.jpg'}
        alt={movie.title}
        referrerPolicy="no-referrer"
        className="absolute inset-0 w-full h-full object-cover object-center scale-105 filter brightness-[0.6] contrast-[1.1]"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-[#0B0E14] via-[#0B0E14]/60 to-transparent" />
      <div className="absolute inset-0 bg-gradient-to-r from-[#0B0E14] via-[#0B0E14]/70 to-transparent max-w-4xl" />

      {/* Hero Content */}
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-full flex flex-col justify-end pb-16 z-10">
        <div className="max-w-2xl space-y-4">
          {/* Metadata line without pills (zero-pill discipline) */}
          <div className="flex items-center gap-2.5 text-xs text-amber-400 font-mono tracking-wider uppercase">
            <span className="flex items-center gap-1 font-semibold">
              <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
              {movie.rating.toFixed(1)} / 10
            </span>
            <span aria-hidden="true" className="text-slate-600">·</span>
            <span className="flex items-center gap-1 text-slate-300">
              <Clock className="w-3.5 h-3.5" />
              {movie.duration} min
            </span>
            <span aria-hidden="true" className="text-slate-600">·</span>
            <span className="text-slate-300">{movie.ageRating}</span>
            <span aria-hidden="true" className="text-slate-600">·</span>
            <span className="text-slate-300">{movie.genres.join(', ')}</span>
          </div>

          {/* Main Title */}
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-white tracking-tight leading-tight text-balance font-display">
            {movie.title}
          </h1>

          {/* Synopsis */}
          <p className="text-sm sm:text-base text-slate-300 line-clamp-3 leading-relaxed max-w-xl">
            {movie.synopsis}
          </p>

          {/* Action CTAs */}
          <div className="flex flex-wrap items-center gap-4 pt-3">
            <button
              onClick={() => onBookNow(movie)}
              className="px-6 py-3.5 bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-500 hover:to-rose-500 text-white font-semibold rounded-xl text-sm transition-all shadow-lg shadow-red-900/40 flex items-center gap-2 group cursor-pointer"
            >
              <Ticket className="w-4 h-4 group-hover:scale-110 transition-transform" />
              <span>Book Tickets</span>
            </button>

            <button
              onClick={() => onViewDetails(movie)}
              className="px-5 py-3.5 bg-slate-900/80 hover:bg-slate-800 border border-slate-700/80 text-slate-200 font-medium rounded-xl text-sm transition-colors flex items-center gap-2 backdrop-blur-sm cursor-pointer"
            >
              <Play className="w-4 h-4 text-amber-400" />
              <span>Trailer & Details</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

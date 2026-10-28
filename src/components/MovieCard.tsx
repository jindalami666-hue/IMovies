import React from 'react';
import { Star, Clock, Ticket } from 'lucide-react';
import { Movie } from '../types/index.ts';

interface MovieCardProps {
  movie: Movie;
  onSelectMovie: (movie: Movie) => void;
  onBookMovie: (movie: Movie) => void;
}

export function MovieCard({ movie, onSelectMovie, onBookMovie }: MovieCardProps) {
  return (
    <div className="group relative bg-[#121620] border border-slate-800/80 rounded-2xl overflow-hidden flex flex-col hover:border-slate-700 transition-all duration-200 hover:-translate-y-1 hover:shadow-xl hover:shadow-black/60">
      {/* 3:4 Aspect Ratio Poster Container */}
      <div
        onClick={() => onSelectMovie(movie)}
        className="relative aspect-[3/4] w-full overflow-hidden bg-slate-900 cursor-pointer"
      >
        <img
          src={movie.poster}
          alt={movie.title}
          referrerPolicy="no-referrer"
          className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-300"
          onError={(e) => {
            // Fallback gradient if path fails
            (e.target as HTMLElement).style.display = 'none';
          }}
        />

        {/* Overlay gradient */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#121620] via-transparent to-black/30 opacity-80" />

        {/* Rating tag in top right */}
        <div className="absolute top-3 right-3 px-2 py-1 bg-black/60 backdrop-blur-md rounded-md border border-slate-700/60 flex items-center gap-1 text-xs font-mono font-bold text-amber-400">
          <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
          <span>{movie.rating.toFixed(1)}</span>
        </div>

        {/* Status tag if Coming Soon */}
        {movie.status === 'coming_soon' && (
          <div className="absolute top-3 left-3 px-2 py-1 bg-red-950/80 text-rose-300 backdrop-blur-md rounded-md border border-rose-800/60 text-[11px] font-mono font-semibold uppercase tracking-wider">
            Coming Soon
          </div>
        )}
      </div>

      {/* Card Content */}
      <div className="p-4 flex-1 flex flex-col justify-between">
        <div className="space-y-1.5">
          {/* Metadata line with unboxed text and separator */}
          <div className="flex items-center gap-1.5 text-xs text-slate-400">
            <span className="truncate max-w-[150px]">{movie.genres[0]}</span>
            <span aria-hidden="true">·</span>
            <span className="flex items-center gap-1 font-mono tabular-nums">
              <Clock className="w-3 h-3" />
              {movie.duration}m
            </span>
            <span aria-hidden="true">·</span>
            <span>{movie.ageRating}</span>
          </div>

          <h3
            onClick={() => onSelectMovie(movie)}
            className="text-base font-bold text-white tracking-tight group-hover:text-amber-400 transition-colors line-clamp-1 cursor-pointer font-display"
          >
            {movie.title}
          </h3>

          <p className="text-xs text-slate-400 line-clamp-2 leading-relaxed">
            {movie.synopsis}
          </p>
        </div>

        {/* Booking CTA button */}
        <div className="mt-4 pt-3 border-t border-slate-800/60 flex items-center justify-between gap-2">
          <button
            onClick={() => onSelectMovie(movie)}
            className="text-xs text-slate-400 hover:text-slate-200 transition-colors cursor-pointer py-1.5"
          >
            View Info
          </button>

          <button
            onClick={() => onBookMovie(movie)}
            className="px-3.5 py-1.5 bg-red-600/90 hover:bg-red-500 text-white text-xs font-medium rounded-lg transition-colors flex items-center gap-1.5 shadow-sm shadow-red-900/30 cursor-pointer"
          >
            <Ticket className="w-3.5 h-3.5" />
            <span>Book Seats</span>
          </button>
        </div>
      </div>
    </div>
  );
}

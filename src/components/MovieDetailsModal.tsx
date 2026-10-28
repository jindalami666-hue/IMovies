import React from 'react';
import { X, Star, Clock, Calendar, Ticket, User, Film } from 'lucide-react';
import { Movie } from '../types/index.ts';

interface MovieDetailsModalProps {
  movie: Movie;
  onClose: () => void;
  onBookNow: (movie: Movie) => void;
}

export function MovieDetailsModal({ movie, onClose, onBookNow }: MovieDetailsModalProps) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md overflow-y-auto">
      <div className="relative w-full max-w-3xl bg-[#0F131C] border border-slate-800 rounded-3xl shadow-2xl overflow-hidden my-auto max-h-[92vh] flex flex-col animate-in fade-in zoom-in-95 duration-150">
        {/* Backdrop Header */}
        <div className="relative h-64 sm:h-72 w-full overflow-hidden bg-slate-950">
          <img
            src={movie.backdrop || movie.poster}
            alt={movie.title}
            className="w-full h-full object-cover object-center filter brightness-75"
            onError={(e) => {
              (e.target as HTMLElement).style.display = 'none';
            }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#0F131C] via-[#0F131C]/60 to-transparent" />

          {/* Close button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 rounded-full bg-black/50 hover:bg-black/70 text-white transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>

          {/* Rating tag */}
          <div className="absolute bottom-4 left-6 flex items-center gap-2">
            <span className="px-2.5 py-1 bg-amber-400 text-slate-950 text-xs font-bold font-mono rounded-lg flex items-center gap-1 shadow-md">
              <Star className="w-3.5 h-3.5 fill-slate-950 text-slate-950" />
              {movie.rating.toFixed(1)} / 10
            </span>
            <span className="px-2.5 py-1 bg-slate-900/80 backdrop-blur-sm border border-slate-700 text-slate-300 text-xs font-mono rounded-lg">
              {movie.ageRating}
            </span>
          </div>
        </div>

        {/* Content Body */}
        <div className="p-6 overflow-y-auto space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
            <div>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-white font-display">
                {movie.title}
              </h2>
              <div className="flex flex-wrap items-center gap-2 text-xs text-slate-400 mt-1 font-mono">
                <span>{movie.genres.join(', ')}</span>
                <span aria-hidden="true">·</span>
                <span className="flex items-center gap-1">
                  <Clock className="w-3 h-3 text-amber-400" />
                  {movie.duration} minutes
                </span>
                <span aria-hidden="true">·</span>
                <span className="flex items-center gap-1">
                  <Calendar className="w-3 h-3 text-rose-400" />
                  Released {movie.releaseDate}
                </span>
              </div>
            </div>

            <button
              onClick={() => {
                onClose();
                onBookNow(movie);
              }}
              className="px-6 py-3 bg-red-600 hover:bg-red-500 text-white font-bold text-xs uppercase tracking-wider rounded-xl transition-all shadow-lg shadow-red-900/40 flex items-center justify-center gap-2 shrink-0 cursor-pointer font-display"
            >
              <Ticket className="w-4 h-4" />
              <span>Select Seats</span>
            </button>
          </div>

          {/* Synopsis */}
          <div className="space-y-2">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 font-mono">
              Storyline & Synopsis
            </h3>
            <p className="text-sm text-slate-300 leading-relaxed">
              {movie.synopsis}
            </p>
          </div>

          {/* Credits */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-4 bg-[#141A26] border border-slate-800 rounded-2xl text-xs">
            <div>
              <span className="text-slate-500 uppercase font-mono block text-[11px]">Director</span>
              <span className="font-semibold text-slate-200 mt-0.5 block flex items-center gap-1.5">
                <User className="w-3.5 h-3.5 text-amber-400" />
                {movie.director}
              </span>
            </div>

            <div>
              <span className="text-slate-500 uppercase font-mono block text-[11px]">Audio & Language</span>
              <span className="font-semibold text-slate-200 mt-0.5 block flex items-center gap-1.5">
                <Film className="w-3.5 h-3.5 text-rose-400" />
                {movie.language}
              </span>
            </div>

            {movie.cast && movie.cast.length > 0 && (
              <div className="sm:col-span-2 pt-2 border-t border-slate-800">
                <span className="text-slate-500 uppercase font-mono block text-[11px] mb-1">Lead Cast</span>
                <div className="flex flex-wrap gap-2">
                  {movie.cast.map((actor) => (
                    <span
                      key={actor}
                      className="px-2.5 py-1 bg-slate-900 border border-slate-700/80 text-slate-300 rounded-lg text-xs"
                    >
                      {actor}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

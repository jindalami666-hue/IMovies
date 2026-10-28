import React from 'react';
import { Search, SlidersHorizontal, Calendar, MapPin } from 'lucide-react';

interface MovieFilterProps {
  searchQuery: string;
  onSearchChange: (q: string) => void;
  selectedGenre: string;
  onSelectGenre: (genre: string) => void;
  selectedDate: string;
  onSelectDate: (date: string) => void;
  selectedCinema: string;
  onSelectCinema: (cinema: string) => void;
}

const GENRES = ['All', 'Sci-Fi', 'Action', 'Mystery', 'Drama', 'Thriller'];
const DATES = [
  { label: 'Today', value: '2026-10-28', sub: 'Oct 28' },
  { label: 'Tomorrow', value: '2026-10-29', sub: 'Oct 29' },
  { label: 'Friday', value: '2026-10-30', sub: 'Oct 30' },
  { label: 'Saturday', value: '2026-10-31', sub: 'Oct 31' },
];
const CINEMAS = [
  'All Cinemas',
  'Starlight IMAX Grand Theatre',
  'CineLuxe Dolby Cinema',
  'Onyx VIP Club Cinema',
];

export function MovieFilter({
  searchQuery,
  onSearchChange,
  selectedGenre,
  onSelectGenre,
  selectedDate,
  onSelectDate,
  selectedCinema,
  onSelectCinema,
}: MovieFilterProps) {
  return (
    <div className="w-full bg-[#10141D] border-y border-slate-800/80 py-4 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-4">
        {/* Row 1: Search Bar and Quick Venue Selection */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
          {/* Search Box */}
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
            <input
              type="text"
              placeholder="Search movie titles, directors, actors..."
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-slate-900 border border-slate-800 rounded-xl text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-amber-400/80 focus:ring-1 focus:ring-amber-400/80 transition-all"
            />
          </div>

          {/* Cinema Location Select */}
          <div className="flex items-center gap-2">
            <MapPin className="w-4 h-4 text-amber-400 shrink-0" />
            <select
              value={selectedCinema}
              onChange={(e) => onSelectCinema(e.target.value)}
              className="bg-slate-900 border border-slate-800 text-slate-200 text-xs sm:text-sm rounded-xl px-3 py-2 focus:outline-none focus:border-amber-400"
            >
              {CINEMAS.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Row 2: Genre Segmented Tabs and Date Carousel */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pt-1">
          {/* Genre Segmented Tabs */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0 scrollbar-none">
            <span className="text-xs text-slate-500 uppercase tracking-wider font-mono mr-2 hidden sm:inline">
              Genre:
            </span>
            {GENRES.map((genre) => (
              <button
                key={genre}
                onClick={() => onSelectGenre(genre)}
                className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                  selectedGenre === genre
                    ? 'bg-amber-400 text-slate-950 font-semibold shadow-sm shadow-amber-400/20'
                    : 'bg-slate-900/80 text-slate-300 hover:bg-slate-800 hover:text-white border border-slate-800'
                }`}
              >
                {genre}
              </button>
            ))}
          </div>

          {/* Date Selector */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1 sm:pb-0 scrollbar-none">
            <Calendar className="w-3.5 h-3.5 text-slate-500 shrink-0 mr-1 hidden sm:inline" />
            {DATES.map((d) => (
              <button
                key={d.value}
                onClick={() => onSelectDate(d.value)}
                className={`px-3 py-1.5 rounded-lg text-xs transition-all whitespace-nowrap shrink-0 flex flex-col items-center cursor-pointer ${
                  selectedDate === d.value
                    ? 'bg-rose-600 text-white font-semibold shadow-sm shadow-rose-900/40 border border-rose-500'
                    : 'bg-slate-900/60 text-slate-400 hover:bg-slate-800 hover:text-slate-200 border border-slate-800/80'
                }`}
              >
                <span className="font-medium">{d.label}</span>
                <span className="text-[10px] opacity-80 font-mono">{d.sub}</span>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

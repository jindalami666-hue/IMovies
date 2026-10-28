import React from 'react';
import { MapPin, Film, Sparkles, Volume2, Monitor, Armchair, Ticket } from 'lucide-react';
import { Movie } from '../types/index.ts';

interface CinemasViewProps {
  onSelectCinemaForBooking: (cinemaName: string) => void;
  movies: Movie[];
}

const CINEMA_VENUES = [
  {
    id: 'starlight',
    name: 'Starlight IMAX Grand Theatre',
    tagline: 'The Ultimate Giant Screen Experience',
    city: 'Downtown Core',
    address: '742 Broadway Boulevard, Metropolis',
    experience: 'IMAX Laser 70mm',
    features: [
      { icon: Monitor, text: 'Custom 80ft Curved Silver Screen' },
      { icon: Volume2, text: '12-Channel Immersive Spatial Audio' },
      { icon: Armchair, text: 'Tiered Stadium VIP Recliners' },
    ],
    image: '/src/assets/images/hero_cinema_imax_1793195911656.jpg',
  },
  {
    id: 'cineluxe',
    name: 'CineLuxe Dolby Cinema',
    tagline: 'Dramatic Contrast & Mastered Dolby Atmos Acoustics',
    city: 'West End Galleria',
    address: '1200 Galleria Mall Way, Suite 400',
    experience: 'Dolby Cinema',
    features: [
      { icon: Monitor, text: 'Dual 4K Laser Projection with 1,000,000:1 Contrast' },
      { icon: Volume2, text: 'Dolby Atmos Overhead Moving Sound' },
      { icon: Armchair, text: 'Zero-Gravity Motorized Recliners with Seat Transducers' },
    ],
    image: '/src/assets/images/movie_shadow_protocol_1793195913215.jpg',
  },
  {
    id: 'onyx',
    name: 'Onyx VIP Club Cinema',
    tagline: 'Boutique Luxury & In-Seat Gourmet Dining',
    city: 'Harbor District',
    address: '88 Waterfront Pier Avenue',
    experience: 'VIP Recliner Suite',
    features: [
      { icon: Monitor, text: 'Samsung Cinema Onyx 4K DCI-Compliant LED' },
      { icon: Volume2, text: 'Harman Professional Audio Engineering' },
      { icon: Armchair, text: 'Private Leather Booths with Dedicated Butler Service' },
    ],
    image: '/src/assets/images/movie_midnight_venice_1793195913561.jpg',
  },
];

export function CinemasView({ onSelectCinemaForBooking, movies }: CinemasViewProps) {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
      {/* Header */}
      <div className="text-center max-w-2xl mx-auto space-y-3">
        <span className="text-xs font-mono font-semibold text-amber-400 tracking-widest uppercase">
          World-Class Auditoriums
        </span>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-white font-display">
          Our Premium Cinema Venues
        </h1>
        <p className="text-sm text-slate-400">
          Experience breathtaking visuals and crystal-clear sound across our state-of-the-art auditorium destinations.
        </p>
      </div>

      {/* Venues Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {CINEMA_VENUES.map((cinema) => (
          <div
            key={cinema.id}
            className="bg-[#121620] border border-slate-800 rounded-3xl overflow-hidden flex flex-col hover:border-slate-700 transition-all hover:shadow-xl"
          >
            {/* Header image */}
            <div className="relative h-48 overflow-hidden bg-slate-900">
              <img
                src={cinema.image}
                alt={cinema.name}
                className="w-full h-full object-cover filter brightness-75 hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#121620] via-transparent to-black/40" />
              <div className="absolute top-3 left-3 px-2.5 py-1 bg-red-950/80 text-rose-300 border border-rose-800/80 rounded-md text-[11px] font-mono font-semibold uppercase">
                {cinema.experience}
              </div>
            </div>

            {/* Content */}
            <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
              <div className="space-y-3">
                <div>
                  <h3 className="text-lg font-bold text-white font-display">{cinema.name}</h3>
                  <p className="text-xs text-amber-400 font-mono flex items-center gap-1 mt-0.5">
                    <MapPin className="w-3.5 h-3.5" />
                    {cinema.city}
                  </p>
                  <p className="text-[11px] text-slate-400 mt-1">{cinema.address}</p>
                </div>

                <div className="pt-2 border-t border-slate-800/80 space-y-2 text-xs">
                  {cinema.features.map((feat, idx) => (
                    <div key={idx} className="flex items-center gap-2 text-slate-300">
                      <feat.icon className="w-4 h-4 text-slate-400 shrink-0" />
                      <span>{feat.text}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Action */}
              <div className="pt-3 border-t border-slate-800/80">
                <button
                  onClick={() => onSelectCinemaForBooking(cinema.name)}
                  className="w-full py-2.5 bg-red-600 hover:bg-red-500 text-white font-semibold text-xs rounded-xl flex items-center justify-center gap-2 transition-colors cursor-pointer uppercase tracking-wider font-display"
                >
                  <Ticket className="w-4 h-4" />
                  <span>View Movies at this Venue</span>
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

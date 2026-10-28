export interface SeedMovie {
  _id: string;
  title: string;
  synopsis: string;
  poster: string;
  backdrop: string;
  trailerUrl?: string;
  genres: string[];
  duration: number;
  rating: number;
  ageRating: string;
  releaseDate: string;
  language: string;
  director: string;
  cast: string[];
  isFeatured: boolean;
  status: 'now_showing' | 'coming_soon';
}

export interface SeedShow {
  _id: string;
  movie: string;
  cinema: {
    name: string;
    hall: string;
    city: string;
    experience: 'IMAX Laser' | 'Dolby Cinema' | 'VIP Recliner Suite' | 'Standard 4K';
  };
  date: string;
  time: string;
  tierPrices: {
    standard: number;
    premium: number;
    vipRecliner: number;
  };
  seatLayout: {
    rows: number;
    cols: number;
    vipRows: string[];
    premiumRows: string[];
    standardRows: string[];
  };
  bookedSeats: string[];
  isActive: boolean;
}

export const INITIAL_MOVIES: SeedMovie[] = [
  {
    _id: '671f1001a1b2c3d4e5f60001',
    title: 'Celestial Horizon',
    synopsis:
      'In a desperate bid to preserve human consciousness, a deep space expedition journeys past the accretion boundary of an ancient Kerr black hole to unlock gravitational distortions.',
    poster: '/src/assets/images/movie_celestial_horizon_1793195912321.jpg',
    backdrop: '/src/assets/images/hero_cinema_imax_1793195911656.jpg',
    trailerUrl: 'https://www.youtube.com/watch?v=zSWdZVtXT7E',
    genres: ['Sci-Fi', 'Adventure', 'Drama'],
    duration: 164,
    rating: 8.9,
    ageRating: 'PG-13',
    releaseDate: '2026-10-15',
    language: 'English (Dolby Atmos)',
    director: 'Eliza Reed',
    cast: ['Marcus Vance', 'Elena Rostova', 'Hassan Al-Mansoor', 'Claire Dupont'],
    isFeatured: true,
    status: 'now_showing',
  },
  {
    _id: '671f1001a1b2c3d4e5f60002',
    title: 'Shadow Protocol',
    synopsis:
      'In a rain-slicked metropolis governed by autonomous surveillance systems, a renegade intelligence operative discovers a predictive algorithm executing covert synthetic identities.',
    poster: '/src/assets/images/movie_shadow_protocol_1793195913215.jpg',
    backdrop: '/src/assets/images/movie_shadow_protocol_1793195913215.jpg',
    trailerUrl: 'https://www.youtube.com/watch?v=Way9Dexny3w',
    genres: ['Action', 'Cyberpunk', 'Thriller'],
    duration: 138,
    rating: 8.6,
    ageRating: 'R',
    releaseDate: '2026-10-20',
    language: 'English',
    director: 'Elara Vance',
    cast: ['Kaelen Vox', 'Jax Reed', 'Luna Chen', 'Victor Sterling'],
    isFeatured: true,
    status: 'now_showing',
  },
  {
    _id: '671f1001a1b2c3d4e5f60003',
    title: 'Foglio Nebbia: Midnight in Venice',
    synopsis:
      'A master detective navigates dense lagoon fog and forgotten Venetian palazzos in the winter of 1954 to decipher a cryptographic ledger left by an eccentric antiquities collector.',
    poster: '/src/assets/images/movie_midnight_venice_1793195913561.jpg',
    backdrop: '/src/assets/images/movie_midnight_venice_1793195913561.jpg',
    trailerUrl: 'https://www.youtube.com/watch?v=4qN0dJ08z0Y',
    genres: ['Mystery', 'Noir', 'Crime'],
    duration: 125,
    rating: 8.4,
    ageRating: 'PG-13',
    releaseDate: '2026-10-10',
    language: 'Italian / English Subs',
    director: 'Marco Rinaldi',
    cast: ['Antonio Bassano', 'Lorenzo Bianchi', 'Giulia Rossi'],
    isFeatured: false,
    status: 'now_showing',
  },
  {
    _id: '671f1001a1b2c3d4e5f60004',
    title: 'Apex Velocity: Tokyo Driftway',
    synopsis:
      'Underground electric hypercar racing pushes prototype telemetry and neural steering interfaces beyond human biological thresholds through Tokyo elevated arterial expressways.',
    poster: '/src/assets/images/movie_shadow_protocol_1793195913215.jpg',
    backdrop: '/src/assets/images/hero_cinema_imax_1793195911656.jpg',
    trailerUrl: '',
    genres: ['Action', 'Motorsport', 'Thriller'],
    duration: 119,
    rating: 8.1,
    ageRating: 'PG-13',
    releaseDate: '2026-10-25',
    language: 'Japanese / English',
    director: 'Kenji Takahashi',
    cast: ['Ren Sato', 'Aoi Tanaka', 'Tyler Brooks'],
    isFeatured: false,
    status: 'now_showing',
  },
  {
    _id: '671f1001a1b2c3d4e5f60005',
    title: 'Chronicles of Solaria',
    synopsis:
      'When solar flares strip the outer atmosphere of a terraformed colony, an alliance of subterranean engineers and astronomers race to ignite an artificial magnetic shield.',
    poster: '/src/assets/images/movie_celestial_horizon_1793195912321.jpg',
    backdrop: '/src/assets/images/hero_cinema_imax_1793195911656.jpg',
    trailerUrl: '',
    genres: ['Sci-Fi', 'Epic', 'Drama'],
    duration: 152,
    rating: 8.7,
    ageRating: 'PG-13',
    releaseDate: '2026-11-12',
    language: 'English',
    director: 'Sofia Chen',
    cast: ['David Oyelowo', 'Zoe Saldana', 'Mads Mikkelsen'],
    isFeatured: false,
    status: 'coming_soon',
  },
];

export const INITIAL_SHOWS: SeedShow[] = [
  // Today's shows for Celestial Horizon
  {
    _id: '671f2001a1b2c3d4e5f60101',
    movie: '671f1001a1b2c3d4e5f60001',
    cinema: {
      name: 'Starlight IMAX Grand Theatre',
      hall: 'Screen 1 - Laser 70mm',
      city: 'Downtown Core',
      experience: 'IMAX Laser',
    },
    date: '2026-10-28',
    time: '14:30',
    tierPrices: { standard: 14.5, premium: 18.5, vipRecliner: 24.0 },
    seatLayout: {
      rows: 7,
      cols: 10,
      vipRows: ['A', 'B'],
      premiumRows: ['C', 'D', 'E'],
      standardRows: ['F', 'G'],
    },
    bookedSeats: ['C4', 'C5', 'D5', 'D6'],
    isActive: true,
  },
  {
    _id: '671f2001a1b2c3d4e5f60102',
    movie: '671f1001a1b2c3d4e5f60001',
    cinema: {
      name: 'Starlight IMAX Grand Theatre',
      hall: 'Screen 1 - Laser 70mm',
      city: 'Downtown Core',
      experience: 'IMAX Laser',
    },
    date: '2026-10-28',
    time: '18:15',
    tierPrices: { standard: 15.0, premium: 19.5, vipRecliner: 25.0 },
    seatLayout: {
      rows: 7,
      cols: 10,
      vipRows: ['A', 'B'],
      premiumRows: ['C', 'D', 'E'],
      standardRows: ['F', 'G'],
    },
    bookedSeats: ['B4', 'B5', 'C4', 'C5', 'C6', 'C7'],
    isActive: true,
  },
  {
    _id: '671f2001a1b2c3d4e5f60103',
    movie: '671f1001a1b2c3d4e5f60001',
    cinema: {
      name: 'CineLuxe Dolby Cinema',
      hall: 'Auditorium A',
      city: 'West End Galleria',
      experience: 'Dolby Cinema',
    },
    date: '2026-10-28',
    time: '21:30',
    tierPrices: { standard: 13.5, premium: 17.5, vipRecliner: 22.5 },
    seatLayout: {
      rows: 7,
      cols: 10,
      vipRows: ['A', 'B'],
      premiumRows: ['C', 'D', 'E'],
      standardRows: ['F', 'G'],
    },
    bookedSeats: ['A4', 'A5'],
    isActive: true,
  },

  // Shows for Shadow Protocol
  {
    _id: '671f2001a1b2c3d4e5f60104',
    movie: '671f1001a1b2c3d4e5f60002',
    cinema: {
      name: 'CineLuxe Dolby Cinema',
      hall: 'Auditorium B',
      city: 'West End Galleria',
      experience: 'Dolby Cinema',
    },
    date: '2026-10-28',
    time: '16:45',
    tierPrices: { standard: 12.0, premium: 16.0, vipRecliner: 21.0 },
    seatLayout: {
      rows: 7,
      cols: 10,
      vipRows: ['A', 'B'],
      premiumRows: ['C', 'D', 'E'],
      standardRows: ['F', 'G'],
    },
    bookedSeats: ['E4', 'E5', 'E6'],
    isActive: true,
  },
  {
    _id: '671f2001a1b2c3d4e5f60105',
    movie: '671f1001a1b2c3d4e5f60002',
    cinema: {
      name: 'Onyx VIP Club Cinema',
      hall: 'Lounge Suite 1',
      city: 'Harbor District',
      experience: 'VIP Recliner Suite',
    },
    date: '2026-10-28',
    time: '20:00',
    tierPrices: { standard: 16.0, premium: 20.0, vipRecliner: 28.0 },
    seatLayout: {
      rows: 6,
      cols: 8,
      vipRows: ['A', 'B'],
      premiumRows: ['C', 'D'],
      standardRows: ['E', 'F'],
    },
    bookedSeats: ['B3', 'B4'],
    isActive: true,
  },

  // Shows for Midnight in Venice
  {
    _id: '671f2001a1b2c3d4e5f60106',
    movie: '671f1001a1b2c3d4e5f60003',
    cinema: {
      name: 'Onyx VIP Club Cinema',
      hall: 'Screen 2 Vintage',
      city: 'Harbor District',
      experience: 'VIP Recliner Suite',
    },
    date: '2026-10-28',
    time: '17:30',
    tierPrices: { standard: 14.0, premium: 18.0, vipRecliner: 23.0 },
    seatLayout: {
      rows: 6,
      cols: 8,
      vipRows: ['A', 'B'],
      premiumRows: ['C', 'D'],
      standardRows: ['E', 'F'],
    },
    bookedSeats: [],
    isActive: true,
  },
  {
    _id: '671f2001a1b2c3d4e5f60107',
    movie: '671f1001a1b2c3d4e5f60003',
    cinema: {
      name: 'Starlight IMAX Grand Theatre',
      hall: 'Hall 3 Classic',
      city: 'Downtown Core',
      experience: 'Standard 4K',
    },
    date: '2026-10-28',
    time: '20:45',
    tierPrices: { standard: 12.0, premium: 15.0, vipRecliner: 19.5 },
    seatLayout: {
      rows: 7,
      cols: 10,
      vipRows: ['A', 'B'],
      premiumRows: ['C', 'D', 'E'],
      standardRows: ['F', 'G'],
    },
    bookedSeats: ['C1', 'C2'],
    isActive: true,
  },

  // Tomorrow's shows (2026-10-29)
  {
    _id: '671f2001a1b2c3d4e5f60108',
    movie: '671f1001a1b2c3d4e5f60001',
    cinema: {
      name: 'Starlight IMAX Grand Theatre',
      hall: 'Screen 1 - Laser 70mm',
      city: 'Downtown Core',
      experience: 'IMAX Laser',
    },
    date: '2026-10-29',
    time: '15:00',
    tierPrices: { standard: 14.5, premium: 18.5, vipRecliner: 24.0 },
    seatLayout: {
      rows: 7,
      cols: 10,
      vipRows: ['A', 'B'],
      premiumRows: ['C', 'D', 'E'],
      standardRows: ['F', 'G'],
    },
    bookedSeats: [],
    isActive: true,
  },
  {
    _id: '671f2001a1b2c3d4e5f60109',
    movie: '671f1001a1b2c3d4e5f60002',
    cinema: {
      name: 'CineLuxe Dolby Cinema',
      hall: 'Auditorium A',
      city: 'West End Galleria',
      experience: 'Dolby Cinema',
    },
    date: '2026-10-29',
    time: '19:00',
    tierPrices: { standard: 13.5, premium: 17.5, vipRecliner: 22.5 },
    seatLayout: {
      rows: 7,
      cols: 10,
      vipRows: ['A', 'B'],
      premiumRows: ['C', 'D', 'E'],
      standardRows: ['F', 'G'],
    },
    bookedSeats: ['D4', 'D5'],
    isActive: true,
  },
];

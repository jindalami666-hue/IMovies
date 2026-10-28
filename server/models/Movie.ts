import mongoose, { Document, Model, Schema } from 'mongoose';

export interface IMovie extends Document {
  title: string;
  synopsis: string;
  poster: string;
  backdrop: string;
  trailerUrl?: string;
  genres: string[];
  duration: number; // in minutes
  rating: number; // 0.0 to 10.0
  ageRating: string; // 'G' | 'PG' | 'PG-13' | 'R' | 'NC-17'
  releaseDate: Date;
  language: string;
  director: string;
  cast: string[];
  isFeatured: boolean;
  status: 'now_showing' | 'coming_soon';
  createdAt: Date;
  updatedAt: Date;
}

const MovieSchema = new Schema<IMovie>(
  {
    title: {
      type: String,
      required: [true, 'Please provide a movie title'],
      trim: true,
      index: true,
    },
    synopsis: {
      type: String,
      required: [true, 'Please provide movie synopsis'],
      trim: true,
    },
    poster: {
      type: String,
      required: [true, 'Please provide poster image URL'],
      default: '/src/assets/images/movie_celestial_horizon_1793195912321.jpg',
    },
    backdrop: {
      type: String,
      default: '/src/assets/images/hero_cinema_imax_1793195911656.jpg',
    },
    trailerUrl: {
      type: String,
      default: '',
    },
    genres: {
      type: [String],
      required: true,
      default: ['Action', 'Sci-Fi'],
    },
    duration: {
      type: Number,
      required: [true, 'Please provide duration in minutes'],
      min: [1, 'Duration must be at least 1 minute'],
    },
    rating: {
      type: Number,
      default: 8.5,
      min: 0,
      max: 10,
    },
    ageRating: {
      type: String,
      default: 'PG-13',
    },
    releaseDate: {
      type: Date,
      default: Date.now,
    },
    language: {
      type: String,
      default: 'English',
    },
    director: {
      type: String,
      default: 'Christopher Nolan',
    },
    cast: {
      type: [String],
      default: [],
    },
    isFeatured: {
      type: Boolean,
      default: false,
    },
    status: {
      type: String,
      enum: ['now_showing', 'coming_soon'],
      default: 'now_showing',
    },
  },
  {
    timestamps: true,
  }
);

export const Movie: Model<IMovie> = mongoose.models.Movie || mongoose.model<IMovie>('Movie', MovieSchema);

import mongoose, { Document, Model, Schema } from 'mongoose';

export interface ICinema {
  name: string;
  hall: string;
  city: string;
  experience: 'IMAX Laser' | 'Dolby Cinema' | 'VIP Recliner Suite' | 'Standard 4K';
}

export interface IShow extends Document {
  movie: mongoose.Types.ObjectId;
  cinema: ICinema;
  date: string; // ISO date string YYYY-MM-DD
  time: string; // HH:mm format
  tierPrices: {
    standard: number;
    premium: number;
    vipRecliner: number;
  };
  seatLayout: {
    rows: number; // e.g. 7 (A-G)
    cols: number; // e.g. 10 (1-10)
    vipRows: string[]; // e.g. ['A', 'B']
    premiumRows: string[]; // e.g. ['C', 'D', 'E']
    standardRows: string[]; // e.g. ['F', 'G']
  };
  bookedSeats: string[]; // e.g. ['C4', 'C5', 'F2']
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const CinemaSubSchema = new Schema<ICinema>(
  {
    name: { type: String, required: true },
    hall: { type: String, required: true },
    city: { type: String, default: 'Metropolis' },
    experience: {
      type: String,
      enum: ['IMAX Laser', 'Dolby Cinema', 'VIP Recliner Suite', 'Standard 4K'],
      default: 'IMAX Laser',
    },
  },
  { _id: false }
);

const ShowSchema = new Schema<IShow>(
  {
    movie: {
      type: Schema.Types.ObjectId,
      ref: 'Movie',
      required: true,
      index: true,
    },
    cinema: {
      type: CinemaSubSchema,
      required: true,
    },
    date: {
      type: String,
      required: true,
      index: true,
    },
    time: {
      type: String,
      required: true,
    },
    tierPrices: {
      standard: { type: Number, default: 12.0 },
      premium: { type: Number, default: 16.5 },
      vipRecliner: { type: Number, default: 22.0 },
    },
    seatLayout: {
      rows: { type: Number, default: 7 },
      cols: { type: Number, default: 10 },
      vipRows: { type: [String], default: ['A', 'B'] },
      premiumRows: { type: [String], default: ['C', 'D', 'E'] },
      standardRows: { type: [String], default: ['F', 'G'] },
    },
    bookedSeats: {
      type: [String],
      default: [],
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

ShowSchema.index({ movie: 1, date: 1 });

export const Show: Model<IShow> = mongoose.models.Show || mongoose.model<IShow>('Show', ShowSchema);

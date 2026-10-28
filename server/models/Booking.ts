import mongoose, { Document, Model, Schema } from 'mongoose';

export interface IBookedSeatDetail {
  seatId: string; // e.g. "C4"
  row: string; // "C"
  number: number; // 4
  tier: 'VIP' | 'Premium' | 'Standard';
  price: number;
}

export interface IBooking extends Document {
  bookingId: string;
  user: mongoose.Types.ObjectId;
  show: mongoose.Types.ObjectId;
  movie: mongoose.Types.ObjectId;
  movieTitle: string;
  moviePoster: string;
  cinemaName: string;
  cinemaHall: string;
  cinemaExperience: string;
  showDate: string;
  showTime: string;
  seats: IBookedSeatDetail[];
  subtotal: number;
  bookingFee: number;
  totalAmount: number;
  status: 'confirmed' | 'cancelled';
  customerName: string;
  customerEmail: string;
  paymentMethod: string;
  paymentStatus: 'paid' | 'pending' | 'refunded';
  qrData: string;
  createdAt: Date;
  updatedAt: Date;
}

const BookedSeatSchema = new Schema<IBookedSeatDetail>(
  {
    seatId: { type: String, required: true },
    row: { type: String, required: true },
    number: { type: Number, required: true },
    tier: {
      type: String,
      enum: ['VIP', 'Premium', 'Standard'],
      required: true,
    },
    price: { type: Number, required: true },
  },
  { _id: false }
);

const BookingSchema = new Schema<IBooking>(
  {
    bookingId: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },
    user: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    show: {
      type: Schema.Types.ObjectId,
      ref: 'Show',
      required: true,
      index: true,
    },
    movie: {
      type: Schema.Types.ObjectId,
      ref: 'Movie',
      required: true,
    },
    movieTitle: { type: String, required: true },
    moviePoster: { type: String, required: true },
    cinemaName: { type: String, required: true },
    cinemaHall: { type: String, required: true },
    cinemaExperience: { type: String, default: 'IMAX Laser' },
    showDate: { type: String, required: true },
    showTime: { type: String, required: true },
    seats: {
      type: [BookedSeatSchema],
      required: true,
      validate: [(v: IBookedSeatDetail[]) => v.length > 0, 'Booking must include at least one seat'],
    },
    subtotal: { type: Number, required: true },
    bookingFee: { type: Number, default: 1.5 },
    totalAmount: { type: Number, required: true },
    status: {
      type: String,
      enum: ['confirmed', 'cancelled'],
      default: 'confirmed',
    },
    customerName: { type: String, required: true },
    customerEmail: { type: String, required: true },
    paymentMethod: { type: String, default: 'Credit Card (Mock)' },
    paymentStatus: {
      type: String,
      enum: ['paid', 'pending', 'refunded'],
      default: 'paid',
    },
    qrData: { type: String, required: true },
  },
  {
    timestamps: true,
  }
);

export const Booking: Model<IBooking> = mongoose.models.Booking || mongoose.model<IBooking>('Booking', BookingSchema);

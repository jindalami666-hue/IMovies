import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import { User, IUser } from '../models/User.ts';
import { Movie, IMovie } from '../models/Movie.ts';
import { Show, IShow } from '../models/Show.ts';
import { Booking, IBooking, IBookedSeatDetail } from '../models/Booking.ts';
import { INITIAL_MOVIES, INITIAL_SHOWS, SeedMovie, SeedShow } from '../seedData.ts';

// In-Memory store for offline/demo/sandbox development when Atlas URI is not yet configured
let memoryUsers: any[] = [];
let memoryMovies: SeedMovie[] = JSON.parse(JSON.stringify(INITIAL_MOVIES));
let memoryShows: SeedShow[] = JSON.parse(JSON.stringify(INITIAL_SHOWS));
let memoryBookings: any[] = [];

// Initialize demo users
async function initDemoUsers() {
  if (memoryUsers.length === 0) {
    const adminPasswordHash = await bcrypt.hash('admin123', 10);
    const viewerPasswordHash = await bcrypt.hash('viewer123', 10);

    memoryUsers = [
      {
        _id: '671f0001a1b2c3d4e5f60901',
        name: 'Alexander Stone (Admin)',
        email: 'admin@imovies.com',
        password: adminPasswordHash,
        role: 'admin',
        phone: '+1 (555) 019-2834',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        _id: '671f0001a1b2c3d4e5f60902',
        name: 'Sophia Patel',
        email: 'viewer@imovies.com',
        password: viewerPasswordHash,
        role: 'user',
        phone: '+1 (555) 019-8765',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ];
  }
}
initDemoUsers();

export function isAtlasConnected(): boolean {
  return mongoose.connection.readyState === 1;
}

export const dbService = {
  // Sync seed data to Atlas if connected and empty
  async syncSeedDataToAtlas(): Promise<void> {
    if (!isAtlasConnected()) return;

    try {
      const movieCount = await Movie.countDocuments();
      if (movieCount === 0) {
        console.log('[MongoDB] Seeding initial movies into MongoDB Atlas...');
        await Movie.insertMany(INITIAL_MOVIES);
      }

      const showCount = await Show.countDocuments();
      if (showCount === 0) {
        console.log('[MongoDB] Seeding initial shows into MongoDB Atlas...');
        await Show.insertMany(INITIAL_SHOWS);
      }

      const userCount = await User.countDocuments();
      if (userCount === 0) {
        console.log('[MongoDB] Seeding demo users into MongoDB Atlas...');
        const adminHash = await bcrypt.hash('admin123', 10);
        const userHash = await bcrypt.hash('viewer123', 10);
        await User.insertMany([
          {
            name: 'Alexander Stone (Admin)',
            email: 'admin@imovies.com',
            password: adminHash,
            role: 'admin',
            phone: '+1 (555) 019-2834',
          },
          {
            name: 'Sophia Patel',
            email: 'viewer@imovies.com',
            password: userHash,
            role: 'user',
            phone: '+1 (555) 019-8765',
          },
        ]);
      }
    } catch (err: any) {
      console.error('[MongoDB] Error during Atlas seed sync:', err.message);
    }
  },

  // USERS
  async findUserByEmail(email: string): Promise<any> {
    if (isAtlasConnected()) {
      return await User.findOne({ email: email.toLowerCase() }).select('+password');
    }
    return memoryUsers.find((u) => u.email.toLowerCase() === email.toLowerCase()) || null;
  },

  async findUserById(id: string): Promise<any> {
    if (isAtlasConnected()) {
      return await User.findById(id).select('-password');
    }
    const user = memoryUsers.find((u) => String(u._id) === String(id));
    if (!user) return null;
    const { password, ...safeUser } = user;
    return safeUser;
  },

  async createUser(userData: { name: string; email: string; password: string; role?: 'user' | 'admin'; phone?: string }): Promise<any> {
    if (isAtlasConnected()) {
      const user = await User.create({
        name: userData.name,
        email: userData.email.toLowerCase(),
        password: userData.password,
        role: userData.role || 'user',
        phone: userData.phone || '',
      });
      return user;
    }

    const hashedPassword = await bcrypt.hash(userData.password, 10);
    const newUser = {
      _id: new mongoose.Types.ObjectId().toString(),
      name: userData.name,
      email: userData.email.toLowerCase(),
      password: hashedPassword,
      role: userData.role || 'user',
      phone: userData.phone || '',
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    memoryUsers.push(newUser);
    return newUser;
  },

  // MOVIES
  async getMovies(filter: { genre?: string; search?: string; status?: string } = {}): Promise<any[]> {
    if (isAtlasConnected()) {
      const query: any = {};
      if (filter.genre && filter.genre !== 'All') {
        query.genres = filter.genre;
      }
      if (filter.status) {
        query.status = filter.status;
      }
      if (filter.search) {
        query.title = { $regex: filter.search, $options: 'i' };
      }
      return await Movie.find(query).sort({ isFeatured: -1, rating: -1 });
    }

    let result = [...memoryMovies];
    if (filter.genre && filter.genre !== 'All') {
      result = result.filter((m) => m.genres.some((g) => g.toLowerCase() === filter.genre!.toLowerCase()));
    }
    if (filter.status) {
      result = result.filter((m) => m.status === filter.status);
    }
    if (filter.search) {
      const q = filter.search.toLowerCase();
      result = result.filter((m) => m.title.toLowerCase().includes(q) || m.director.toLowerCase().includes(q));
    }
    return result.sort((a, b) => (b.isFeatured ? 1 : 0) - (a.isFeatured ? 1 : 0) || b.rating - a.rating);
  },

  async getMovieById(id: string): Promise<any> {
    if (isAtlasConnected()) {
      return await Movie.findById(id);
    }
    return memoryMovies.find((m) => String(m._id) === String(id)) || null;
  },

  async createMovie(data: Partial<SeedMovie>): Promise<any> {
    if (isAtlasConnected()) {
      return await Movie.create(data);
    }
    const newMovie: SeedMovie = {
      _id: new mongoose.Types.ObjectId().toString(),
      title: data.title || 'Untitled',
      synopsis: data.synopsis || '',
      poster: data.poster || '/src/assets/images/movie_celestial_horizon_1793195912321.jpg',
      backdrop: data.backdrop || '/src/assets/images/hero_cinema_imax_1793195911656.jpg',
      trailerUrl: data.trailerUrl || '',
      genres: data.genres || ['Action'],
      duration: data.duration || 120,
      rating: data.rating || 8.0,
      ageRating: data.ageRating || 'PG-13',
      releaseDate: data.releaseDate || new Date().toISOString().split('T')[0],
      language: data.language || 'English',
      director: data.director || 'Director',
      cast: data.cast || [],
      isFeatured: Boolean(data.isFeatured),
      status: data.status || 'now_showing',
    };
    memoryMovies.unshift(newMovie);
    return newMovie;
  },

  async updateMovie(id: string, data: Partial<SeedMovie>): Promise<any> {
    if (isAtlasConnected()) {
      return await Movie.findByIdAndUpdate(id, data, { new: true });
    }
    const idx = memoryMovies.findIndex((m) => String(m._id) === String(id));
    if (idx === -1) return null;
    memoryMovies[idx] = { ...memoryMovies[idx], ...data };
    return memoryMovies[idx];
  },

  async deleteMovie(id: string): Promise<boolean> {
    if (isAtlasConnected()) {
      const res = await Movie.findByIdAndDelete(id);
      return Boolean(res);
    }
    const initialLen = memoryMovies.length;
    memoryMovies = memoryMovies.filter((m) => String(m._id) !== String(id));
    return memoryMovies.length < initialLen;
  },

  // SHOWS
  async getShows(filter: { movieId?: string; date?: string; cinemaName?: string } = {}): Promise<any[]> {
    if (isAtlasConnected()) {
      const query: any = { isActive: true };
      if (filter.movieId) query.movie = filter.movieId;
      if (filter.date) query.date = filter.date;
      if (filter.cinemaName && filter.cinemaName !== 'All') {
        query['cinema.name'] = filter.cinemaName;
      }
      return await Show.find(query).populate('movie').sort({ date: 1, time: 1 });
    }

    let result = memoryShows.filter((s) => s.isActive);
    if (filter.movieId) {
      result = result.filter((s) => String(s.movie) === String(filter.movieId));
    }
    if (filter.date) {
      result = result.filter((s) => s.date === filter.date);
    }
    if (filter.cinemaName && filter.cinemaName !== 'All') {
      result = result.filter((s) => s.cinema.name.toLowerCase() === filter.cinemaName!.toLowerCase());
    }

    // Attach movie details
    return result.map((show) => ({
      ...show,
      movie: memoryMovies.find((m) => String(m._id) === String(show.movie)) || null,
    }));
  },

  async getShowById(id: string): Promise<any> {
    if (isAtlasConnected()) {
      return await Show.findById(id).populate('movie');
    }
    const show = memoryShows.find((s) => String(s._id) === String(id));
    if (!show) return null;
    return {
      ...show,
      movie: memoryMovies.find((m) => String(m._id) === String(show.movie)) || null,
    };
  },

  async createShow(showData: any): Promise<any> {
    if (isAtlasConnected()) {
      return await Show.create(showData);
    }
    const newShow: SeedShow = {
      _id: new mongoose.Types.ObjectId().toString(),
      movie: showData.movie,
      cinema: showData.cinema,
      date: showData.date,
      time: showData.time,
      tierPrices: showData.tierPrices || { standard: 12.0, premium: 16.0, vipRecliner: 22.0 },
      seatLayout: showData.seatLayout || {
        rows: 7,
        cols: 10,
        vipRows: ['A', 'B'],
        premiumRows: ['C', 'D', 'E'],
        standardRows: ['F', 'G'],
      },
      bookedSeats: [],
      isActive: true,
    };
    memoryShows.push(newShow);
    return newShow;
  },

  async deleteShow(id: string): Promise<boolean> {
    if (isAtlasConnected()) {
      const res = await Show.findByIdAndDelete(id);
      return Boolean(res);
    }
    const len = memoryShows.length;
    memoryShows = memoryShows.filter((s) => String(s._id) !== String(id));
    return memoryShows.length < len;
  },

  // BOOKINGS WITH CONCURRENCY CHECK
  async createBooking(bookingData: {
    userId: string;
    showId: string;
    seats: IBookedSeatDetail[];
    customerName: string;
    customerEmail: string;
    paymentMethod?: string;
  }): Promise<any> {
    const seatIds = bookingData.seats.map((s) => s.seatId);
    if (!seatIds || seatIds.length === 0) {
      throw new Error('At least one seat must be selected');
    }

    if (isAtlasConnected()) {
      // Atomic reservation to prevent double booking in MongoDB
      const updatedShow = await Show.findOneAndUpdate(
        {
          _id: bookingData.showId,
          bookedSeats: { $nin: seatIds },
        },
        {
          $push: { bookedSeats: { $each: seatIds } },
        },
        { new: true }
      ).populate('movie');

      if (!updatedShow) {
        throw new Error('One or more of the selected seats were just booked by another customer. Please choose different seats.');
      }

      const movie: any = updatedShow.movie;
      const subtotal = bookingData.seats.reduce((acc, curr) => acc + curr.price, 0);
      const bookingFee = 1.5;
      const totalAmount = Number((subtotal + bookingFee).toFixed(2));
      const bookingId = `IMV-${new Date().toISOString().slice(0, 10).replace(/-/g, '')}-${Math.floor(1000 + Math.random() * 9000)}`;

      const booking = await Booking.create({
        bookingId,
        user: bookingData.userId,
        show: bookingData.showId,
        movie: movie._id,
        movieTitle: movie.title,
        moviePoster: movie.poster,
        cinemaName: updatedShow.cinema.name,
        cinemaHall: updatedShow.cinema.hall,
        cinemaExperience: updatedShow.cinema.experience,
        showDate: updatedShow.date,
        showTime: updatedShow.time,
        seats: bookingData.seats,
        subtotal,
        bookingFee,
        totalAmount,
        status: 'confirmed',
        customerName: bookingData.customerName,
        customerEmail: bookingData.customerEmail,
        paymentMethod: bookingData.paymentMethod || 'Credit Card (Mock)',
        paymentStatus: 'paid',
        qrData: `IMOVIES|${bookingId}|${movie.title}|${seatIds.join(',')}|${updatedShow.date}`,
      });

      return booking;
    }

    // In-memory atomic check
    const show = memoryShows.find((s) => String(s._id) === String(bookingData.showId));
    if (!show) {
      throw new Error('Show screening not found');
    }

    const collision = seatIds.some((sId) => show.bookedSeats.includes(sId));
    if (collision) {
      throw new Error('One or more selected seats were just reserved by another guest. Please choose different seats.');
    }

    // Atomically push seats
    show.bookedSeats.push(...seatIds);

    const movie = memoryMovies.find((m) => String(m._id) === String(show.movie)) || {
      _id: show.movie,
      title: 'Featured Movie',
      poster: '/src/assets/images/movie_celestial_horizon_1793195912321.jpg',
    };

    const subtotal = bookingData.seats.reduce((acc, curr) => acc + curr.price, 0);
    const bookingFee = 1.5;
    const totalAmount = Number((subtotal + bookingFee).toFixed(2));
    const bookingId = `IMV-${new Date().toISOString().slice(0, 10).replace(/-/g, '')}-${Math.floor(1000 + Math.random() * 9000)}`;

    const newBooking = {
      _id: new mongoose.Types.ObjectId().toString(),
      bookingId,
      user: bookingData.userId,
      show: bookingData.showId,
      movie: movie._id,
      movieTitle: movie.title,
      moviePoster: movie.poster,
      cinemaName: show.cinema.name,
      cinemaHall: show.cinema.hall,
      cinemaExperience: show.cinema.experience,
      showDate: show.date,
      showTime: show.time,
      seats: bookingData.seats,
      subtotal,
      bookingFee,
      totalAmount,
      status: 'confirmed',
      customerName: bookingData.customerName,
      customerEmail: bookingData.customerEmail,
      paymentMethod: bookingData.paymentMethod || 'Credit Card (Mock)',
      paymentStatus: 'paid',
      qrData: `IMOVIES|${bookingId}|${movie.title}|${seatIds.join(',')}|${show.date}`,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    memoryBookings.unshift(newBooking);
    return newBooking;
  },

  async getUserBookings(userId: string): Promise<any[]> {
    if (isAtlasConnected()) {
      return await Booking.find({ user: userId }).sort({ createdAt: -1 });
    }
    return memoryBookings.filter((b) => String(b.user) === String(userId));
  },

  async getBookingById(bookingId: string): Promise<any> {
    if (isAtlasConnected()) {
      return await Booking.findOne({ bookingId });
    }
    return memoryBookings.find((b) => b.bookingId === bookingId) || null;
  },

  async getAllBookings(): Promise<any[]> {
    if (isAtlasConnected()) {
      return await Booking.find().sort({ createdAt: -1 });
    }
    return [...memoryBookings];
  },

  async cancelBooking(bookingId: string, userId: string, isAdmin: boolean): Promise<any> {
    if (isAtlasConnected()) {
      const query: any = { bookingId };
      if (!isAdmin) query.user = userId;

      const booking = await Booking.findOne(query);
      if (!booking) throw new Error('Booking not found or unauthorized');
      if (booking.status === 'cancelled') throw new Error('Booking is already cancelled');

      booking.status = 'cancelled';
      booking.paymentStatus = 'refunded';
      await booking.save();

      // Release seats back to the show
      const seatIds = booking.seats.map((s) => s.seatId);
      await Show.findByIdAndUpdate(booking.show, {
        $pull: { bookedSeats: { $in: seatIds } },
      });

      return booking;
    }

    const booking = memoryBookings.find((b) => b.bookingId === bookingId);
    if (!booking) throw new Error('Booking not found');
    if (!isAdmin && String(booking.user) !== String(userId)) throw new Error('Unauthorized');
    if (booking.status === 'cancelled') throw new Error('Booking is already cancelled');

    booking.status = 'cancelled';
    booking.paymentStatus = 'refunded';

    // Release seats
    const show = memoryShows.find((s) => String(s._id) === String(booking.show));
    if (show) {
      const seatIds = booking.seats.map((s: any) => s.seatId);
      show.bookedSeats = show.bookedSeats.filter((s: string) => !seatIds.includes(s));
    }

    return booking;
  },

  async resetSeedData(): Promise<void> {
    memoryMovies = JSON.parse(JSON.stringify(INITIAL_MOVIES));
    memoryShows = JSON.parse(JSON.stringify(INITIAL_SHOWS));
    memoryBookings = [];
    await initDemoUsers();

    if (isAtlasConnected()) {
      await Movie.deleteMany({});
      await Show.deleteMany({});
      await Booking.deleteMany({});
      await this.syncSeedDataToAtlas();
    }
  },

  async getStats(): Promise<any> {
    if (isAtlasConnected()) {
      const [moviesCount, showsCount, bookingsCount, usersCount] = await Promise.all([
        Movie.countDocuments(),
        Show.countDocuments(),
        Booking.countDocuments(),
        User.countDocuments(),
      ]);
      return { moviesCount, showsCount, bookingsCount, usersCount, storage: 'MongoDB Atlas' };
    }
    return {
      moviesCount: memoryMovies.length,
      showsCount: memoryShows.length,
      bookingsCount: memoryBookings.length,
      usersCount: memoryUsers.length,
      storage: 'Persistent In-Memory (Atlas Ready)',
    };
  },
};

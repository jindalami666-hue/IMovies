import express from 'express';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import { connectDB } from './server/config/db.ts';
import { dbService } from './server/services/dbService.ts';
import { protect, adminOnly } from './server/middleware/auth.ts';
import * as authController from './server/controllers/authController.ts';
import * as movieController from './server/controllers/movieController.ts';
import * as showController from './server/controllers/showController.ts';
import * as bookingController from './server/controllers/bookingController.ts';
import * as systemController from './server/controllers/systemController.ts';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function startServer() {
  const app = express();
  const PORT = process.env.PORT || 3000;

  // Middleware
  app.use(cors());
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));

  // Initialize Database connection
  await connectDB();
  await dbService.syncSeedDataToAtlas();

  // API Routes
  // 1. Auth routes
  app.post('/api/auth/register', authController.register);
  app.post('/api/auth/login', authController.login);
  app.get('/api/auth/me', protect, authController.getMe);

  // 2. Movie routes
  app.get('/api/movies', movieController.getMovies);
  app.get('/api/movies/:id', movieController.getMovieById);
  app.post('/api/movies', protect, adminOnly, movieController.createMovie);
  app.put('/api/movies/:id', protect, adminOnly, movieController.updateMovie);
  app.delete('/api/movies/:id', protect, adminOnly, movieController.deleteMovie);

  // 3. Show routes
  app.get('/api/shows', showController.getShows);
  app.get('/api/shows/:id', showController.getShowById);
  app.post('/api/shows', protect, adminOnly, showController.createShow);
  app.delete('/api/shows/:id', protect, adminOnly, showController.deleteShow);

  // 4. Booking routes
  app.post('/api/bookings', protect, bookingController.createBooking);
  app.get('/api/bookings/my', protect, bookingController.getMyBookings);
  app.get('/api/bookings/admin/all', protect, adminOnly, bookingController.getAllBookings);
  app.get('/api/bookings/:id', protect, bookingController.getBookingById);
  app.delete('/api/bookings/:id', protect, bookingController.cancelBooking);

  // 5. System & Health routes
  app.get('/api/status', systemController.getSystemStatus);
  app.post('/api/seed', systemController.resetDatabase);

  // Vite dev middleware or static serving
  const isProduction = process.env.NODE_ENV === 'production';
  if (!isProduction) {
    const { createServer } = await import('vite');
    const vite = await createServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.resolve(__dirname, 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.resolve(distPath, 'index.html'));
    });
  }

  const portNumber = typeof PORT === 'string' ? parseInt(PORT, 10) : PORT;
  app.listen(portNumber, '0.0.0.0', () => {
    console.log(`[IMovies Server] Cinema Booking API running on port ${portNumber}`);
  });
}

startServer().catch((err) => {
  console.error('[IMovies Server] Startup failed:', err);
  process.exit(1);
});

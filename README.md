# IMovies – Movie Ticket Booking System (MERN Stack)

IMovies is a full-stack cinema ticket reservation and auditorium booking web application built with the **MERN** stack (MongoDB, Express.js, React.js, and Node.js). It provides a responsive, dark cinema aesthetic with real-time seat matrix selection, tiered pricing (VIP Recliner, Premium, Standard), showtime scheduling, JWT authentication, and atomic concurrency checks to prevent double-booking.

---

## Tech Stack Overview

- **Frontend**: React 19, TypeScript, Tailwind CSS, Lucide Icons, Motion
- **Backend**: Node.js, Express.js (REST API architecture)
- **Database**: MongoDB Atlas using Mongoose ODM with atomic reservation queries
- **Authentication**: JSON Web Tokens (JWT) and `bcryptjs` password hashing
- **Deployment**: Google Cloud Run & Docker ready

---

## Key Features

1. **Cinematic Responsive Interface**
   - High-contrast cinema UI with dark obsidian styling (`#0B0E14`), warm amber accents, and clean typography.
   - High-fidelity visual assets, backdrop hero banners, and 3:4 aspect movie posters.

2. **Movie Catalog & Screening Schedules**
   - Live search by title, director, or cast.
   - Segmented genre filtering (`All`, `Sci-Fi`, `Action`, `Mystery`, `Drama`, `Thriller`).
   - Cinema hall and venue filtering (`Starlight IMAX`, `CineLuxe Dolby Cinema`, `Onyx VIP`).
   - Date selection carousel (`Today`, `Tomorrow`, upcoming dates).

3. **Interactive Seat Matrix & Live Pricing**
   - Tiered seating:
     - **VIP Recliner (Row A-B)**: Plush wide chairs with premium view.
     - **Premium (Row C-E)**: Optimal sightlines and surround audio sweet spot.
     - **Standard (Row F-G)**: Value seating.
   - Visual IMAX curved screen representation.
   - Dynamic real-time calculation: subtotal + cinema booking fee = live total.
   - Real-time seat legend: Available, Selected, and Occupied.

4. **Atomic Concurrency Protection**
   - Duplicate booking prevention in backend via MongoDB `findOneAndUpdate` atomic operations with `$nin: seatIds` filters.
   - Instant conflict detection if two customers attempt to reserve the same seat simultaneously.

5. **Customer Booking Pass & History**
   - Unique alphanumeric booking reference (e.g., `IMV-20261028-9842`).
   - Deluxe digital cinema ticket pass with QR code and barcode.
   - Booking history view with status tracking (`confirmed`, `cancelled`).
   - 1-click booking cancellation with instant seat release back into the available pool.

6. **Executive Admin Console**
   - Overview KPI cards: Gross revenue, tickets reserved, active movies, scheduled shows.
   - Movie management: Add new releases with posters, synopsis, duration, genres, and age ratings.
   - Showtime scheduler: Schedule screening dates, times, and pricing tiers for auditoriums.
   - Reservation monitor: Real-time table of all platform bookings.
   - Seed data reset button for one-click demo re-initialization.

7. **Zero-Downtime Database Architecture**
   - When configured with `MONGODB_URI`, Mongoose connects directly to your live MongoDB Atlas cloud database.
   - During evaluation or local development before you configure Atlas credentials, the backend uses a built-in persistent repository that executes the exact same Mongoose schemas, queries, and concurrency locks without crashing or blocking your workflow.

---

## Pre-Seeded Demo Credentials

For immediate testing, sample accounts are pre-configured:

| Role | Email | Password | Permissions |
| :--- | :--- | :--- | :--- |
| **Admin** | `admin@imovies.com` | `admin123` | Full access to Admin Console, Movie Manager, Showtime Scheduler, and Bookings Monitor |
| **Customer** | `viewer@imovies.com` | `viewer123` | Seat selection, checkout, ticket inspection, and booking cancellation |

*Note: You can also click the quick demo buttons on the Sign In modal or create a new account with your own credentials.*

---

## Setup & Local Installation

### 1. Clone the repository
```bash
git clone <repository-url>
cd imovies
```

### 2. Install dependencies
```bash
npm install
```

### 3. Configure Environment Variables
Copy `.env.example` to `.env`:
```bash
cp .env.example .env
```

Edit `.env` with your settings:
```env
# MongoDB Atlas Connection String
MONGODB_URI="mongodb+srv://<username>:<password>@cluster0.abcde.mongodb.net/imovies?retryWrites=true&w=majority"

# JWT Secret Key
JWT_SECRET="your-secure-jwt-secret-key-2026"

# Port (defaults to 3000)
PORT=3000
```

### 4. Running in Development
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

### 5. Running in Production
```bash
# Build the React frontend
npm run build

# Start the Node.js Express server
npm start
```

---

## Step-by-Step MongoDB Atlas Setup Guide

To link your own free MongoDB Atlas cloud database:

1. **Sign Up for MongoDB Atlas**:
   - Visit [mongodb.com/cloud/atlas](https://www.mongodb.com/cloud/atlas) and register a free account.
2. **Create a Free Cluster**:
   - Choose the free Shared (M0) tier in your preferred cloud provider and region.
3. **Configure Network Whitelist**:
   - Navigate to **Security** → **Network Access**.
   - Click **Add IP Address** and select **Allow Access from Anywhere** (`0.0.0.0/0`).
4. **Create Database Credentials**:
   - Navigate to **Security** → **Database Access**.
   - Click **Add New Database User**. Choose **Password Authentication**, set a username (e.g. `imovies_user`) and a secure password. Grant **Read and write to any database**.
5. **Copy the Connection String**:
   - Click **Database** → **Connect** → **Drivers** (Node.js).
   - Copy the URI:
     `mongodb+srv://<username>:<password>@cluster0.abcde.mongodb.net/imovies?retryWrites=true&w=majority`
   - Replace `<username>` and `<password>` with the credentials created in Step 4.
6. **Set `MONGODB_URI`**:
   - Add this URI to your `.env` or your hosting environment secrets. On server restart, Mongoose will connect and sync initial seed collections automatically!

---

## Google Cloud Run Deployment

This project contains a unified Express server (`server.ts`) that serves both REST APIs and the built Vite frontend assets.

```bash
# 1. Build project
npm run build

# 2. Deploy to Cloud Run
gcloud run deploy imovies-booking \
  --source . \
  --port 3000 \
  --set-env-vars MONGODB_URI="<your-mongodb-uri>",JWT_SECRET="<your-jwt-secret>" \
  --allow-unauthenticated
```

---

## REST API Documentation

### Authentication
- `POST /api/auth/register` - Register a new customer
- `POST /api/auth/login` - Authenticate and return JWT token
- `GET /api/auth/me` - Get current authenticated user profile (`Bearer <token>`)

### Movies
- `GET /api/movies` - List movies with filters (`genre`, `search`, `status`)
- `GET /api/movies/:id` - Get movie details
- `POST /api/movies` - Add new movie (*Admin only*)
- `PUT /api/movies/:id` - Update movie details (*Admin only*)
- `DELETE /api/movies/:id` - Delete movie (*Admin only*)

### Shows & Screenings
- `GET /api/shows` - Query shows by `movieId`, `date`, or `cinemaName`
- `GET /api/shows/:id` - Get show seat layout and occupied seat map
- `POST /api/shows` - Schedule new show (*Admin only*)
- `DELETE /api/shows/:id` - Cancel and delete show (*Admin only*)

### Bookings
- `POST /api/bookings` - Create atomic seat reservation (`Bearer <token>`)
- `GET /api/bookings/my` - Fetch current user's booking history
- `GET /api/bookings/:id` - Retrieve ticket pass details
- `DELETE /api/bookings/:id` - Cancel booking and release seats
- `GET /api/bookings/admin/all` - List all reservations (*Admin only*)

### System Health
- `GET /api/status` - Probe MongoDB Atlas connection state and collection metrics
- `POST /api/seed` - Reset sample movies and auditoriums

---

## Security Best Practices
- Database passwords and JWT secrets are kept in environment variables.
- Passwords are never stored in plaintext and are salted using `bcryptjs`.
- Sensitive password hashes are stripped from user responses.
- Atomic MongoDB operations eliminate race conditions during concurrent bookings.

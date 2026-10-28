import { Response } from 'express';
import { dbService } from '../services/dbService.ts';
import { AuthRequest } from '../middleware/auth.ts';

export async function createBooking(req: AuthRequest, res: Response): Promise<void> {
  try {
    if (!req.user) {
      res.status(401).json({ success: false, message: 'Authentication required to complete booking.' });
      return;
    }

    const { showId, seats, paymentMethod, customerName, customerEmail } = req.body;

    if (!showId) {
      res.status(400).json({ success: false, message: 'Show screening ID is required.' });
      return;
    }

    if (!seats || !Array.isArray(seats) || seats.length === 0) {
      res.status(400).json({ success: false, message: 'Please select at least one seat to book.' });
      return;
    }

    const booking = await dbService.createBooking({
      userId: req.user._id,
      showId,
      seats,
      customerName: customerName || req.user.name,
      customerEmail: customerEmail || req.user.email,
      paymentMethod: paymentMethod || 'Mock Credit Card',
    });

    res.status(201).json({
      success: true,
      message: 'Booking confirmed successfully!',
      booking,
    });
  } catch (err: any) {
    console.error('Booking creation error:', err.message);
    res.status(400).json({ success: false, message: err.message || 'Failed to complete booking reservation.' });
  }
}

export async function getMyBookings(req: AuthRequest, res: Response): Promise<void> {
  try {
    if (!req.user) {
      res.status(401).json({ success: false, message: 'Authentication required.' });
      return;
    }

    const bookings = await dbService.getUserBookings(req.user._id);
    res.json({ success: true, count: bookings.length, bookings });
  } catch (err: any) {
    res.status(500).json({ success: false, message: err.message });
  }
}

export async function getBookingById(req: AuthRequest, res: Response): Promise<void> {
  try {
    const booking = await dbService.getBookingById(req.params.id);
    if (!booking) {
      res.status(404).json({ success: false, message: 'Booking reservation not found.' });
      return;
    }

    // Only allow owner or admin
    if (req.user && req.user.role !== 'admin' && String(booking.user) !== req.user._id) {
      res.status(403).json({ success: false, message: 'Access denied to this booking receipt.' });
      return;
    }

    res.json({ success: true, booking });
  } catch (err: any) {
    res.status(500).json({ success: false, message: err.message });
  }
}

export async function cancelBooking(req: AuthRequest, res: Response): Promise<void> {
  try {
    if (!req.user) {
      res.status(401).json({ success: false, message: 'Authentication required.' });
      return;
    }

    const isAdmin = req.user.role === 'admin';
    const booking = await dbService.cancelBooking(req.params.id, req.user._id, isAdmin);

    res.json({
      success: true,
      message: 'Booking cancelled successfully. Seats have been released and refund processed.',
      booking,
    });
  } catch (err: any) {
    res.status(400).json({ success: false, message: err.message });
  }
}

export async function getAllBookings(req: AuthRequest, res: Response): Promise<void> {
  try {
    const bookings = await dbService.getAllBookings();
    res.json({ success: true, count: bookings.length, bookings });
  } catch (err: any) {
    res.status(500).json({ success: false, message: err.message });
  }
}

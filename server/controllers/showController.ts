import { Request, Response } from 'express';
import { dbService } from '../services/dbService.ts';

export async function getShows(req: Request, res: Response): Promise<void> {
  try {
    const { movieId, date, cinemaName } = req.query;
    const shows = await dbService.getShows({
      movieId: movieId ? String(movieId) : undefined,
      date: date ? String(date) : undefined,
      cinemaName: cinemaName ? String(cinemaName) : undefined,
    });
    res.json({ success: true, count: shows.length, shows });
  } catch (err: any) {
    res.status(500).json({ success: false, message: err.message });
  }
}

export async function getShowById(req: Request, res: Response): Promise<void> {
  try {
    const show = await dbService.getShowById(req.params.id);
    if (!show) {
      res.status(404).json({ success: false, message: 'Screening show not found.' });
      return;
    }
    res.json({ success: true, show });
  } catch (err: any) {
    res.status(500).json({ success: false, message: err.message });
  }
}

export async function createShow(req: Request, res: Response): Promise<void> {
  try {
    const { movie, cinema, date, time, tierPrices, seatLayout } = req.body;

    if (!movie || !cinema || !date || !time) {
      res.status(400).json({ success: false, message: 'Movie, cinema details, date, and time are required.' });
      return;
    }

    const show = await dbService.createShow({
      movie,
      cinema,
      date,
      time,
      tierPrices: tierPrices || { standard: 12.0, premium: 16.0, vipRecliner: 22.0 },
      seatLayout: seatLayout || {
        rows: 7,
        cols: 10,
        vipRows: ['A', 'B'],
        premiumRows: ['C', 'D', 'E'],
        standardRows: ['F', 'G'],
      },
    });

    res.status(201).json({ success: true, message: 'Show scheduled successfully.', show });
  } catch (err: any) {
    res.status(500).json({ success: false, message: err.message });
  }
}

export async function deleteShow(req: Request, res: Response): Promise<void> {
  try {
    const deleted = await dbService.deleteShow(req.params.id);
    if (!deleted) {
      res.status(404).json({ success: false, message: 'Show not found.' });
      return;
    }
    res.json({ success: true, message: 'Show screening deleted successfully.' });
  } catch (err: any) {
    res.status(500).json({ success: false, message: err.message });
  }
}

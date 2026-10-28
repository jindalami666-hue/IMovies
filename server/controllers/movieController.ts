import { Request, Response } from 'express';
import { dbService } from '../services/dbService.ts';

export async function getMovies(req: Request, res: Response): Promise<void> {
  try {
    const { genre, search, status } = req.query;
    const movies = await dbService.getMovies({
      genre: genre ? String(genre) : undefined,
      search: search ? String(search) : undefined,
      status: status ? String(status) : undefined,
    });
    res.json({ success: true, count: movies.length, movies });
  } catch (err: any) {
    res.status(500).json({ success: false, message: err.message });
  }
}

export async function getMovieById(req: Request, res: Response): Promise<void> {
  try {
    const movie = await dbService.getMovieById(req.params.id);
    if (!movie) {
      res.status(404).json({ success: false, message: 'Movie not found.' });
      return;
    }
    res.json({ success: true, movie });
  } catch (err: any) {
    res.status(500).json({ success: false, message: err.message });
  }
}

export async function createMovie(req: Request, res: Response): Promise<void> {
  try {
    const { title, synopsis, poster, backdrop, genres, duration, rating, ageRating, language, director, cast, isFeatured, status } = req.body;

    if (!title || !synopsis || !duration) {
      res.status(400).json({ success: false, message: 'Title, synopsis, and duration are required.' });
      return;
    }

    const movie = await dbService.createMovie({
      title,
      synopsis,
      poster,
      backdrop,
      genres: Array.isArray(genres) ? genres : [genres || 'Action'],
      duration: Number(duration),
      rating: rating ? Number(rating) : 8.0,
      ageRating: ageRating || 'PG-13',
      language: language || 'English',
      director: director || 'Director',
      cast: Array.isArray(cast) ? cast : cast ? [cast] : [],
      isFeatured: Boolean(isFeatured),
      status: status || 'now_showing',
    });

    res.status(201).json({ success: true, message: 'Movie created successfully.', movie });
  } catch (err: any) {
    res.status(500).json({ success: false, message: err.message });
  }
}

export async function updateMovie(req: Request, res: Response): Promise<void> {
  try {
    const movie = await dbService.updateMovie(req.params.id, req.body);
    if (!movie) {
      res.status(404).json({ success: false, message: 'Movie not found.' });
      return;
    }
    res.json({ success: true, message: 'Movie updated successfully.', movie });
  } catch (err: any) {
    res.status(500).json({ success: false, message: err.message });
  }
}

export async function deleteMovie(req: Request, res: Response): Promise<void> {
  try {
    const deleted = await dbService.deleteMovie(req.params.id);
    if (!deleted) {
      res.status(404).json({ success: false, message: 'Movie not found.' });
      return;
    }
    res.json({ success: true, message: 'Movie deleted successfully.' });
  } catch (err: any) {
    res.status(500).json({ success: false, message: err.message });
  }
}

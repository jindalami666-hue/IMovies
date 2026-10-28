import { Request, Response } from 'express';
import { dbStatus } from '../config/db.ts';
import { dbService, isAtlasConnected } from '../services/dbService.ts';

export async function getSystemStatus(req: Request, res: Response): Promise<void> {
  try {
    const stats = await dbService.getStats();
    res.json({
      success: true,
      service: 'IMovies API',
      timestamp: new Date().toISOString(),
      database: {
        status: dbStatus.connected ? 'healthy' : 'degraded',
        type: isAtlasConnected() ? 'MongoDB Atlas (Live Cloud)' : 'Persistent In-Memory (Atlas Ready)',
        atlasConnected: isAtlasConnected(),
        uriConfigured: dbStatus.uriConfigured,
        databaseName: dbStatus.databaseName || (isAtlasConnected() ? 'imovies' : 'imovies_local'),
        host: dbStatus.host || (isAtlasConnected() ? 'cluster0.mongodb.net' : 'localhost-memory'),
        error: dbStatus.error,
        instruction: !isAtlasConnected()
          ? 'To link live MongoDB Atlas: create a free cluster at mongodb.com/cloud/atlas, allow IP 0.0.0.0/0 in Network Access, and set MONGODB_URI in your environment secrets.'
          : 'Connected to live MongoDB Atlas.',
      },
      stats,
    });
  } catch (err: any) {
    res.status(500).json({ success: false, message: err.message });
  }
}

export async function resetDatabase(req: Request, res: Response): Promise<void> {
  try {
    await dbService.resetSeedData();
    const stats = await dbService.getStats();
    res.json({
      success: true,
      message: 'Database reset and sample movie/show seed data re-initialized.',
      stats,
    });
  } catch (err: any) {
    res.status(500).json({ success: false, message: err.message });
  }
}

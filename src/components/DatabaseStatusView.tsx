import React, { useState, useEffect } from 'react';
import { Database, ShieldCheck, CheckCircle2, AlertTriangle, RefreshCw, Terminal, Globe, Server, Layers } from 'lucide-react';
import { SystemStatusResponse } from '../types/index.ts';
import { api } from '../services/api.ts';

export function DatabaseStatusView() {
  const [status, setStatus] = useState<SystemStatusResponse | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [refreshing, setRefreshing] = useState<boolean>(false);

  const fetchStatus = async () => {
    setRefreshing(true);
    try {
      const res = await api.getStatus();
      if (res.success) {
        setStatus(res);
      }
    } catch (err) {
      console.error('Failed to query database status:', err);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchStatus();
  }, []);

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* View Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-800">
        <div>
          <span className="text-xs font-mono font-semibold text-amber-400 tracking-wider uppercase block">
            Infrastructure & Diagnostics
          </span>
          <h1 className="text-2xl sm:text-3xl font-bold text-white font-display">
            MERN Stack & MongoDB Status
          </h1>
        </div>

        <button
          onClick={fetchStatus}
          disabled={refreshing}
          className="px-4 py-2 bg-slate-900 hover:bg-slate-800 border border-slate-700 text-slate-300 text-xs font-mono rounded-xl flex items-center gap-1.5 transition-colors cursor-pointer self-start sm:self-auto disabled:opacity-50"
        >
          <RefreshCw className={`w-3.5 h-3.5 text-amber-400 ${refreshing ? 'animate-spin' : ''}`} />
          <span>Refresh Connection Probe</span>
        </button>
      </div>

      {/* Tech Stack Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-4 bg-[#121620] border border-slate-800 rounded-2xl space-y-1">
          <div className="flex items-center gap-2 text-amber-400">
            <Globe className="w-4 h-4" />
            <span className="text-xs font-mono font-bold uppercase">Frontend</span>
          </div>
          <p className="text-base font-bold text-white">React 19 + Tailwind</p>
          <p className="text-[11px] text-slate-400 font-mono">Vite SPA with Lucide & Motion</p>
        </div>

        <div className="p-4 bg-[#121620] border border-slate-800 rounded-2xl space-y-1">
          <div className="flex items-center gap-2 text-rose-400">
            <Server className="w-4 h-4" />
            <span className="text-xs font-mono font-bold uppercase">Backend</span>
          </div>
          <p className="text-base font-bold text-white">Node.js + Express</p>
          <p className="text-[11px] text-slate-400 font-mono">REST endpoints & JSON middleware</p>
        </div>

        <div className="p-4 bg-[#121620] border border-slate-800 rounded-2xl space-y-1">
          <div className="flex items-center gap-2 text-emerald-400">
            <Database className="w-4 h-4" />
            <span className="text-xs font-mono font-bold uppercase">Database</span>
          </div>
          <p className="text-base font-bold text-white">MongoDB Atlas (Mongoose)</p>
          <p className="text-[11px] text-slate-400 font-mono">Strict schemas & atomic concurrency</p>
        </div>

        <div className="p-4 bg-[#121620] border border-slate-800 rounded-2xl space-y-1">
          <div className="flex items-center gap-2 text-indigo-400">
            <ShieldCheck className="w-4 h-4" />
            <span className="text-xs font-mono font-bold uppercase">Security & Auth</span>
          </div>
          <p className="text-base font-bold text-white">JWT + bcrypt</p>
          <p className="text-[11px] text-slate-400 font-mono">Password salting & Bearer tokens</p>
        </div>
      </div>

      {/* Live Probe Results */}
      <div className="p-6 bg-[#121620] border border-slate-800 rounded-3xl space-y-5">
        <div className="flex items-center justify-between pb-4 border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div
              className={`w-3.5 h-3.5 rounded-full ${
                status?.database.status === 'healthy' ? 'bg-emerald-500' : 'bg-amber-500'
              }`}
            />
            <div>
              <h3 className="text-base font-bold text-white font-display">Active Storage Engine</h3>
              <p className="text-xs text-slate-400 font-mono">{status?.database.type}</p>
            </div>
          </div>

          <span
            className={`px-3 py-1 text-xs font-mono font-semibold rounded-lg ${
              status?.database.atlasConnected
                ? 'bg-emerald-950 text-emerald-300 border border-emerald-800'
                : 'bg-amber-950/80 text-amber-300 border border-amber-800'
            }`}
          >
            {status?.database.status?.toUpperCase() || 'PROBING'}
          </span>
        </div>

        {/* Database Stats Grid */}
        {status?.stats && (
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 p-4 bg-slate-900/60 rounded-2xl border border-slate-800 font-mono text-center">
            <div>
              <span className="text-[10px] text-slate-500 uppercase block">Movies</span>
              <span className="text-xl font-bold text-white">{status.stats.moviesCount}</span>
            </div>
            <div>
              <span className="text-[10px] text-slate-500 uppercase block">Showtimes</span>
              <span className="text-xl font-bold text-white">{status.stats.showsCount}</span>
            </div>
            <div>
              <span className="text-[10px] text-slate-500 uppercase block">Bookings</span>
              <span className="text-xl font-bold text-amber-400">{status.stats.bookingsCount}</span>
            </div>
            <div>
              <span className="text-[10px] text-slate-500 uppercase block">Users</span>
              <span className="text-xl font-bold text-white">{status.stats.usersCount}</span>
            </div>
          </div>
        )}

        <div className="space-y-2 text-xs">
          <span className="font-semibold text-slate-300 block">Connection State:</span>
          <div className="p-3 bg-slate-900 rounded-xl border border-slate-800 font-mono text-slate-300 space-y-1">
            <div><strong>Database:</strong> {status?.database.databaseName}</div>
            <div><strong>Host:</strong> {status?.database.host}</div>
            <div><strong>URI Configured:</strong> {status?.database.uriConfigured ? 'Yes (via process.env.MONGODB_URI)' : 'No (Running in resilient fallback store)'}</div>
            {status?.database.error && (
              <div className="text-rose-400"><strong>Notice:</strong> {status.database.error}</div>
            )}
          </div>
        </div>
      </div>

      {/* GitHub Sync and Cloud Run Deployment Instructions */}
      <div className="p-6 bg-[#141A26] border border-slate-800 rounded-3xl space-y-5">
        <div className="flex items-center gap-3">
          <Terminal className="w-5 h-5 text-amber-400" />
          <h3 className="text-lg font-bold text-white font-display">
            GitHub Export & Google Cloud Run Deployment Guide
          </h3>
        </div>

        <p className="text-xs text-slate-300 leading-relaxed">
          This codebase is architected with complete parity for local development, GitHub version control, and production Docker/Cloud Run hosting. Follow these steps when you export to GitHub:
        </p>

        <div className="space-y-4 text-xs text-slate-300">
          <div className="p-4 bg-slate-900 rounded-2xl border border-slate-800 space-y-2">
            <span className="font-bold text-amber-400 font-mono text-sm block">1. Environment Secrets Setup</span>
            <p className="text-slate-400">
              Never commit database credentials to git. Copy <code className="text-slate-200">.env.example</code> to <code className="text-slate-200">.env</code>:
            </p>
            <pre className="p-3 bg-black/60 rounded-xl text-amber-300 font-mono text-[11px] overflow-x-auto">
{`MONGODB_URI="mongodb+srv://<username>:<password>@cluster0.abcde.mongodb.net/imovies?retryWrites=true&w=majority"
JWT_SECRET="your-production-jwt-secret-string"
PORT=3000`}
            </pre>
          </div>

          <div className="p-4 bg-slate-900 rounded-2xl border border-slate-800 space-y-2">
            <span className="font-bold text-amber-400 font-mono text-sm block">2. Building and Starting for Production</span>
            <p className="text-slate-400">
              Run the full-stack build script:
            </p>
            <pre className="p-3 bg-black/60 rounded-xl text-amber-300 font-mono text-[11px] overflow-x-auto">
{`# 1. Install dependencies
npm install

# 2. Build React Vite frontend
npm run build

# 3. Start Express server serving API + static frontend
npm start`}
            </pre>
          </div>

          <div className="p-4 bg-slate-900 rounded-2xl border border-slate-800 space-y-2">
            <span className="font-bold text-amber-400 font-mono text-sm block">3. Deploying to Google Cloud Run</span>
            <p className="text-slate-400">
              Deploy as a single container service listening on port 3000:
            </p>
            <pre className="p-3 bg-black/60 rounded-xl text-amber-300 font-mono text-[11px] overflow-x-auto">
{`gcloud run deploy imovies \\
  --source . \\
  --port 3000 \\
  --set-env-vars MONGODB_URI="mongodb+srv://...",JWT_SECRET="..." \\
  --allow-unauthenticated`}
            </pre>
          </div>
        </div>
      </div>
    </div>
  );
}

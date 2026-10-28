import React from 'react';
import { Film, User as UserIcon, LogOut, Ticket, Database, Shield } from 'lucide-react';
import { useAuth } from '../context/AuthContext.tsx';

interface NavbarProps {
  activeTab: 'movies' | 'cinemas' | 'bookings' | 'admin' | 'db-status';
  onSelectTab: (tab: 'movies' | 'cinemas' | 'bookings' | 'admin' | 'db-status') => void;
  isAtlasConnected: boolean;
}

export function Navbar({ activeTab, onSelectTab, isAtlasConnected }: NavbarProps) {
  const { user, isAuthenticated, logout, openAuthModal } = useAuth();

  return (
    <header className="sticky top-0 z-40 bg-[#0B0E14]/90 backdrop-blur-md border-b border-slate-800/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-8">
        {/* Zone 1: Brand title wordmark */}
        <button
          onClick={() => onSelectTab('movies')}
          className="flex items-center gap-2.5 text-left group focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-500 rounded-md"
        >
          <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-red-600 via-rose-600 to-amber-600 flex items-center justify-center shadow-lg shadow-red-950/40">
            <Film className="w-5 h-5 text-white" />
          </div>
          <div className="flex flex-col">
            <span className="text-xl font-extrabold tracking-wider text-white font-display uppercase">
              I<span className="text-amber-400">Movies</span>
            </span>
            <span className="text-[10px] text-slate-400 -mt-1 tracking-widest font-mono">CINEMA BOOKING</span>
          </div>
        </button>

        {/* Zone 2: 4-5 Clean single-line text navigation links */}
        <nav className="hidden md:flex items-center gap-7 text-sm font-medium">
          <button
            onClick={() => onSelectTab('movies')}
            className={`whitespace-nowrap shrink-0 transition-colors py-1 ${
              activeTab === 'movies'
                ? 'text-amber-400 font-semibold border-b-2 border-amber-400'
                : 'text-slate-300 hover:text-white'
            }`}
          >
            Now Showing
          </button>

          <button
            onClick={() => onSelectTab('cinemas')}
            className={`whitespace-nowrap shrink-0 transition-colors py-1 ${
              activeTab === 'cinemas'
                ? 'text-amber-400 font-semibold border-b-2 border-amber-400'
                : 'text-slate-300 hover:text-white'
            }`}
          >
            Cinemas & Halls
          </button>

          <button
            onClick={() => onSelectTab('bookings')}
            className={`whitespace-nowrap shrink-0 transition-colors py-1 flex items-center gap-1.5 ${
              activeTab === 'bookings'
                ? 'text-amber-400 font-semibold border-b-2 border-amber-400'
                : 'text-slate-300 hover:text-white'
            }`}
          >
            <Ticket className="w-4 h-4" />
            My Bookings
          </button>

          {user?.role === 'admin' && (
            <button
              onClick={() => onSelectTab('admin')}
              className={`whitespace-nowrap shrink-0 transition-colors py-1 flex items-center gap-1.5 ${
                activeTab === 'admin'
                  ? 'text-amber-400 font-semibold border-b-2 border-amber-400'
                  : 'text-rose-400 hover:text-rose-300'
              }`}
            >
              <Shield className="w-4 h-4" />
              Admin Portal
            </button>
          )}

          <button
            onClick={() => onSelectTab('db-status')}
            className={`whitespace-nowrap shrink-0 transition-colors py-1 flex items-center gap-1.5 text-xs font-mono ${
              activeTab === 'db-status'
                ? 'text-amber-400 font-semibold border-b-2 border-amber-400'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Database className="w-3.5 h-3.5" />
            <span>MongoDB: {isAtlasConnected ? 'Atlas Live' : 'Memory Sync'}</span>
          </button>
        </nav>

        {/* Zone 3: 1 Primary Action */}
        <div className="flex items-center gap-3 shrink-0">
          {isAuthenticated && user ? (
            <div className="flex items-center gap-3">
              <div className="hidden sm:flex flex-col items-end text-xs">
                <span className="font-semibold text-slate-200 truncate max-w-[130px]">{user.name}</span>
                <span className="text-[11px] text-amber-400/90 font-mono capitalize">{user.role}</span>
              </div>
              <button
                onClick={logout}
                title="Log Out"
                className="p-2 text-slate-400 hover:text-rose-400 transition-colors rounded-lg bg-slate-900 border border-slate-800"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <button
              onClick={() => openAuthModal('login')}
              className="px-4 py-2 text-xs font-medium text-slate-950 bg-amber-400 hover:bg-amber-300 transition-colors rounded-lg font-display tracking-wide uppercase font-bold shadow-md shadow-amber-400/20 whitespace-nowrap shrink-0 flex items-center gap-1.5"
            >
              <UserIcon className="w-3.5 h-3.5" />
              Sign In
            </button>
          )}
        </div>
      </div>
    </header>
  );
}

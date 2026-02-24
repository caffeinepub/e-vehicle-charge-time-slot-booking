import { useNavigate } from '@tanstack/react-router';
import { useInternetIdentity } from '../hooks/useInternetIdentity';
import { Button } from './ui/button';
import { Zap, User, Calendar, Heart } from 'lucide-react';

export function Layout({ children }: { children: React.ReactNode }) {
  const navigate = useNavigate();
  const { identity, login, clear, isLoggingIn } = useInternetIdentity();
  const isAuthenticated = !!identity && !identity.getPrincipal().isAnonymous();

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-background via-background to-accent/5">
      <header className="border-b border-border/40 bg-card/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <button
              onClick={() => navigate({ to: '/' })}
              className="flex items-center gap-3 group"
            >
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[oklch(0.75_0.18_155)] to-[oklch(0.65_0.20_165)] p-2 shadow-lg group-hover:shadow-xl transition-shadow">
                <img
                  src="/assets/generated/eco-icon.dim_128x128.png"
                  alt="EV Charge"
                  className="w-full h-full object-contain"
                />
              </div>
              <div>
                <h1 className="text-2xl font-bold bg-gradient-to-r from-[oklch(0.65_0.20_165)] to-[oklch(0.55_0.22_175)] bg-clip-text text-transparent">
                  EV Charge
                </h1>
                <p className="text-xs text-muted-foreground">Smart Booking System</p>
              </div>
            </button>

            <nav className="flex items-center gap-2">
              <Button
                variant="ghost"
                onClick={() => navigate({ to: '/' })}
                className="gap-2"
              >
                <Calendar className="w-4 h-4" />
                <span className="hidden sm:inline">Stations</span>
              </Button>

              {isAuthenticated && (
                <Button
                  variant="ghost"
                  onClick={() => navigate({ to: '/dashboard' })}
                  className="gap-2"
                >
                  <User className="w-4 h-4" />
                  <span className="hidden sm:inline">My Bookings</span>
                </Button>
              )}

              {isAuthenticated ? (
                <Button
                  onClick={clear}
                  variant="outline"
                  className="gap-2 border-[oklch(0.65_0.20_165)] text-[oklch(0.65_0.20_165)] hover:bg-[oklch(0.65_0.20_165)] hover:text-white"
                >
                  <User className="w-4 h-4" />
                  Logout
                </Button>
              ) : (
                <Button
                  onClick={login}
                  disabled={isLoggingIn}
                  className="gap-2 bg-gradient-to-r from-[oklch(0.65_0.20_165)] to-[oklch(0.55_0.22_175)] hover:from-[oklch(0.60_0.20_165)] hover:to-[oklch(0.50_0.22_175)] text-white shadow-lg"
                >
                  <Zap className="w-4 h-4" />
                  {isLoggingIn ? 'Connecting...' : 'Login'}
                </Button>
              )}
            </nav>
          </div>
        </div>
      </header>

      <main className="flex-1">{children}</main>

      <footer className="border-t border-border/40 bg-card/30 backdrop-blur-sm mt-auto">
        <div className="container mx-auto px-4 py-6">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 text-sm text-muted-foreground">
            <p>© {new Date().getFullYear()} EV Charge. All rights reserved.</p>
            <p className="flex items-center gap-1">
              Built with <Heart className="w-4 h-4 text-[oklch(0.65_0.20_165)] fill-current" /> using{' '}
              <a
                href={`https://caffeine.ai/?utm_source=Caffeine-footer&utm_medium=referral&utm_content=${encodeURIComponent(
                  typeof window !== 'undefined' ? window.location.hostname : 'ev-charge-app'
                )}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-[oklch(0.65_0.20_165)] hover:underline font-medium"
              >
                caffeine.ai
              </a>
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}

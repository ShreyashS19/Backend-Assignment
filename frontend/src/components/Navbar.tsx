import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { LogOut, LayoutDashboard, Home } from 'lucide-react';

export function Navbar() {
  const { user, logout, token } = useAuth();
  const location = useLocation();

  return (
    <nav className="border-b bg-card">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          <div className="flex items-center gap-8">
            <Link to="/" className="text-xl font-bold text-foreground">
              TaskFlow
            </Link>
            {token && (
              <div className="hidden items-center gap-4 sm:flex">
                <Link
                  to="/"
                  className={`flex items-center gap-2 text-sm font-medium transition-colors hover:text-primary ${
                    location.pathname === '/' ? 'text-primary' : 'text-muted-foreground'
                  }`}
                >
                  <Home className="h-4 w-4" />
                  Home
                </Link>
                <Link
                  to="/dashboard"
                  className={`flex items-center gap-2 text-sm font-medium transition-colors hover:text-primary ${
                    location.pathname === '/dashboard' ? 'text-primary' : 'text-muted-foreground'
                  }`}
                >
                  <LayoutDashboard className="h-4 w-4" />
                  Dashboard
                </Link>
              </div>
            )}
          </div>

          <div className="flex items-center gap-4">
            {token && user ? (
              <>
                <span className="hidden text-sm text-muted-foreground sm:inline">
                  {user.name}
                </span>
                <Button onClick={logout} variant="outline" size="sm">
                  <LogOut className="mr-2 h-4 w-4" />
                  Logout
                </Button>
              </>
            ) : (
              <div className="flex gap-2">
                <Link to="/login">
                  <Button variant="outline" size="sm">
                    Login
                  </Button>
                </Link>
                <Link to="/register">
                  <Button size="sm">Register</Button>
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}

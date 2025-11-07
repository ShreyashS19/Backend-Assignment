import { Link } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { CheckCircle, Shield, Zap } from 'lucide-react';

const Index = () => {
  const { token } = useAuth();

  return (
    <div className="min-h-[calc(100vh-4rem)] bg-gradient-to-b from-background to-muted/20">
      <div className="mx-auto max-w-6xl px-4 py-20">
        <div className="text-center">
          <h1 className="mb-6 text-5xl font-bold tracking-tight sm:text-6xl">
            Manage Your Tasks{' '}
            <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
              Effortlessly
            </span>
          </h1>
          <p className="mx-auto mb-8 max-w-2xl text-xl text-muted-foreground">
            A modern task management platform built with React. Stay organized, boost productivity,
            and accomplish your goals.
          </p>
          <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
            {token ? (
              <Link to="/dashboard">
                <Button size="lg" className="px-8">
                  Go to Dashboard
                </Button>
              </Link>
            ) : (
              <>
                <Link to="/register">
                  <Button size="lg" className="px-8">
                    Get Started
                  </Button>
                </Link>
                <Link to="/login">
                  <Button size="lg" variant="outline" className="px-8">
                    Login
                  </Button>
                </Link>
              </>
            )}
          </div>
        </div>

        <div className="mt-24 grid gap-8 sm:grid-cols-3">
          <div className="rounded-xl border bg-card p-6 text-center transition-shadow hover:shadow-lg">
            <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
              <Zap className="h-6 w-6 text-primary" />
            </div>
            <h3 className="mb-2 text-lg font-semibold">Fast & Efficient</h3>
            <p className="text-sm text-muted-foreground">
              Quick task creation and management with a clean, intuitive interface
            </p>
          </div>

          <div className="rounded-xl border bg-card p-6 text-center transition-shadow hover:shadow-lg">
            <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
              <Shield className="h-6 w-6 text-primary" />
            </div>
            <h3 className="mb-2 text-lg font-semibold">Secure</h3>
            <p className="text-sm text-muted-foreground">
              JWT-based authentication keeps your data safe and secure
            </p>
          </div>

          <div className="rounded-xl border bg-card p-6 text-center transition-shadow hover:shadow-lg">
            <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
              <CheckCircle className="h-6 w-6 text-primary" />
            </div>
            <h3 className="mb-2 text-lg font-semibold">Full Control</h3>
            <p className="text-sm text-muted-foreground">
              Complete CRUD operations - create, edit, delete, and manage all your tasks
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;

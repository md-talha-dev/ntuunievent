import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Calendar, Eye, EyeOff, AlertCircle } from 'lucide-react';
import { toast } from 'sonner';

const Login: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  
  const { login, user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (user) {
      navigate(user.role === 'admin' ? '/admin' : '/events');
    }
  }, [user, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    // Basic validation
    if (!email.trim() || !password.trim()) {
      setError('Please fill in all fields');
      setIsLoading(false);
      return;
    }

    const result = login(email, password);
    
    setTimeout(() => {
      setIsLoading(false);
      if (result.success) {
        toast.success('Welcome back!');
      } else {
        setError(result.error || 'Login failed');
      }
    }, 500);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-hero p-4">
      <div className="w-full max-w-md animate-slide-up">
        <div className="flex justify-center mb-8">
          <Link to="/" className="flex items-center gap-3 group">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-primary shadow-md">
              <Calendar className="h-6 w-6 text-primary-foreground" />
            </div>
            <div>
              <h1 className="font-display text-2xl font-bold text-foreground">
                UniEvent
              </h1>
              <p className="text-sm text-muted-foreground">NTU Campus Events</p>
            </div>
          </Link>
        </div>

        <Card className="shadow-card-hover border-border">
          <CardHeader className="text-center pb-2">
            <CardTitle className="font-display text-2xl">Welcome Back</CardTitle>
            <CardDescription>
              Sign in to discover and join campus events
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              {error && (
                <div className="flex items-center gap-2 p-3 rounded-lg bg-destructive/10 text-destructive text-sm">
                  <AlertCircle className="h-4 w-4 flex-shrink-0" />
                  <span>{error}</span>
                </div>
              )}

              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="your.email@student.ntu.edu.pk"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="h-11"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    placeholder="Enter your password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="h-11 pr-10"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>

              <Button 
                type="submit" 
                variant="hero" 
                size="lg" 
                className="w-full"
                disabled={isLoading}
              >
                {isLoading ? 'Signing in...' : 'Sign In'}
              </Button>
            </form>

            <div className="mt-6 pt-6 border-t border-border">
              <p className="text-xs text-muted-foreground text-center mb-3">
                Demo Credentials
              </p>
              <div className="space-y-2 text-xs text-muted-foreground">
                <div className="p-2 rounded bg-muted/50">
                  <p className="font-medium text-foreground">Student Login:</p>
                  <p>Email: 24ntucsfl1001@student.ntu.edu.pk</p>
                  <p>Password: Ali12345</p>
                </div>
                <div className="p-2 rounded bg-muted/50">
                  <p className="font-medium text-foreground">Admin Login:</p>
                  <p>Email: talha@admin.com</p>
                  <p>Password: Admin123</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Login;

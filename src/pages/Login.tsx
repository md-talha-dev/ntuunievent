import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent } from '@/components/ui/card';
import { Eye, EyeOff, AlertCircle, LogIn, ArrowLeft } from 'lucide-react';
import { toast } from 'sonner';
import ntuLogo from '@/assets/ntu-logo.png';

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
    <div className="min-h-screen flex">
      {/* Left Panel - Branding */}
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-primary relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_right,_hsl(0_100%_35%_/_0.4)_0%,_transparent_60%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_left,_hsl(0_100%_40%_/_0.3)_0%,_transparent_50%)]" />
        <div className="relative z-10 flex flex-col justify-center items-center w-full p-12 text-primary-foreground">
          <img src={ntuLogo} alt="NTU Logo" className="h-32 w-32 mb-8 drop-shadow-2xl animate-float" />
          <h1 className="font-display text-4xl font-bold mb-4 text-center animate-fade-in">
            UniEvent
          </h1>
          <p className="text-xl text-primary-foreground/90 text-center max-w-md animate-slide-up" style={{ animationDelay: '100ms' }}>
            National Textile University
          </p>
          <p className="text-lg text-primary-foreground/70 text-center mt-2 animate-slide-up" style={{ animationDelay: '200ms' }}>
            Campus Event Discovery Platform
          </p>
          <div className="mt-12 grid grid-cols-3 gap-8 text-center animate-slide-up" style={{ animationDelay: '300ms' }}>
            <div className="p-4 rounded-xl bg-primary-foreground/10 backdrop-blur-sm hover:bg-primary-foreground/20 transition-all duration-300 hover:-translate-y-1">
              <div className="text-3xl font-bold">100+</div>
              <div className="text-sm text-primary-foreground/70">Events</div>
            </div>
            <div className="p-4 rounded-xl bg-primary-foreground/10 backdrop-blur-sm hover:bg-primary-foreground/20 transition-all duration-300 hover:-translate-y-1">
              <div className="text-3xl font-bold">5000+</div>
              <div className="text-sm text-primary-foreground/70">Students</div>
            </div>
            <div className="p-4 rounded-xl bg-primary-foreground/10 backdrop-blur-sm hover:bg-primary-foreground/20 transition-all duration-300 hover:-translate-y-1">
              <div className="text-3xl font-bold">50+</div>
              <div className="text-sm text-primary-foreground/70">Clubs</div>
            </div>
          </div>
        </div>
        {/* Decorative circles with animation */}
        <div className="absolute -bottom-32 -left-32 w-64 h-64 bg-gradient-to-tr from-primary-foreground/10 to-transparent rounded-full animate-pulse-glow" />
        <div className="absolute -top-16 -right-16 w-48 h-48 bg-gradient-to-bl from-primary-foreground/10 to-transparent rounded-full animate-float" />
        <div className="absolute top-1/2 -right-24 w-32 h-32 bg-gradient-to-tl from-primary-foreground/10 to-transparent rounded-full animate-bounce-soft" />
      </div>

      {/* Right Panel - Login Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-6 bg-gradient-hero">
        <div className="w-full max-w-md animate-fade-in">
          {/* Mobile Logo */}
          <div className="lg:hidden flex justify-center mb-8">
            <Link to="/" className="flex items-center gap-3 group">
              <img src={ntuLogo} alt="NTU Logo" className="h-12 w-12 group-hover:animate-bounce-soft transition-transform" />
              <div>
                <h1 className="font-display text-xl font-bold text-foreground">UniEvent</h1>
                <p className="text-xs text-muted-foreground">NTU Campus Events</p>
              </div>
            </Link>
          </div>

          {/* Back to Home */}
          <Link 
            to="/" 
            className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-all hover:-translate-x-1 mb-8"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Home
          </Link>

          <Card className="border-0 shadow-none lg:shadow-xl lg:border bg-gradient-to-br from-card to-muted/30">
            <CardContent className="p-0 lg:p-8">
              <div className="mb-8">
                <h2 className="font-display text-3xl font-bold text-foreground mb-2">
                  Welcome Back
                </h2>
                <p className="text-muted-foreground">
                  Sign in to discover and join campus events
                </p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-5">
                {error && (
                  <div className="flex items-center gap-3 p-4 rounded-lg bg-primary/10 border border-primary/20 text-foreground text-sm">
                    <AlertCircle className="h-5 w-5 text-primary flex-shrink-0" />
                    <span>{error}</span>
                  </div>
                )}

                <div className="space-y-2">
                  <Label htmlFor="email" className="text-sm font-medium flex items-center gap-2">
                    <div className="p-1.5 rounded-lg bg-gradient-primary shadow-lg shadow-primary/30">
                      <svg className="h-3.5 w-3.5 text-primary-foreground" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                      </svg>
                    </div>
                    Email Address
                  </Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="your.email@student.ntu.edu.pk"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="h-12 text-base"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="password" className="text-sm font-medium flex items-center gap-2">
                    <div className="p-1.5 rounded-lg bg-gradient-primary shadow-lg shadow-primary/30">
                      <svg className="h-3.5 w-3.5 text-primary-foreground" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                      </svg>
                    </div>
                    Password
                  </Label>
                  <div className="relative">
                    <Input
                      id="password"
                      type={showPassword ? 'text' : 'password'}
                      placeholder="Enter your password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="h-12 text-base pr-12"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-4 top-1/2 -translate-y-1/2 p-1.5 rounded-lg bg-gradient-to-br from-muted to-muted/50 shadow-md hover:shadow-lg text-muted-foreground hover:text-foreground transition-all duration-300 hover:scale-110"
                    >
                      {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>
                </div>

                <Button 
                  type="submit" 
                  size="lg" 
                  className="w-full h-12 text-base font-semibold mt-2"
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <span className="flex items-center gap-2">
                      <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                      </svg>
                      Signing in...
                    </span>
                  ) : (
                    <span className="flex items-center gap-2">
                      <LogIn className="h-5 w-5" />
                      Sign In
                    </span>
                  )}
                </Button>
              </form>

              <p className="mt-8 text-center text-sm text-muted-foreground">
                Use your NTU student email to sign in
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Login;

import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { LogOut, Calendar, LayoutDashboard, User, Menu, X } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import ntuLogo from '@/assets/ntu-logo.png';

const Header: React.FC = () => {
  const { user, profile, isAdmin, logout } = useAuth();
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  const displayName = profile?.name || user?.email?.split('@')[0] || 'User';
  const displayEmail = profile?.email || user?.email || '';
  const displayRole = profile?.role || 'student';

  const NavLinks = ({ mobile = false, onClose }: { mobile?: boolean; onClose?: () => void }) => (
    <>
      {user ? (
        <>
          {isAdmin && (
            <Link to="/admin" onClick={onClose}>
              <Button variant={mobile ? "ghost" : "ghost"} size={mobile ? "lg" : "sm"} className={`gap-2 ${mobile ? 'w-full justify-start' : ''}`}>
                <LayoutDashboard className="h-4 w-4 icon-3d-sm" />
                Dashboard
              </Button>
            </Link>
          )}
          <Link to="/events" onClick={onClose}>
            <Button variant="ghost" size={mobile ? "lg" : "sm"} className={`gap-2 ${mobile ? 'w-full justify-start' : ''}`}>
              <Calendar className="h-4 w-4 icon-3d-sm" />
              Events
            </Button>
          </Link>
          {mobile && (
            <>
              <Link to="/profile" onClick={onClose}>
                <Button variant="ghost" size="lg" className="gap-2 w-full justify-start">
                  <User className="h-4 w-4 icon-3d-sm" />
                  My Profile
                </Button>
              </Link>
              <Button 
                variant="ghost" 
                size="lg" 
                className="gap-2 w-full justify-start text-destructive"
                onClick={() => { handleLogout(); onClose?.(); }}
              >
                <LogOut className="h-4 w-4 icon-3d-sm" />
                Log out
              </Button>
            </>
          )}
        </>
      ) : (
        <Link to="/login" onClick={onClose}>
          <Button variant="hero" size={mobile ? "lg" : "sm"} className={mobile ? 'w-full' : ''}>
            Sign In
          </Button>
        </Link>
      )}
    </>
  );

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/50 bg-gradient-to-r from-background via-background to-muted/30 backdrop-blur-lg supports-[backdrop-filter]:bg-background/80">
      <div className="container flex h-14 sm:h-16 items-center justify-between">
        <Link to="/" className="flex items-center gap-2 sm:gap-3 group">
          <img src={ntuLogo} alt="NTU Logo" className="h-8 sm:h-12 w-auto transition-transform duration-300 group-hover:scale-110" />
          <div>
            <h1 className="font-display text-lg sm:text-xl font-bold text-foreground group-hover:text-gradient-primary transition-all">
              UniEvent
            </h1>
            <p className="text-[10px] sm:text-xs text-muted-foreground hidden sm:block">NTU Campus Events</p>
          </div>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-4">
          <NavLinks />
          {user && (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="relative h-10 w-10 rounded-full transition-transform hover:scale-110">
                  <Avatar className="h-10 w-10 border-2 border-primary/30 hover:border-primary transition-colors">
                    <AvatarFallback className="bg-gradient-primary text-primary-foreground font-semibold">
                      {getInitials(displayName)}
                    </AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56 bg-gradient-to-br from-popover to-muted/50" align="end" forceMount>
                <DropdownMenuLabel className="font-normal">
                  <div className="flex flex-col space-y-1">
                    <p className="text-sm font-medium leading-none">{displayName}</p>
                    <p className="text-xs leading-none text-muted-foreground">
                      {displayEmail}
                    </p>
                    <span className="mt-1 inline-flex w-fit rounded-full bg-gradient-primary px-2 py-0.5 text-xs font-medium text-primary-foreground capitalize">
                      {displayRole}
                    </span>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => navigate('/profile')} className="cursor-pointer">
                  <User className="mr-2 h-4 w-4 icon-3d-sm" />
                  <span>My Profile</span>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleLogout} className="text-destructive cursor-pointer">
                  <LogOut className="mr-2 h-4 w-4 icon-3d-sm" />
                  <span>Log out</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          )}
        </nav>

        {/* Mobile Navigation */}
        <div className="md:hidden flex items-center gap-2">
          {user && (
            <Avatar className="h-8 w-8 border-2 border-primary/30">
              <AvatarFallback className="bg-gradient-primary text-primary-foreground text-xs font-semibold">
                {getInitials(displayName)}
              </AvatarFallback>
            </Avatar>
          )}
          <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="h-9 w-9">
                <Menu className="h-5 w-5 icon-3d-sm" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-[280px] sm:w-[320px]">
              <div className="flex flex-col gap-4 mt-8">
                <div className="flex items-center gap-3 pb-4 border-b border-border">
                  <img src={ntuLogo} alt="NTU Logo" className="h-10 w-auto" />
                  <div>
                    <h2 className="font-display font-bold text-foreground">UniEvent</h2>
                    <p className="text-xs text-muted-foreground">NTU Campus Events</p>
                  </div>
                </div>
                {user && (
                  <div className="flex items-center gap-3 pb-4 border-b border-border">
                    <Avatar className="h-10 w-10 border-2 border-primary/30">
                      <AvatarFallback className="bg-gradient-primary text-primary-foreground font-semibold">
                        {getInitials(displayName)}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="font-medium text-sm">{displayName}</p>
                      <span className="inline-flex w-fit rounded-full bg-gradient-primary px-2 py-0.5 text-[10px] font-medium text-primary-foreground capitalize">
                        {displayRole}
                      </span>
                    </div>
                  </div>
                )}
                <nav className="flex flex-col gap-2">
                  <NavLinks mobile onClose={() => setMobileMenuOpen(false)} />
                </nav>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
};

export default Header;

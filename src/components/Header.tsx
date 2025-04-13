
import { Link } from "react-router-dom";
import { Menu, X, Home, BarChart2, Mail, QrCode, User, LogOut } from "lucide-react";
import { useState } from "react";
import { useIsMobile } from "@/hooks/use-mobile";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu";
import { cn } from "@/lib/utils";
import { Button } from "./ui/button";
import { useAuth } from "@/context/AuthContext";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const isMobile = useIsMobile();
  const { user, profile, signOut } = useAuth();

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <header className="py-6">
      <div className="flex items-center justify-between">
        <Link to="/" className="flex items-center">
          <img className="w-[150px]" src="/img/logo.png" alt="free link shortener tool" />
        </Link>

        {isMobile ? (
          <>
            <Button variant="ghost" size="icon" onClick={toggleMenu} aria-label="Toggle menu">
              {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </Button>
            
            {isMenuOpen && (
              <div className="fixed inset-0 top-[80px] bg-background z-50 p-4">
                <nav className="flex flex-col space-y-4">
                  <Link 
                    to="/" 
                    className="flex items-center gap-2 p-2 hover:bg-accent rounded-md"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    <Home size={18} />
                    <span>Home</span>
                  </Link>
                  <Link 
                    to="/analytics" 
                    className="flex items-center gap-2 p-2 hover:bg-accent rounded-md"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    <BarChart2 size={18} />
                    <span>URL Analysis</span>
                  </Link>
                  {user && (
                    <Link 
                      to="/qr-code" 
                      className="flex items-center gap-2 p-2 hover:bg-accent rounded-md"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      <QrCode size={18} />
                      <span>QR Code Generator</span>
                    </Link>
                  )}
                  <Link 
                    to="/contact-us" 
                    className="flex items-center gap-2 p-2 hover:bg-accent rounded-md"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    <Mail size={18} />
                    <span>Contact Us</span>
                  </Link>
                  
                  {user ? (
                    <>
                      <div className="border-t border-border pt-4 mt-4">
                        <div className="flex items-center gap-2 p-2">
                          <User size={18} />
                          <span className="font-medium">{profile?.name || user.email}</span>
                        </div>
                        <button 
                          className="flex w-full items-center gap-2 p-2 text-destructive hover:bg-accent rounded-md"
                          onClick={() => {
                            signOut();
                            setIsMenuOpen(false);
                          }}
                        >
                          <LogOut size={18} />
                          <span>Sign Out</span>
                        </button>
                      </div>
                    </>
                  ) : (
                    <Link 
                      to="/auth" 
                      className="flex items-center gap-2 p-2 text-primary hover:bg-accent rounded-md"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      <User size={18} />
                      <span>Sign In / Register</span>
                    </Link>
                  )}
                </nav>
              </div>
            )}
          </>
        ) : (
          <div className="flex items-center gap-4">
            <NavigationMenu>
              <NavigationMenuList>
                <NavigationMenuItem>
                  <Link to="/">
                    <NavigationMenuLink className={cn(navigationMenuTriggerStyle(), "flex items-center gap-1.5")}>
                      <Home className="h-4 w-4" />
                      <span>Home</span>
                    </NavigationMenuLink>
                  </Link>
                </NavigationMenuItem>
                <NavigationMenuItem>
                  <Link to="/analytics">
                    <NavigationMenuLink className={cn(navigationMenuTriggerStyle(), "flex items-center gap-1.5")}>
                      <BarChart2 className="h-4 w-4" />
                      <span>URL Analysis</span>
                    </NavigationMenuLink>
                  </Link>
                </NavigationMenuItem>
                {user && (
                  <NavigationMenuItem>
                    <Link to="/qr-code">
                      <NavigationMenuLink className={cn(navigationMenuTriggerStyle(), "flex items-center gap-1.5")}>
                        <QrCode className="h-4 w-4" />
                        <span>QR Code</span>
                      </NavigationMenuLink>
                    </Link>
                  </NavigationMenuItem>
                )}
                <NavigationMenuItem>
                  <Link to="/contact-us">
                    <NavigationMenuLink className={cn(navigationMenuTriggerStyle(), "flex items-center gap-1.5")}>
                      <Mail className="h-4 w-4" />
                      <span>Contact Us</span>
                    </NavigationMenuLink>
                  </Link>
                </NavigationMenuItem>
              </NavigationMenuList>
            </NavigationMenu>
            
            {user ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" size="sm" className="ml-2">
                    <User className="h-4 w-4 mr-2" />
                    {profile?.name ? profile.name.split(' ')[0] : 'Account'}
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuLabel>{profile?.name || user.email}</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={() => signOut()}>
                    <LogOut className="h-4 w-4 mr-2" />
                    Sign Out
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <Link to="/auth">
                <Button size="sm">Sign In</Button>
              </Link>
            )}
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;

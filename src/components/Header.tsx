
import { Link } from "react-router-dom";
import { Menu, X, Home, BarChart2, Mail } from "lucide-react";
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

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const isMobile = useIsMobile();

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
                  <Link 
                    to="/contact-us" 
                    className="flex items-center gap-2 p-2 hover:bg-accent rounded-md"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    <Mail size={18} />
                    <span>Contact Us</span>
                  </Link>
                </nav>
              </div>
            )}
          </>
        ) : (
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
        )}
      </div>
    </header>
  );
};

export default Header;

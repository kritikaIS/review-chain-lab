import { Button } from "@/components/ui/button";
import { FileText, Home, Upload, User, Search, Trophy, LogIn, LogOut } from "lucide-react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";

const Navigation = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { toast } = useToast();
  const isLoggedIn = localStorage.getItem("isLoggedIn") === "true";

  const navItems = [
    { path: "/", label: "Home", icon: Home },
    { path: "/browse", label: "Browse Papers", icon: Search },
    { path: "/submit", label: "Submit Paper", icon: Upload },
    { path: "/leaderboard", label: "Leaderboard", icon: Trophy },
    ...(isLoggedIn ? [{ path: "/profile", label: "Profile", icon: User }] : []),
  ];

  const handleLogout = () => {
    localStorage.removeItem("isLoggedIn");
    localStorage.removeItem("userEmail");
    toast({
      title: "Logged Out",
      description: "You have been successfully logged out.",
    });
    navigate("/");
  };

  return (
    <nav className="border-b bg-card/50 backdrop-blur-sm sticky top-0 z-50">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <Link to="/" className="flex items-center space-x-2">
            <FileText className="h-8 w-8 text-primary" />
            <span className="text-xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
              PeerChain
            </span>
          </Link>

          <div className="flex items-center space-x-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.path;
              
              return (
                <Button
                  key={item.path}
                  variant={isActive ? "default" : "ghost"}
                  size="sm"
                  asChild
                  className={isActive ? "shadow-lg" : ""}
                >
                  <Link to={item.path} className="flex items-center space-x-2">
                    <Icon className="h-4 w-4" />
                    <span className="hidden md:inline">{item.label}</span>
                  </Link>
                </Button>
              );
            })}
            
            {isLoggedIn ? (
              <Button 
                variant="outline" 
                size="sm" 
                className="ml-4"
                onClick={handleLogout}
              >
                <LogOut className="h-4 w-4 mr-2" />
                <span className="hidden md:inline">Logout</span>
              </Button>
            ) : (
              <Button variant="outline" size="sm" className="ml-4" asChild>
                <Link to="/login">
                  <LogIn className="h-4 w-4 mr-2" />
                  <span className="hidden md:inline">Login</span>
                </Link>
              </Button>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navigation;
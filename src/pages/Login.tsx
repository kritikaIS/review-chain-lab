import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { Mail, Lock, FileText } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      // Simple frontend-only login - just check if it's a VIT email
      if (email.includes('@vitstudent.ac.in')) {
        // Set login status and user data directly
        localStorage.setItem("isLoggedIn", "true");
        localStorage.setItem("userEmail", email);
        
        // Set mock user data directly in localStorage
        const mockUserData = {
          id: "user1",
          name: email.split('@')[0].replace(/[._]/g, ' ').replace(/\b\w/g, l => l.toUpperCase()),
          email: email,
          institution: "VIT University",
          department: "Computer Science",
          researchArea: "Blockchain",
          bio: "Researcher focused on blockchain technology and distributed systems. Passionate about improving academic peer review processes through technology.",
          socialLinks: {
            linkedin: "https://linkedin.com/in/mockuser",
            github: "https://github.com/mockuser",
            website: "https://mockuser.vit.edu"
          },
          trustRating: 4.6,
          papersSubmitted: 8,
          reviewsCompleted: 24,
          walletAddress: "0x1234567890abcdef1234567890abcdef12345678",
          points: 1850,
          level: "Silver Tier",
          joinedDate: new Date().toISOString(),
          dailyActivity: [
            { date: '2025-09-21', contributions: 3, reviewsCompleted: 2, papersSubmitted: 1, pointsEarned: 50 },
            { date: '2025-09-20', contributions: 2, reviewsCompleted: 1, papersSubmitted: 0, pointsEarned: 25 },
            { date: '2025-09-19', contributions: 4, reviewsCompleted: 3, papersSubmitted: 1, pointsEarned: 75 }
          ],
          chatRequests: [],
          sentRequests: [],
          verificationData: {
            emailVerified: true,
            completedAt: new Date().toISOString()
          }
        };
        
        localStorage.setItem("userData", JSON.stringify(mockUserData));
        
        toast({
          title: "Login Successful",
          description: "Welcome back to PeerChain!",
        });
        navigate("/profile");
      } else {
        toast({
          title: "Login Failed",
          description: "Please use a valid VIT email address (@vitstudent.ac.in)",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error('Login error:', error);
      toast({
        title: "Login Failed",
        description: "Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-secondary/20 to-background flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <Link to="/" className="flex items-center justify-center space-x-2 mb-4">
            <FileText className="h-8 w-8 text-primary" />
            <span className="text-2xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
              PeerChain
            </span>
          </Link>
          <h1 className="text-3xl font-bold mb-2">Welcome Back</h1>
          <p className="text-muted-foreground">
            Sign in to your academic research account
          </p>
        </div>

        <Card className="shadow-elevated">
          <CardHeader>
            <CardTitle>Login to Your Account</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleLogin} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email Address</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="email"
                    type="email"
                    placeholder="researcher@university.edu"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="pl-10"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="password"
                    type="password"
                    placeholder="Enter your password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="pl-10"
                    required
                  />
                </div>
              </div>

              <Button 
                type="submit" 
                className="w-full shadow-lg" 
                disabled={isLoading}
              >
                {isLoading ? "Signing In..." : "Sign In"}
              </Button>
            </form>

            <div className="mt-6 text-center">
              <p className="text-sm text-muted-foreground">
                Don't have an account?{" "}
                <Link to="/signup">
                  <Button variant="link" className="p-0 h-auto">
                    Sign Up
                  </Button>
                </Link>
              </p>
            </div>

            <div className="mt-4 text-xs text-center text-muted-foreground">
              Demo: Use any email and password to login
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Login;
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Navigation from "@/components/Navigation";
import TrustRating from "@/components/TrustRating";
import PaperCard from "@/components/PaperCard";
import ProgressBar from "@/components/ProgressBar";
import DailyActivity from "@/components/DailyActivity";
import SocialLinks from "@/components/SocialLinks";
import InteractionSystem from "@/components/InteractionSystem";
import VerificationStatus from "@/components/VerificationStatus";
import { mockUser, mockPapers, mockReviews, mockUsers, User, ChatRequest } from "@/data/mockData";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { 
  User as UserIcon, 
  FileText, 
  MessageSquare, 
  Wallet, 
  Trophy, 
  Calendar,
  Edit,
  Shield,
  Star,
  Award,
  Users,
  Activity
} from "lucide-react";

const Profile = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  
  // Get user data from localStorage or use mock data
  const [currentUser, setCurrentUser] = useState<User>(() => {
    const storedUser = localStorage.getItem("userData");
    if (storedUser) {
      return JSON.parse(storedUser);
    }
    return mockUser;
  });
  
  // Get current points from localStorage (updates when user reviews papers)
  const currentPoints = parseInt(localStorage.getItem("userPoints") || currentUser.points.toString());
  const updatedUser = { ...currentUser, points: currentPoints };

  useEffect(() => {
    // Check login status
    const checkLoginStatus = () => {
      const loggedIn = localStorage.getItem("isLoggedIn") === "true";
      const userData = localStorage.getItem("userData");
      
      if (loggedIn && userData) {
        setIsLoggedIn(true);
        setCurrentUser(JSON.parse(userData));
      } else if (!loggedIn) {
        navigate("/login");
      }
      setIsLoading(false);
    };

    checkLoginStatus();
  }, [navigate]);

  // Show loading while checking authentication
  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <Navigation />
        <div className="container mx-auto px-4 py-8">
          <Card className="text-center py-12">
            <CardContent>
              <h2 className="text-2xl font-bold mb-2">Loading Profile...</h2>
              <p className="text-muted-foreground">Please wait while we load your profile.</p>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  // Don't render if not logged in (will redirect)
  if (!isLoggedIn) {
    return null;
  }
  const userPapers = mockPapers.filter(paper => 
    paper.authors.some(author => author.includes("John Smith"))
  );
  
  const userReviews = mockReviews.slice(0, 3); // Mock user reviews

  const achievements = [
    { title: "Top Reviewer", description: "Completed 20+ high-quality reviews", icon: Trophy },
    { title: "Trusted Author", description: "Maintained 4.5+ trust rating", icon: Shield },
    { title: "Active Contributor", description: "Active member for 6+ months", icon: Star },
  ];

  // Interaction system handlers
  const handleSendRequest = (request: Omit<ChatRequest, 'id' | 'createdAt'>) => {
    const newRequest: ChatRequest = {
      ...request,
      id: `req_${Date.now()}`,
      createdAt: new Date().toISOString()
    };
    
    setCurrentUser(prev => ({
      ...prev,
      sentRequests: [...(prev.sentRequests || []), newRequest]
    }));
  };

  const handleAcceptRequest = (requestId: string) => {
    setCurrentUser(prev => {
      const updatedRequests = (prev.chatRequests || []).map(req => 
        req.id === requestId 
          ? { ...req, status: "accepted" as const, acceptedAt: new Date().toISOString() }
          : req
      );
      
      // Deduct points
      const request = prev.chatRequests?.find(req => req.id === requestId);
      const newPoints = request ? prev.points - request.pointsCost : prev.points;
      
      return {
        ...prev,
        chatRequests: updatedRequests,
        points: newPoints
      };
    });
    
    // Update localStorage
    localStorage.setItem("userPoints", (updatedUser.points - (currentUser.chatRequests?.find(req => req.id === requestId)?.pointsCost || 0)).toString());
  };

  const handleDeclineRequest = (requestId: string) => {
    setCurrentUser(prev => ({
      ...prev,
      chatRequests: (prev.chatRequests || []).map(req => 
        req.id === requestId 
          ? { ...req, status: "declined" as const }
          : req
      )
    }));
  };

  const handleReverify = () => {
    navigate("/verification");
  };

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto">
          {/* Profile Header */}
          <Card className="mb-8">
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="flex items-center space-x-4">
                  <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center">
                    <UserIcon className="h-10 w-10 text-primary" />
                  </div>
                  <div>
                    <h1 className="text-3xl font-bold mb-2">{updatedUser.name}</h1>
                    <p className="text-muted-foreground mb-2">{updatedUser.email}</p>
                    {updatedUser.institution && (
                      <p className="text-muted-foreground mb-2">{updatedUser.institution}</p>
                    )}
                    {updatedUser.bio && (
                      <p className="text-sm text-muted-foreground mb-3 max-w-2xl">{updatedUser.bio}</p>
                    )}
                    <div className="flex items-center space-x-4 mb-3">
                      <TrustRating rating={updatedUser.trustRating} />
                      <Badge variant="outline">Verified Researcher</Badge>
                      <Badge variant="trust" className="bg-gradient-to-r from-primary to-accent">
                        {updatedUser.level}
                      </Badge>
                    </div>
                    {/* Points and Progress */}
                    <div className="flex items-center space-x-4 mb-2">
                      <div className="flex items-center space-x-2">
                        <Award className="h-4 w-4 text-primary" />
                        <span className="font-semibold text-primary">
                          {updatedUser.points.toLocaleString()} Points
                        </span>
                      </div>
                    </div>
                    <div className="w-64">
                      <ProgressBar currentPoints={updatedUser.points} level={updatedUser.level} />
                    </div>
                  </div>
                </div>
                <Button variant="outline" className="flex items-center space-x-2">
                  <Edit className="h-4 w-4" />
                  <span>Edit Profile</span>
                </Button>
              </div>
            </CardHeader>
          </Card>

          <Tabs defaultValue="overview" className="w-full">
            <TabsList className="grid w-full grid-cols-5">
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="verification">Verification</TabsTrigger>
              <TabsTrigger value="activity">Activity</TabsTrigger>
              <TabsTrigger value="papers">Papers</TabsTrigger>
              <TabsTrigger value="connect">Connect</TabsTrigger>
            </TabsList>

            <TabsContent value="overview" className="mt-6">
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Main Content */}
                <div className="lg:col-span-2 space-y-8">
                  {/* Daily Activity */}
                  {updatedUser.dailyActivity && (
                    <DailyActivity activityData={updatedUser.dailyActivity} />
                  )}

                  {/* Review History */}
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center space-x-2">
                        <MessageSquare className="h-5 w-5" />
                        <span>Recent Reviews ({updatedUser.reviewsCompleted})</span>
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        {userReviews.map((review, index) => (
                          <div key={review.id}>
                            <div className="flex items-start justify-between mb-2">
                              <div>
                                <h4 className="font-medium text-sm">
                                  Review for Paper #{review.paperId}
                                </h4>
                                <div className="flex items-center space-x-2 mt-1">
                                  <TrustRating rating={review.rating} size="sm" />
                                  <span className="text-xs text-muted-foreground">
                                    {new Date(review.submittedAt).toLocaleDateString()}
                                  </span>
                                </div>
                              </div>
                              <Badge variant="outline" className="text-xs">
                                {review.isAnonymous ? "Anonymous" : "Public"}
                              </Badge>
                            </div>
                            <p className="text-sm text-muted-foreground line-clamp-2">
                              {review.comment}
                            </p>
                            {index < userReviews.length - 1 && <Separator className="mt-4" />}
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </div>

                {/* Sidebar */}
                <div className="space-y-6">
                  {/* Social Links */}
                  <SocialLinks 
                    socialLinks={updatedUser.socialLinks} 
                    email={updatedUser.email}
                  />

                  {/* Stats */}
                  <Card>
                    <CardHeader>
                      <CardTitle>Profile Statistics</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div className="text-center">
                          <div className="text-2xl font-bold text-primary">
                            {updatedUser.papersSubmitted}
                          </div>
                          <div className="text-xs text-muted-foreground">
                            Papers Submitted
                          </div>
                        </div>
                        <div className="text-center">
                          <div className="text-2xl font-bold text-primary">
                            {updatedUser.reviewsCompleted}
                          </div>
                          <div className="text-xs text-muted-foreground">
                            Reviews Completed
                          </div>
                        </div>
                      </div>
                      <Separator />
                      <div className="space-y-2">
                        <div className="flex justify-between">
                          <span className="text-sm text-muted-foreground">Points</span>
                          <span className="text-sm font-medium text-primary">
                            {updatedUser.points.toLocaleString()}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-sm text-muted-foreground">Level</span>
                          <Badge variant="trust" className="text-xs">{updatedUser.level}</Badge>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-sm text-muted-foreground">Trust Rating</span>
                          <TrustRating rating={updatedUser.trustRating} size="sm" />
                        </div>
                        <div className="flex justify-between">
                          <span className="text-sm text-muted-foreground">Member Since</span>
                          <span className="text-sm font-medium">
                            {new Date(updatedUser.joinedDate).toLocaleDateString()}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-sm text-muted-foreground">Status</span>
                          <Badge variant="trust" className="text-xs">Active</Badge>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Achievements */}
                  <Card>
                    <CardHeader>
                      <CardTitle>Achievements</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        {achievements.map((achievement, index) => {
                          const Icon = achievement.icon;
                          return (
                            <div key={index} className="flex items-start space-x-3">
                              <div className="flex-shrink-0 w-8 h-8 bg-accent/10 rounded-lg flex items-center justify-center">
                                <Icon className="h-4 w-4 text-accent" />
                              </div>
                              <div>
                                <h4 className="font-medium text-sm">{achievement.title}</h4>
                                <p className="text-xs text-muted-foreground">
                                  {achievement.description}
                                </p>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="verification" className="mt-6">
              <VerificationStatus
                verificationData={updatedUser.verificationData}
                onReverify={handleReverify}
              />
            </TabsContent>

            <TabsContent value="activity" className="mt-6">
              <div className="space-y-6">
                {updatedUser.dailyActivity && (
                  <DailyActivity activityData={updatedUser.dailyActivity} />
                )}
                
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center space-x-2">
                      <Activity className="h-5 w-5" />
                      <span>Activity Timeline</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3 text-sm">
                      <div className="flex items-center space-x-2">
                        <div className="w-2 h-2 bg-trust rounded-full"></div>
                        <span className="text-muted-foreground">Reviewed paper #2</span>
                        <span className="text-xs text-muted-foreground">2 days ago</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <div className="w-2 h-2 bg-primary rounded-full"></div>
                        <span className="text-muted-foreground">Submitted new paper</span>
                        <span className="text-xs text-muted-foreground">1 week ago</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <div className="w-2 h-2 bg-accent rounded-full"></div>
                        <span className="text-muted-foreground">Earned trust rating</span>
                        <span className="text-xs text-muted-foreground">2 weeks ago</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="papers" className="mt-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <FileText className="h-5 w-5" />
                    <span>My Submitted Papers ({userPapers.length})</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {userPapers.length > 0 ? (
                    <div className="grid gap-6">
                      {userPapers.map(paper => (
                        <PaperCard key={paper.id} paper={paper} />
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-8">
                      <FileText className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                      <p className="text-muted-foreground">No papers submitted yet</p>
                      <Button variant="outline" className="mt-4">
                        Submit Your First Paper
                      </Button>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="connect" className="mt-6">
              <InteractionSystem
                currentUser={updatedUser}
                otherUsers={mockUsers.filter(user => user.id !== updatedUser.id)}
                onSendRequest={handleSendRequest}
                onAcceptRequest={handleAcceptRequest}
                onDeclineRequest={handleDeclineRequest}
              />
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
};

export default Profile;
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import Navigation from "@/components/Navigation";
import TrustRating from "@/components/TrustRating";
import PaperCard from "@/components/PaperCard";
import { mockUser, mockPapers, mockReviews } from "@/data/mockData";
import { 
  User, 
  FileText, 
  MessageSquare, 
  Wallet, 
  Trophy, 
  Calendar,
  Edit,
  Shield,
  Star
} from "lucide-react";

const Profile = () => {
  const userPapers = mockPapers.filter(paper => 
    paper.authors.some(author => author.includes("John Smith"))
  );
  
  const userReviews = mockReviews.slice(0, 3); // Mock user reviews

  const achievements = [
    { title: "Top Reviewer", description: "Completed 20+ high-quality reviews", icon: Trophy },
    { title: "Trusted Author", description: "Maintained 4.5+ trust rating", icon: Shield },
    { title: "Active Contributor", description: "Active member for 6+ months", icon: Star },
  ];

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
                    <User className="h-10 w-10 text-primary" />
                  </div>
                  <div>
                    <h1 className="text-3xl font-bold mb-2">{mockUser.name}</h1>
                    <p className="text-muted-foreground mb-2">{mockUser.email}</p>
                    <div className="flex items-center space-x-4">
                      <TrustRating rating={mockUser.trustRating} />
                      <Badge variant="outline">Verified Researcher</Badge>
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

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-8">
              {/* My Papers */}
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

              {/* Review History */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <MessageSquare className="h-5 w-5" />
                    <span>Recent Reviews ({mockUser.reviewsCompleted})</span>
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
              {/* Stats */}
              <Card>
                <CardHeader>
                  <CardTitle>Profile Statistics</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="text-center">
                      <div className="text-2xl font-bold text-primary">
                        {mockUser.papersSubmitted}
                      </div>
                      <div className="text-xs text-muted-foreground">
                        Papers Submitted
                      </div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-primary">
                        {mockUser.reviewsCompleted}
                      </div>
                      <div className="text-xs text-muted-foreground">
                        Reviews Completed
                      </div>
                    </div>
                  </div>
                  <Separator />
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-sm text-muted-foreground">Trust Rating</span>
                      <TrustRating rating={mockUser.trustRating} size="sm" />
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-muted-foreground">Member Since</span>
                      <span className="text-sm font-medium">Jan 2024</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-muted-foreground">Status</span>
                      <Badge variant="trust" className="text-xs">Active</Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Blockchain Wallet */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Wallet className="h-5 w-5" />
                    <span>Wallet Info</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div>
                      <label className="text-xs text-muted-foreground">Wallet Address</label>
                      <code className="block bg-secondary p-2 rounded text-xs break-all mt-1">
                        {mockUser.walletAddress}
                      </code>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-muted-foreground">Network</span>
                      <span className="text-sm font-medium">Ethereum</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-muted-foreground">Balance</span>
                      <span className="text-sm font-medium">0.042 ETH</span>
                    </div>
                    <Button variant="outline" size="sm" className="w-full">
                      View on Blockchain
                    </Button>
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

              {/* Recent Activity */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Calendar className="h-5 w-5" />
                    <span>Recent Activity</span>
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
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
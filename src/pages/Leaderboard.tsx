import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import Navigation from "@/components/Navigation";
import TrustRating from "@/components/TrustRating";
import { Trophy, Medal, Award, Star, Users, BookOpen } from "lucide-react";

const Leaderboard = () => {
  const topReviewers = [
    {
      id: "1",
      name: "Dr. Sarah Chen",
      email: "s.chen@stanford.edu",
      points: 2850,
      trustRating: 4.9,
      reviewsCompleted: 47,
      papersSubmitted: 12,
      rank: 1,
    },
    {
      id: "2", 
      name: "Prof. Michael Rodriguez",
      email: "m.rodriguez@mit.edu",
      points: 2720,
      trustRating: 4.8,
      reviewsCompleted: 52,
      papersSubmitted: 8,
      rank: 2,
    },
    {
      id: "3",
      name: "Dr. Emily Watson",
      email: "e.watson@harvard.edu", 
      points: 2650,
      trustRating: 4.7,
      reviewsCompleted: 41,
      papersSubmitted: 15,
      rank: 3,
    },
    {
      id: "4",
      name: "Dr. James Kim",
      email: "j.kim@caltech.edu",
      points: 2400,
      trustRating: 4.6,
      reviewsCompleted: 38,
      papersSubmitted: 9,
      rank: 4,
    },
    {
      id: "5",
      name: "Prof. Lisa Anderson", 
      email: "l.anderson@berkeley.edu",
      points: 2350,
      trustRating: 4.8,
      reviewsCompleted: 35,
      papersSubmitted: 11,
      rank: 5,
    }
  ];

  const categories = [
    {
      title: "Top Reviewers",
      description: "Most helpful peer reviewers",
      icon: Trophy,
      data: topReviewers.slice(0, 10)
    }
  ];

  const getRankIcon = (rank: number) => {
    switch(rank) {
      case 1: return <Trophy className="h-5 w-5 text-yellow-500" />;
      case 2: return <Medal className="h-5 w-5 text-gray-400" />;  
      case 3: return <Award className="h-5 w-5 text-amber-600" />;
      default: return <span className="text-sm font-bold text-muted-foreground">#{rank}</span>;
    }
  };

  const stats = [
    { label: "Total Researchers", value: "1,247", icon: Users },
    { label: "Active Reviewers", value: "892", icon: Star },
    { label: "Papers Reviewed", value: "3,456", icon: BookOpen },
  ];

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold mb-4 bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
              Community Leaderboard
            </h1>
            <p className="text-xl text-muted-foreground">
              Recognizing our top contributors to academic peer review
            </p>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            {stats.map((stat, index) => {
              const Icon = stat.icon;
              return (
                <Card key={index} className="text-center">
                  <CardContent className="p-6">
                    <Icon className="h-8 w-8 text-primary mx-auto mb-2" />
                    <div className="text-3xl font-bold text-primary mb-1">
                      {stat.value}
                    </div>
                    <div className="text-sm text-muted-foreground">
                      {stat.label}
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>

          {/* Leaderboard */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Trophy className="h-6 w-6 text-primary" />
                <span>Top Reviewers</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {topReviewers.map((user) => (
                  <div 
                    key={user.id} 
                    className="flex items-center justify-between p-4 rounded-lg border hover:shadow-lg transition-all"
                  >
                    <div className="flex items-center space-x-4">
                      <div className="flex items-center justify-center w-12 h-12">
                        {getRankIcon(user.rank)}
                      </div>
                      
                      <Avatar className="h-12 w-12">
                        <AvatarFallback className="bg-primary/10 text-primary font-semibold">
                          {user.name.split(' ').map(n => n[0]).join('')}
                        </AvatarFallback>
                      </Avatar>
                      
                      <div>
                        <h3 className="font-semibold">{user.name}</h3>
                        <p className="text-sm text-muted-foreground">{user.email}</p>
                        <div className="flex items-center space-x-3 mt-1">
                          <TrustRating rating={user.trustRating} size="sm" />
                          <Badge variant="outline" className="text-xs">
                            {user.reviewsCompleted} reviews
                          </Badge>
                        </div>
                      </div>
                    </div>
                    
                    <div className="text-right">
                      <div className="text-2xl font-bold text-primary">
                        {user.points.toLocaleString()}
                      </div>
                      <div className="text-xs text-muted-foreground">
                        points
                      </div>
                      <div className="text-xs text-muted-foreground mt-1">
                        {user.papersSubmitted} papers submitted
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Achievement Categories */}
          <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-center">🏆 Gold Tier</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center">
                  <div className="text-lg font-semibold">2500+ Points</div>
                  <div className="text-sm text-muted-foreground">Elite Reviewers</div>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle className="text-center">🥈 Silver Tier</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center">
                  <div className="text-lg font-semibold">1000-2499 Points</div>
                  <div className="text-sm text-muted-foreground">Expert Reviewers</div>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle className="text-center">🥉 Bronze Tier</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center">
                  <div className="text-lg font-semibold">500-999 Points</div>
                  <div className="text-sm text-muted-foreground">Active Reviewers</div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Leaderboard;
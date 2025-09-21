import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import Navigation from "@/components/Navigation";
import { Shield, Users, Zap, FileText, Star, Globe } from "lucide-react";
import { Link } from "react-router-dom";
import heroImage from "@/assets/hero-blockchain.jpg";

const Index = () => {
  const features = [
    {
      icon: Shield,
      title: "Transparent Reviews",
      description: "All reviews are recorded on blockchain for complete transparency and immutability."
    },
    {
      icon: Users,
      title: "Global Community",
      description: "Connect with researchers worldwide in a decentralized peer review network."
    },
    {
      icon: Zap,
      title: "Smart Contracts",
      description: "Automated trust ratings and reviewer compensation through smart contracts."
    },
    {
      icon: Globe,
      title: "Open Access",
      description: "Break down barriers to academic publishing with decentralized, open-access research."
    }
  ];

  const stats = [
    { label: "Papers Reviewed", value: "1,247" },
    { label: "Active Reviewers", value: "892" },
    { label: "Trust Score", value: "98.5%" },
    { label: "Global Reach", value: "67 Countries" }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-secondary/20 to-background">
      <Navigation />
      
      {/* Hero Section */}
      <section className="relative py-20 px-4">
        <div className="container mx-auto text-center">
          <div className="mb-12 animate-fade-in">
            <h1 className="text-5xl md:text-7xl font-bold mb-6 bg-gradient-to-r from-primary via-accent to-trust bg-clip-text text-transparent">
              PeerChain
            </h1>
            <p className="text-xl md:text-2xl text-muted-foreground mb-4">
              Decentralized Academic Peer Review System
            </p>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto mb-8">
              Revolutionizing scholarly publishing through blockchain technology. 
              Transparent, accountable, and globally accessible peer review.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Button asChild size="lg" className="shadow-lg hover:shadow-blockchain transition-all">
                <Link to="/browse">Browse Papers</Link>
              </Button>
              <Button asChild variant="outline" size="lg">
                <Link to="/submit">Submit Paper</Link>
              </Button>
            </div>
          </div>
          
          <div className="relative max-w-4xl mx-auto animate-slide-up">
            <img 
              src={heroImage} 
              alt="Blockchain peer review visualization" 
              className="rounded-lg shadow-elevated w-full"
            />
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-4">
        <div className="container mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">
            Why Choose PeerChain?
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <Card key={index} className="text-center hover:shadow-elevated transition-all duration-300 animate-fade-in" style={{ animationDelay: `${index * 0.1}s` }}>
                  <CardHeader>
                    <div className="mx-auto w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
                      <Icon className="h-6 w-6 text-primary" />
                    </div>
                    <CardTitle className="text-lg">{feature.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground">{feature.description}</p>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20 px-4 bg-card/50">
        <div className="container mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">
            Platform Statistics
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {stats.map((stat, index) => (
              <div key={index} className="text-center animate-fade-in" style={{ animationDelay: `${index * 0.1}s` }}>
                <div className="text-3xl md:text-4xl font-bold text-primary mb-2">
                  {stat.value}
                </div>
                <div className="text-muted-foreground">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4">
        <div className="container mx-auto text-center">
          <Card className="max-w-4xl mx-auto p-8 bg-gradient-to-r from-primary/5 to-accent/5 border-primary/20">
            <CardHeader>
              <CardTitle className="text-3xl md:text-4xl mb-4">
                Join the Future of Academic Publishing
              </CardTitle>
              <p className="text-xl text-muted-foreground mb-8">
                Be part of a transparent, decentralized research community that values quality, 
                integrity, and open access to knowledge.
              </p>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button asChild size="lg" className="shadow-lg">
                  <Link to="/submit" className="flex items-center space-x-2">
                    <FileText className="h-5 w-5" />
                    <span>Submit Your Research</span>
                  </Link>
                </Button>
                <Button asChild variant="outline" size="lg">
                  <Link to="/browse" className="flex items-center space-x-2">
                    <Star className="h-5 w-5" />
                    <span>Start Reviewing</span>
                  </Link>
                </Button>
              </div>
              
              <div className="mt-8 text-sm text-muted-foreground">
                <Badge variant="outline" className="mr-2">Blockchain Secured</Badge>
                <Badge variant="outline" className="mr-2">Peer Reviewed</Badge>
                <Badge variant="outline">Open Access</Badge>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>
    </div>
  );
};

export default Index;

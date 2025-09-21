import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ExternalLink, Linkedin, Github, Globe, Mail } from "lucide-react";

interface SocialLinksProps {
  socialLinks?: {
    linkedin?: string;
    github?: string;
    website?: string;
  };
  email?: string;
  className?: string;
}

const SocialLinks = ({ socialLinks, email, className = "" }: SocialLinksProps) => {
  const links = [
    {
      name: "LinkedIn",
      url: socialLinks?.linkedin,
      icon: Linkedin,
      color: "text-blue-600 hover:text-blue-700",
      bgColor: "bg-blue-50 hover:bg-blue-100"
    },
    {
      name: "GitHub",
      url: socialLinks?.github,
      icon: Github,
      color: "text-gray-800 hover:text-gray-900",
      bgColor: "bg-gray-50 hover:bg-gray-100"
    },
    {
      name: "Website",
      url: socialLinks?.website,
      icon: Globe,
      color: "text-green-600 hover:text-green-700",
      bgColor: "bg-green-50 hover:bg-green-100"
    }
  ];

  const hasAnyLinks = links.some(link => link.url) || email;

  if (!hasAnyLinks) {
    return (
      <Card className={className}>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Globe className="h-5 w-5" />
            <span>Social Profiles</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-4">
            <Globe className="h-12 w-12 mx-auto text-muted-foreground mb-3" />
            <p className="text-muted-foreground text-sm mb-3">
              No social profiles added yet
            </p>
            <Button variant="outline" size="sm">
              Add Social Links
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <Globe className="h-5 w-5" />
          <span>Social Profiles</span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {/* Email */}
          {email && (
            <div className="flex items-center space-x-3 p-3 bg-secondary/50 rounded-lg">
              <div className="flex-shrink-0 w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center">
                <Mail className="h-4 w-4 text-primary" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-muted-foreground">Email</p>
                <p className="text-sm truncate">{email}</p>
              </div>
              <Button variant="ghost" size="sm" asChild>
                <a href={`mailto:${email}`}>
                  <ExternalLink className="h-3 w-3" />
                </a>
              </Button>
            </div>
          )}

          {/* Social Links */}
          {links.map((link) => {
            if (!link.url) return null;
            
            const Icon = link.icon;
            return (
              <div key={link.name} className="flex items-center space-x-3 p-3 bg-secondary/50 rounded-lg">
                <div className={`flex-shrink-0 w-8 h-8 ${link.bgColor} rounded-lg flex items-center justify-center transition-colors`}>
                  <Icon className={`h-4 w-4 ${link.color} transition-colors`} />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-muted-foreground">{link.name}</p>
                  <p className="text-sm truncate">{link.url}</p>
                </div>
                <div className="flex items-center space-x-2">
                  <Badge variant="outline" className="text-xs">
                    Verified
                  </Badge>
                  <Button variant="ghost" size="sm" asChild>
                    <a href={link.url} target="_blank" rel="noopener noreferrer">
                      <ExternalLink className="h-3 w-3" />
                    </a>
                  </Button>
                </div>
              </div>
            );
          })}
        </div>

        {/* Add More Links Button */}
        <div className="mt-4 pt-4 border-t">
          <Button variant="outline" size="sm" className="w-full">
            <Globe className="h-4 w-4 mr-2" />
            Add More Links
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default SocialLinks;

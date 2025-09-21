import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { FileText, Star, Users, Clock } from "lucide-react";
import { Link } from "react-router-dom";

interface Paper {
  id: string;
  title: string;
  abstract: string;
  authors: string[];
  category: string;
  status: "pending" | "under_review" | "reviewed" | "published";
  trustRating: number;
  reviewCount: number;
  submittedAt: string;
}

interface PaperCardProps {
  paper: Paper;
}

const PaperCard = ({ paper }: PaperCardProps) => {
  const getStatusColor = (status: string) => {
    switch (status) {
      case "pending":
        return "secondary";
      case "under_review":
        return "outline";
      case "reviewed":
        return "default";
      case "published":
        return "trust";
      default:
        return "secondary";
    }
  };

  const getStatusText = (status: string) => {
    return status.replace("_", " ").toUpperCase();
  };

  return (
    <Card className="h-full hover:shadow-elevated transition-all duration-300 animate-fade-in">
      <CardHeader className="pb-4">
        <div className="flex items-start justify-between gap-4">
          <CardTitle className="text-lg line-clamp-2 flex-1">
            {paper.title}
          </CardTitle>
          <Badge variant={getStatusColor(paper.status) as any}>
            {getStatusText(paper.status)}
          </Badge>
        </div>
        <div className="flex items-center text-sm text-muted-foreground space-x-4">
          <span>By {paper.authors.join(", ")}</span>
          <Badge variant="outline" className="text-xs">
            {paper.category}
          </Badge>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-4">
        <p className="text-sm text-muted-foreground line-clamp-3">
          {paper.abstract}
        </p>
        
        <div className="flex items-center justify-between text-sm">
          <div className="flex items-center space-x-4 text-muted-foreground">
            <div className="flex items-center space-x-1">
              <Star className="h-4 w-4 fill-accent text-accent" />
              <span>{paper.trustRating.toFixed(1)}</span>
            </div>
            <div className="flex items-center space-x-1">
              <Users className="h-4 w-4" />
              <span>{paper.reviewCount} reviews</span>
            </div>
            <div className="flex items-center space-x-1">
              <Clock className="h-4 w-4" />
              <span>{new Date(paper.submittedAt).toLocaleDateString()}</span>
            </div>
          </div>
        </div>
        
        <div className="flex space-x-2 pt-2">
          <Button asChild variant="default" size="sm" className="flex-1">
            <Link to={`/paper/${paper.id}`} className="flex items-center space-x-2">
              <FileText className="h-4 w-4" />
              <span>View Paper</span>
            </Link>
          </Button>
          {paper.status === "pending" && (
            <Button asChild variant="outline" size="sm">
              <Link to={`/review/${paper.id}`}>Review</Link>
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default PaperCard;
import { useState } from "react";
import { useParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Separator } from "@/components/ui/separator";
import Navigation from "@/components/Navigation";
import TrustRating from "@/components/TrustRating";
import { mockPapers, mockReviews } from "@/data/mockData";
import { 
  FileText, 
  Users, 
  Calendar, 
  Star, 
  MessageSquare, 
  Download,
  Share,
  Flag,
  Send
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const Paper = () => {
  const { id } = useParams();
  const [review, setReview] = useState("");
  const [rating, setRating] = useState(0);
  const [isSubmittingReview, setIsSubmittingReview] = useState(false);
  const { toast } = useToast();

  const paper = mockPapers.find(p => p.id === id);
  const reviews = mockReviews.filter(r => r.paperId === id);

  if (!paper) {
    return (
      <div className="min-h-screen bg-background">
        <Navigation />
        <div className="container mx-auto px-4 py-8">
          <Card className="text-center py-12">
            <CardContent>
              <h2 className="text-2xl font-bold mb-2">Paper Not Found</h2>
              <p className="text-muted-foreground">The requested paper could not be found.</p>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  const handleSubmitReview = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!review.trim() || rating === 0) {
      toast({
        title: "Incomplete Review",
        description: "Please provide both a rating and written review.",
        variant: "destructive",
      });
      return;
    }

    setIsSubmittingReview(true);
    
    setTimeout(() => {
      setIsSubmittingReview(false);
      toast({
        title: "Review Submitted!",
        description: "Your review has been recorded on the blockchain.",
      });
      setReview("");
      setRating(0);
    }, 1500);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "pending": return "secondary";
      case "under_review": return "outline";
      case "reviewed": return "default";
      case "published": return "trust";
      default: return "secondary";
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto">
          {/* Paper Header */}
          <Card className="mb-8">
            <CardHeader>
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1">
                  <h1 className="text-3xl font-bold mb-4">{paper.title}</h1>
                  <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground mb-4">
                    <div className="flex items-center space-x-1">
                      <Users className="h-4 w-4" />
                      <span>By {paper.authors.join(", ")}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Calendar className="h-4 w-4" />
                      <span>{new Date(paper.submittedAt).toLocaleDateString()}</span>
                    </div>
                    <Badge variant="outline">{paper.category}</Badge>
                  </div>
                  <div className="flex items-center space-x-4 mb-4">
                    <TrustRating rating={paper.trustRating} />
                    <span className="text-sm text-muted-foreground">
                      {paper.reviewCount} reviews
                    </span>
                    <Badge variant={getStatusColor(paper.status) as any}>
                      {paper.status.replace("_", " ").toUpperCase()}
                    </Badge>
                  </div>
                </div>
                
                <div className="flex flex-col space-y-2">
                  <Button size="sm" className="flex items-center space-x-2">
                    <Download className="h-4 w-4" />
                    <span>Download PDF</span>
                  </Button>
                  <Button variant="outline" size="sm" className="flex items-center space-x-2">
                    <Share className="h-4 w-4" />
                    <span>Share</span>
                  </Button>
                  <Button variant="ghost" size="sm" className="flex items-center space-x-2">
                    <Flag className="h-4 w-4" />
                    <span>Report</span>
                  </Button>
                </div>
              </div>
            </CardHeader>
          </Card>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-8">
              {/* Abstract */}
              <Card>
                <CardHeader>
                  <CardTitle>Abstract</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-foreground leading-relaxed">
                    {paper.abstract}
                  </p>
                </CardContent>
              </Card>

              {/* Full Paper Content */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <FileText className="h-5 w-5" />
                    <span>Paper Content</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="prose max-w-none">
                    <p className="text-muted-foreground mb-4">
                      This is a preview of the paper content. The full paper would be displayed here
                      with proper formatting, equations, figures, and references.
                    </p>
                    <div className="bg-secondary/20 p-6 rounded-lg">
                      <h3 className="font-semibold mb-2">1. Introduction</h3>
                      <p className="text-sm leading-relaxed mb-4">
                        {paper.content || `This section would contain the full introduction of the paper "${paper.title}". 
                        The content would include proper academic formatting with citations, mathematical equations, 
                        and detailed explanations of the research methodology.`}
                      </p>
                      <p className="text-xs text-muted-foreground italic">
                        ... Full paper content continues ...
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Reviews Section */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <MessageSquare className="h-5 w-5" />
                    <span>Peer Reviews ({reviews.length})</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {reviews.length > 0 ? (
                    <div className="space-y-6">
                      {reviews.map((review, index) => (
                        <div key={review.id}>
                          <div className="flex items-start justify-between mb-3">
                            <div>
                              <div className="flex items-center space-x-2 mb-1">
                                <span className="font-medium">
                                  {review.isAnonymous ? "Anonymous Reviewer" : review.reviewer}
                                </span>
                                <TrustRating rating={review.rating} size="sm" />
                              </div>
                              <span className="text-xs text-muted-foreground">
                                {new Date(review.submittedAt).toLocaleDateString()}
                              </span>
                            </div>
                            {review.isAnonymous && (
                              <Badge variant="outline" className="text-xs">
                                Anonymous
                              </Badge>
                            )}
                          </div>
                          <p className="text-sm leading-relaxed">{review.comment}</p>
                          {index < reviews.length - 1 && <Separator className="mt-6" />}
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-muted-foreground text-center py-8">
                      No reviews yet. Be the first to review this paper!
                    </p>
                  )}
                </CardContent>
              </Card>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Submit Review */}
              {paper.status === "pending" || paper.status === "under_review" ? (
                <Card>
                  <CardHeader>
                    <CardTitle>Submit Review</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <form onSubmit={handleSubmitReview} className="space-y-4">
                      <div>
                        <label className="text-sm font-medium mb-2 block">
                          Rating
                        </label>
                        <div className="flex space-x-1">
                          {[1, 2, 3, 4, 5].map((star) => (
                            <button
                              key={star}
                              type="button"
                              onClick={() => setRating(star)}
                              className="p-1 hover:scale-110 transition-transform"
                            >
                              <Star
                                className={`h-6 w-6 ${
                                  star <= rating
                                    ? "fill-accent text-accent"
                                    : "text-muted-foreground"
                                }`}
                              />
                            </button>
                          ))}
                        </div>
                      </div>
                      
                      <div>
                        <label className="text-sm font-medium mb-2 block">
                          Review Comments
                        </label>
                        <Textarea
                          value={review}
                          onChange={(e) => setReview(e.target.value)}
                          placeholder="Provide constructive feedback on this paper..."
                          rows={4}
                        />
                      </div>
                      
                      <Button 
                        type="submit" 
                        className="w-full"
                        disabled={isSubmittingReview}
                      >
                        {isSubmittingReview ? (
                          <>
                            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
                            Submitting...
                          </>
                        ) : (
                          <>
                            <Send className="h-4 w-4 mr-2" />
                            Submit Review
                          </>
                        )}
                      </Button>
                    </form>
                  </CardContent>
                </Card>
              ) : (
                <Card>
                  <CardContent className="pt-6">
                    <p className="text-sm text-muted-foreground text-center">
                      This paper has completed the review process.
                    </p>
                  </CardContent>
                </Card>
              )}

              {/* Paper Stats */}
              <Card>
                <CardHeader>
                  <CardTitle>Paper Statistics</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">Trust Rating</span>
                    <TrustRating rating={paper.trustRating} size="sm" />
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">Reviews</span>
                    <span className="text-sm font-medium">{paper.reviewCount}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">Status</span>
                    <Badge variant={getStatusColor(paper.status) as any} className="text-xs">
                      {paper.status.replace("_", " ").toUpperCase()}
                    </Badge>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">Submitted</span>
                    <span className="text-sm font-medium">
                      {new Date(paper.submittedAt).toLocaleDateString()}
                    </span>
                  </div>
                </CardContent>
              </Card>

              {/* Blockchain Info */}
              <Card>
                <CardHeader>
                  <CardTitle>Blockchain Record</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2 text-xs">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Transaction Hash</span>
                    </div>
                    <code className="block bg-secondary p-2 rounded text-xs break-all">
                      0x{paper.id}a1b2c3d4e5f6...
                    </code>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Block Number</span>
                      <span>1,247,892</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Confirmations</span>
                      <span>156</span>
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

export default Paper;
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import Navigation from "@/components/Navigation";
import { Upload, FileText, Users, Globe, Shield, Zap } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const Submit = () => {
  const [title, setTitle] = useState("");
  const [abstract, setAbstract] = useState("");
  const [authors, setAuthors] = useState("");
  const [category, setCategory] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const categories = [
    "Computer Science",
    "Blockchain Technology", 
    "Artificial Intelligence",
    "Privacy & Security",
    "Distributed Systems",
    "Machine Learning",
    "Cryptography"
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Simulate submission process
    setTimeout(() => {
      setIsSubmitting(false);
      toast({
        title: "Paper Submitted Successfully!",
        description: "Your paper has been added to the blockchain and is now available for peer review.",
      });
      
      // Reset form
      setTitle("");
      setAbstract("");
      setAuthors("");
      setCategory("");
      setFile(null);
    }, 2000);
  };

  const benefits = [
    {
      icon: Shield,
      title: "Blockchain Security",
      description: "Your work is protected by immutable blockchain technology"
    },
    {
      icon: Globe,
      title: "Global Reach",
      description: "Connect with reviewers from leading institutions worldwide"
    },
    {
      icon: Zap,
      title: "Fast Review",
      description: "Automated matching with qualified reviewers"
    },
    {
      icon: Users,
      title: "Transparent Process",
      description: "Track your paper's review progress in real-time"
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold mb-2">Submit Your Research</h1>
            <p className="text-muted-foreground">
              Share your work with the global academic community through our decentralized platform
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main Form */}
            <div className="lg:col-span-2">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <FileText className="h-5 w-5" />
                    <span>Paper Details</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                      <label className="text-sm font-medium mb-2 block">
                        Paper Title *
                      </label>
                      <Input
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        placeholder="Enter your paper title..."
                        required
                      />
                    </div>

                    <div>
                      <label className="text-sm font-medium mb-2 block">
                        Authors *
                      </label>
                      <Input
                        value={authors}
                        onChange={(e) => setAuthors(e.target.value)}
                        placeholder="Dr. Jane Smith, Prof. John Doe..."
                        required
                      />
                      <p className="text-xs text-muted-foreground mt-1">
                        Separate multiple authors with commas
                      </p>
                    </div>

                    <div>
                      <label className="text-sm font-medium mb-2 block">
                        Category *
                      </label>
                      <Select value={category} onValueChange={setCategory} required>
                        <SelectTrigger>
                          <SelectValue placeholder="Select a category" />
                        </SelectTrigger>
                        <SelectContent>
                          {categories.map(cat => (
                            <SelectItem key={cat} value={cat}>
                              {cat}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div>
                      <label className="text-sm font-medium mb-2 block">
                        Abstract *
                      </label>
                      <Textarea
                        value={abstract}
                        onChange={(e) => setAbstract(e.target.value)}
                        placeholder="Provide a detailed abstract of your research..."
                        rows={6}
                        required
                      />
                      <p className="text-xs text-muted-foreground mt-1">
                        {abstract.length}/500 characters recommended
                      </p>
                    </div>

                    <div>
                      <label className="text-sm font-medium mb-2 block">
                        Upload Paper *
                      </label>
                      <div className="border-2 border-dashed border-border rounded-lg p-6 text-center">
                        <Upload className="h-10 w-10 mx-auto text-muted-foreground mb-4" />
                        <div className="space-y-2">
                          <p className="text-sm font-medium">
                            Drop your PDF file here, or click to browse
                          </p>
                          <p className="text-xs text-muted-foreground">
                            Supported formats: PDF (max 10MB)
                          </p>
                          <input
                            type="file"
                            accept=".pdf"
                            onChange={(e) => setFile(e.target.files?.[0] || null)}
                            className="hidden"
                            id="file-upload"
                            required
                          />
                          <Button 
                            type="button" 
                            variant="outline" 
                            size="sm"
                            onClick={() => document.getElementById('file-upload')?.click()}
                          >
                            Choose File
                          </Button>
                        </div>
                        {file && (
                          <div className="mt-4 p-2 bg-secondary rounded text-sm">
                            Selected: {file.name}
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="bg-secondary/50 p-4 rounded-lg">
                      <h4 className="font-medium mb-2 flex items-center space-x-2">
                        <Shield className="h-4 w-4" />
                        <span>Blockchain Submission</span>
                      </h4>
                      <p className="text-sm text-muted-foreground">
                        Your paper will be stored on IPFS and registered on the blockchain 
                        for permanent, tamper-proof record keeping. This ensures transparency 
                        and immutability of your research.
                      </p>
                    </div>

                    <Button 
                      type="submit" 
                      className="w-full" 
                      size="lg"
                      disabled={isSubmitting}
                    >
                      {isSubmitting ? (
                        <>
                          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
                          Submitting to Blockchain...
                        </>
                      ) : (
                        <>
                          <Upload className="h-4 w-4 mr-2" />
                          Submit Paper
                        </>
                      )}
                    </Button>
                  </form>
                </CardContent>
              </Card>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Why Submit Here?</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {benefits.map((benefit, index) => {
                    const Icon = benefit.icon;
                    return (
                      <div key={index} className="flex items-start space-x-3">
                        <div className="flex-shrink-0 w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center">
                          <Icon className="h-4 w-4 text-primary" />
                        </div>
                        <div>
                          <h4 className="font-medium text-sm">{benefit.title}</h4>
                          <p className="text-xs text-muted-foreground">
                            {benefit.description}
                          </p>
                        </div>
                      </div>
                    );
                  })}
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Submission Guidelines</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="space-y-2">
                    <Badge variant="outline" className="w-full justify-center">
                      Original Research Only
                    </Badge>
                    <Badge variant="outline" className="w-full justify-center">
                      Peer Review Ready
                    </Badge>
                    <Badge variant="outline" className="w-full justify-center">
                      Proper Citations Required
                    </Badge>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    All submissions are verified for originality and will be 
                    subject to transparent peer review on the blockchain.
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Submit;
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import apiService from "@/services/api";
import { 
  ExternalLink, 
  CheckCircle, 
  XCircle, 
  Loader2, 
  GraduationCap,
  AlertTriangle,
  Search
} from "lucide-react";

interface GoogleScholarVerificationProps {
  onVerificationComplete: (isVerified: boolean, profileData?: any) => void;
  className?: string;
}

interface ScholarProfile {
  name: string;
  email: string;
  institution: string;
  verified: boolean;
  profileUrl: string;
  citations: number;
  hIndex: number;
}

const GoogleScholarVerification = ({ onVerificationComplete, className = "" }: GoogleScholarVerificationProps) => {
  const [profileUrl, setProfileUrl] = useState("");
  const [isVerifying, setIsVerifying] = useState(false);
  const [verificationResult, setVerificationResult] = useState<{
    status: 'idle' | 'success' | 'error';
    message: string;
    profileData?: ScholarProfile;
  }>({ status: 'idle', message: '' });
  const { toast } = useToast();

  const validateScholarUrl = (url: string): boolean => {
    const scholarPattern = /^https?:\/\/(scholar\.google\.com\/citations\?user=|scholar\.google\.co\.in\/citations\?user=)[A-Za-z0-9_-]+/;
    return scholarPattern.test(url);
  };

  const extractUserId = (url: string): string | null => {
    const match = url.match(/user=([A-Za-z0-9_-]+)/);
    return match ? match[1] : null;
  };

  const verifyScholarProfile = async (url: string): Promise<ScholarProfile | null> => {
    try {
      const response = await apiService.verifyScholarProfile(url);
      
      if (response.success && response.data?.profile) {
        return response.data.profile;
      } else {
        throw new Error(response.message || "Verification failed");
      }
    } catch (error) {
      console.error('Scholar verification error:', error);
      throw error;
    }
  };

  const handleVerify = async () => {
    if (!profileUrl.trim()) {
      toast({
        title: "URL Required",
        description: "Please enter your Google Scholar profile URL.",
        variant: "destructive",
      });
      return;
    }

    if (!validateScholarUrl(profileUrl)) {
      toast({
        title: "Invalid URL",
        description: "Please enter a valid Google Scholar profile URL.",
        variant: "destructive",
      });
      return;
    }

    setIsVerifying(true);
    setVerificationResult({ status: 'idle', message: '' });

    try {
      const profileData = await verifyScholarProfile(profileUrl);
      
      if (profileData?.verified) {
        setVerificationResult({
          status: 'success',
          message: 'Google Scholar profile verified successfully!',
          profileData
        });
        onVerificationComplete(true, profileData);
        
        toast({
          title: "Verification Successful",
          description: "Your Google Scholar profile has been verified.",
        });
      } else {
        throw new Error("Profile verification failed");
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Verification failed. Please try again.";
      setVerificationResult({
        status: 'error',
        message: errorMessage
      });
      onVerificationComplete(false);
      
      toast({
        title: "Verification Failed",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setIsVerifying(false);
    }
  };

  const handleReset = () => {
    setProfileUrl("");
    setVerificationResult({ status: 'idle', message: '' });
    onVerificationComplete(false);
  };

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <GraduationCap className="h-5 w-5" />
          <span>Step 1: Google Scholar Verification</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="scholar-url">Google Scholar Profile URL</Label>
          <div className="flex space-x-2">
            <Input
              id="scholar-url"
              type="url"
              placeholder="https://scholar.google.com/citations?user=YOUR_USER_ID"
              value={profileUrl}
              onChange={(e) => setProfileUrl(e.target.value)}
              disabled={isVerifying || verificationResult.status === 'success'}
              className="flex-1"
            />
            <Button
              onClick={handleVerify}
              disabled={isVerifying || !profileUrl.trim() || verificationResult.status === 'success'}
              size="sm"
            >
              {isVerifying ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Search className="h-4 w-4" />
              )}
            </Button>
          </div>
          <p className="text-xs text-muted-foreground">
            Enter your public Google Scholar profile URL. Make sure your profile shows "Verified email at vitstudent.ac.in"
          </p>
        </div>

        {verificationResult.status !== 'idle' && (
          <Alert className={verificationResult.status === 'success' ? 'border-green-200 bg-green-50' : 'border-red-200 bg-red-50'}>
            <div className="flex items-center space-x-2">
              {verificationResult.status === 'success' ? (
                <CheckCircle className="h-4 w-4 text-green-600" />
              ) : (
                <XCircle className="h-4 w-4 text-red-600" />
              )}
              <AlertDescription className={verificationResult.status === 'success' ? 'text-green-800' : 'text-red-800'}>
                {verificationResult.message}
              </AlertDescription>
            </div>
          </Alert>
        )}

        {verificationResult.status === 'success' && verificationResult.profileData && (
          <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
            <h4 className="font-medium text-green-900 mb-2">Verified Profile Details</h4>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-green-700">Name:</span>
                <span className="font-medium">{verificationResult.profileData.name}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-green-700">Email:</span>
                <span className="font-medium">{verificationResult.profileData.email}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-green-700">Institution:</span>
                <span className="font-medium">{verificationResult.profileData.institution}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-green-700">Citations:</span>
                <span className="font-medium">{verificationResult.profileData.citations.toLocaleString()}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-green-700">H-Index:</span>
                <span className="font-medium">{verificationResult.profileData.hIndex}</span>
              </div>
            </div>
            <div className="mt-3 flex items-center space-x-2">
              <Badge variant="outline" className="text-green-700 border-green-300">
                <CheckCircle className="h-3 w-3 mr-1" />
                Verified
              </Badge>
              <Button variant="ghost" size="sm" asChild>
                <a href={verificationResult.profileData.profileUrl} target="_blank" rel="noopener noreferrer">
                  <ExternalLink className="h-3 w-3 mr-1" />
                  View Profile
                </a>
              </Button>
            </div>
          </div>
        )}

        {verificationResult.status === 'success' && (
          <div className="flex space-x-2">
            <Button onClick={handleReset} variant="outline" size="sm">
              Verify Different Profile
            </Button>
          </div>
        )}

        <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
          <div className="flex items-start space-x-2">
            <AlertTriangle className="h-4 w-4 text-blue-600 mt-0.5" />
            <div className="text-sm text-blue-800">
              <p className="font-medium mb-1">Verification Requirements:</p>
              <ul className="list-disc list-inside space-y-1 text-xs">
                <li>Your Google Scholar profile must be public</li>
                <li>Profile must show "Verified email at vitstudent.ac.in"</li>
                <li>Profile name should match your registration details</li>
                <li>Profile should contain recent academic activity</li>
              </ul>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default GoogleScholarVerification;

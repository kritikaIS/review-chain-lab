import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import Navigation from "@/components/Navigation";
import AcademicVerification from "@/components/AcademicVerification";
import VerificationStatus from "@/components/VerificationStatus";
import { useToast } from "@/hooks/use-toast";
import { 
  ArrowLeft, 
  CheckCircle, 
  AlertTriangle,
  Shield
} from "lucide-react";

const Verification = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [verificationData, setVerificationData] = useState<any>(null);
  const [showVerification, setShowVerification] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Load verification data from localStorage
    const storedVerification = localStorage.getItem("verificationData");
    if (storedVerification) {
      setVerificationData(JSON.parse(storedVerification));
    }
    setIsLoading(false);
  }, []);

  const handleVerificationComplete = (isVerified: boolean, data?: any) => {
    if (isVerified && data) {
      setVerificationData(data);
      localStorage.setItem("verificationData", JSON.stringify(data));
      
      toast({
        title: "Verification Complete!",
        description: "Your academic credentials have been successfully verified.",
      });
      
      // Redirect to profile after successful verification
      setTimeout(() => {
        navigate("/profile");
      }, 2000);
    }
  };

  const handleSkip = () => {
    toast({
      title: "Verification Skipped",
      description: "You can complete verification later from your profile.",
    });
    navigate("/profile");
  };

  const handleReverify = () => {
    setShowVerification(true);
  };

  const handleBack = () => {
    if (showVerification) {
      setShowVerification(false);
    } else {
      navigate("/profile");
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading verification status...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="flex items-center space-x-4 mb-8">
            <Button
              onClick={handleBack}
              variant="outline"
              size="sm"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back
            </Button>
            <div>
              <h1 className="text-3xl font-bold">Academic Verification</h1>
              <p className="text-muted-foreground">
                Verify your academic credentials to access full platform features
              </p>
            </div>
          </div>

          {/* Verification Status or Verification Form */}
          {!showVerification ? (
            <div className="space-y-6">
              {/* Current Status */}
              <VerificationStatus
                verificationData={verificationData}
                onReverify={handleReverify}
              />

              {/* Action Cards */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center space-x-2">
                      <Shield className="h-5 w-5 text-primary" />
                      <span>Why Verify?</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-2 text-sm">
                      <li className="flex items-center space-x-2">
                        <CheckCircle className="h-4 w-4 text-green-600" />
                        <span>Access to verified-only features</span>
                      </li>
                      <li className="flex items-center space-x-2">
                        <CheckCircle className="h-4 w-4 text-green-600" />
                        <span>Submit and review research papers</span>
                      </li>
                      <li className="flex items-center space-x-2">
                        <CheckCircle className="h-4 w-4 text-green-600" />
                        <span>Connect with verified researchers</span>
                      </li>
                      <li className="flex items-center space-x-2">
                        <CheckCircle className="h-4 w-4 text-green-600" />
                        <span>Build academic reputation</span>
                      </li>
                    </ul>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Verification Process</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div className="flex items-center space-x-3">
                        <div className="w-6 h-6 rounded-full bg-primary text-white text-xs flex items-center justify-center font-medium">1</div>
                        <span className="text-sm">Provide Google Scholar profile URL</span>
                      </div>
                      <div className="flex items-center space-x-3">
                        <div className="w-6 h-6 rounded-full bg-primary text-white text-xs flex items-center justify-center font-medium">2</div>
                        <span className="text-sm">Verify VIT email with OTP</span>
                      </div>
                      <div className="flex items-center space-x-3">
                        <div className="w-6 h-6 rounded-full bg-green-600 text-white text-xs flex items-center justify-center font-medium">✓</div>
                        <span className="text-sm">Get verified status</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Important Notice */}
              <Alert>
                <AlertTriangle className="h-4 w-4" />
                <AlertDescription>
                  <strong>For VIT Students:</strong> Academic verification is required to access full platform features. 
                  This ensures platform integrity and connects you with verified academic community members.
                </AlertDescription>
              </Alert>
            </div>
          ) : (
            <AcademicVerification
              onComplete={handleVerificationComplete}
              onSkip={handleSkip}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default Verification;

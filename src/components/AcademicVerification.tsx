import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useToast } from "@/hooks/use-toast";
import { 
  CheckCircle, 
  Clock, 
  Shield, 
  GraduationCap,
  Mail,
  AlertTriangle,
  ArrowRight,
  ArrowLeft
} from "lucide-react";
import GoogleScholarVerification from "./GoogleScholarVerification";
import VITEmailVerification from "./VITEmailVerification";

interface AcademicVerificationProps {
  onComplete: (isVerified: boolean, verificationData?: any) => void;
  onSkip?: () => void;
  className?: string;
}

interface VerificationData {
  scholarProfile?: any;
  emailVerified: boolean;
  completedAt: string;
}

const AcademicVerification = ({ onComplete, onSkip, className = "" }: AcademicVerificationProps) => {
  const [currentStep, setCurrentStep] = useState(1);
  const [scholarVerified, setScholarVerified] = useState(false);
  const [emailVerified, setEmailVerified] = useState(false);
  const [scholarData, setScholarData] = useState<any>(null);
  const [isCompleting, setIsCompleting] = useState(false);
  const { toast } = useToast();

  const totalSteps = 2;
  const progress = (currentStep / totalSteps) * 100;

  const handleScholarVerification = (isVerified: boolean, profileData?: any) => {
    setScholarVerified(isVerified);
    if (isVerified && profileData) {
      setScholarData(profileData);
    }
    
    if (isVerified) {
      setCurrentStep(2);
      toast({
        title: "Step 1 Complete",
        description: "Google Scholar verification successful. Proceed to email verification.",
      });
    }
  };

  const handleEmailVerification = (isVerified: boolean) => {
    setEmailVerified(isVerified);
    
    if (isVerified) {
      handleCompleteVerification();
    }
  };

  const handleCompleteVerification = async () => {
    setIsCompleting(true);
    
    // Simulate final verification process
    setTimeout(() => {
      const verificationData: VerificationData = {
        scholarProfile: scholarData,
        emailVerified: true,
        completedAt: new Date().toISOString()
      };
      
      onComplete(true, verificationData);
      
      toast({
        title: "Verification Complete!",
        description: "Your academic credentials have been successfully verified.",
      });
      
      setIsCompleting(false);
    }, 1500);
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSkip = () => {
    if (onSkip) {
      onSkip();
    }
  };

  const getStepStatus = (step: number) => {
    if (step < currentStep) return 'completed';
    if (step === currentStep) return 'current';
    return 'pending';
  };

  const getStepIcon = (step: number) => {
    const status = getStepStatus(step);
    if (status === 'completed') return <CheckCircle className="h-5 w-5 text-green-600" />;
    if (status === 'current') return <Clock className="h-5 w-5 text-blue-600" />;
    return <div className="h-5 w-5 rounded-full border-2 border-gray-300" />;
  };

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Header */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center space-x-2">
                <Shield className="h-6 w-6 text-primary" />
                <span>Academic Verification</span>
              </CardTitle>
              <p className="text-sm text-muted-foreground mt-1">
                Verify your academic credentials to access full platform features
              </p>
            </div>
            <Badge variant="outline" className="text-xs">
              Required for VIT Students
            </Badge>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <div className="flex items-center justify-between text-sm mb-2">
                <span>Verification Progress</span>
                <span>{Math.round(progress)}% Complete</span>
              </div>
              <Progress value={progress} className="h-2" />
            </div>

            {/* Step Indicators */}
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                {getStepIcon(1)}
                <div className="text-sm">
                  <div className="font-medium">Google Scholar</div>
                  <div className="text-xs text-muted-foreground">Profile Verification</div>
                </div>
              </div>
              
              <div className="flex-1 h-px bg-border mx-4" />
              
              <div className="flex items-center space-x-2">
                {getStepIcon(2)}
                <div className="text-sm">
                  <div className="font-medium">VIT Email</div>
                  <div className="text-xs text-muted-foreground">OTP Verification</div>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Current Step Content */}
      {currentStep === 1 && (
        <GoogleScholarVerification
          onVerificationComplete={handleScholarVerification}
        />
      )}

      {currentStep === 2 && (
        <VITEmailVerification
          onVerificationComplete={handleEmailVerification}
        />
      )}

      {/* Navigation */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex items-center justify-between">
            <div className="flex space-x-2">
              {currentStep > 1 && (
                <Button
                  onClick={handleBack}
                  variant="outline"
                  disabled={isCompleting}
                >
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Back
                </Button>
              )}
            </div>

            <div className="flex space-x-2">
              {onSkip && (
                <Button
                  onClick={handleSkip}
                  variant="ghost"
                  disabled={isCompleting}
                >
                  Skip for Now
                </Button>
              )}
              
              {scholarVerified && emailVerified && (
                <Button
                  onClick={handleCompleteVerification}
                  disabled={isCompleting}
                  className="bg-green-600 hover:bg-green-700"
                >
                  {isCompleting ? (
                    <>
                      <Clock className="h-4 w-4 mr-2 animate-spin" />
                      Completing...
                    </>
                  ) : (
                    <>
                      <CheckCircle className="h-4 w-4 mr-2" />
                      Complete Verification
                    </>
                  )}
                </Button>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Verification Benefits */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Why Verify Your Credentials?</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-3">
              <div className="flex items-start space-x-3">
                <GraduationCap className="h-5 w-5 text-primary mt-0.5" />
                <div>
                  <h4 className="font-medium">Academic Credibility</h4>
                  <p className="text-sm text-muted-foreground">
                    Verified profiles increase your credibility in academic discussions
                  </p>
                </div>
              </div>
              
              <div className="flex items-start space-x-3">
                <Mail className="h-5 w-5 text-primary mt-0.5" />
                <div>
                  <h4 className="font-medium">Secure Access</h4>
                  <p className="text-sm text-muted-foreground">
                    Access to verified-only features and research collaborations
                  </p>
                </div>
              </div>
            </div>
            
            <div className="space-y-3">
              <div className="flex items-start space-x-3">
                <Shield className="h-5 w-5 text-primary mt-0.5" />
                <div>
                  <h4 className="font-medium">Trust Building</h4>
                  <p className="text-sm text-muted-foreground">
                    Build reputation through verified academic work and contributions
                  </p>
                </div>
              </div>
              
              <div className="flex items-start space-x-3">
                <CheckCircle className="h-5 w-5 text-primary mt-0.5" />
                <div>
                  <h4 className="font-medium">Quality Assurance</h4>
                  <p className="text-sm text-muted-foreground">
                    Ensure platform integrity with verified academic community
                  </p>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Important Notice */}
      <Alert>
        <AlertTriangle className="h-4 w-4" />
        <AlertDescription>
          <strong>Important:</strong> Verification is required to access full platform features including paper submissions, peer reviews, and research collaborations. Your verification data is securely stored and only used for platform authentication.
        </AlertDescription>
      </Alert>
    </div>
  );
};

export default AcademicVerification;

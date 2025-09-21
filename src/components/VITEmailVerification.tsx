import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import apiService from "@/services/api";
import { 
  Mail, 
  CheckCircle, 
  XCircle, 
  Loader2, 
  Clock,
  RefreshCw,
  Shield,
  AlertTriangle
} from "lucide-react";

interface VITEmailVerificationProps {
  onVerificationComplete: (isVerified: boolean) => void;
  className?: string;
}

const VITEmailVerification = ({ onVerificationComplete, className = "" }: VITEmailVerificationProps) => {
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [isSendingOtp, setIsSendingOtp] = useState(false);
  const [isVerifyingOtp, setIsVerifyingOtp] = useState(false);
  const [otpSent, setOtpSent] = useState(false);
  const [verificationResult, setVerificationResult] = useState<{
    status: 'idle' | 'success' | 'error';
    message: string;
  }>({ status: 'idle', message: '' });
  const [countdown, setCountdown] = useState(0);
  const [otpAttempts, setOtpAttempts] = useState(0);
  const { toast } = useToast();

  const validateVITEmail = (email: string): boolean => {
    const vitPattern = /^[a-zA-Z0-9._%+-]+@vitstudent\.ac\.in$/;
    return vitPattern.test(email);
  };

  const sendOTP = async (email: string): Promise<boolean> => {
    try {
      const response = await apiService.sendOTP(email);
      return response.success;
    } catch (error) {
      console.error('Send OTP error:', error);
      throw error;
    }
  };

  const verifyOTP = async (email: string, otp: string): Promise<boolean> => {
    try {
      const response = await apiService.verifyOTP(email, otp);
      return response.success;
    } catch (error) {
      console.error('Verify OTP error:', error);
      throw error;
    }
  };

  const handleSendOTP = async () => {
    if (!email.trim()) {
      toast({
        title: "Email Required",
        description: "Please enter your VIT email address.",
        variant: "destructive",
      });
      return;
    }

    if (!validateVITEmail(email)) {
      toast({
        title: "Invalid Email",
        description: "Please enter a valid VIT email address (ending with @vitstudent.ac.in).",
        variant: "destructive",
      });
      return;
    }

    setIsSendingOtp(true);
    setVerificationResult({ status: 'idle', message: '' });

    try {
      await sendOTP(email);
      setOtpSent(true);
      setCountdown(300); // 5 minutes countdown
      setVerificationResult({
        status: 'success',
        message: 'OTP sent successfully! Please check your email.'
      });
      
      toast({
        title: "OTP Sent",
        description: "Please check your VIT email for the verification code.",
      });
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Failed to send OTP. Please try again.";
      setVerificationResult({
        status: 'error',
        message: errorMessage
      });
      
      toast({
        title: "Failed to Send OTP",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setIsSendingOtp(false);
    }
  };

  const handleVerifyOTP = async () => {
    if (!otp.trim()) {
      toast({
        title: "OTP Required",
        description: "Please enter the OTP sent to your email.",
        variant: "destructive",
      });
      return;
    }

    if (otp.length !== 6) {
      toast({
        title: "Invalid OTP Format",
        description: "Please enter the 6-digit OTP.",
        variant: "destructive",
      });
      return;
    }

    setIsVerifyingOtp(true);
    setVerificationResult({ status: 'idle', message: '' });

    try {
      await verifyOTP(email, otp);
      setVerificationResult({
        status: 'success',
        message: 'Email verification successful!'
      });
      onVerificationComplete(true);
      
      toast({
        title: "Verification Successful",
        description: "Your VIT email has been verified successfully.",
      });
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "OTP verification failed. Please try again.";
      setVerificationResult({
        status: 'error',
        message: errorMessage
      });
      setOtpAttempts(prev => prev + 1);
      
      toast({
        title: "Verification Failed",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setIsVerifyingOtp(false);
    }
  };

  const handleResendOTP = async () => {
    if (countdown > 0) return;
    
    setOtp("");
    setOtpSent(false);
    setVerificationResult({ status: 'idle', message: '' });
    await handleSendOTP();
  };

  const handleReset = () => {
    setEmail("");
    setOtp("");
    setOtpSent(false);
    setVerificationResult({ status: 'idle', message: '' });
    setCountdown(0);
    setOtpAttempts(0);
    onVerificationComplete(false);
  };

  // Countdown timer
  useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [countdown]);

  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <Mail className="h-5 w-5" />
          <span>Step 2: VIT Email Verification</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="vit-email">VIT Email Address</Label>
          <div className="flex space-x-2">
            <Input
              id="vit-email"
              type="email"
              placeholder="your.name2024@vitstudent.ac.in"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={isSendingOtp || verificationResult.status === 'success'}
              className="flex-1"
            />
            <Button
              onClick={handleSendOTP}
              disabled={isSendingOtp || !email.trim() || verificationResult.status === 'success'}
              size="sm"
            >
              {isSendingOtp ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Mail className="h-4 w-4" />
              )}
            </Button>
          </div>
          <p className="text-xs text-muted-foreground">
            Enter your official VIT email address to receive verification code
          </p>
        </div>

        {otpSent && (
          <div className="space-y-2">
            <Label htmlFor="otp">Verification Code</Label>
            <div className="flex space-x-2">
              <Input
                id="otp"
                type="text"
                placeholder="123456"
                value={otp}
                onChange={(e) => setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))}
                disabled={isVerifyingOtp || verificationResult.status === 'success'}
                className="flex-1"
                maxLength={6}
              />
              <Button
                onClick={handleVerifyOTP}
                disabled={isVerifyingOtp || !otp.trim() || verificationResult.status === 'success'}
                size="sm"
              >
                {isVerifyingOtp ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <CheckCircle className="h-4 w-4" />
                )}
              </Button>
            </div>
            
            {countdown > 0 && (
              <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                <Clock className="h-4 w-4" />
                <span>Resend available in {formatTime(countdown)}</span>
              </div>
            )}
            
            {countdown === 0 && (
              <Button
                onClick={handleResendOTP}
                variant="outline"
                size="sm"
                disabled={isSendingOtp}
              >
                <RefreshCw className="h-4 w-4 mr-1" />
                Resend OTP
              </Button>
            )}
          </div>
        )}

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

        {verificationResult.status === 'success' && (
          <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
            <div className="flex items-center space-x-2 mb-2">
              <Shield className="h-5 w-5 text-green-600" />
              <h4 className="font-medium text-green-900">Email Verified Successfully</h4>
            </div>
            <p className="text-sm text-green-700">
              Your VIT email address <strong>{email}</strong> has been verified and linked to your account.
            </p>
            <div className="mt-3">
              <Badge variant="outline" className="text-green-700 border-green-300">
                <CheckCircle className="h-3 w-3 mr-1" />
                Verified VIT Student
              </Badge>
            </div>
          </div>
        )}

        {otpAttempts > 0 && otpAttempts < 3 && (
          <Alert className="border-yellow-200 bg-yellow-50">
            <AlertTriangle className="h-4 w-4 text-yellow-600" />
            <AlertDescription className="text-yellow-800">
              {otpAttempts === 1 && "1 attempt failed. You have 2 more attempts."}
              {otpAttempts === 2 && "2 attempts failed. You have 1 more attempt."}
            </AlertDescription>
          </Alert>
        )}

        {otpAttempts >= 3 && (
          <Alert className="border-red-200 bg-red-50">
            <XCircle className="h-4 w-4 text-red-600" />
            <AlertDescription className="text-red-800">
              Maximum attempts exceeded. Please contact support or try again later.
            </AlertDescription>
          </Alert>
        )}

        {verificationResult.status === 'success' && (
          <div className="flex space-x-2">
            <Button onClick={handleReset} variant="outline" size="sm">
              Verify Different Email
            </Button>
          </div>
        )}

        <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
          <div className="flex items-start space-x-2">
            <AlertTriangle className="h-4 w-4 text-blue-600 mt-0.5" />
            <div className="text-sm text-blue-800">
              <p className="font-medium mb-1">Verification Requirements:</p>
              <ul className="list-disc list-inside space-y-1 text-xs">
                <li>Email must end with @vitstudent.ac.in</li>
                <li>You must have access to the email inbox</li>
                <li>OTP is valid for 5 minutes only</li>
                <li>Maximum 3 verification attempts allowed</li>
              </ul>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default VITEmailVerification;

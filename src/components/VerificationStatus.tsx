import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { 
  CheckCircle, 
  XCircle, 
  Clock, 
  Shield, 
  GraduationCap,
  Mail,
  AlertTriangle,
  RefreshCw,
  ExternalLink
} from "lucide-react";

interface VerificationStatusProps {
  verificationData?: {
    scholarProfile?: any;
    emailVerified: boolean;
    completedAt: string;
  };
  onReverify?: () => void;
  className?: string;
}

const VerificationStatus = ({ verificationData, onReverify, className = "" }: VerificationStatusProps) => {
  const isFullyVerified = verificationData?.emailVerified && verificationData?.scholarProfile;
  const isPartiallyVerified = verificationData?.emailVerified || verificationData?.scholarProfile;
  const isNotVerified = !verificationData;

  const getStatusColor = () => {
    if (isFullyVerified) return "text-green-600";
    if (isPartiallyVerified) return "text-yellow-600";
    return "text-red-600";
  };

  const getStatusIcon = () => {
    if (isFullyVerified) return <CheckCircle className="h-5 w-5 text-green-600" />;
    if (isPartiallyVerified) return <Clock className="h-5 w-5 text-yellow-600" />;
    return <XCircle className="h-5 w-5 text-red-600" />;
  };

  const getStatusText = () => {
    if (isFullyVerified) return "Fully Verified";
    if (isPartiallyVerified) return "Partially Verified";
    return "Not Verified";
  };

  const getStatusBadge = () => {
    if (isFullyVerified) return <Badge className="bg-green-100 text-green-800 border-green-200">Verified</Badge>;
    if (isPartiallyVerified) return <Badge className="bg-yellow-100 text-yellow-800 border-yellow-200">Pending</Badge>;
    return <Badge variant="destructive">Unverified</Badge>;
  };

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <Shield className="h-5 w-5" />
          <span>Academic Verification Status</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Overall Status */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            {getStatusIcon()}
            <div>
              <h3 className="font-medium">{getStatusText()}</h3>
              <p className="text-sm text-muted-foreground">
                {isFullyVerified && "Your academic credentials are verified"}
                {isPartiallyVerified && "Complete verification to access all features"}
                {isNotVerified && "Verify your credentials to get started"}
              </p>
            </div>
          </div>
          {getStatusBadge()}
        </div>

        {/* Verification Details */}
        <div className="space-y-3">
          {/* Google Scholar Status */}
          <div className="flex items-center justify-between p-3 bg-secondary/50 rounded-lg">
            <div className="flex items-center space-x-3">
              <GraduationCap className="h-5 w-5 text-primary" />
              <div>
                <h4 className="font-medium text-sm">Google Scholar Profile</h4>
                <p className="text-xs text-muted-foreground">
                  {verificationData?.scholarProfile ? "Verified" : "Not verified"}
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              {verificationData?.scholarProfile ? (
                <CheckCircle className="h-4 w-4 text-green-600" />
              ) : (
                <XCircle className="h-4 w-4 text-red-600" />
              )}
              {verificationData?.scholarProfile && (
                <Button variant="ghost" size="sm" asChild>
                  <a 
                    href={verificationData.scholarProfile.profileUrl} 
                    target="_blank" 
                    rel="noopener noreferrer"
                  >
                    <ExternalLink className="h-3 w-3" />
                  </a>
                </Button>
              )}
            </div>
          </div>

          {/* VIT Email Status */}
          <div className="flex items-center justify-between p-3 bg-secondary/50 rounded-lg">
            <div className="flex items-center space-x-3">
              <Mail className="h-5 w-5 text-primary" />
              <div>
                <h4 className="font-medium text-sm">VIT Email Address</h4>
                <p className="text-xs text-muted-foreground">
                  {verificationData?.emailVerified ? "Verified" : "Not verified"}
                </p>
              </div>
            </div>
            {verificationData?.emailVerified ? (
              <CheckCircle className="h-4 w-4 text-green-600" />
            ) : (
              <XCircle className="h-4 w-4 text-red-600" />
            )}
          </div>
        </div>

        {/* Scholar Profile Details */}
        {verificationData?.scholarProfile && (
          <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
            <h4 className="font-medium text-green-900 mb-2">Verified Scholar Profile</h4>
            <div className="space-y-1 text-sm">
              <div className="flex justify-between">
                <span className="text-green-700">Name:</span>
                <span className="font-medium">{verificationData.scholarProfile.name}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-green-700">Citations:</span>
                <span className="font-medium">{verificationData.scholarProfile.citations.toLocaleString()}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-green-700">H-Index:</span>
                <span className="font-medium">{verificationData.scholarProfile.hIndex}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-green-700">Institution:</span>
                <span className="font-medium">{verificationData.scholarProfile.institution}</span>
              </div>
            </div>
          </div>
        )}

        {/* Verification Date */}
        {verificationData?.completedAt && (
          <div className="text-xs text-muted-foreground">
            Verified on {new Date(verificationData.completedAt).toLocaleDateString()}
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex space-x-2">
          {onReverify && (
            <Button
              onClick={onReverify}
              variant="outline"
              size="sm"
              className="flex-1"
            >
              <RefreshCw className="h-4 w-4 mr-2" />
              {isFullyVerified ? "Re-verify" : "Complete Verification"}
            </Button>
          )}
        </div>

        {/* Status Messages */}
        {!isFullyVerified && (
          <Alert className={isPartiallyVerified ? "border-yellow-200 bg-yellow-50" : "border-red-200 bg-red-50"}>
            <AlertTriangle className="h-4 w-4" />
            <AlertDescription>
              {isPartiallyVerified 
                ? "Complete your verification to access all platform features including paper submissions and peer reviews."
                : "Verification is required to access full platform features. Please verify your academic credentials."
              }
            </AlertDescription>
          </Alert>
        )}

        {isFullyVerified && (
          <Alert className="border-green-200 bg-green-50">
            <CheckCircle className="h-4 w-4 text-green-600" />
            <AlertDescription className="text-green-800">
              Your academic credentials are fully verified. You have access to all platform features.
            </AlertDescription>
          </Alert>
        )}
      </CardContent>
    </Card>
  );
};

export default VerificationStatus;

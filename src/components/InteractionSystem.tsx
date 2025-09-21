import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { useToast } from "@/hooks/use-toast";
import { 
  MessageSquare, 
  Users, 
  Send, 
  Check, 
  X, 
  Clock, 
  Award,
  UserPlus,
  DollarSign
} from "lucide-react";
import { User, ChatRequest } from "@/data/mockData";

interface InteractionSystemProps {
  currentUser: User;
  otherUsers: User[];
  onSendRequest: (request: Omit<ChatRequest, 'id' | 'createdAt'>) => void;
  onAcceptRequest: (requestId: string) => void;
  onDeclineRequest: (requestId: string) => void;
  className?: string;
}

const InteractionSystem = ({ 
  currentUser, 
  otherUsers, 
  onSendRequest, 
  onAcceptRequest, 
  onDeclineRequest,
  className = "" 
}: InteractionSystemProps) => {
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [pointsCost, setPointsCost] = useState(50);
  const [message, setMessage] = useState("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const { toast } = useToast();

  const handleSendRequest = () => {
    if (!selectedUser || !message.trim()) {
      toast({
        title: "Missing Information",
        description: "Please select a user and enter a message.",
        variant: "destructive",
      });
      return;
    }

    if (pointsCost > currentUser.points) {
      toast({
        title: "Insufficient Points",
        description: "You don't have enough points to send this request.",
        variant: "destructive",
      });
      return;
    }

    onSendRequest({
      fromUserId: currentUser.id,
      fromUserName: currentUser.name,
      toUserId: selectedUser.id,
      pointsCost,
      message: message.trim(),
      status: "pending"
    });

    toast({
      title: "Request Sent",
      description: `Chat request sent to ${selectedUser.name}. Points will be deducted only if accepted.`,
    });

    setIsDialogOpen(false);
    setMessage("");
    setSelectedUser(null);
  };

  const handleAcceptRequest = (request: ChatRequest) => {
    onAcceptRequest(request.id);
    toast({
      title: "Request Accepted",
      description: `You've accepted the chat request from ${request.fromUserName}. ${request.pointsCost} points have been deducted from your account.`,
    });
  };

  const handleDeclineRequest = (request: ChatRequest) => {
    onDeclineRequest(request.id);
    toast({
      title: "Request Declined",
      description: `You've declined the chat request from ${request.fromUserName}.`,
    });
  };

  const pendingRequests = currentUser.chatRequests?.filter(req => req.status === "pending") || [];
  const sentRequests = currentUser.sentRequests?.filter(req => req.status === "pending") || [];

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Send Chat Request */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <UserPlus className="h-5 w-5" />
            <span>Connect with Researchers</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Select Researcher</Label>
                <div className="grid gap-2">
                  {otherUsers.map((user) => (
                    <div
                      key={user.id}
                      className={`p-3 border rounded-lg cursor-pointer transition-colors ${
                        selectedUser?.id === user.id 
                          ? "border-primary bg-primary/5" 
                          : "border-border hover:bg-secondary/50"
                      }`}
                      onClick={() => setSelectedUser(user)}
                    >
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-medium">{user.name}</p>
                          <p className="text-sm text-muted-foreground">{user.institution}</p>
                          <div className="flex items-center space-x-2 mt-1">
                            <Badge variant="outline" className="text-xs">
                              {user.researchArea?.replace('-', ' ').toUpperCase()}
                            </Badge>
                            <Badge variant="trust" className="text-xs">
                              {user.level}
                            </Badge>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="text-sm font-medium text-primary">{user.points} pts</p>
                          <p className="text-xs text-muted-foreground">Trust: {user.trustRating}/5</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="pointsCost">Points to Spend</Label>
                  <div className="relative">
                    <DollarSign className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="pointsCost"
                      type="number"
                      min="10"
                      max={currentUser.points}
                      value={pointsCost}
                      onChange={(e) => setPointsCost(parseInt(e.target.value) || 0)}
                      className="pl-10"
                    />
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Your balance: {currentUser.points.toLocaleString()} points
                  </p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="message">Message</Label>
                  <Textarea
                    id="message"
                    placeholder="Introduce yourself and explain why you'd like to connect..."
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    rows={4}
                  />
                </div>

                <Button 
                  onClick={() => setIsDialogOpen(true)}
                  disabled={!selectedUser || !message.trim() || pointsCost > currentUser.points}
                  className="w-full"
                >
                  <Send className="h-4 w-4 mr-2" />
                  Send Chat Request
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Pending Requests */}
      {pendingRequests.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Clock className="h-5 w-5" />
              <span>Pending Requests ({pendingRequests.length})</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {pendingRequests.map((request) => (
                <div key={request.id} className="p-4 border rounded-lg">
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <p className="font-medium">{request.fromUserName}</p>
                      <p className="text-sm text-muted-foreground">
                        Wants to connect for {request.pointsCost} points
                      </p>
                    </div>
                    <Badge variant="outline" className="text-xs">
                      {new Date(request.createdAt).toLocaleDateString()}
                    </Badge>
                  </div>
                  
                  <p className="text-sm mb-4 p-3 bg-secondary/50 rounded">
                    "{request.message}"
                  </p>
                  
                  <div className="flex space-x-2">
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button size="sm" className="flex-1">
                          <Check className="h-4 w-4 mr-2" />
                          Accept ({request.pointsCost} pts)
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>Accept Chat Request</AlertDialogTitle>
                          <AlertDialogDescription>
                            Are you sure you want to accept this chat request? 
                            {request.pointsCost} points will be deducted from your account.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Cancel</AlertDialogCancel>
                          <AlertDialogAction onClick={() => handleAcceptRequest(request)}>
                            Accept & Deduct Points
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                    
                    <Button 
                      size="sm" 
                      variant="outline" 
                      onClick={() => handleDeclineRequest(request)}
                    >
                      <X className="h-4 w-4 mr-2" />
                      Decline
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Sent Requests */}
      {sentRequests.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Send className="h-5 w-5" />
              <span>Sent Requests ({sentRequests.length})</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {sentRequests.map((request) => (
                <div key={request.id} className="p-4 border rounded-lg">
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="font-medium">Request to {request.toUserId}</p>
                      <p className="text-sm text-muted-foreground">
                        {request.pointsCost} points • {new Date(request.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                    <Badge variant="outline" className="text-xs">
                      Pending
                    </Badge>
                  </div>
                  <p className="text-sm mt-2 p-3 bg-secondary/50 rounded">
                    "{request.message}"
                  </p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Confirmation Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirm Chat Request</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="p-4 bg-secondary/50 rounded-lg">
              <p className="text-sm">
                You're about to send a chat request to <strong>{selectedUser?.name}</strong> 
                for <strong>{pointsCost} points</strong>.
              </p>
              <p className="text-xs text-muted-foreground mt-2">
                Points will only be deducted if they accept your request.
              </p>
            </div>
            <div className="flex space-x-2">
              <Button variant="outline" onClick={() => setIsDialogOpen(false)} className="flex-1">
                Cancel
              </Button>
              <Button onClick={handleSendRequest} className="flex-1">
                <Send className="h-4 w-4 mr-2" />
                Send Request
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default InteractionSystem;

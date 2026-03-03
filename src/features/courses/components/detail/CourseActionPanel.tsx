import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { EnrollmentState } from "../../hooks/useEnrollmentState";
import { CheckCircle2, AlertTriangle, PlayCircle, Award, Loader2 } from "lucide-react";

interface CourseActionPanelProps {
  state: EnrollmentState;
  progressPercentage: number;
  canClose: boolean;
  isProcessing: boolean;
  onEnroll: () => void;
  onClose: () => void;
  onClaim: () => void;
}

export function CourseActionPanel({
  state,
  progressPercentage,
  canClose,
  isProcessing,
  onEnroll,
  onClose,
  onClaim
}: CourseActionPanelProps) {
  
  if (state === "NOT_ENROLLED") {
    return (
      <div className="bg-card border rounded-xl p-6 shadow-sm sticky top-24">
        <h3 className="font-bold text-lg mb-2">Ready to start?</h3>
        <p className="text-muted-foreground text-sm mb-6">
          Enroll in this course to track your progress and earn XP and NFT credentials.
        </p>
        <Button 
          className="w-full font-bold text-md" 
          size="lg" 
          onClick={onEnroll}
          disabled={isProcessing}
        >
          {isProcessing ? <Loader2 className="w-5 h-5 animate-spin mr-2" /> : <PlayCircle className="w-5 h-5 mr-2" />}
          Enroll Now
        </Button>
      </div>
    );
  }

  if (state === "COMPLETED") {
    return (
      <div className="bg-card border-2 border-primary/20 rounded-xl p-6 shadow-sm sticky top-24 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-32 h-32 bg-primary/10 rounded-full blur-3xl -mr-10 -mt-10 pointer-events-none" />
        
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center">
            <CheckCircle2 className="w-6 h-6 text-primary" />
          </div>
          <div>
            <h3 className="font-bold text-lg">Course Completed!</h3>
            <p className="text-primary text-sm font-semibold">100% finished</p>
          </div>
        </div>
        
        <p className="text-muted-foreground text-sm mb-6">
          Congratulations! You've mastered this material. Claim your on-chain credential now.
        </p>

        <Button 
          className="w-full font-bold text-md bg-primary hover:bg-primary/90 text-primary-foreground shadow-lg shadow-primary/20" 
          size="lg" 
          onClick={onClaim}
          disabled={isProcessing}
        >
          {isProcessing ? <Loader2 className="w-5 h-5 animate-spin mr-2" /> : <Award className="w-5 h-5 mr-2" />}
          Claim Credential
        </Button>
      </div>
    );
  }

  if (state === "CLAIMED_CREDENTIAL") {
    return (
      <div className="bg-card border border-green-500/30 rounded-xl p-6 shadow-sm sticky top-24 relative overflow-hidden">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-full bg-green-500/20 flex items-center justify-center">
            <Award className="w-6 h-6 text-green-500" />
          </div>
          <div>
            <h3 className="font-bold text-lg">Credential Claimed</h3>
            <p className="text-green-500 text-sm font-semibold">NFT stored in wallet</p>
          </div>
        </div>
        
        <Button 
          className="w-full font-bold text-md" 
          variant="outline"
          size="lg" 
        >
          View on Explorer
        </Button>
      </div>
    );
  }

  // IN_PROGRESS
  return (
    <div className="bg-card border rounded-xl p-6 shadow-sm sticky top-24">
      <h3 className="font-bold text-lg mb-4">Your Progress</h3>
      
      <div className="space-y-2 mb-6">
        <div className="flex justify-between text-sm font-semibold">
          <span>{Math.round(progressPercentage)}% Complete</span>
        </div>
        <Progress value={progressPercentage} className="h-2.5 w-full" />
      </div>

      <div className="space-y-3">
        <Button className="w-full font-bold text-md" size="lg">
          <PlayCircle className="w-5 h-5 mr-2" />
          Continue Learning
        </Button>

        {canClose && (
          <div className="pt-4 mt-4 border-t border-border/50 text-center">
            <p className="text-xs text-muted-foreground mb-3 flex items-start gap-1.5 text-left">
              <AlertTriangle className="w-4 h-4 text-orange-500 flex-shrink-0" />
              You can close this enrollment to reclaim your Solana rent fees. Progress will be lost.
            </p>
            <Button 
              variant="destructive" 
              className="w-full text-sm font-medium" 
              onClick={onClose}
              disabled={isProcessing}
            >
              {isProcessing ? "Closing..." : "Close Enrollment"}
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}

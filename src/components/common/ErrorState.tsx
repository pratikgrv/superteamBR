import { AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";

interface ErrorStateProps {
  title?: string;
  message?: string;
  onRetry?: () => void;
}

export function ErrorState({ title = "Something went wrong", message = "There was an error loading this data.", onRetry }: ErrorStateProps) {
  return (
    <div className="flex h-[40vh] w-full flex-col items-center justify-center gap-4 text-center">
      <div className="rounded-full bg-destructive/10 p-3">
        <AlertTriangle className="h-6 w-6 text-destructive" />
      </div>
      <div>
        <h3 className="text-lg font-semibold">{title}</h3>
        <p className="text-sm text-muted-foreground mt-1 max-w-[250px] mx-auto">{message}</p>
      </div>
      {onRetry && (
        <Button variant="outline" onClick={onRetry} className="mt-2">
          Try Again
        </Button>
      )}
    </div>
  );
}

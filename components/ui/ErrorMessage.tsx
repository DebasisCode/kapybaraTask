import { AlertCircle } from "lucide-react";
import { cn } from "@/lib/utils";

interface ErrorMessageProps {
  title?: string;
  message: string;
  onRetry?: () => void;
  className?: string;
}

export default function ErrorMessage({ title = "Something went wrong", message, onRetry, className }: ErrorMessageProps) {
  return (
    <div className={cn("rounded-lg border border-destructive bg-destructive/10 p-6", className)}>
      <div className="flex items-start gap-3">
        <AlertCircle className="h-5 w-5 shrink-0 text-destructive" />
        <div className="flex-1">
          <h3 className="font-semibold text-destructive">{title}</h3>
          <p className="mt-1 text-sm text-muted-foreground">{message}</p>
          {onRetry && (
            <button
              onClick={onRetry}
              className="mt-4 rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90 transition-colors"
            >
              Try Again
            </button>
          )}
        </div>
      </div>
    </div>
  );
}







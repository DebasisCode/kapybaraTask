import { cn } from "@/lib/utils";

interface LoadingSkeletonProps {
  className?: string;
}

export function LoadingSkeleton({ className }: LoadingSkeletonProps) {
  return (
    <div className={cn("animate-pulse rounded-md bg-muted", className)} />
  );
}

export function CardSkeleton() {
  return (
    <div className="flex flex-col overflow-hidden rounded-lg border bg-card">
      <div className="aspect-video w-full bg-muted" />
      <div className="flex flex-1 flex-col gap-3 p-6">
        <div className="h-4 w-32 bg-muted" />
        <div className="h-6 w-3/4 bg-muted" />
        <div className="h-4 w-full bg-muted" />
        <div className="h-4 w-2/3 bg-muted" />
        <div className="mt-2 flex gap-2">
          <div className="h-6 w-16 rounded-full bg-muted" />
          <div className="h-6 w-20 rounded-full bg-muted" />
        </div>
      </div>
    </div>
  );
}

export function TableRowSkeleton() {
  return (
    <tr className="animate-pulse">
      <td className="px-4 py-3">
        <div className="h-4 w-48 bg-muted rounded" />
      </td>
      <td className="px-4 py-3">
        <div className="h-4 w-24 bg-muted rounded" />
      </td>
      <td className="px-4 py-3">
        <div className="h-6 w-20 bg-muted rounded-full" />
      </td>
      <td className="px-4 py-3">
        <div className="flex gap-1">
          <div className="h-6 w-16 bg-muted rounded-full" />
          <div className="h-6 w-20 bg-muted rounded-full" />
        </div>
      </td>
      <td className="px-4 py-3">
        <div className="h-4 w-24 bg-muted rounded" />
      </td>
      <td className="px-4 py-3">
        <div className="h-4 w-24 bg-muted rounded" />
      </td>
      <td className="px-4 py-3">
        <div className="flex justify-end gap-2">
          <div className="h-8 w-8 bg-muted rounded" />
          <div className="h-8 w-8 bg-muted rounded" />
          <div className="h-8 w-8 bg-muted rounded" />
        </div>
      </td>
    </tr>
  );
}






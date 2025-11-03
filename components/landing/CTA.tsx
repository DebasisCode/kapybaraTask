import Link from "next/link";
import { cn } from "@/lib/utils";

export default function CTA() {
  return (
    <section className="mx-auto max-w-7xl px-6 py-24 md:px-8">
      <div className="mx-auto max-w-2xl text-center">
        <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">Ready to start writing?</h2>
        <p className="mt-6 text-lg leading-8 text-muted-foreground">
          Join our platform and start sharing your thoughts with the world today.
        </p>
        <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row sm:gap-x-6">
          <Link
            href="/posts/new"
            className={cn(
              "rounded-md bg-primary px-6 py-3 text-base font-semibold text-primary-foreground",
              "hover:bg-primary/90",
              "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
              "transition-colors",
              "w-full sm:w-auto text-center"
            )}
          >
            Create Your First Post
          </Link>
          <Link
            href="/blog"
            className={cn(
              "text-base font-semibold leading-6 text-foreground",
              "hover:text-primary",
              "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
              "transition-colors",
              "w-full sm:w-auto text-center"
            )}
          >
            Browse Posts
          </Link>
        </div>
      </div>
    </section>
  );
}


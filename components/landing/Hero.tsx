import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";

export default function Hero() {
  return (
    <section className="mx-auto max-w-7xl px-6 py-24 md:px-8 md:py-32">
      <div className="mx-auto max-w-2xl text-center">
        <h1 className="text-4xl font-bold tracking-tight sm:text-6xl">
          Share your thoughts with the world
        </h1>
        <p className="mt-6 text-lg leading-8 text-muted-foreground">
          A modern blogging platform built for creators. Write, publish, and share your stories with
          a beautiful, responsive design.
        </p>
        <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row sm:gap-x-6">
          <Link
            href="/blog"
            className={cn(
              "rounded-md bg-primary px-6 py-3 text-base font-semibold text-primary-foreground",
              "hover:bg-primary/90",
              "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
              "transition-colors",
              "w-full sm:w-auto text-center"
            )}
          >
            Explore Blog
          </Link>
          <Link
            href="/posts/new"
            className={cn(
              "text-base font-semibold leading-6 text-foreground",
              "hover:text-primary",
              "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
              "transition-colors",
              "flex items-center justify-center gap-2",
              "w-full sm:w-auto"
            )}
          >
            Start Writing <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </div>
    </section>
  );
}


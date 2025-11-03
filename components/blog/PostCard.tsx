import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { cn } from "@/lib/utils";
import type { RouterOutputs } from "@/lib/types";

type Post = RouterOutputs["post"]["list"]["items"][number];

const categoryColors: Record<string, string> = {
  Design: "bg-blue-100 text-blue-800",
  Research: "bg-pink-100 text-pink-800",
  Software: "bg-green-100 text-green-800",
  Programming: "bg-purple-100 text-purple-800",
  Leadership: "bg-yellow-100 text-yellow-800",
  Management: "bg-orange-100 text-orange-800",
  Product: "bg-indigo-100 text-indigo-800",
  Frameworks: "bg-teal-100 text-teal-800",
  Tools: "bg-cyan-100 text-cyan-800",
  SaaS: "bg-violet-100 text-violet-800",
  Podcasts: "bg-rose-100 text-rose-800",
  "Customer Success": "bg-emerald-100 text-emerald-800",
  Presentation: "bg-purple-100 text-purple-800",
};

function getCategoryColor(name: string): string {
  return categoryColors[name] ?? "bg-gray-100 text-gray-800";
}

function formatDate(date: Date | null): string {
  if (!date) return "";
  return new Intl.DateTimeFormat("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
  }).format(new Date(date));
}

function truncateText(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength).trim() + "...";
}

export default function PostCard({ post, featured = false }: { post: Post; featured?: boolean }) {
  const formattedDate = formatDate(post.publishedAt ?? post.createdAt);
  const snippet = truncateText(post.content.replace(/[#*`]/g, ""), featured ? 120 : 80);

  return (
    <Link
      href={`/blog/${post.slug}`}
      className={cn(
        "group flex flex-col overflow-hidden rounded-lg border bg-card transition-shadow hover:shadow-md",
        featured ? "md:col-span-2 md:row-span-2" : ""
      )}
    >
      <div className={cn("relative aspect-video w-full bg-muted", featured && "md:aspect-auto md:h-64")}>
        <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-purple-100 to-blue-100">
          <span className="text-4xl font-bold text-muted-foreground/20">Blog</span>
        </div>
      </div>

      <div className="flex flex-1 flex-col gap-3 p-6">
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <span>{post.authorName}</span>
          <span>•</span>
          <span>{formattedDate}</span>
        </div>

        <div className="flex items-start justify-between gap-4">
          <h3 className="flex-1 text-lg font-semibold leading-tight group-hover:text-primary transition-colors">
            {post.title}
          </h3>
          <ArrowUpRight className="h-5 w-5 shrink-0 text-muted-foreground group-hover:text-primary transition-colors" />
        </div>

        <p className="line-clamp-2 text-sm text-muted-foreground">{snippet}</p>

        {post.categories.length > 0 && (
          <div className="mt-auto flex flex-wrap gap-2">
            {post.categories.map((cat) => (
              <span
                key={cat.id}
                className={cn(
                  "rounded-full px-3 py-1 text-xs font-medium",
                  getCategoryColor(cat.name)
                )}
              >
                {cat.name}
              </span>
            ))}
          </div>
        )}
      </div>
    </Link>
  );
}


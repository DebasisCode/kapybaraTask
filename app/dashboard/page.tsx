import type { Metadata } from "next";
import Container from "@/components/layout/Container";
import PostTable from "@/components/dashboard/PostTable";
import { createCaller } from "@/lib/trpc/server";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Dashboard",
  description: "Manage your blog posts, categories, and content from the dashboard.",
  robots: {
    index: false,
    follow: false,
  },
};

export default async function DashboardPage() {
  const caller = await createCaller();
  
  // Optimize: Fetch posts and stats in parallel instead of filtering client-side
  const [postsData, stats] = await Promise.all([
    caller.post.list({ page: 1, limit: 50, publishedOnly: false }),
    caller.post.stats(),
  ]);

  return (
    <Container>
      <div className="mx-auto max-w-6xl">
        <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
            <p className="mt-2 text-muted-foreground">Manage your blog posts and content</p>
          </div>
          <Link
            href="/posts/new"
            className="rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90 transition-colors w-full sm:w-auto text-center"
          >
            Create New Post
          </Link>
        </div>

        <div className="mb-6 grid grid-cols-1 gap-4 md:grid-cols-3">
          <div className="rounded-lg border bg-card p-6">
            <div className="text-sm font-medium text-muted-foreground">Total Posts</div>
            <div className="mt-2 text-3xl font-bold">{stats.total}</div>
          </div>
          <div className="rounded-lg border bg-card p-6">
            <div className="text-sm font-medium text-muted-foreground">Published</div>
            <div className="mt-2 text-3xl font-bold text-green-600">{stats.published}</div>
          </div>
          <div className="rounded-lg border bg-card p-6">
            <div className="text-sm font-medium text-muted-foreground">Drafts</div>
            <div className="mt-2 text-3xl font-bold text-gray-600">{stats.drafts}</div>
          </div>
        </div>

        <PostTable initialPosts={postsData.items} />
      </div>
    </Container>
  );
}


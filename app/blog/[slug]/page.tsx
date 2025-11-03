import { notFound } from "next/navigation";
import Container from "@/components/layout/Container";
import { createCaller } from "@/lib/trpc/server";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

function formatDate(date: Date | null): string {
	if (!date) return "";
	return new Intl.DateTimeFormat("en-GB", {
		day: "numeric",
		month: "short",
		year: "numeric",
	}).format(new Date(date));
}

import type { Metadata } from "next";

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
	const { slug } = await params;
	const caller = await createCaller();
	const post = await caller.post.getBySlug({ slug });
	if (!post) {
		return {
			title: "Post not found",
			description: "The blog post you're looking for doesn't exist.",
		};
	}

	const description = post.content.replace(/[#*`]/g, "").slice(0, 160).trim() + "...";
	const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";

	return {
		title: post.title,
		description,
		openGraph: {
			title: post.title,
			description,
			type: "article",
			publishedTime: post.publishedAt?.toISOString(),
			authors: [post.authorName],
			tags: post.categories.map((cat) => cat.name),
		},
		twitter: {
			card: "summary_large_image",
			title: post.title,
			description,
		},
		alternates: {
			canonical: `${baseUrl}/blog/${slug}`,
		},
	};
}

export default async function PostPage({ params }: { params: Promise<{ slug: string }> }) {
	const { slug } = await params;
	const caller = await createCaller();
	const post = await caller.post.getBySlug({ slug });
	if (!post) notFound();

	const date = formatDate(post.publishedAt ?? post.createdAt);

	return (
		<Container>
			<article className="mx-auto max-w-3xl">
				<header className="mb-8">
					<h1 className="mb-3 text-3xl font-bold tracking-tight">{post.title}</h1>
					<p className="text-sm text-muted-foreground">
						{post.authorName} • {date}
					</p>
					{post.categories.length > 0 && (
						<div className="mt-4 flex flex-wrap gap-2">
							{post.categories.map((cat) => (
								<span key={cat.categoryId} className="rounded-full bg-muted px-3 py-1 text-xs font-medium text-muted-foreground">
									{cat.name}
								</span>
							))}
						</div>
					)}
				</header>

				<div className="prose prose-zinc max-w-none">
					<ReactMarkdown remarkPlugins={[remarkGfm]}>{post.content}</ReactMarkdown>
				</div>
			</article>
		</Container>
	);
}


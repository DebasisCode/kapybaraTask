import { notFound } from "next/navigation";
import Container from "@/components/layout/Container";
import EditPostForm from "./EditPostForm";
import { createCaller } from "@/lib/trpc/server";

export default async function EditPostPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const caller = await createCaller();
  const post = await caller.post.getById({ id });

  if (!post) {
    notFound();
  }

  return (
    <Container>
      <div className="mx-auto max-w-3xl">
        <h1 className="mb-8 text-3xl font-bold tracking-tight">Edit Post</h1>
        <EditPostForm post={post} />
      </div>
    </Container>
  );
}

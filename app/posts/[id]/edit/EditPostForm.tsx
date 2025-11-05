"use client";

import PostForm from "@/components/forms/PostForm";
import type { RouterOutputs } from "@/lib/types";

type Post = RouterOutputs["post"]["getById"];

interface EditPostFormProps {
  post: Post;
}

export default function EditPostForm({ post }: EditPostFormProps) {
  return <PostForm post={post} mode="edit" />;
}







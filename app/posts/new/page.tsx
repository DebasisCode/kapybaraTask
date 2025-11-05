import Container from "@/components/layout/Container";
import PostForm from "@/components/forms/PostForm";

export default function NewPostPage() {
  return (
    <Container>
      <div className="mx-auto max-w-3xl">
        <h1 className="mb-8 text-3xl font-bold tracking-tight">Create New Post</h1>
        <PostForm mode="create" />
      </div>
    </Container>
  );
}







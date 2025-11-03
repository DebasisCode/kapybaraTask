import Container from "@/components/layout/Container";
import CategoryList from "@/components/categories/CategoryList";
import { createCaller } from "@/lib/trpc/server";

export default async function CategoriesPage() {
  const caller = await createCaller();
  const categoriesData = await caller.category.list({ page: 1, limit: 50 });

  return (
    <Container>
      <div className="mx-auto max-w-4xl">
        <CategoryList categories={categoriesData.items} />
      </div>
    </Container>
  );
}





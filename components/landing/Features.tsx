import { FileText, Tag, Edit, Search, Layout, Zap } from "lucide-react";
import { cn } from "@/lib/utils";

const features = [
  {
    name: "Rich Content Editor",
    description: "Write your posts using Markdown with a live preview. Simple yet powerful editing experience.",
    icon: Edit,
  },
  {
    name: "Category Management",
    description: "Organize your content with categories. Easy to create, edit, and manage your taxonomy.",
    icon: Tag,
  },
  {
    name: "Draft & Publish",
    description: "Work on drafts privately and publish when ready. Full control over your content lifecycle.",
    icon: FileText,
  },
  {
    name: "Responsive Design",
    description: "Your blog looks great on any device. Mobile-first approach ensures perfect viewing everywhere.",
    icon: Layout,
  },
  {
    name: "Fast Performance",
    description: "Built with Next.js for lightning-fast page loads. Optimized for the best user experience.",
    icon: Zap,
  },
  {
    name: "Easy Discovery",
    description: "Browse posts by category, search functionality, and intuitive navigation. Find what you need quickly.",
    icon: Search,
  },
];

export default function Features() {
  return (
    <section className="mx-auto max-w-7xl px-6 py-24 md:px-8">
      <div className="mx-auto max-w-2xl text-center">
        <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">Everything you need</h2>
        <p className="mt-2 text-lg leading-8 text-muted-foreground">
          All the tools you need to create and manage your blog content.
        </p>
      </div>
      <div className="mx-auto mt-16 max-w-2xl sm:mt-20 lg:mt-24 lg:max-w-none">
        <dl className="grid max-w-xl grid-cols-1 gap-x-8 gap-y-16 lg:max-w-none lg:grid-cols-3">
          {features.map((feature) => {
            const Icon = feature.icon;
            return (
              <div key={feature.name} className="flex flex-col">
                <dt className="flex items-center gap-x-3 text-base font-semibold leading-7">
                  <div className={cn("flex h-10 w-10 items-center justify-center rounded-lg bg-primary")}>
                    <Icon className="h-6 w-6 text-primary-foreground" aria-hidden="true" />
                  </div>
                  {feature.name}
                </dt>
                <dd className="mt-4 flex flex-auto flex-col text-base leading-7 text-muted-foreground">
                  <p className="flex-auto">{feature.description}</p>
                </dd>
              </div>
            );
          })}
        </dl>
      </div>
    </section>
  );
}






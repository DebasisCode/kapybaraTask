import type { Metadata } from "next";

interface GenerateMetadataProps {
  title: string;
  description: string;
  path?: string;
  image?: string;
}

export function generateMetadata({
  title,
  description,
  path = "",
  image,
}: GenerateMetadataProps): Metadata {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";
  const url = `${baseUrl}${path}`;

  return {
    title: `${title} | Blog Platform`,
    description,
    openGraph: {
      title: `${title} | Blog Platform`,
      description,
      url,
      siteName: "Blog Platform",
      images: image ? [{ url: image }] : [],
      locale: "en_US",
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title: `${title} | Blog Platform`,
      description,
      images: image ? [image] : [],
    },
    alternates: {
      canonical: url,
    },
  };
}







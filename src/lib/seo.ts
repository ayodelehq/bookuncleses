import type { Metadata } from "next";
import { siteConfig } from "@/lib/site-config";

// Child pages pass a bare title ("Photos & Videos") — the root layout's
// title.template appends "— Bookuncleses" for the <title> tag, but
// openGraph/twitter titles aren't covered by that template, so we build the
// full string once here to keep shared links consistent with the tab title.
export function pageMetadata({
  title,
  description,
  path,
}: {
  title: string;
  description: string;
  path: string;
}): Metadata {
  const fullTitle = `${title} — ${siteConfig.name}`;

  return {
    title,
    description,
    alternates: { canonical: path },
    openGraph: {
      title: fullTitle,
      description,
      url: path,
    },
    twitter: {
      title: fullTitle,
      description,
    },
  };
}

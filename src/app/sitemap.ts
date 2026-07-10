import type { MetadataRoute } from "next";
import { getPublishedEvents } from "@/lib/data/events";

const baseUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const events = await getPublishedEvents();

  const staticRoutes: MetadataRoute.Sitemap = [
    { url: baseUrl, changeFrequency: "weekly", priority: 1 },
    { url: `${baseUrl}/bookings`, changeFrequency: "monthly", priority: 0.9 },
    { url: `${baseUrl}/photos`, changeFrequency: "weekly", priority: 0.8 },
    { url: `${baseUrl}/tickets`, changeFrequency: "weekly", priority: 0.8 },
    { url: `${baseUrl}/rate-card`, changeFrequency: "monthly", priority: 0.8 },
    { url: `${baseUrl}/contact`, changeFrequency: "yearly", priority: 0.5 },
    { url: `${baseUrl}/tickets/lookup`, changeFrequency: "yearly", priority: 0.3 },
  ];

  const eventRoutes: MetadataRoute.Sitemap = events.map((event) => ({
    url: `${baseUrl}/tickets/${event.slug}`,
    lastModified: event.created_at,
    changeFrequency: "weekly",
    priority: 0.6,
  }));

  return [...staticRoutes, ...eventRoutes];
}

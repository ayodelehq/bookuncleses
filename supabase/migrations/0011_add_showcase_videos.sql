-- Real event footage the client provided, added to the portfolio gallery.
-- Both are direct Cloudinary-hosted video files (not YouTube/Vimeo embeds) —
-- the gallery's video_embed handling was extended in code
-- (src/lib/media.ts + PortfolioGallery.tsx) to render these as native
-- <video> players instead of assuming an iframe embed.

insert into gallery_items (category, media_type, url, caption, sort_order) values
  ('hosted_events', 'video_embed',
   'https://res.cloudinary.com/dzomdloyf/video/upload/v1783521389/Naturally_I_love_weddings_and_wedding_parties._Extra_points_if_I_m_friends_with_the_couple._Ima_gn5kss.mp4',
   'Event Hosting', 0),
  ('corporate', 'video_embed',
   'https://res.cloudinary.com/dzomdloyf/video/upload/v1783521631/Sesmo_ouut3d.mp4',
   'Brand Promotion', 0);

/** True for a direct video file URL (e.g. Cloudinary-hosted .mp4), false for an
 * external embed URL (YouTube/Vimeo) that needs an iframe player instead. */
export function isDirectVideoUrl(url: string): boolean {
  return /\.(mp4|webm|mov|m4v)(\?.*)?$/i.test(url);
}

/** For a Cloudinary-hosted video URL, returns an auto-generated JPG thumbnail
 * (first frame) so gallery tiles can show a real preview instead of a flat
 * placeholder. Returns null for anything that isn't a Cloudinary video URL. */
export function getCloudinaryVideoThumbnail(url: string): string | null {
  const match = url.match(/^(https:\/\/res\.cloudinary\.com\/[^/]+\/video\/upload\/)(.+)\.\w+$/);
  if (!match) return null;
  return `${match[1]}so_0/${match[2]}.jpg`;
}

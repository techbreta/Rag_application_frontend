/**
 * Generates an SEO-friendly URL slug from an image prompt and its unique ID.
 * Example:
 *   prompt: "A cozy modern workspace with glowing laptop"
 *   id: "6991a551721c72449fcd9f70"
 *   returns: "a-cozy-modern-workspace-with-glowing-laptop-6991a551721c72449fcd9f70"
 */
export function createPromptSlug(prompt: string, id: string): string {
  if (!prompt) return id;

  const cleanPrompt = prompt
    .toLowerCase()
    .replace(/[^\w\s-]/g, "") // remove non-alphanumeric chars
    .trim()
    .replace(/\s+/g, "-") // convert spaces to single hyphen
    .replace(/-+/g, "-") // collapse multiple hyphens
    .slice(0, 60) // keep slug length reasonable
    .replace(/-$/, ""); // trim trailing hyphen

  return cleanPrompt ? `${cleanPrompt}-${id}` : id;
}

/**
 * Extracts the 24-hex-character MongoDB ObjectId from a slug.
 * Supports both full slugs ("my-slug-6991a551721c72449fcd9f70")
 * and direct IDs ("6991a551721c72449fcd9f70").
 */
export function extractIdFromSlug(slug: string): string {
  if (!slug) return "";
  const match = slug.match(/[0-9a-fA-F]{24}$/);
  return match ? match[0] : slug;
}


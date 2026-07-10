// Only allow same-origin, relative paths as post-login redirects — an
// absolute or protocol-relative `next` value would let a crafted login
// link forward the user to an external site after they authenticate.
export function getSafeRedirect(next: string | null, fallback = "/") {
  if (!next || !next.startsWith("/") || next.startsWith("//")) {
    return fallback;
  }
  return next;
}

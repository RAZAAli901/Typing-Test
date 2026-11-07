/**
 * Google AdSense Route Eligibility Module
 *
 * Strict policy enforcement ensuring advertising scripts and ad units
 * are strictly restricted to publisher content pages.
 *
 * Allowed:
 *  - `/` (Home landing page)
 *  - `/about` (System specs & operator details)
 *  - `/learn` (Educational hub)
 *  - `/learn/*` (Educational guides and glossary)
 *
 * Prohibited (Never Eligible):
 *  - `/play` (Interactive typing area / accidental click policy risk)
 *  - `/leaderboard` (Dynamic data ranking tables)
 *  - `/stats` (Personal analytics metrics)
 *  - `/login`, `/signup`, `/verify` (Authentication & transactional flows)
 *  - `/profile` (Account settings & file upload)
 *  - `/privacy`, `/terms`, `/cookies`, `/editorial-policy` (Legal & trust pages)
 *  - `/contact` (Support directory)
 *  - `/_not-found`, 404, error, or unmapped paths
 */

const ALLOWED_EXACT_ROUTES = new Set([
  "/",
  "/about",
  "/learn",
]);

export function isRouteEligibleForAds(pathname: string | null | undefined): boolean {
  if (!pathname) return false;

  // Clean trailing slashes except for root
  const normalized = pathname.length > 1 && pathname.endsWith("/")
    ? pathname.slice(0, -1)
    : pathname;

  if (ALLOWED_EXACT_ROUTES.has(normalized)) {
    return true;
  }

  // Allow sub-routes of /learn/ (e.g. /learn/how-to-improve-typing-speed, /learn/glossary)
  if (normalized.startsWith("/learn/")) {
    const slug = normalized.replace("/learn/", "");
    // Must have a non-empty sub-segment and not contain forbidden nested paths
    return slug.length > 0 && !slug.includes("/");
  }

  // All other paths (auth, legal, play, stats, leaderboard, error, api) default to false
  return false;
}

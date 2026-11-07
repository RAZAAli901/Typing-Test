import { howToImproveTypingSpeedGuide } from "./how-to-improve-typing-speed";
import { touchTypingForBeginnersGuide } from "./touch-typing-for-beginners";
import { Guide } from "./types";

export const GUIDES: Guide[] = [
  howToImproveTypingSpeedGuide,
  touchTypingForBeginnersGuide,
];

export function getAllGuides(): Guide[] {
  return GUIDES;
}

export function getGuideBySlug(slug: string): Guide | undefined {
  return GUIDES.find((g) => g.slug === slug);
}

export function getRelatedGuides(currentSlug: string, count = 3): Guide[] {
  const current = getGuideBySlug(currentSlug);
  if (!current) return [];

  const explicitRelated = current.relatedSlugs
    .map((slug) => getGuideBySlug(slug))
    .filter((g): g is Guide => Boolean(g));

  if (explicitRelated.length >= count) {
    return explicitRelated.slice(0, count);
  }

  const others = GUIDES.filter(
    (g) => g.slug !== currentSlug && !explicitRelated.some((r) => r.slug === g.slug)
  );

  return [...explicitRelated, ...others].slice(0, count);
}

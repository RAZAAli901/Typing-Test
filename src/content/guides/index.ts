import { choosingAKeyboardForTypingGuide } from "./choosing-a-keyboard-for-typing";
import { homeRowAndFingerPlacementGuide } from "./home-row-and-finger-placement";
import { howToImproveTypingSpeedGuide } from "./how-to-improve-typing-speed";
import { qwertyDvorakColemakGuide } from "./qwerty-dvorak-colemak";
import { touchTypingForBeginnersGuide } from "./touch-typing-for-beginners";
import { typingAccuracyVsSpeedGuide } from "./typing-accuracy-vs-speed";
import { typingPostureAndErgonomicsGuide } from "./typing-posture-and-ergonomics";
import { whatIsAGoodTypingSpeedGuide } from "./what-is-a-good-typing-speed";
import { whatIsWpmGuide } from "./what-is-wpm";
import { Guide } from "./types";

export const GUIDES: Guide[] = [
  howToImproveTypingSpeedGuide,
  touchTypingForBeginnersGuide,
  whatIsWpmGuide,
  typingAccuracyVsSpeedGuide,
  whatIsAGoodTypingSpeedGuide,
  homeRowAndFingerPlacementGuide,
  typingPostureAndErgonomicsGuide,
  qwertyDvorakColemakGuide,
  choosingAKeyboardForTypingGuide,
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

import { IconName } from "@/components/Icon";

export interface TypingModeInfo {
  id: string;
  name: string;
  desc: string;
  icon: IconName;
  isCustom?: boolean;
}

export const TYPING_MODES: TypingModeInfo[] = [
  {
    id: "standard",
    name: "Standard Mode",
    desc: "Focuses on clean, fluid English text passages with balanced sentence structures. Great for checking your baseline speed.",
    icon: "standard",
  },
  {
    id: "numbers",
    name: "Numbers Mode",
    desc: "Presents batch reports, ambient decimals, serial numbers, and statistics. Essential training for bookkeeping and data entry fields.",
    icon: "numbers",
  },
  {
    id: "quotes",
    name: "Quotes Mode",
    desc: "Features famous quotes and philosophy excerpts. Exercises capital letters, basic spacing, and varying prompt structures.",
    icon: "quotes",
  },
  {
    id: "code-snippet",
    name: "Code Snippet Mode",
    desc: "Loads real code snippets (functions, variables, loops) with heavy braces, brackets, logic operators, and indentations. Perfect for developers.",
    icon: "code",
  },
  {
    id: "punctuation",
    name: "Punctuation Mode",
    desc: "A text prompt saturated with complex symbols, hyphens, dashes, exclamation points, and brackets. Excellent for keyboard layout mastery.",
    icon: "punctuation",
  },
  {
    id: "random-words",
    name: "Random Words Mode",
    desc: "Generates randomized word sequences that challenge predictive muscle memory and force pure character-by-character sight reading.",
    icon: "random",
  },
  {
    id: "daily-challenge",
    name: "Daily Challenge Mode",
    desc: "A globally synchronized daily test prompt refreshed every 24 hours. All participants type identical text to compete on fair leaderboards.",
    icon: "daily",
  },
  {
    id: "custom",
    name: "Custom Text Mode",
    desc: "Allows pasting or loading your own practice materials, legal briefs, technical manuscripts, or study notes for targeted training.",
    icon: "custom",
    isCustom: true,
  },
];

export const TOTAL_MODES_COUNT = TYPING_MODES.length; // 8 modes
export const BUILT_IN_MODES_COUNT = TYPING_MODES.filter((m) => !m.isCustom).length; // 7

import { Guide } from "./types";

export const howTypeMasterScoresWorkGuide: Guide = {
  slug: "how-typemaster-scores-work",
  title: "How TypeMaster Scores Work: The Engine Explained",
  description:
    "An inside look at TypeMaster's scoring engine: Net WPM, accuracy ratios, raw CPM, score validation telemetry, and leaderboard integrity.",
  updatedDate: "2026-11-07",
  readingMinutes: 5,
  practiceMode: "standard",
  practiceModeLabel: "Standard Mode",
  relatedSlugs: [
    "what-is-wpm",
    "typing-accuracy-vs-speed",
    "typing-tests-for-job-applications",
  ],
  sections: [
    {
      heading: "The Engineering Behind High-Precision Telemetry",
      paragraphs: [
        "In casual typing apps, speed calculations are often rudimentary: a basic timer starts on the first keypress and divides crude word counts by elapsed seconds when the user presses Enter. While this basic approach suffices for personal amusement, it is easily distorted by variable word lengths, uncorrected typos, and automated client-side tampering.",
        "TypeMaster was engineered from the ground up to provide mathematically rigorous, tamper-resistant keystroke telemetry. Every keydown event, duration interval, and error sequence is recorded with millisecond precision, ensuring that the metrics displayed on your terminal and recorded to global leaderboards reflect genuine human transcription capability.",
      ],
    },
    {
      heading: "Gross WPM, Net WPM, and the 5-Character Rule",
      paragraphs: [
        "At the heart of the TypeMaster scoring pipeline is the standardized five-character word rule. In typography and international transcription benchmarks, one standard word equals exactly five keystrokes, including letters, spaces, and punctuation symbols. If you type a 250-character excerpt, that sequence represents exactly 50 standard words, regardless of the individual vocabulary lengths within the passage.",
        "Gross WPM measures your absolute mechanical throughput: total registered characters divided by five, divided by the test duration in minutes. Net WPM, however, is the metric that governs leaderboard rankings. Net WPM evaluates strictly the volume of correct characters submitted. Uncorrected mistakes or skipped characters are penalized, ensuring that reckless speed without precision never claims the top spot.",
      ],
    },
    {
      heading: "Accuracy Calculation and Real-Time Error Penalties",
      paragraphs: [
        "TypeMaster calculates keystroke accuracy as a pure percentage of precision: the total number of correct keystrokes divided by total registered keystrokes, multiplied by 100. If you complete a test with 490 correct strikes out of 500 total interactions, your accuracy registers at precisely 98.0%.",
        "During active sessions, TypeMaster provides immediate visual and audio feedback for mistakes. Erroneous characters are highlighted instantly in contrasting amber, signaling to your brain that a motor misalignment occurred. Because maintaining a rhythm without pausing for catastrophic backspacing is a critical typing skill, our scoring engine incentivizes clean first-pass precision over erratic correction bursts.",
      ],
    },
    {
      heading: "Anti-Cheat Integrity and Server-Side Validation",
      paragraphs: [
        "Online leaderboards are notoriously vulnerable to automated scripts, macros, and client-side browser memory manipulation. To ensure absolute competitive integrity, TypeMaster utilizes server-side validation on every submitted score before it can appear on public leaderboards.",
        "When you finish a test, the application submits a detailed telemetry payload containing total keystrokes, error counts, elapsed timestamps, and cryptographically verified session markers. The server independently verifies that the mechanical speed does not violate physiological human limits (such as superhuman 300+ WPM rates) and verifies that the character count matches the prescribed prompt text. Malformed, forged, or impossible payloads are immediately rejected.",
      ],
    },
    {
      heading: "Interpreting Your Performance Breakdown",
      paragraphs: [
        "Upon completing any TypeMaster test, you receive a detailed terminal breakdown: Net WPM, Gross WPM, Accuracy Percentage, Characters Per Minute (CPM), and elapsed duration. Use these metrics as diagnostic tools to guide your deliberate training routine.",
        "If your Gross WPM is significantly higher than your Net WPM, you are rushing beyond your control threshold and need to slow down to stabilize accuracy above 98%. If your accuracy is already 99% or 100% but your speed feels stagnant, you are primed to push into speed intervals. By tracking your official scores across our 8 distinct test modes, you can observe your skills systematically compounding over time.",
      ],
    },
  ],
};

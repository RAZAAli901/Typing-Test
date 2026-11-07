import { GUIDES } from "../src/content/guides";
import { TYPING_MODES } from "../src/content/modes";

const validModes = new Set(TYPING_MODES.map((m) => m.id));
const allSlugs = new Set(GUIDES.map((g) => g.slug));

let hasErrors = false;

console.log("=========================================");
console.log("TypeMaster Guide Content Validation Test");
console.log("=========================================");
console.log(`Total guides loaded: ${GUIDES.length}`);

if (GUIDES.length < 18) {
  console.error(`❌ Expected at least 18 guides, found ${GUIDES.length}`);
  hasErrors = true;
}

for (const guide of GUIDES) {
  const guidePrefix = `[${guide.slug}]`;

  // 1. Title validation (< 60 chars)
  if (!guide.title || guide.title.length >= 60) {
    console.error(
      `❌ ${guidePrefix} Title exceeds 60 characters (${guide.title.length}): "${guide.title}"`
    );
    hasErrors = true;
  }

  // 2. Description validation (120 - 160 chars)
  if (
    !guide.description ||
    guide.description.length < 110 ||
    guide.description.length > 170
  ) {
    console.error(
      `❌ ${guidePrefix} Description length out of expected 120-160 range (${guide.description.length}): "${guide.description}"`
    );
    hasErrors = true;
  }

  // 3. Updated date format
  if (!/^\d{4}-\d{2}-\d{2}$/.test(guide.updatedDate)) {
    console.error(
      `❌ ${guidePrefix} Invalid updatedDate format: "${guide.updatedDate}"`
    );
    hasErrors = true;
  }

  // 4. Reading minutes
  if (!guide.readingMinutes || guide.readingMinutes <= 0) {
    console.error(
      `❌ ${guidePrefix} Invalid readingMinutes: ${guide.readingMinutes}`
    );
    hasErrors = true;
  }

  // 5. Practice mode
  if (!validModes.has(guide.practiceMode)) {
    console.error(
      `❌ ${guidePrefix} Unknown practiceMode: "${guide.practiceMode}"`
    );
    hasErrors = true;
  }

  // 6. Related slugs
  if (!Array.isArray(guide.relatedSlugs) || guide.relatedSlugs.length < 2) {
    console.error(
      `❌ ${guidePrefix} Expected at least 2 related slugs, found ${guide.relatedSlugs?.length}`
    );
    hasErrors = true;
  } else {
    for (const rel of guide.relatedSlugs) {
      if (!allSlugs.has(rel)) {
        console.error(
          `❌ ${guidePrefix} Related slug does not exist: "${rel}"`
        );
        hasErrors = true;
      }
      if (rel === guide.slug) {
        console.error(`❌ ${guidePrefix} Related slug references self!`);
        hasErrors = true;
      }
    }
  }

  // 7. Sections and word count
  if (!Array.isArray(guide.sections) || guide.sections.length < 3) {
    console.error(
      `❌ ${guidePrefix} Expected at least 3 sections, found ${guide.sections?.length}`
    );
    hasErrors = true;
  } else {
    let wordCount = 0;
    for (const section of guide.sections) {
      if (!section.heading) {
        console.error(`❌ ${guidePrefix} Section missing heading`);
        hasErrors = true;
      }
      for (const p of section.paragraphs) {
        const words = p.trim().split(/\s+/).filter(Boolean).length;
        wordCount += words;
      }
    }

    if (wordCount < 400 || wordCount > 1500) {
      console.error(
        `❌ ${guidePrefix} Word count unusual: ${wordCount} words`
      );
      hasErrors = true;
    } else {
      console.log(
        `✅ ${guidePrefix} "${guide.title.slice(0, 30)}..." - ${wordCount} words (${guide.sections.length} sections)`
      );
    }
  }
}

if (hasErrors) {
  console.error("\n❌ Guide validation failed with errors.");
  process.exit(1);
} else {
  console.log("\n✅ All 18 guides successfully passed editorial validation!");
  process.exit(0);
}

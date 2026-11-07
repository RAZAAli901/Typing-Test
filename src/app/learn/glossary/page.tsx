import type { Metadata } from "next";
import Link from "next/link";
import Breadcrumbs from "@/components/Breadcrumbs";
import { pageMetadata } from "@/lib/seo";
import { OPERATOR_NAME, SITE_URL } from "@/lib/site";

export const metadata: Metadata = pageMetadata({
  title: "Touch Typing & Keyboard Glossary: 25+ Key Terms",
  description:
    "Comprehensive glossary of touch typing, mechanical keyboard terminology, ergonomics, ergonomics, and speed metrics from WPM to actuation point.",
  path: "/learn/glossary",
});

interface GlossaryTerm {
  term: string;
  pronunciation?: string;
  category: "Metrics" | "Technique" | "Hardware" | "Ergonomics";
  definition: string;
  context: string;
}

const GLOSSARY_TERMS: GlossaryTerm[] = [
  {
    term: "Actuation Point",
    category: "Hardware",
    definition:
      "The physical depth at which a key switch registers an electrical connection and transmits a keystroke to the operating system, occurring before the key bottoms out.",
    context:
      "Most mechanical switches actuate at approximately 1.8mm to 2.0mm of a 4.0mm travel distance, allowing typists to register keystrokes without bottoming out.",
  },
  {
    term: "Actuation Force",
    category: "Hardware",
    definition:
      "The amount of downward pressure, typically measured in grams (g) or centinewtons (cN), required to depress a switch to its electrical actuation point.",
    context:
      "Lighter switches (35g–45g) require minimal effort but can increase accidental presses; medium switches (50g–60g) provide balanced resistance for typing stability.",
  },
  {
    term: "Bottoming Out",
    category: "Technique",
    definition:
      "The act of pressing a keycap completely downward until the stem physically strikes the switch housing or keyboard backplate.",
    context:
      "Bottoming out produces maximum auditory volume and finger impact vibration. Learning to release keys near actuation reduces finger strain.",
  },
  {
    term: "Carpal Tunnel",
    category: "Ergonomics",
    definition:
      "A narrow passageway of ligament and bones at the base of the wrist through which the median nerve and finger flexor tendons travel.",
    context:
      "Resting wrists heavily on hard desk edges while typing bends the hands upward, compressing the carpal tunnel and potentially inducing nerve inflammation.",
  },
  {
    term: "Characters Per Minute (CPM)",
    category: "Metrics",
    definition:
      "A raw measurement of typing throughput calculated as the total number of characters, spaces, and punctuation symbols typed in one minute.",
    context:
      "Under the international five-character standard, dividing CPM by 5 directly yields Words Per Minute (e.g., 300 CPM = 60 WPM).",
  },
  {
    term: "Chording",
    category: "Technique",
    definition:
      "Pressing multiple keys simultaneously to register a composite command, symbol, or whole syllable rather than typing characters sequentially.",
    context:
      "Stenographers and specialized chorded keyboard operators use chords to achieve sustained speech-transcription speeds exceeding 225 WPM.",
  },
  {
    term: "Clicky Switch",
    category: "Hardware",
    definition:
      "A mechanical keyboard switch mechanism that produces both a distinct tactile bump and a crisp acoustic click sound at the exact moment of electrical actuation.",
    context:
      "Popular examples include Cherry MX Blue switches, beloved for retro typewriter feel but often too loud for quiet office environments.",
  },
  {
    term: "Colemak",
    category: "Hardware",
    definition:
      "A modern, highly optimized ergonomic keyboard layout designed in 2006 that places the most frequent English letters on the home row while preserving common shortcuts like Ctrl+C and Ctrl+V.",
    context:
      "Colemak significantly reduces finger travel compared to QWERTY while providing a smoother learning curve than Dvorak.",
  },
  {
    term: "Dvorak Simplified Keyboard",
    category: "Hardware",
    definition:
      "An ergonomic keyboard layout patented in 1936 by Dr. August Dvorak that clusters all vowels under the left hand and the most common consonants under the right hand.",
    context:
      "On Dvorak, roughly 70% of typing occurs on the home row, drastically reducing finger travel distance across long documents.",
  },
  {
    term: "Gross WPM",
    category: "Metrics",
    definition:
      "Raw typing speed calculated purely by total keystrokes divided by five, divided by elapsed minutes, without subtracting deductions for errors.",
    context:
      "Gross WPM reveals pure hand traversal speed but does not measure accuracy or submitted text validity.",
  },
  {
    term: "Home Row",
    category: "Technique",
    definition:
      "The central horizontal row of keys (A-S-D-F for the left hand and J-K-L-; for the right hand) where fingers rest neutrally between keystrokes.",
    context:
      "Maintaining the home row anchor allows fingers to execute precise, predictable reach vectors across the entire keyboard grid.",
  },
  {
    term: "Hunt-and-Peck",
    category: "Technique",
    definition:
      "An informal typing method where the typist visually searches for keys on the keyboard and strikes them with two to four fingers.",
    context:
      "Hunt-and-peck typists experience a severe speed ceiling around 40 WPM due to visual lag and constant head movement between screen and desk.",
  },
  {
    term: "Keystrokes Per Hour (KPH)",
    category: "Metrics",
    definition:
      "A high-volume transcription and data-entry metric calculated by multiplying Characters Per Minute by 60.",
    context:
      "Enterprise accounting and billing positions frequently benchmark candidate speeds in KPH, where 10,000 KPH corresponds to ~33 WPM.",
  },
  {
    term: "Linear Switch",
    category: "Hardware",
    definition:
      "A mechanical keyboard switch that moves straight up and down smoothly with zero tactile resistance bump and no acoustic click.",
    context:
      "Linear switches (e.g., Cherry MX Red) offer rapid actuation and silent operation, making them favorites for high-cadence typists and gamers.",
  },
  {
    term: "Lookahead Buffer",
    category: "Technique",
    definition:
      "The visual and cognitive technique of reading one to two words ahead of the current word being physically typed by the hands.",
    context:
      "Developing a lookahead buffer eliminates hesitation micro-pauses between words, producing a steady, metronomic cadence.",
  },
  {
    term: "Motor Chunking",
    category: "Technique",
    definition:
      "A neurological process whereby the brain groups frequently recurring character sequences (e.g., 'ing', 'the', 'tion') into single automated motor impulses.",
    context:
      "Motor chunking bypasses conscious letter-by-letter lookup, allowing elite typists to type common words in fractions of a second.",
  },
  {
    term: "N-Key Rollover (NKRO)",
    category: "Hardware",
    definition:
      "A hardware capability enabling a keyboard to accurately scan and register every pressed key simultaneously without dropping inputs or generating ghost keystrokes.",
    context:
      "NKRO ensures that high-speed typists typing over 120 WPM will never lose inputs during rapid roll combinations.",
  },
  {
    term: "Net WPM",
    category: "Metrics",
    definition:
      "The definitive metric for typing velocity, calculated by taking total correct standardized five-character words and dividing by elapsed minutes.",
    context:
      "Net WPM penalizes errors and uncorrected mistakes, serving as the benchmark standard across competitive leaderboards and professional testing.",
  },
  {
    term: "Proprioception",
    category: "Technique",
    definition:
      "The subconscious bodily awareness of the position and movement of the hands and fingers in three-dimensional space without visual cues.",
    context:
      "Touch typing relies fundamentally on proprioception, allowing fingers to know exact key locations purely through spatial sensory memory.",
  },
  {
    term: "QWERTY",
    category: "Hardware",
    definition:
      "The ubiquitous Latin-script keyboard layout designed in 1873 by Christopher Latham Sholes for early mechanical typewriters.",
    context:
      "Named after the first six letters of the top alphabet row, QWERTY remains the default input configuration across computers and mobile operating systems.",
  },
  {
    term: "Tactile Bump",
    category: "Hardware",
    definition:
      "A small physical resistance feedback ridge felt through the keycap switch stem at the exact point of electrical actuation.",
    context:
      "Tactile switches (such as Cherry MX Brown) let typists feel when a character has registered without needing to bottom out the key completely.",
  },
  {
    term: "Tactile Nib (F/J Bumps)",
    category: "Technique",
    definition:
      "Small raised horizontal lines or dots molded directly onto the 'F' and 'J' keycaps on standard computer keyboards.",
    context:
      "These nibs act as blind navigation beacons, allowing touch typists to align their index fingers on the home row without looking down.",
  },
  {
    term: "Tenkeyless (TKL)",
    category: "Hardware",
    definition:
      "A compact keyboard form factor (roughly 80% size) that eliminates the right-hand numeric keypad while keeping alphanumeric and function rows intact.",
    context:
      "TKL keyboards bring the mouse closer to the body centerline, reducing lateral shoulder reach and improving overall typing ergonomics.",
  },
  {
    term: "Touch Typing",
    category: "Technique",
    definition:
      "The practice of typing text by memory of key locations through physical touch and spatial awareness, without looking at the keyboard.",
    context:
      "Touch typists use all ten fingers, assigning each key to a specific digit, resulting in significantly higher speed and reduced fatigue.",
  },
  {
    term: "Ulnar Deviation",
    category: "Ergonomics",
    definition:
      "The awkward sideways bending of the hands outward at the wrist toward the pinky finger side, common when using narrow straight keyboards.",
    context:
      "Chronic ulnar deviation strains carpal tendons. Split ergonomic keyboards allow hands to align straight with forearms to prevent this strain.",
  },
  {
    term: "Words Per Minute (WPM)",
    category: "Metrics",
    definition:
      "The universal unit of measurement for typing velocity, mathematically standardized where five typed characters represent one word.",
    context:
      "Standardizing words to five characters ensures consistent evaluation regardless of vocabulary length or sentence complexity.",
  },
];

export default function GlossaryPage() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "DefinedTermSet",
    name: "Touch Typing and Keyboard Terminology Glossary",
    description:
      "Authoritative definitions of touch typing mechanics, keyboard hardware, ergonomic postures, and typing performance metrics.",
    url: `${SITE_URL}/learn/glossary`,
    publisher: {
      "@type": "Organization",
      name: OPERATOR_NAME,
      url: SITE_URL,
    },
    hasDefinedTerm: GLOSSARY_TERMS.map((item) => ({
      "@type": "DefinedTerm",
      name: item.term,
      description: item.definition,
    })),
  };

  return (
    <div className="min-h-screen bg-crt-black text-crt-primary p-4 md:p-8 font-mono">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <div className="max-w-4xl mx-auto space-y-8">
        <Breadcrumbs
          items={[
            { label: "Home", href: "/" },
            { label: "Learn", href: "/learn" },
            { label: "Glossary" },
          ]}
        />

        <header className="border-b border-crt-border/60 pb-6 space-y-3">
          <div className="inline-block px-2.5 py-1 text-xs border border-crt-primary/40 rounded bg-crt-primary/10 text-crt-primary">
            REFERENCE &amp; DEFINITIONS
          </div>
          <h1 className="text-2xl md:text-4xl font-bold tracking-tight text-crt-primary">
            Touch Typing &amp; Keyboard Glossary
          </h1>
          <p className="text-sm md:text-base text-crt-dim max-w-3xl leading-relaxed">
            Essential reference terminology covering typing speed metrics (WPM, CPM, KPH), keyboard hardware
            mechanics, ergonomic health concepts, and motor learning principles. Use these definitions to better
            understand your typing diagnostics.
          </p>
          <div className="pt-2">
            <Link
              href="/learn"
              className="text-xs text-crt-primary hover:underline font-semibold"
            >
              &larr; Back to all Training Guides
            </Link>
          </div>
        </header>

        <section aria-labelledby="glossary-terms-heading" className="space-y-6">
          <h2 id="glossary-terms-heading" className="sr-only">
            Glossary Definitions
          </h2>
          <div className="grid grid-cols-1 gap-4">
            {GLOSSARY_TERMS.map((item) => (
              <article
                key={item.term}
                className="p-5 border border-crt-border/70 rounded-lg bg-crt-black/40 space-y-2 hover:border-crt-primary/60 transition-colors"
              >
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <h3 className="text-base md:text-lg font-bold text-crt-primary">
                    {item.term}
                  </h3>
                  <span className="text-[10px] uppercase tracking-wider px-2 py-0.5 border border-crt-border rounded text-crt-dim">
                    {item.category}
                  </span>
                </div>
                <p className="text-xs md:text-sm text-crt-primary/90 leading-relaxed">
                  {item.definition}
                </p>
                <p className="text-xs text-crt-dim leading-relaxed italic border-l-2 border-crt-primary/30 pl-3 mt-2">
                  {item.context}
                </p>
              </article>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}

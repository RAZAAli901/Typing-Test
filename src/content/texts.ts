export const TEXT_ASSETS = {
  standard:
    "The old clock on the wall ticked softly as the afternoon light faded across the wooden floor. Sarah sat at the desk and opened her notebook to a fresh page. She had been working on the same chapter for three weeks and still could not find the right ending. Outside the window the maple tree swayed in the breeze and a single red leaf broke free and spiralled down to the ground. She watched it fall and felt something shift inside her. Sometimes an ending was not a conclusion but simply a pause before the next beginning.",
  
  numbers:
    "The engineering report dated 2019-04-17 identified 3 critical faults in sector 7B. Ambient temperature had reached 42.6 degrees Celsius during the test cycle, exceeding the rated threshold of 38.0 by 4.6 degrees. Component batch A-2204 showed a failure rate of 0.78%, well above the acceptable ceiling of 0.25%. Total runtime logged was 1440 hours across 60 test units, and 11 units failed before reaching the 500-hour mark.",
  
  quotes:
    "In the middle of every difficulty lies opportunity said Albert Einstein. It does not matter how slowly you go as long as you do not stop said Confucius. You have power over your mind not outside events realize this and you will find strength said Marcus Aurelius. The only way to do great work is to love what you do said Steve Jobs. Life is what happens when you are busy making other plans said John Lennon.",
  
  "code-snippet":
    "function quicksort(arr) { if (arr.length <= 1) return arr; const pivot = arr[Math.floor(arr.length / 2)]; const left = arr.filter(x => x < pivot); const right = arr.filter(x => x > pivot); return [...quicksort(left), pivot, ...quicksort(right)]; }",
  
  punctuation:
    "Stop! Who goes there? Under the glowing moon, she asked: 'Is this the path?' Yes, indeed it was! (Although, some travelers claimed it was a trap; others, a shortcut.) With 100% confidence, she pressed forward - hoping for the best!",
};

export type ModeType = keyof typeof TEXT_ASSETS | "random-words" | "daily-challenge";
export type LengthType = "short" | "medium" | "long";

export const WORD_BANK = [
  "the", "be", "to", "of", "and", "a", "in", "that", "have", "i",
  "it", "for", "not", "on", "with", "he", "as", "you", "do", "at",
  "this", "but", "his", "by", "from", "they", "we", "say", "her", "she",
  "or", "an", "will", "my", "one", "all", "would", "there", "their", "what",
  "so", "up", "out", "if", "about", "who", "get", "which", "go", "me",
  "when", "make", "can", "like", "time", "no", "just", "him", "know", "take",
  "people", "into", "year", "your", "good", "some", "could", "them", "see", "other",
  "than", "then", "now", "look", "only", "come", "its", "over", "think", "also",
  "back", "after", "use", "two", "how", "our", "work", "first", "well", "way",
  "even", "new", "want", "because", "any", "these", "give", "day", "most", "us"
];

export function generateRandomWords(count: number = 30): string {
  const result: string[] = [];
  const array = new Uint32Array(count);
  if (typeof window !== "undefined" && window.crypto) {
    window.crypto.getRandomValues(array);
  } else {
    for (let i = 0; i < count; i++) {
      array[i] = Math.floor(Math.random() * 1000000);
    }
  }

  for (let i = 0; i < count; i++) {
    const randomIndex = array[i] % WORD_BANK.length;
    result.push(WORD_BANK[randomIndex]);
  }
  return result.join(" ");
}

export function generateDeterministicRandomWords(count: number = 30, seed: number): string {
  const result: string[] = [];
  let seedVal = seed;
  
  const nextRand = () => {
    let t = (seedVal += 0x6d2b79f5);
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };

  for (let i = 0; i < count; i++) {
    const randomIndex = Math.floor(nextRand() * WORD_BANK.length);
    result.push(WORD_BANK[randomIndex]);
  }
  return result.join(" ");
}

export function getDailyChallengeSeed(): number {
  const now = new Date();
  const year = now.getUTCFullYear();
  const month = now.getUTCMonth();
  const date = now.getUTCDate();
  return year * 10000 + (month + 1) * 100 + date;
}

export function adjustPassageLength(text: string, lengthType: LengthType): string {
  const words = text.split(" ");
  let targetCount = 30;
  if (lengthType === "short") targetCount = 15;
  if (lengthType === "long") targetCount = 60;

  if (words.length >= targetCount) {
    return words.slice(0, targetCount).join(" ");
  } else {
    const resultWords = [...words];
    while (resultWords.length < targetCount) {
      resultWords.push(...words);
    }
    return resultWords.slice(0, targetCount).join(" ");
  }
}

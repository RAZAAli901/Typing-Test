// @ts-nocheck
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  console.log("Seeding started...");

  // 1. Clean existing data
  await prisma.session.deleteMany();
  await prisma.user.deleteMany();

  // 2. Define seed users
  const usernames = [
    "speedtyper",
    "keyboard_warrior",
    "typemaster",
    "finger_ninja",
    "code_runner",
    "anonymous_typer",
  ];

  console.log("Creating seed users...");
  const users = [];
  for (const username of usernames) {
    const user = await prisma.user.create({
      data: { username },
    });
    users.push(user);
  }

  // 3. Define seed sessions (15+ entries)
  const sessionsData = [
    { username: "speedtyper", mode: "standard", grossWpm: 120, netWpm: 118, accuracy: 98.3, timeTakenSeconds: 24.5, charsTyped: 245, mistakes: 2 },
    { username: "speedtyper", mode: "quotes", grossWpm: 110, netWpm: 108, accuracy: 98.0, timeTakenSeconds: 28.2, charsTyped: 260, mistakes: 2 },
    { username: "keyboard_warrior", mode: "standard", grossWpm: 95, netWpm: 92, accuracy: 96.8, timeTakenSeconds: 31.0, charsTyped: 245, mistakes: 3 },
    { username: "keyboard_warrior", mode: "numbers", grossWpm: 75, netWpm: 70, accuracy: 93.3, timeTakenSeconds: 40.1, charsTyped: 250, mistakes: 5 },
    { username: "typemaster", mode: "standard", grossWpm: 142, netWpm: 140, accuracy: 98.6, timeTakenSeconds: 20.8, charsTyped: 245, mistakes: 1 },
    { username: "typemaster", mode: "code-snippet", grossWpm: 90, netWpm: 88, accuracy: 97.8, timeTakenSeconds: 33.3, charsTyped: 250, mistakes: 2 },
    { username: "typemaster", mode: "punctuation", grossWpm: 85, netWpm: 80, accuracy: 94.1, timeTakenSeconds: 35.3, charsTyped: 250, mistakes: 5 },
    { username: "finger_ninja", mode: "standard", grossWpm: 105, netWpm: 101, accuracy: 96.2, timeTakenSeconds: 28.0, charsTyped: 245, mistakes: 4 },
    { username: "finger_ninja", mode: "quotes", grossWpm: 98, netWpm: 95, accuracy: 96.9, timeTakenSeconds: 31.8, charsTyped: 260, mistakes: 3 },
    { username: "code_runner", mode: "code-snippet", grossWpm: 105, netWpm: 102, accuracy: 97.1, timeTakenSeconds: 28.5, charsTyped: 250, mistakes: 3 },
    { username: "code_runner", mode: "numbers", grossWpm: 88, netWpm: 85, accuracy: 96.6, timeTakenSeconds: 34.0, charsTyped: 250, mistakes: 3 },
    { username: "anonymous_typer", mode: "standard", grossWpm: 60, netWpm: 55, accuracy: 91.8, timeTakenSeconds: 49.0, charsTyped: 245, mistakes: 10 },
    { username: "speedtyper", mode: "standard", grossWpm: 125, netWpm: 124, accuracy: 99.2, timeTakenSeconds: 23.5, charsTyped: 245, mistakes: 1 },
    { username: "keyboard_warrior", mode: "quotes", grossWpm: 100, netWpm: 96, accuracy: 96.0, timeTakenSeconds: 31.2, charsTyped: 260, mistakes: 4 },
    { username: "finger_ninja", mode: "numbers", grossWpm: 82, netWpm: 78, accuracy: 95.1, timeTakenSeconds: 36.6, charsTyped: 250, mistakes: 4 },
    { username: "code_runner", mode: "standard", grossWpm: 102, netWpm: 99, accuracy: 97.0, timeTakenSeconds: 28.8, charsTyped: 245, mistakes: 3 },
  ];

  console.log("Creating seed sessions...");
  for (const session of sessionsData) {
    await prisma.session.create({
      data: session,
    });
  }

  console.log("Seeding completed successfully.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

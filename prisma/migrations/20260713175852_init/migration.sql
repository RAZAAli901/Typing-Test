-- CreateTable
CREATE TABLE "User" (
    "username" VARCHAR(50) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "User_pkey" PRIMARY KEY ("username")
);

-- CreateTable
CREATE TABLE "Session" (
    "id" TEXT NOT NULL,
    "username" TEXT NOT NULL,
    "mode" TEXT NOT NULL,
    "grossWpm" INTEGER NOT NULL,
    "netWpm" INTEGER NOT NULL,
    "accuracy" DOUBLE PRECISION NOT NULL,
    "timeTakenSeconds" DOUBLE PRECISION NOT NULL,
    "charsTyped" INTEGER NOT NULL DEFAULT 0,
    "mistakes" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Session_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "Session_username_idx" ON "Session"("username");

-- CreateIndex
CREATE INDEX "Session_mode_idx" ON "Session"("mode");

-- AddForeignKey
ALTER TABLE "Session" ADD CONSTRAINT "Session_username_fkey" FOREIGN KEY ("username") REFERENCES "User"("username") ON DELETE CASCADE ON UPDATE CASCADE;

-- CreateTable
CREATE TABLE "submission" (
    "id" UUID NOT NULL,
    "repositoryLink" TEXT NOT NULL,
    "status" TEXT NOT NULL,
    "grade" DECIMAL(65,30) NOT NULL,
    "challengeId" UUID,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "submission_pkey" PRIMARY KEY ("id")
);

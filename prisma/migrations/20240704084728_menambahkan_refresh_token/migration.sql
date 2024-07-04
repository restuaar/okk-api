-- CreateTable
CREATE TABLE "refresh_token" (
    "idUser" TEXT NOT NULL,
    "token" TEXT NOT NULL,

    CONSTRAINT "refresh_token_pkey" PRIMARY KEY ("idUser","token")
);

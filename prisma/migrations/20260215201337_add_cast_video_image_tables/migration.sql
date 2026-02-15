-- CreateEnum
CREATE TYPE "CastType" AS ENUM ('ACTOR', 'DIRECTOR', 'WRITER', 'PRODUCER', 'CINEMATOGRAPHER', 'COMPOSER', 'EDITOR', 'OTHER');

-- CreateEnum
CREATE TYPE "VideoType" AS ENUM ('Trailer', 'Teaser', 'Clip', 'Featurette', 'Behind the Scenes', 'Bloopers', 'Recap', 'Opening');

-- CreateEnum
CREATE TYPE "ImageType" AS ENUM ('Backdrop', 'Poster', 'Still', 'Logo');

-- CreateTable
CREATE TABLE "person" (
    "id" TEXT NOT NULL,
    "tmdb_id" INTEGER NOT NULL,
    "adult" BOOLEAN NOT NULL DEFAULT false,
    "gender" INTEGER DEFAULT 0,
    "known_for_department" VARCHAR(100),
    "name" VARCHAR(255) NOT NULL,
    "original_name" VARCHAR(255) NOT NULL,
    "popularity" DOUBLE PRECISION NOT NULL DEFAULT 0.0,
    "profile_path" VARCHAR(500),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "person_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "media_cast" (
    "id" TEXT NOT NULL,
    "media_id" TEXT NOT NULL,
    "person_id" TEXT NOT NULL,
    "cast_type" "CastType" NOT NULL,
    "role" VARCHAR(500),
    "order" INTEGER NOT NULL DEFAULT 0,
    "tmdb_credit_id" VARCHAR(100),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "media_cast_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "known_for" (
    "id" TEXT NOT NULL,
    "person_id" TEXT NOT NULL,
    "tmdb_id" INTEGER NOT NULL,
    "adult" BOOLEAN NOT NULL DEFAULT false,
    "backdrop_path" VARCHAR(500),
    "title" VARCHAR(255) NOT NULL,
    "original_language" VARCHAR(10),
    "original_title" VARCHAR(255),
    "overview" TEXT,
    "poster_path" VARCHAR(500),
    "media_type" VARCHAR(50) NOT NULL,
    "genre_ids" TEXT NOT NULL,
    "popularity" DOUBLE PRECISION NOT NULL DEFAULT 0.0,
    "release_date" TIMESTAMP(3),
    "video" BOOLEAN NOT NULL DEFAULT false,
    "vote_average" DOUBLE PRECISION NOT NULL DEFAULT 0.0,
    "vote_count" INTEGER NOT NULL DEFAULT 0,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "known_for_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "video" (
    "id" TEXT NOT NULL,
    "media_id" TEXT NOT NULL,
    "tmdb_id" TEXT NOT NULL,
    "iso_639_1" VARCHAR(10),
    "iso_3166_1" VARCHAR(10),
    "name" VARCHAR(500) NOT NULL,
    "key" VARCHAR(255) NOT NULL,
    "site" VARCHAR(50) NOT NULL,
    "size" INTEGER NOT NULL DEFAULT 1080,
    "type" "VideoType" NOT NULL,
    "official" BOOLEAN NOT NULL DEFAULT false,
    "published_at" TIMESTAMP(3) NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "video_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "image" (
    "id" TEXT NOT NULL,
    "media_id" TEXT NOT NULL,
    "file_path" VARCHAR(500) NOT NULL,
    "aspect_ratio" DOUBLE PRECISION NOT NULL,
    "height" INTEGER NOT NULL,
    "width" INTEGER NOT NULL,
    "iso_639_1" VARCHAR(10),
    "vote_average" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "vote_count" INTEGER NOT NULL DEFAULT 0,
    "type" "ImageType" NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "image_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "person_tmdb_id_key" ON "person"("tmdb_id");

-- CreateIndex
CREATE INDEX "person_name_idx" ON "person"("name");

-- CreateIndex
CREATE INDEX "person_popularity_idx" ON "person"("popularity" DESC);

-- CreateIndex
CREATE INDEX "person_known_for_department_idx" ON "person"("known_for_department");

-- CreateIndex
CREATE INDEX "person_tmdb_id_idx" ON "person"("tmdb_id");

-- CreateIndex
CREATE UNIQUE INDEX "media_cast_tmdb_credit_id_key" ON "media_cast"("tmdb_credit_id");

-- CreateIndex
CREATE INDEX "media_cast_media_id_idx" ON "media_cast"("media_id");

-- CreateIndex
CREATE INDEX "media_cast_person_id_idx" ON "media_cast"("person_id");

-- CreateIndex
CREATE INDEX "media_cast_cast_type_idx" ON "media_cast"("cast_type");

-- CreateIndex
CREATE INDEX "media_cast_order_idx" ON "media_cast"("order");

-- CreateIndex
CREATE UNIQUE INDEX "media_cast_media_id_person_id_cast_type_role_key" ON "media_cast"("media_id", "person_id", "cast_type", "role");

-- CreateIndex
CREATE INDEX "known_for_person_id_idx" ON "known_for"("person_id");

-- CreateIndex
CREATE INDEX "known_for_tmdb_id_idx" ON "known_for"("tmdb_id");

-- CreateIndex
CREATE INDEX "known_for_media_type_idx" ON "known_for"("media_type");

-- CreateIndex
CREATE INDEX "known_for_popularity_idx" ON "known_for"("popularity" DESC);

-- CreateIndex
CREATE INDEX "known_for_release_date_idx" ON "known_for"("release_date" DESC);

-- CreateIndex
CREATE UNIQUE INDEX "known_for_person_id_tmdb_id_key" ON "known_for"("person_id", "tmdb_id");

-- CreateIndex
CREATE INDEX "video_type_idx" ON "video"("type");

-- CreateIndex
CREATE INDEX "video_media_id_idx" ON "video"("media_id");

-- CreateIndex
CREATE INDEX "video_official_idx" ON "video"("official");

-- CreateIndex
CREATE INDEX "video_published_at_idx" ON "video"("published_at" DESC);

-- CreateIndex
CREATE UNIQUE INDEX "video_media_id_tmdb_id_key" ON "video"("media_id", "tmdb_id");

-- CreateIndex
CREATE INDEX "image_media_id_idx" ON "image"("media_id");

-- CreateIndex
CREATE INDEX "image_type_idx" ON "image"("type");

-- CreateIndex
CREATE INDEX "image_vote_average_idx" ON "image"("vote_average" DESC);

-- CreateIndex
CREATE UNIQUE INDEX "image_media_id_file_path_key" ON "image"("media_id", "file_path");

-- CreateIndex
CREATE INDEX "Media_title_idx" ON "Media"("title");

-- CreateIndex
CREATE INDEX "Media_title_status_idx" ON "Media"("title", "status");

-- CreateIndex
CREATE INDEX "Media_title_releaseYear_idx" ON "Media"("title", "releaseYear");

-- CreateIndex
CREATE INDEX "Media_createdAt_idx" ON "Media"("createdAt");

-- AddForeignKey
ALTER TABLE "media_cast" ADD CONSTRAINT "media_cast_media_id_fkey" FOREIGN KEY ("media_id") REFERENCES "Media"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "media_cast" ADD CONSTRAINT "media_cast_person_id_fkey" FOREIGN KEY ("person_id") REFERENCES "person"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "known_for" ADD CONSTRAINT "known_for_person_id_fkey" FOREIGN KEY ("person_id") REFERENCES "person"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "video" ADD CONSTRAINT "video_media_id_fkey" FOREIGN KEY ("media_id") REFERENCES "Media"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "image" ADD CONSTRAINT "image_media_id_fkey" FOREIGN KEY ("media_id") REFERENCES "Media"("id") ON DELETE CASCADE ON UPDATE CASCADE;

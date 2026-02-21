/*
  Warnings:

  - You are about to drop the `Account` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `AuditLog` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Collection` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Creator` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Favorite` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Genre` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Media` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `MediaCreator` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `MediaGenre` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Passkey` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Permission` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Profile` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Role` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `RolePermission` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Session` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Subscription` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `TwoFactor` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `User` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `UserPermission` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `UserReview` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `UserRole` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Verification` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `ViewingHistory` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `WatchList` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `image` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `known_for` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `media_cast` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `person` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `video` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "Account" DROP CONSTRAINT "Account_userId_fkey";

-- DropForeignKey
ALTER TABLE "AuditLog" DROP CONSTRAINT "AuditLog_userId_fkey";

-- DropForeignKey
ALTER TABLE "Favorite" DROP CONSTRAINT "Favorite_mediaId_fkey";

-- DropForeignKey
ALTER TABLE "Favorite" DROP CONSTRAINT "Favorite_userId_fkey";

-- DropForeignKey
ALTER TABLE "Media" DROP CONSTRAINT "Media_collectionId_fkey";

-- DropForeignKey
ALTER TABLE "MediaCreator" DROP CONSTRAINT "MediaCreator_creatorId_fkey";

-- DropForeignKey
ALTER TABLE "MediaCreator" DROP CONSTRAINT "MediaCreator_mediaId_fkey";

-- DropForeignKey
ALTER TABLE "MediaGenre" DROP CONSTRAINT "MediaGenre_genreId_fkey";

-- DropForeignKey
ALTER TABLE "MediaGenre" DROP CONSTRAINT "MediaGenre_mediaId_fkey";

-- DropForeignKey
ALTER TABLE "Passkey" DROP CONSTRAINT "Passkey_userId_fkey";

-- DropForeignKey
ALTER TABLE "Profile" DROP CONSTRAINT "Profile_userId_fkey";

-- DropForeignKey
ALTER TABLE "RolePermission" DROP CONSTRAINT "RolePermission_permissionId_fkey";

-- DropForeignKey
ALTER TABLE "RolePermission" DROP CONSTRAINT "RolePermission_roleId_fkey";

-- DropForeignKey
ALTER TABLE "Session" DROP CONSTRAINT "Session_userId_fkey";

-- DropForeignKey
ALTER TABLE "Subscription" DROP CONSTRAINT "Subscription_userId_fkey";

-- DropForeignKey
ALTER TABLE "TwoFactor" DROP CONSTRAINT "TwoFactor_userId_fkey";

-- DropForeignKey
ALTER TABLE "UserPermission" DROP CONSTRAINT "UserPermission_permissionId_fkey";

-- DropForeignKey
ALTER TABLE "UserPermission" DROP CONSTRAINT "UserPermission_userId_fkey";

-- DropForeignKey
ALTER TABLE "UserReview" DROP CONSTRAINT "UserReview_mediaId_fkey";

-- DropForeignKey
ALTER TABLE "UserReview" DROP CONSTRAINT "UserReview_userId_fkey";

-- DropForeignKey
ALTER TABLE "UserRole" DROP CONSTRAINT "UserRole_roleId_fkey";

-- DropForeignKey
ALTER TABLE "UserRole" DROP CONSTRAINT "UserRole_userId_fkey";

-- DropForeignKey
ALTER TABLE "ViewingHistory" DROP CONSTRAINT "ViewingHistory_mediaId_fkey";

-- DropForeignKey
ALTER TABLE "ViewingHistory" DROP CONSTRAINT "ViewingHistory_profileId_fkey";

-- DropForeignKey
ALTER TABLE "WatchList" DROP CONSTRAINT "WatchList_mediaId_fkey";

-- DropForeignKey
ALTER TABLE "WatchList" DROP CONSTRAINT "WatchList_userId_fkey";

-- DropForeignKey
ALTER TABLE "image" DROP CONSTRAINT "image_media_id_fkey";

-- DropForeignKey
ALTER TABLE "known_for" DROP CONSTRAINT "known_for_person_id_fkey";

-- DropForeignKey
ALTER TABLE "media_cast" DROP CONSTRAINT "media_cast_media_id_fkey";

-- DropForeignKey
ALTER TABLE "media_cast" DROP CONSTRAINT "media_cast_person_id_fkey";

-- DropForeignKey
ALTER TABLE "video" DROP CONSTRAINT "video_media_id_fkey";

-- DropTable
DROP TABLE "Account";

-- DropTable
DROP TABLE "AuditLog";

-- DropTable
DROP TABLE "Collection";

-- DropTable
DROP TABLE "Creator";

-- DropTable
DROP TABLE "Favorite";

-- DropTable
DROP TABLE "Genre";

-- DropTable
DROP TABLE "Media";

-- DropTable
DROP TABLE "MediaCreator";

-- DropTable
DROP TABLE "MediaGenre";

-- DropTable
DROP TABLE "Passkey";

-- DropTable
DROP TABLE "Permission";

-- DropTable
DROP TABLE "Profile";

-- DropTable
DROP TABLE "Role";

-- DropTable
DROP TABLE "RolePermission";

-- DropTable
DROP TABLE "Session";

-- DropTable
DROP TABLE "Subscription";

-- DropTable
DROP TABLE "TwoFactor";

-- DropTable
DROP TABLE "User";

-- DropTable
DROP TABLE "UserPermission";

-- DropTable
DROP TABLE "UserReview";

-- DropTable
DROP TABLE "UserRole";

-- DropTable
DROP TABLE "Verification";

-- DropTable
DROP TABLE "ViewingHistory";

-- DropTable
DROP TABLE "WatchList";

-- DropTable
DROP TABLE "image";

-- DropTable
DROP TABLE "known_for";

-- DropTable
DROP TABLE "media_cast";

-- DropTable
DROP TABLE "person";

-- DropTable
DROP TABLE "video";

-- DropEnum
DROP TYPE "CastType";

-- DropEnum
DROP TYPE "CollectionType";

-- DropEnum
DROP TYPE "CreatorRole";

-- DropEnum
DROP TYPE "GenreType";

-- DropEnum
DROP TYPE "ImageType";

-- DropEnum
DROP TYPE "MediaStatus";

-- DropEnum
DROP TYPE "MediaType";

-- DropEnum
DROP TYPE "SubscriptionStatus";

-- DropEnum
DROP TYPE "VideoType";

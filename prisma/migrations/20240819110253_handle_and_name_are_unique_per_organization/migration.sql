/*
  Warnings:

  - A unique constraint covering the columns `[name,organizationId]` on the table `Folder` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[handle,organizationId]` on the table `Folder` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[name,organizationId]` on the table `Page` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[handle,organizationId]` on the table `Page` will be added. If there are existing duplicate values, this will fail.

*/
-- DropIndex
DROP INDEX "Folder_handle_key";

-- DropIndex
DROP INDEX "Folder_name_key";

-- DropIndex
DROP INDEX "Page_handle_key";

-- AlterTable
ALTER TABLE "Account" ALTER COLUMN "updatedAt" SET DEFAULT CURRENT_TIMESTAMP;

-- AlterTable
ALTER TABLE "Folder" ADD COLUMN     "isRoot" BOOLEAN NOT NULL DEFAULT false;

-- CreateIndex
CREATE UNIQUE INDEX "Folder_name_organizationId_key" ON "Folder"("name", "organizationId");

-- CreateIndex
CREATE UNIQUE INDEX "Folder_handle_organizationId_key" ON "Folder"("handle", "organizationId");

-- CreateIndex
CREATE UNIQUE INDEX "Page_name_organizationId_key" ON "Page"("name", "organizationId");

-- CreateIndex
CREATE UNIQUE INDEX "Page_handle_organizationId_key" ON "Page"("handle", "organizationId");

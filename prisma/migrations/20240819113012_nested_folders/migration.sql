/*
  Warnings:

  - A unique constraint covering the columns `[name,organizationId,parentId]` on the table `Folder` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[handle,organizationId,parentId]` on the table `Folder` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[name,organizationId,folderId]` on the table `Page` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[handle,organizationId,folderId]` on the table `Page` will be added. If there are existing duplicate values, this will fail.

*/
-- DropIndex
DROP INDEX "Folder_handle_organizationId_key";

-- DropIndex
DROP INDEX "Folder_name_organizationId_key";

-- DropIndex
DROP INDEX "Page_handle_organizationId_key";

-- DropIndex
DROP INDEX "Page_name_organizationId_key";

-- AlterTable
ALTER TABLE "Folder" ADD COLUMN     "parentId" TEXT,
ALTER COLUMN "updatedAt" SET DEFAULT CURRENT_TIMESTAMP;

-- CreateIndex
CREATE UNIQUE INDEX "Folder_name_organizationId_parentId_key" ON "Folder"("name", "organizationId", "parentId");

-- CreateIndex
CREATE UNIQUE INDEX "Folder_handle_organizationId_parentId_key" ON "Folder"("handle", "organizationId", "parentId");

-- CreateIndex
CREATE UNIQUE INDEX "Page_name_organizationId_folderId_key" ON "Page"("name", "organizationId", "folderId");

-- CreateIndex
CREATE UNIQUE INDEX "Page_handle_organizationId_folderId_key" ON "Page"("handle", "organizationId", "folderId");

-- AddForeignKey
ALTER TABLE "Folder" ADD CONSTRAINT "Folder_parentId_fkey" FOREIGN KEY ("parentId") REFERENCES "Folder"("id") ON DELETE SET NULL ON UPDATE CASCADE;

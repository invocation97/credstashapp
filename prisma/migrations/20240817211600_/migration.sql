/*
  Warnings:

  - A unique constraint covering the columns `[handle]` on the table `Folder` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[handle]` on the table `Page` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `handle` to the `Folder` table without a default value. This is not possible if the table is not empty.
  - Added the required column `handle` to the `Page` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Folder" ADD COLUMN     "handle" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "Page" ADD COLUMN     "handle" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "Folder_handle_key" ON "Folder"("handle");

-- CreateIndex
CREATE UNIQUE INDEX "Page_handle_key" ON "Page"("handle");

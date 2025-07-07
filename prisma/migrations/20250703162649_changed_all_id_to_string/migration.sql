/*
  Warnings:

  - The primary key for the `Category` table will be changed. If it partially fails, the table could be left without primary key constraint.

*/
-- DropForeignKey
ALTER TABLE "blogs" DROP CONSTRAINT "blogs_categoryId_fkey";

-- DropForeignKey
ALTER TABLE "projects" DROP CONSTRAINT "projects_categoryId_fkey";

-- AlterTable
ALTER TABLE "Category" DROP CONSTRAINT "Category_pkey",
ALTER COLUMN "id" DROP DEFAULT,
ALTER COLUMN "id" SET DATA TYPE TEXT,
ADD CONSTRAINT "Category_pkey" PRIMARY KEY ("id");
DROP SEQUENCE "Category_id_seq";

-- AlterTable
ALTER TABLE "blogs" ALTER COLUMN "categoryId" SET DATA TYPE TEXT;

-- AlterTable
ALTER TABLE "projects" ALTER COLUMN "categoryId" SET DATA TYPE TEXT;

-- AddForeignKey
ALTER TABLE "blogs" ADD CONSTRAINT "blogs_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "Category"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "projects" ADD CONSTRAINT "projects_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "Category"("id") ON DELETE SET NULL ON UPDATE CASCADE;

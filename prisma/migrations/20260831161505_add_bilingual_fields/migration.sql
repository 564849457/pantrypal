/*
  Warnings:

  - You are about to drop the column `name` on the `Category` table. All the data in the column will be lost.
  - You are about to drop the column `name` on the `Ingredient` table. All the data in the column will be lost.
  - You are about to drop the column `description` on the `Recipe` table. All the data in the column will be lost.
  - You are about to drop the column `instructions` on the `Recipe` table. All the data in the column will be lost.
  - You are about to drop the column `title` on the `Recipe` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[nameZh]` on the table `Category` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[nameEn]` on the table `Category` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[nameZh]` on the table `Ingredient` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[nameEn]` on the table `Ingredient` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `nameEn` to the `Category` table without a default value. This is not possible if the table is not empty.
  - Added the required column `nameZh` to the `Category` table without a default value. This is not possible if the table is not empty.
  - Added the required column `nameEn` to the `Ingredient` table without a default value. This is not possible if the table is not empty.
  - Added the required column `nameZh` to the `Ingredient` table without a default value. This is not possible if the table is not empty.
  - Added the required column `instructionsEn` to the `Recipe` table without a default value. This is not possible if the table is not empty.
  - Added the required column `instructionsZh` to the `Recipe` table without a default value. This is not possible if the table is not empty.
  - Added the required column `titleEn` to the `Recipe` table without a default value. This is not possible if the table is not empty.
  - Added the required column `titleZh` to the `Recipe` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX "Category_name_key";

-- DropIndex
DROP INDEX "Ingredient_name_key";

-- AlterTable
ALTER TABLE "Category" DROP COLUMN "name",
ADD COLUMN     "nameEn" TEXT NOT NULL,
ADD COLUMN     "nameZh" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "Ingredient" DROP COLUMN "name",
ADD COLUMN     "nameEn" TEXT NOT NULL,
ADD COLUMN     "nameZh" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "Recipe" DROP COLUMN "description",
DROP COLUMN "instructions",
DROP COLUMN "title",
ADD COLUMN     "descriptionEn" TEXT,
ADD COLUMN     "descriptionZh" TEXT,
ADD COLUMN     "instructionsEn" TEXT NOT NULL,
ADD COLUMN     "instructionsZh" TEXT NOT NULL,
ADD COLUMN     "titleEn" TEXT NOT NULL,
ADD COLUMN     "titleZh" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "Category_nameZh_key" ON "Category"("nameZh");

-- CreateIndex
CREATE UNIQUE INDEX "Category_nameEn_key" ON "Category"("nameEn");

-- CreateIndex
CREATE UNIQUE INDEX "Ingredient_nameZh_key" ON "Ingredient"("nameZh");

-- CreateIndex
CREATE UNIQUE INDEX "Ingredient_nameEn_key" ON "Ingredient"("nameEn");

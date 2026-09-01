import prisma from "@/lib/prisma";
import { notFound } from "next/navigation";
import RecipeDetailClient from "./RecipeDetailClient";

type RecipePageProps = {
  params: Promise<{
    id: string;
  }>;
};

export default async function RecipePage({
  params,
}: RecipePageProps) {
  const { id } = await params;

  const recipe = await prisma.recipe.findUnique({
    where: {
      id,
    },
    include: {
      category: true,
      ingredients: {
        include: {
          ingredient: true,
        },
      },
    },
  });

  if (!recipe) {
    notFound();
  }

  return <RecipeDetailClient recipe={recipe} />;
}
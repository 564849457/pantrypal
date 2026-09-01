import prisma from "@/lib/prisma";
import HomeClient from "./HomeClient";

export default async function HomePage() {
  const recipes = await prisma.recipe.findMany({
    include: {
      category: true,
    },
    orderBy: {
      createdAt: "desc",
    },
    take: 3,
  });

  return <HomeClient recipes={recipes} />;
}
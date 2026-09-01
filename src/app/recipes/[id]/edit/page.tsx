import prisma from "@/lib/prisma";
import { notFound } from "next/navigation";
import EditRecipeForm from "./EditRecipeForm";
import { auth } from "@/auth";
import { redirect } from "next/navigation";

type EditRecipePageProps = {
  params: Promise<{
    id: string;
  }>;
};

export default async function EditRecipePage({
  params,
}: EditRecipePageProps) {
  const { id } = await params;

  const [recipe, categories] = await Promise.all([
    prisma.recipe.findUnique({
      where: {
        id,
      },
      include: {
        ingredients: {
          include: {
            ingredient: true,
          },
        },
      },
    }),

    prisma.category.findMany({
      orderBy: {
        nameEn: "asc",
      },
    }),
  ]);

  if (!recipe) {
    notFound();
  }

  const session = await auth();

if (!session?.user?.email) {
  redirect("/api/auth/signin");
}

  const user = await prisma.user.findUnique({
    where: {
      email: session.user.email,
    },
  });

  if (!user || recipe.userId !== user.id) {
    redirect(`/recipes/${recipe.id}`);
  }
  
  return (
    <EditRecipeForm
      recipe={recipe}
      categories={categories}
    />
  );
}
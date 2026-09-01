import prisma from "@/lib/prisma";
import { auth } from "@/auth";
import { redirect } from "next/navigation";
import NewRecipeForm from "./NewRecipeForm";

export default async function NewRecipePage() {
  const session = await auth();

  if (!session?.user) {
    redirect("/api/auth/signin");
  }

  const categories = await prisma.category.findMany({
    orderBy: {
      nameEn: "asc",
    },
  });

  return <NewRecipeForm categories={categories} />;
}
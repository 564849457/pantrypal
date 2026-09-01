import prisma from "../src/lib/prisma";

type IngredientInput = {
  nameZh: string;
  nameEn: string;
  quantity?: number;
  unit?: string;
};

type RecipeInput = {
  titleZh: string;
  titleEn: string;

  descriptionZh: string;
  descriptionEn: string;

  instructionsZh: string;
  instructionsEn: string;

  imageUrl?: string;

  prepTime?: number;
  cookTime?: number;
  servings?: number;

  userId: string;
  categoryId: string;
};

async function addRecipe(
  data: RecipeInput,
  ingredients: IngredientInput[],
) {
  let recipe = await prisma.recipe.findFirst({
    where: {
      titleEn: data.titleEn,
      userId: data.userId,
    },
  });

  if (recipe) {
    await prisma.recipeIngredient.deleteMany({
      where: {
        recipeId: recipe.id,
      },
    });

    recipe = await prisma.recipe.update({
      where: {
        id: recipe.id,
      },
      data,
    });
  } else {
    recipe = await prisma.recipe.create({
      data,
    });
  }

  for (const item of ingredients) {
    const ingredient = await prisma.ingredient.upsert({
      where: {
        nameEn: item.nameEn,
      },
      update: {
        nameZh: item.nameZh,
      },
      create: {
        nameZh: item.nameZh,
        nameEn: item.nameEn,
      },
    });

    await prisma.recipeIngredient.create({
      data: {
        recipeId: recipe.id,
        ingredientId: ingredient.id,
        quantity: item.quantity,
        unit: item.unit,
      },
    });
  }
}

async function main() {
  // ------------------------------------------------
  // Demo User
  // ------------------------------------------------

  const user = await prisma.user.upsert({
    where: {
      email: "demo@pantrypal.dev",
    },
    update: {},
    create: {
      email: "demo@pantrypal.dev",
      name: "Demo User",
    },
  });

  // ------------------------------------------------
  // Categories
  // ------------------------------------------------

  const chinese = await prisma.category.upsert({
    where: {
      nameEn: "Chinese",
    },
    update: {
      nameZh: "中餐",
    },
    create: {
      nameZh: "中餐",
      nameEn: "Chinese",
    },
  });

  const japanese = await prisma.category.upsert({
    where: {
      nameEn: "Japanese",
    },
    update: {
      nameZh: "日料",
    },
    create: {
      nameZh: "日料",
      nameEn: "Japanese",
    },
  });

  const italian = await prisma.category.upsert({
    where: {
      nameEn: "Italian",
    },
    update: {
      nameZh: "意大利菜",
    },
    create: {
      nameZh: "意大利菜",
      nameEn: "Italian",
    },
  });

  // ============================================================
  // 1. Mapo Tofu
  // ============================================================

  await addRecipe(
    {
      titleZh: "麻婆豆腐",
      titleEn: "Mapo Tofu",

      descriptionZh:
        "经典川味家常菜，豆腐搭配牛肉末和豆瓣酱，麻辣鲜香。",
      descriptionEn:
        "A classic Sichuan-style tofu dish with beef mince, doubanjiang and a rich spicy sauce.",

      instructionsZh: `1. 豆腐切成小块，放入加少量盐的热水中焯烫后沥干。
      
2. 锅中加入食用油，放入牛肉末炒散并炒香。

3. 加入蒜末、生姜和郫县豆瓣酱，小火炒出红油。

4. 加入适量清水和生抽，放入豆腐后轻轻翻动。

5. 中小火煮约5分钟, 让豆腐吸收汤汁。

6. 加入水淀粉勾芡，撒上花椒粉和葱花即可。`,

      instructionsEn: `1. Cut the tofu into cubes and briefly blanch it in lightly salted hot water.

2. Heat oil in a pan and cook the beef mince until browned.

3. Add garlic, ginger and doubanjiang. Cook gently until fragrant and the oil turns red.

4. Add water and light soy sauce, then gently add the tofu.

5. Simmer for around 5 minutes so the tofu absorbs the sauce.

6. Thicken with a cornstarch slurry and finish with Sichuan pepper and spring onion.`,

      
      imageUrl: "/recipes/mapo-tofu.jpg",

      prepTime: 15,
      cookTime: 20,
      servings: 2,

      userId: user.id,
      categoryId: chinese.id,
    },
    [
      {
        nameZh: "豆腐",
        nameEn: "Tofu",
        quantity: 400,
        unit: "g",
      },
      {
        nameZh: "牛肉末",
        nameEn: "Beef Mince",
        quantity: 150,
        unit: "g",
      },
      {
        nameZh: "郫县豆瓣酱",
        nameEn: "Doubanjiang",
        quantity: 30,
        unit: "g",
      },
      {
        nameZh: "大蒜",
        nameEn: "Garlic",
        quantity: 15,
        unit: "g",
      },
      {
        nameZh: "生姜",
        nameEn: "Ginger",
        quantity: 10,
        unit: "g",
      },
      {
        nameZh: "生抽",
        nameEn: "Light Soy Sauce",
        quantity: 15,
        unit: "ml",
      },
      {
        nameZh: "花椒粉",
        nameEn: "Sichuan Pepper Powder",
        quantity: 2,
        unit: "g",
      },
    ],
  );

  // ============================================================
  // 2. Tomato and Egg Stir Fry
  // ============================================================

  await addRecipe(
    {
      titleZh: "番茄炒蛋",
      titleEn: "Tomato and Egg Stir Fry",

      descriptionZh:
        "简单经典的中式家常菜，酸甜番茄搭配嫩滑鸡蛋。",
      descriptionEn:
        "A quick Chinese home-style dish combining soft scrambled eggs with sweet and tangy tomatoes.",

      instructionsZh: `1. 番茄切块，鸡蛋打散。

2. 锅中放油，先将鸡蛋炒至刚刚凝固，盛出备用。

3. 锅中补少量油，加入番茄翻炒至变软并出汁。

4. 加入盐和白糖调味。

5. 将鸡蛋重新倒回锅中，与番茄快速翻匀即可。`,

      instructionsEn: `1. Cut the tomatoes into chunks and beat the eggs.

2. Heat oil and scramble the eggs until just set, then remove them from the pan.

3. Add a little more oil and cook the tomatoes until softened and juicy.

4. Season with salt and sugar.

5. Return the eggs to the pan and gently combine before serving.`,

      imageUrl: "/recipes/tomato-egg.jpg",

      prepTime: 10,
      cookTime: 10,
      servings: 2,

      userId: user.id,
      categoryId: chinese.id,
    },
    [
      {
        nameZh: "番茄",
        nameEn: "Tomato",
        quantity: 400,
        unit: "g",
      },
      {
        nameZh: "鸡蛋",
        nameEn: "Egg",
        quantity: 4,
        unit: "pcs",
      },
      {
        nameZh: "白糖",
        nameEn: "Sugar",
        quantity: 10,
        unit: "g",
      },
      {
        nameZh: "盐",
        nameEn: "Salt",
        quantity: 3,
        unit: "g",
      },
    ],
  );

  // ============================================================
  // 3. Teriyaki Chicken
  // ============================================================

  await addRecipe(
    {
      titleZh: "照烧鸡",
      titleEn: "Teriyaki Chicken",

      descriptionZh:
        "外焦里嫩的鸡肉搭配甜咸照烧汁，非常适合配米饭。",
      descriptionEn:
        "Pan-seared chicken coated in a glossy sweet and savoury teriyaki sauce.",

      instructionsZh: `1. 鸡肉擦干水分并切成合适大小。

2. 平底锅中加入少量油，将鸡肉两面煎至金黄。

3. 加入生抽、味醂、清酒和白糖。

4. 中火继续煮至酱汁逐渐浓稠并均匀包裹鸡肉。

5. 切块后搭配米饭食用。`,

      instructionsEn: `1. Pat the chicken dry and cut it into suitable portions.

2. Heat a little oil and sear the chicken until golden on both sides.

3. Add soy sauce, mirin, sake and sugar.

4. Continue cooking over medium heat until the sauce becomes glossy and coats the chicken.

5. Slice and serve with rice.`,

      imageUrl: "/recipes/teriyaki-chicken.jpg",

      prepTime: 10,
      cookTime: 20,
      servings: 2,

      userId: user.id,
      categoryId: japanese.id,
    },
    [
      {
        nameZh: "鸡腿肉",
        nameEn: "Chicken Thigh",
        quantity: 400,
        unit: "g",
      },
      {
        nameZh: "生抽",
        nameEn: "Light Soy Sauce",
        quantity: 30,
        unit: "ml",
      },
      {
        nameZh: "味醂",
        nameEn: "Mirin",
        quantity: 30,
        unit: "ml",
      },
      {
        nameZh: "清酒",
        nameEn: "Sake",
        quantity: 30,
        unit: "ml",
      },
      {
        nameZh: "白糖",
        nameEn: "Sugar",
        quantity: 15,
        unit: "g",
      },
    ],
  );

  // ============================================================
  // 4. Carbonara
  // ============================================================

  await addRecipe(
    {
      titleZh: "意大利培根蛋酱面",
      titleEn: "Spaghetti Carbonara",

      descriptionZh:
        "使用鸡蛋、奶酪、黑胡椒和培根制作的经典意大利意面。",
      descriptionEn:
        "A classic Italian pasta made with egg, cheese, black pepper and pancetta.",

      instructionsZh: `1. 意大利面放入盐水中煮至接近理想熟度。

2. 培根切块后放入平底锅中煎至香脆。

3. 碗中混合鸡蛋、奶酪和黑胡椒。

4. 将意大利面加入培根锅中，保留少量面汤。

5. 关火后加入蛋液和奶酪混合物，快速搅拌。

6. 根据需要加入少量面汤调整浓稠度。`,

      instructionsEn: `1. Cook the spaghetti in salted water until nearly al dente.

2. Fry the pancetta until golden and crisp.

3. Mix the eggs, cheese and black pepper in a bowl.

4. Add the cooked pasta to the pancetta, reserving some pasta water.

5. Remove the pan from the heat and quickly mix in the egg and cheese mixture.

6. Add a little pasta water as needed to create a creamy sauce.`,

      imageUrl: "/recipes/carbonara.jpg",
      prepTime: 10,
      cookTime: 20,
      servings: 2,

      userId: user.id,
      categoryId: italian.id,
    },
    [
      {
        nameZh: "意大利面",
        nameEn: "Spaghetti",
        quantity: 200,
        unit: "g",
      },
      {
        nameZh: "意式培根",
        nameEn: "Pancetta",
        quantity: 100,
        unit: "g",
      },
      {
        nameZh: "鸡蛋",
        nameEn: "Egg",
        quantity: 3,
        unit: "pcs",
      },
      {
        nameZh: "帕玛森奶酪",
        nameEn: "Parmesan Cheese",
        quantity: 60,
        unit: "g",
      },
      {
        nameZh: "黑胡椒",
        nameEn: "Black Pepper",
        quantity: 2,
        unit: "g",
      },
    ],
  );

  // ============================================================
  // 5. Overnight Pickled Cucumbers
  // ============================================================

  await addRecipe(
    {
      titleZh: "一夜渍小黄瓜",
      titleEn: "Overnight Pickled Cucumbers",

      descriptionZh:
        "酸辣爽脆的隔夜腌黄瓜，适合作为凉菜或佐餐小菜。",
      descriptionEn:
        "Crisp overnight-pickled cucumbers with a savoury, spicy and lightly tangy dressing.",

      instructionsZh: `1. 黄瓜洗净去头去尾，一分四瓣，去掉中间的瓤，再切成条和小段。

2. 加入白糖和盐抓拌均匀，腌制约2小时。

3. 香菜洗净，辣椒切圈，大蒜切片，姜切丝，小葱切段。

4. 锅中加入食用油，放入八角、花椒和干辣椒，小火炸香。

5. 加入姜丝和葱段炒香，再加入生抽、老抽、冰糖和清水煮开。

6. 关火后加入味精，料汁彻底晾凉。

7. 腌好的黄瓜用清水冲洗，充分挤干水分。

8. 加入蒜片、香菜和辣椒，再倒入完全晾凉的料汁。

9. 根据口味加入陈醋，密封后冷藏一夜。`,

      instructionsEn: `1. Wash and trim the cucumbers. Quarter them lengthways, remove the soft centre and cut into strips and shorter pieces.

2. Mix with sugar and salt and leave for around 2 hours.

3. Prepare the coriander, chillies, garlic, ginger and spring onion.

4. Heat oil gently with star anise, Sichuan peppercorns and dried chilli until fragrant.

5. Add ginger and spring onion, followed by light soy sauce, dark soy sauce, rock sugar and water.

6. Bring to a boil, remove from heat and cool the dressing completely.

7. Rinse the cucumbers and squeeze out as much moisture as possible.

8. Add garlic, coriander and chilli, then pour over the cooled dressing.

9. Add vinegar to taste and refrigerate overnight.`,

      imageUrl: "/recipes/pickled-cucumber.jpg",

      prepTime: 30,
      cookTime: 10,
      servings: 6,

      userId: user.id,
      categoryId: chinese.id,
    },
    [
      {
        nameZh: "黄瓜",
        nameEn: "Cucumber",
        quantity: 1000,
        unit: "g",
      },
      {
        nameZh: "香菜",
        nameEn: "Coriander",
        quantity: 30,
        unit: "g",
      },
      {
        nameZh: "薄皮绿辣椒",
        nameEn: "Green Chilli",
        quantity: 60,
        unit: "g",
      },
      {
        nameZh: "小米辣",
        nameEn: "Bird's Eye Chilli",
        quantity: 50,
        unit: "g",
      },
      {
        nameZh: "大蒜",
        nameEn: "Garlic",
        quantity: 40,
        unit: "g",
      },
      {
        nameZh: "生姜",
        nameEn: "Ginger",
        quantity: 30,
        unit: "g",
      },
      {
        nameZh: "小葱",
        nameEn: "Spring Onion",
        quantity: 30,
        unit: "g",
      },
      {
        nameZh: "八角",
        nameEn: "Star Anise",
        quantity: 4,
        unit: "g",
      },
      {
        nameZh: "花椒",
        nameEn: "Sichuan Peppercorn",
        quantity: 2,
        unit: "g",
      },
      {
        nameZh: "生抽",
        nameEn: "Light Soy Sauce",
        quantity: 120,
        unit: "g",
      },
      {
        nameZh: "老抽",
        nameEn: "Dark Soy Sauce",
        quantity: 10,
        unit: "g",
      },
      {
        nameZh: "冰糖",
        nameEn: "Rock Sugar",
        quantity: 60,
        unit: "g",
      },
      {
        nameZh: "陈醋",
        nameEn: "Chinese Black Vinegar",
        quantity: 35,
        unit: "g",
      },
    ],
  );

  // ============================================================
  // 6. Razor Clam Rice Bowl
  // ============================================================

  await addRecipe(
    {
      titleZh: "蛏子捞饭",
      titleEn: "Razor Clam Rice Bowl",

      descriptionZh:
        "鲜美蛏子搭配肉末、韭菜和浓郁汤汁制作的浇饭。",
      descriptionEn:
        "A savoury rice bowl topped with razor clams, pork mince, chives and a rich glossy sauce.",

      instructionsZh: `1. 蛏子放入盐水中浸泡约1小时吐沙，之后彻底清洗。

2. 将蛏子放入锅中，小火焖至开口，取出蛏子肉并保留汤汁。

3. 韭菜切末，准备肉馅和水淀粉。

4. 锅中加入食用油，将肉馅炒散并炒至出油。

5. 加入料酒和生抽炒香。

6. 加入清水、白胡椒粉、老抽、蚝油、鸡精和白糖。

7. 加入蛏子肉和蛏子汤，煮开。

8. 分次加入水淀粉，使汤汁达到明亮浓稠的状态。

9. 加入韭菜末翻匀，浇在米饭上即可。`,

      instructionsEn: `1. Soak the razor clams in lightly salted water for around 1 hour to remove sand, then rinse thoroughly.

2. Cook the clams gently until they open. Remove the meat and reserve the clam liquid.

3. Chop the chives and prepare the pork mince and starch slurry.

4. Heat oil and cook the pork mince until browned.

5. Add cooking wine and soy sauce.

6. Add water, white pepper, dark soy sauce, oyster sauce, chicken seasoning and sugar.

7. Add the clam meat and reserved clam liquid and bring to a boil.

8. Gradually add the starch slurry until the sauce becomes glossy and thick.

9. Stir in the chives and serve over rice.`,

      imageUrl: "/recipes/razor-clam-rice.jpg",
      prepTime: 20,
      cookTime: 20,
      servings: 3,

      userId: user.id,
      categoryId: chinese.id,
    },
    [
      {
        nameZh: "蛏子",
        nameEn: "Razor Clams",
        quantity: 600,
        unit: "g",
      },
      {
        nameZh: "五花肉馅",
        nameEn: "Pork Mince",
        quantity: 200,
        unit: "g",
      },
      {
        nameZh: "韭菜",
        nameEn: "Chinese Chives",
        quantity: 100,
        unit: "g",
      },
      {
        nameZh: "土豆淀粉",
        nameEn: "Potato Starch",
        quantity: 8,
        unit: "g",
      },
      {
        nameZh: "蚝油",
        nameEn: "Oyster Sauce",
        quantity: 20,
        unit: "g",
      },
      {
        nameZh: "生抽",
        nameEn: "Light Soy Sauce",
        quantity: 15,
        unit: "g",
      },
      {
        nameZh: "老抽",
        nameEn: "Dark Soy Sauce",
        quantity: 10,
        unit: "g",
      },
      {
        nameZh: "白胡椒粉",
        nameEn: "White Pepper",
        quantity: 0.5,
        unit: "g",
      },
    ],
  );

  // ============================================================
  // 7. Beer-Braised Duck
  // ============================================================

  await addRecipe(
    {
      titleZh: "啤酒鸭",
      titleEn: "Beer-Braised Duck",

      descriptionZh:
        "啤酒慢炖鸭肉，香辣浓郁，鸭肉软嫩入味。",
      descriptionEn:
        "Rich and spicy duck slowly braised with beer, aromatics and Sichuan seasonings.",

      instructionsZh: `1. 鸭肉清洗后充分沥干水分。

2. 锅中加入食用油，大火翻炒鸭肉约5至6分钟，直到表面微黄。

3. 加入大蒜、姜片、桂皮、八角、白芷、山奈和花椒炒香。

4. 转小火加入郫县豆瓣酱，炒出红油。

5. 加入干辣椒和啤酒。

6. 加入鸡精、味精、白糖、白胡椒粉和陈醋。

7. 大火煮开后盖盖，转小火炖约30分钟。

8. 开盖转大火收汁，加入线椒和小米辣。

9. 汤汁浓稠后撒葱花即可。`,

      instructionsEn: `1. Clean the duck and dry it thoroughly.

2. Heat oil and stir-fry the duck over high heat for around 5–6 minutes until lightly browned.

3. Add garlic, ginger, cinnamon, star anise and the remaining spices.

4. Reduce the heat and cook the doubanjiang until fragrant and red.

5. Add dried chilli and beer.

6. Season with chicken seasoning, sugar, white pepper and vinegar.

7. Bring to a boil, cover and simmer gently for around 30 minutes.

8. Remove the lid and reduce the sauce over high heat. Add fresh chillies.

9. Finish with spring onion and serve.`,

      imageUrl: "/recipes/beer-duck.jpg",

      prepTime: 20,
      cookTime: 45,
      servings: 4,

      userId: user.id,
      categoryId: chinese.id,
    },
    [
      {
        nameZh: "鸭肉",
        nameEn: "Duck",
        quantity: 1200,
        unit: "g",
      },
      {
        nameZh: "线椒",
        nameEn: "Green Chilli",
        quantity: 60,
        unit: "g",
      },
      {
        nameZh: "小米辣",
        nameEn: "Bird's Eye Chilli",
        quantity: 30,
        unit: "g",
      },
      {
        nameZh: "大蒜",
        nameEn: "Garlic",
        quantity: 40,
        unit: "g",
      },
      {
        nameZh: "生姜",
        nameEn: "Ginger",
        quantity: 30,
        unit: "g",
      },
      {
        nameZh: "郫县豆瓣酱",
        nameEn: "Doubanjiang",
        quantity: 50,
        unit: "g",
      },
      {
        nameZh: "啤酒",
        nameEn: "Beer",
        quantity: 1000,
        unit: "ml",
      },
      {
        nameZh: "八角",
        nameEn: "Star Anise",
        quantity: 4,
        unit: "g",
      },
      {
        nameZh: "青花椒",
        nameEn: "Green Sichuan Peppercorn",
        quantity: 5,
        unit: "g",
      },
      {
        nameZh: "陈醋",
        nameEn: "Chinese Black Vinegar",
        quantity: 5,
        unit: "g",
      },
    ],
  );

  // ============================================================
  // 8. Garlic Shrimp & Vermicelli Claypot
  // ============================================================

  await addRecipe(
    {
      titleZh: "蒜蓉粉丝虾滑煲",
      titleEn: "Garlic Shrimp & Vermicelli Claypot",

      descriptionZh:
        "蒜香浓郁的虾滑粉丝煲，搭配娃娃菜、金针菇和自制蒜蓉酱。",
      descriptionEn:
        "A comforting claypot with shrimp paste, glass noodles, vegetables and a rich garlic sauce.",

      instructionsZh: `1. 龙口粉丝用凉水泡软。

2. 大蒜切成蒜末，小米辣切碎，小葱切葱花。

3. 锅中加入食用油，放入一半蒜末，中小火炒至浅金黄色。

4. 关火后加入剩余蒜末、小米辣和部分葱花。

5. 加入生抽、蚝油、味精和白糖炒匀，制成蒜蓉酱。

6. 将虾滑挤成丸子放入热水中煮熟。

7. 砂锅底部铺洋葱，再铺娃娃菜、金针菇和粉丝。

8. 加入清水、生抽、白胡椒粉、白糖、味精和盐。

9. 加入虾滑并铺上蒜蓉酱。

10. 大火煮开后盖盖，小火煮约3分钟，撒葱花即可。`,

      instructionsEn: `1. Soak the glass noodles in cold water until softened.

2. Finely chop the garlic, chilli and spring onion.

3. Heat oil and gently fry half of the garlic until lightly golden.

4. Turn off the heat and add the remaining garlic, chilli and some spring onion.

5. Add soy sauce, oyster sauce and sugar to make the garlic sauce.

6. Form the shrimp paste into balls and briefly poach them until cooked.

7. Layer onion, baby napa cabbage, enoki mushrooms and noodles in a claypot.

8. Add water, soy sauce, white pepper, sugar and salt.

9. Add the shrimp balls and spread the garlic sauce over the top.

10. Bring to a boil, cover and simmer for around 3 minutes. Finish with spring onion.`,

      imageUrl: "/recipes/shrimp-vermicelli.jpg",
      prepTime: 20,
      cookTime: 15,
      servings: 3,

      userId: user.id,
      categoryId: chinese.id,
    },
    [
      {
        nameZh: "龙口粉丝",
        nameEn: "Glass Noodles",
        quantity: 45,
        unit: "g",
      },
      {
        nameZh: "娃娃菜",
        nameEn: "Baby Napa Cabbage",
        quantity: 130,
        unit: "g",
      },
      {
        nameZh: "金针菇",
        nameEn: "Enoki Mushrooms",
        quantity: 100,
        unit: "g",
      },
      {
        nameZh: "洋葱",
        nameEn: "Onion",
        quantity: 20,
        unit: "g",
      },
      {
        nameZh: "虾滑",
        nameEn: "Shrimp Paste",
        quantity: 300,
        unit: "g",
      },
      {
        nameZh: "大蒜",
        nameEn: "Garlic",
        quantity: 100,
        unit: "g",
      },
      {
        nameZh: "小米辣",
        nameEn: "Bird's Eye Chilli",
        quantity: 20,
        unit: "g",
      },
      {
        nameZh: "小葱",
        nameEn: "Spring Onion",
        quantity: 10,
        unit: "g",
      },
      {
        nameZh: "生抽",
        nameEn: "Light Soy Sauce",
        quantity: 35,
        unit: "g",
      },
      {
        nameZh: "蚝油",
        nameEn: "Oyster Sauce",
        quantity: 20,
        unit: "g",
      },
    ],
  );

  console.log("✅ PantryPal bilingual seed completed.");
}

main()
  .catch((error) => {
    console.error("❌ Seed failed:");
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
# PantryPal

PantryPal is a bilingual full-stack recipe management platform built with Next.js, React, TypeScript, Prisma, and PostgreSQL.

It allows users to discover recipes, search by ingredients, save favourites, rate recipes, and manage their own recipe collection with Google authentication.

## Live Demo

https://pantrypal-neon-rho.vercel.app

## Features

- Browse all public recipes
- Search recipes by title, description, and ingredients
- Filter recipes by category
- English / 中文 language switching
- Google OAuth authentication
- Create new recipes
- Edit and delete owned recipes
- Favourite recipes
- Rate recipes from 1 to 5 stars
- Responsive design for desktop and mobile
- Production caching for public recipe pages
- SEO metadata, sitemap, and robots configuration

## Tech Stack

### Frontend

- Next.js 16
- React
- TypeScript
- Tailwind CSS
- Next.js App Router
- Next/Image

### Backend

- Next.js Server Components
- Server Actions
- Auth.js
- Prisma ORM
- PostgreSQL

### Authentication

- Auth.js
- Google OAuth 2.0

### Database

- PostgreSQL
- Neon Serverless Postgres

### Deployment

- Vercel
- Neon PostgreSQL
- GitHub-based automatic deployments

## Architecture

```text
                    Users
                      |
                      v
             +----------------+
             |     Vercel     |
             | Next.js 16 App |
             +----------------+
                |          |
                |          |
                v          v
          +----------+   +----------------+
          | Auth.js  |   |  Prisma ORM    |
          +----------+   +----------------+
                |              |
                v              v
          +----------+   +----------------+
          |  Google  |   | Neon PostgreSQL|
          |  OAuth   |   |    Sydney      |
          +----------+   +----------------+
```

Deployment workflow:

```text
GitHub main
    |
    v
Vercel Build
    |
    v
Production Deployment
```

## Application Structure

```text
src/
├── app/
│   ├── api/
│   │   └── auth/
│   ├── favorites/
│   ├── recipes/
│   │   ├── [id]/
│   │   │   ├── edit/
│   │   │   ├── actions.ts
│   │   │   ├── favorite-actions.ts
│   │   │   ├── rating-actions.ts
│   │   │   ├── FavoriteButton.tsx
│   │   │   ├── RatingStars.tsx
│   │   │   └── RecipeDetailClient.tsx
│   │   ├── new/
│   │   ├── RecipesClient.tsx
│   │   └── page.tsx
│   ├── layout.tsx
│   ├── page.tsx
│   ├── robots.ts
│   └── sitemap.ts
│
├── components/
│   ├── AuthButton.tsx
│   ├── Navbar.tsx
│   └── NavbarClient.tsx
│
├── hooks/
│   └── useLanguage.ts
│
├── lib/
│   ├── i18n.ts
│   └── prisma.ts
│
└── auth.ts
```

## Database Design

The main database entities include:

- User
- Recipe
- Ingredient
- RecipeIngredient
- Category
- Favorite
- Rating
- Account
- Session
- VerificationToken

Key relationships:

```text
User
 ├── Recipes
 ├── Favorites
 └── Ratings

Recipe
 ├── Category
 ├── Ingredients
 ├── Favorites
 └── Ratings
```

Each user can create and manage their own recipes, while all recipes remain publicly viewable.

Ownership validation is enforced both in the UI and in server-side actions.

## Authentication and Authorization

PantryPal uses Auth.js with Google OAuth.

Public users can:

- Browse recipes
- Search and filter recipes
- View recipe details
- View recipe ratings

Authenticated users can additionally:

- Create recipes
- Favourite recipes
- Rate recipes

Recipe owners can additionally:

- Edit their recipes
- Delete their recipes

Server-side ownership checks prevent users from modifying recipes belonging to another account.

## Performance

Public recipe data is cached using Next.js caching APIs.

Recipe creation, editing, and deletion automatically invalidate the recipe cache so users receive updated content without waiting for the normal cache expiration period.

The production deployment is hosted close to the PostgreSQL database region to reduce database latency.

### Lighthouse

The production site achieved:

| Category | Score |
|---|---:|
| Performance | 100 |
| Accessibility | 100 |
| Best Practices | 100 |
| SEO | 100 |

## Internationalisation

PantryPal currently supports:

- English
- Simplified Chinese

Recipe titles, descriptions, instructions, ingredients, and categories can be stored in both languages.

The selected language is persisted locally in the browser.

## Local Development

### Prerequisites

- Node.js
- npm
- Docker
- PostgreSQL
- Google OAuth credentials

### 1. Clone the repository

```bash
git clone https://github.com/564849457/pantrypal.git
cd pantrypal
```

### 2. Install dependencies

```bash
npm install
```

### 3. Start PostgreSQL

```bash
docker compose up -d
```

### 4. Configure environment variables

Create a `.env` file:

```env
DATABASE_URL="postgresql://pantrypal:pantrypal@localhost:5432/pantrypal"
DIRECT_URL="postgresql://pantrypal:pantrypal@localhost:5432/pantrypal"
AUTH_SECRET="your-auth-secret"
AUTH_GOOGLE_ID="your-google-client-id"
AUTH_GOOGLE_SECRET="your-google-client-secret"
NEXT_PUBLIC_SITE_URL="http://localhost:3000"
```

Do not commit environment files or secrets to Git.

### 5. Apply database migrations

```bash
npx prisma migrate dev
```

### 6. Generate Prisma Client

```bash
npx prisma generate
```

### 7. Seed sample recipes

```bash
npm run seed
```

### 8. Start the development server

```bash
npm run dev
```

Open:

```text
http://localhost:3000
```

## Production Database

Production uses Neon PostgreSQL.

The application uses a pooled PostgreSQL connection for application traffic and a direct connection for Prisma migrations.

Example configuration:

```env
DATABASE_URL="NEON_POOLED_CONNECTION_STRING"
DIRECT_URL="NEON_DIRECT_CONNECTION_STRING"
```

Production migrations can be applied using:

```bash
npx dotenv -e .env.production -- npx prisma migrate deploy
```

## Production Build

```bash
npm run build
```

## Deployment

The application is deployed through Vercel.

Every push to the main GitHub branch triggers an automatic production build and deployment.

```text
Git Push
   |
   v
GitHub
   |
   v
Vercel Build
   |
   v
Production
```

Environment variables are configured securely through Vercel and are not stored in the repository.

## Future Improvements

Potential future additions include:

- Weekly meal planning
- Automatic shopping list generation
- Printable PDF shopping lists
- Calendar export
- Recipe image uploads using object storage
- Nutrition information
- Recipe recommendations
- Mobile application
- AI-assisted recipe suggestions

## Author

**Ye Lin**

- Portfolio: https://www.linyedev.com
- GitHub: https://github.com/564849457
- LinkedIn: https://www.linkedin.com/in/lin-ye-3aa2a9403/

## License

This project is intended primarily as a personal portfolio and learning project.

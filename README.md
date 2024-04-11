# Full Stack Trello Clone with Next.js 14 App Router: React, Tailwind, Prisma, Server Actions , MySql , Clerk and ShadcnUI 2024

![Screenshot 2024-04-11 204057](https://github.com/PSriVignesH/ecommerce-admin-dashboard/assets/111482290/a06a3a65-f5b5-4df8-a808-92ca5821837d)

This is a repository for a Full Stack Trello Clone with Next.js 14 App Router: React, Tailwind, Prisma, MySQL, Clerk and Server actions.


Features:
   
- Auth using clerk
- Organizations / Workspaces
- Board creation
- Unsplash API for random beautiful cover images
- Activity log for entire organization
- Board rename and delete
- List creation
- List rename, delete, drag & drop reorder and copy
- Card creation
- Card description, rename, delete, drag & drop reorder and copy
- Card activity log
- Board limit for every organization
- Stripe subscription for each organization to unlock unlimited boards
- Landing page
- MySQL DB with Aiven
- Prisma ORM
- shadcnUI & TailwindCSS

### Prerequisites

**Node version 14.x**

### Cloning the repository

```shell
git clone https://github.com/PSriVignesH/trello-clone.git
```

### Install packages

```shell
npm i
```

### Setup .env file


```js
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=
CLERK_SECRET_KEY=
NEXT_PUBLIC_CLERK_SIGN_IN_URL=
NEXT_PUBLIC_CLERK_SIGN_UP_URL=
NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL=
NEXT_PUBLIC_CLERK_AFTER_SIGN_UP_URL=
DATABASE_URL=
NEXT_PUBLIC_UNSPLASH_ACCESS_KEY=
STRIPE_API_KEY=
NEXT_PUBLIC_APP_URL=
STRIPE_WEBHOOK_SECRET = 
```

### Setup Prisma

```shell
npx prisma db push

```

### Start the app

```shell
npm run dev
```

## Available commands
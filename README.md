<h1 align="center">E-Commerce Store 🛒</h1>

A full-stack e-commerce app with auth, cart, checkout, coupons, and an admin dashboard. Built by **Rohit Chigatapu**.

![Demo App](/frontend/public/screenshot-for-readme.png)

- **Live demo:** https://ecommerce-1-kohl.vercel.app
- **Repo:** https://github.com/Rohit04052004/ecommerce-1
- **Author:** [Rohit Chigatapu](https://github.com/Rohit04052004)

## Features

- 🗄️ PostgreSQL via Prisma ORM (hosted on Neon, provisioned through Vercel's integration — no manual DB setup needed)
- 🔐 JWT auth with access/refresh tokens, httpOnly cookies
- 📦 Product & category management, featured/recommended products
- 🛍️ Shopping cart, 🏷️ coupon codes
- 💳 Stripe checkout — optional; if `STRIPE_SECRET_KEY` isn't set, checkout endpoints return a clear "Stripe API key missing" error instead of crashing
- 👑 Admin dashboard with 📊 sales analytics
- 🎨 React + Tailwind frontend (Vite)

## Tech stack

**Frontend**: React, Vite, Tailwind CSS
**Backend**: Node.js, Express, PostgreSQL via Prisma, JWT, Stripe (optional), Cloudinary (optional)

This started as a MongoDB + Redis MERN app and was migrated to Postgres/Prisma, with Redis removed entirely (refresh tokens are now stateless JWTs — no server-side session store — and the featured-products cache was dropped in favor of querying the DB directly).

This is a single deployable app: the Express server exposes the API under `/api/*` and, in production, serves the built React frontend for everything else.

## Setup

### 0. Clone

```bash
git clone https://github.com/Rohit04052004/ecommerce-1.git
cd ecommerce-1
```

### 1. Database

The project uses Prisma + PostgreSQL. On Vercel this is Neon, provisioned automatically via `vercel integration add neon`, which injects `POSTGRES_PRISMA_URL` / `POSTGRES_URL_NON_POOLING` as project env vars — no manual database setup required.

For local development, pull those same env vars with `vercel env pull .env.local`, or point `prisma/schema.prisma` at any Postgres connection string.

### 2. Environment variables

Create a `.env` file in the project root:

```bash
PORT=5000
POSTGRES_PRISMA_URL=your_pooled_postgres_url
POSTGRES_URL_NON_POOLING=your_direct_postgres_url

ACCESS_TOKEN_SECRET=your_access_token_secret
REFRESH_TOKEN_SECRET=your_refresh_token_secret

# Optional — checkout returns a clear error if this is missing
STRIPE_SECRET_KEY=your_stripe_secret_key

# Optional — product image upload is skipped if these aren't set
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret

CLIENT_URL=http://localhost:5173
NODE_ENV=development
```

### 3. Run locally

```bash
npm install                     # also runs `prisma generate` via postinstall
npm run prisma:migrate          # applies the schema to your database
npm install --prefix frontend
npm run dev                     # backend, with nodemon
npm run dev --prefix frontend   # frontend, in a second terminal
```

### 4. Production build (single-server deploy, e.g. Render/Railway)

```bash
npm run build   # installs deps + builds the frontend into frontend/dist
npm run start
```

## Deployment

This repo includes a root `vercel.json` that builds the frontend as a static site and the backend (`backend/server.js`) as a Node serverless function, routing `/api/*` to the function and everything else to the static build.

- **Status:** live at https://ecommerce-1-kohl.vercel.app
- **Database:** Postgres via Neon, provisioned through Vercel's integration — `POSTGRES_PRISMA_URL` / `POSTGRES_URL_NON_POOLING` are set automatically
- **Auth secrets:** `ACCESS_TOKEN_SECRET`, `REFRESH_TOKEN_SECRET`, `CLIENT_URL` are set on the Vercel project
- **Auto-deploy:** the Vercel project is connected to this GitHub repo — every push to `main` triggers a new production deployment
- **Not yet configured:** `STRIPE_SECRET_KEY` (checkout returns a 503 until this is set) and the Cloudinary vars (needed only for product image upload)

To redeploy manually or set up your own copy:

```bash
npm i -g vercel
vercel link            # link this directory to a Vercel project
vercel integration add neon   # provisions Postgres automatically, no account needed up front
vercel env add ACCESS_TOKEN_SECRET production
vercel env add REFRESH_TOKEN_SECRET production
vercel env add CLIENT_URL production
vercel --prod
```

## Credits

Adapted from an open-source MERN e-commerce tutorial project, migrated to Postgres/Prisma and extended here by Rohit Chigatapu.

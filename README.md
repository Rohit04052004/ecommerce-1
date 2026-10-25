<h1 align="center">E-Commerce Store 🛒</h1>

A full-stack MERN e-commerce app with auth, cart, checkout, coupons, and an admin dashboard. Built by **Rohit Chigatapu**.

![Demo App](/frontend/public/screenshot-for-readme.png)

## Features

- 🗄️ MongoDB (Mongoose) + Redis (Upstash) caching
- 🔐 JWT auth with access/refresh tokens, httpOnly cookies
- 📦 Product & category management, featured/recommended products
- 🛍️ Shopping cart, 🏷️ coupon codes, 💳 Stripe checkout
- 👑 Admin dashboard with 📊 sales analytics
- 🎨 React + Tailwind frontend (Vite)

## Tech stack

**Frontend**: React, Vite, Tailwind CSS
**Backend**: Node.js, Express, MongoDB/Mongoose, Redis (ioredis/Upstash), JWT, Stripe, Cloudinary

This is a single deployable app: the Express server exposes the API under `/api/*` and, in production, serves the built React frontend for everything else.

## Setup

### 1. Environment variables

Create a `.env` file in the project root:

```bash
PORT=5000
MONGO_URI=your_mongo_uri

UPSTASH_REDIS_URL=your_redis_url

ACCESS_TOKEN_SECRET=your_access_token_secret
REFRESH_TOKEN_SECRET=your_refresh_token_secret

CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret

STRIPE_SECRET_KEY=your_stripe_secret_key
CLIENT_URL=http://localhost:5173
NODE_ENV=development
```

### 2. Run locally

```bash
npm install
npm install --prefix frontend
npm run dev          # backend, with nodemon
npm run dev --prefix frontend   # frontend, in a second terminal
```

### 3. Production build (single-server deploy, e.g. Render/Railway)

```bash
npm run build   # installs deps + builds the frontend into frontend/dist
npm run start
```

## Deploying on Vercel

This repo includes a root `vercel.json` that builds the frontend as a static site and the backend (`backend/server.js`) as a Node serverless function, routing `/api/*` to the function and everything else to the static build.

Add the same environment variables from above to the Vercel project settings (Project → Settings → Environment Variables) before deploying — without a real `MONGO_URI`, `UPSTASH_REDIS_URL`, `STRIPE_SECRET_KEY`, and Cloudinary credentials, the site will load but API calls (auth, cart, checkout, etc.) will fail.

## Credits

Adapted from an open-source MERN e-commerce tutorial project, maintained and extended here by Rohit Chigatapu.

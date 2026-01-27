---
description: How to deploy the Database (Vercel Postgres) and connect it to your Vercel deployment.
---

# Deploying the Database on Vercel

Since you are hosting the app on Vercel, the easiest way to get a live database is to use **Vercel Postgres** (managed by Neon).

## 1. Create the Database Store
1. Go to your [Vercel Dashboard](https://vercel.com/dashboard).
2. Navigate to your **Kadaver** project.
3. Go to the **Storage** tab.
4. Click **Create Database**.
5. Select **Postgres**.
6. Give it a name (e.g., `kadaver-db-prod`) and select a region (choose one close to your users, e.g., Frankfurt `fra1` or London `lon1`).
7. Click **Create** and wait for it to provision.

## 2. Connect to Your Project
1. Once created, Vercel should automatically prompt you to connect it to your project.
2. If not, go to **Settings > Environment Variables**.
3. You should see new variables automatically added:
   - `POSTGRES_URL`
   - `POSTGRES_PRISMA_URL`
   - `POSTGRES_URL_NON_POOLING`
   - etc.

> **Important**: Prisma needs two specific variable names. Vercel provides them, but sometimes the naming differs slightly.
> Ensure your **Environment Variables** in Vercel include:
> - `DATABASE_URL` -> Value of `POSTGRES_PRISMA_URL`
> - `DIRECT_URL` -> Value of `POSTGRES_URL_NON_POOLING`
> 
> *You may need to manually Add these two variables by copying the values from the Vercel-generated ones.*

## 3. Push Your Schema to Production
You need to apply your local schema to this new remote database. You can do this from your local terminal.

First, pull the latest environment variables from Vercel to your local machine (requires Vercel CLI):
```bash
npm i -g vercel
vercel link
vercel env pull .env.production.local
```

Now, run the migration commands pointing to the *production* database. 
**Note**: The safest way is to temporarily set your `.env` `DATABASE_URL` to the production URL, OR explicitly pass it.

An easier way using the pulled env file:
```bash
# This applies migrations to the DB defined in .env.production.local
npx dotenv -e .env.production.local -- npx prisma migrate deploy
```

## 4. Seed Production Data (Optional)
If you want your "Kafka" seed data in production:

```bash
npx dotenv -e .env.production.local -- npx prisma db seed
```
*Note: Make sure your `package.json` seed script is configured, or run the ts-node command directly.*

## 5. Redeploy Application
1. Go to Vercel Deployments.
2. Redeploy the latest commit (to ensure the new Env Vars are picked up by the build).

---

## 6. Admin Access
Your production Admin Panel will need the password.
1. Go to Vercel **Settings > Environment Variables**.
2. Add `ADMIN_PASSWORD`.
3. Set your secret passphrase.
4. Redeploy.

## Troubleshooting
- **Connection Limitations**: Vercel Postgres has a limit on concurrent connections. Prisma accelerates this, but ensure you use `POSTGRES_PRISMA_URL` (pooling) for the app and `POSTGRES_URL_NON_POOLING` for migrations.

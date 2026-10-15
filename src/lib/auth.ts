import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import prisma from "./db";

const productionURL =
  process.env.BETTER_AUTH_URL ?? process.env.NEXT_PUBLIC_APP_URL ?? undefined;

const allowedHosts = ["localhost:3000", "*.vercel.app"];

if (productionURL) {
  try {
    allowedHosts.push(new URL(productionURL).host);
  } catch {
    allowedHosts.push(productionURL);
  }
}

if (process.env.VERCEL_PROJECT_PRODUCTION_URL) {
  allowedHosts.push(process.env.VERCEL_PROJECT_PRODUCTION_URL);
}

export const auth = betterAuth({
  baseURL: {
    allowedHosts,
    fallback: productionURL,
    protocol: process.env.NODE_ENV === "production" ? "https" : "auto",
  },
  secret: process.env.BETTER_AUTH_SECRET,
  trustedOrigins: [
    "http://localhost:3000",
    "https://*.vercel.app",
    ...(productionURL ? [productionURL] : []),
  ],
  database: prismaAdapter(prisma, {
    provider: "postgresql",
  }),
  emailAndPassword: {
    enabled: true,
    autoSignIn: true,
  },
  socialProviders: {
    github: {
      clientId: process.env.GITHUB_CLIENT_ID as string,
      clientSecret: process.env.GITHUB_CLIENT_SECRET as string,
    },
    google: {
      clientId: process.env.GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
    },
  },
});

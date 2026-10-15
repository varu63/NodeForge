import { type BetterAuthOptions, betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import prisma from "./db";

const isNextBuild = process.env.NEXT_PHASE === "phase-production-build";

const FATAL_ENV_VARS = ["DATABASE_URL", "BETTER_AUTH_SECRET"] as const;

const OPTIONAL_ENV_VARS = [
  "BETTER_AUTH_URL",
  "NEXT_PUBLIC_APP_URL",
  "GITHUB_CLIENT_ID",
  "GITHUB_CLIENT_SECRET",
  "GOOGLE_CLIENT_ID",
  "GOOGLE_CLIENT_SECRET",
] as const;

function isBlank(name: string) {
  const value = process.env[name];
  return value === undefined || value.trim() === "";
}

function checkAuthEnv() {
  const missingFatal = FATAL_ENV_VARS.filter(isBlank);

  if (missingFatal.length > 0) {
    throw new Error(
      `[auth] Missing required environment variable(s): ${missingFatal.join(
        ", ",
      )}. Set them locally in .env and in Vercel (Project Settings → Environment Variables), then redeploy.`,
    );
  }

  const missingOptional = OPTIONAL_ENV_VARS.filter(isBlank);

  if (missingOptional.length > 0) {
    console.warn(
      `[auth] Environment variable(s) not set: ${missingOptional.join(
        ", ",
      )}. These are not fatal, but the related features (for example social sign-in) stay disabled until they are configured.`,
    );
  }
}

if (!isNextBuild) {
  checkAuthEnv();
}

const productionURL =
  process.env.BETTER_AUTH_URL ?? process.env.NEXT_PUBLIC_APP_URL;

const trustedOrigins = [
  "http://localhost:3000",
  "https://*.vercel.app",
  productionURL,
  process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : undefined,
  process.env.VERCEL_PROJECT_PRODUCTION_URL
    ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`
    : undefined,
  process.env.NEXT_PUBLIC_APP_URL,
].filter((origin): origin is string => Boolean(origin));

const socialProviders: NonNullable<BetterAuthOptions["socialProviders"]> = {};

if (!isBlank("GITHUB_CLIENT_ID") && !isBlank("GITHUB_CLIENT_SECRET")) {
  socialProviders.github = {
    clientId: process.env.GITHUB_CLIENT_ID as string,
    clientSecret: process.env.GITHUB_CLIENT_SECRET as string,
  };
}

if (!isBlank("GOOGLE_CLIENT_ID") && !isBlank("GOOGLE_CLIENT_SECRET")) {
  socialProviders.google = {
    clientId: process.env.GOOGLE_CLIENT_ID as string,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
  };
}

export const auth = betterAuth({
  baseURL: productionURL,
  secret: process.env.BETTER_AUTH_SECRET,
  trustedOrigins,
  database: prismaAdapter(prisma, {
    provider: "postgresql",
  }),
  emailAndPassword: {
    enabled: true,
    autoSignIn: true,
  },
  socialProviders,
  logger: {
    level: "error",
    disabled: false,
  },
  advanced: {
    useSecureCookies: process.env.NODE_ENV === "production",
  },
});

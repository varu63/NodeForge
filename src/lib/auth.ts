import {checkout , polar , portal} from "@polar-sh/better-auth"
import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import prisma from "./db";
import { polarClient } from "./polar";

export const auth = betterAuth({
baseURL: process.env.BETTER_AUTH_URL, 
  database: prismaAdapter(prisma, {
        provider: "postgresql", 
    }),
    emailAndPassword: {
        enabled: true,
        authSingIn: true,
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
    plugins:[
        polar({
            client: polarClient,
            createCustomerOnSignUp: true,
            use:[
                checkout({
                    products:[
                        {
                            productId:"854ce4b9-725b-4782-907f-980d1931c9cd",
                            slug:"pro"
                        }
                    ],
                    successUrl: process.env.POLAR_SUCCESS_URL || "http://localhost:3000",
                    authenticatedUsersOnly: true,
                }),
                portal(),
            ]
        })
    ]
});
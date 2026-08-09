import {checkout , polar , portal} from "@polar-sh/better-auth"
import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import prisma from "./db";
import { polarClient } from "./polar";

export const auth = betterAuth({
  database: prismaAdapter(prisma, {
        provider: "postgresql", 
    }),
    emailAndPassword: {
        enabled: true,
        authSingIn: true,
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
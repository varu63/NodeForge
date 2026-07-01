import { z } from "zod";
import prisma from "@/lib/db"; // adjust the path if needed
import { createTRPCRouter, protectedProcedure } from "../init";
import { inngest } from "@/inngest/client";
import { generateText } from "ai";
import { google } from "@ai-sdk/google";

export const appRouter = createTRPCRouter({
  testai: protectedProcedure.mutation(async () => {
    await inngest.send({
      name:"execute/ai"
    })
    return { success: true , message: "job queued"}
}),
  getUsers: protectedProcedure.query(async (ctx) => {
    return await prisma.account.findMany();
  }),

  createworkflow: protectedProcedure.mutation(async () => {
    await inngest.send({
      name: "app/task.created",
      data: {
        email: "test@gmail.com",
      },
    });
    return prisma.workflow.create({
      data: {
        name: "test-workflow",
      },
    });
  }),
});

export type AppRouter = typeof appRouter;

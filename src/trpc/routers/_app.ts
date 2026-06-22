import { z } from "zod";
import prisma from "@/lib/db"; // adjust the path if needed
import { baseProcedure, createTRPCRouter } from "../init";

export const appRouter = createTRPCRouter({
  getUsers: baseProcedure.query(async () => {
    return await prisma.user.findMany();
  }),
});

export type AppRouter = typeof appRouter;
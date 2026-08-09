import { initTRPC, TRPCError } from '@trpc/server';
import { cache } from 'react';
import {auth} from '@/lib/auth';
import { headers } from 'next/headers';
import { polarClient } from '@/lib/polar';
export const createTRPCContext = cache(async () => {
   return { userId: 'user_123' };
 });

 const t = initTRPC.create({});
 //Base router and procedure helpers
 export const createTRPCRouter = t.router;
 export const createCallerFactory = t.createCallerFactory;
 export const baseProcedure = t.procedure;
export const protectedProcedure =baseProcedure.use(async ({ctx , next}) =>{
  const session = await auth.api.getSession({
      headers:await headers()
    });
    if(!session){
      throw new TRPCError({
        code:"UNAUTHORIZED",
        message:"Unauthorized"
      })
    }
return next({ctx : {...ctx , auth: session}});
})
export const premiumProcedure = protectedProcedure.use(
  async ({ctx , next}) =>{
    const customer = await polarClient.customers.getStateExteranal({
      externalId: ctx.auth.user.id
    })
    if(
      !customer.activeSubscription ||
      customer.activeSubscription.length === 0
    ){
   throw new TRPCError({
      code:"FORBIDDEN",
      message:"You need an active subscription to access this resource"
   })
    }
    return next({ctx : {...ctx , customer}});
  }
)
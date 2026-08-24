"use server"

import { getSubscriptionToken , type Realtime } from "@inngest/realtime"

import { inngest } from "@/inngest/client"
import { manualtriggerChannel } from "@/inngest/channels/manual-trigger"

export type ManualTriggerToken = Realtime.Token<
typeof manualtriggerChannel,
["status"]
>

export async function fetchManualTriggerRealtimeToken():
Promise<ManualTriggerToken>{
    const token = await getSubscriptionToken(inngest , {
        channel: manualtriggerChannel(),
        topics:["status"]
    })
    return token
}
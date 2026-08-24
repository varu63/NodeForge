
import {channel , topic} from "@inngest/realtime"

export const MANULA_TRIGGER_CHANNEL_NAME = "http-request-execution"
export const manualtriggerChannel = channel(MANULA_TRIGGER_CHANNEL_NAME)
.addTopic(
    topic("status").type<{
        nodeId: string
        status:"loading"| "success" | "error"
    }>()
)
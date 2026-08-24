import type { NodeExecutor } from "@/features/executions/types";
import { manualtriggerChannel } from "@/inngest/channels/manual-trigger";
type ManualTriggerData = Record<string , unknown>

export const manualTriggerExecutor: NodeExecutor<ManualTriggerData> = async({
    nodeId,
    context,
    step,
    publish,
})=>{
    await publish(
        manualtriggerChannel().status({
            nodeId,
            status : "loading"
        })
    )
    const result = await step.run("manual-tirgger" , async()=> context)
    
    await publish(
        manualtriggerChannel().status({
            nodeId,
            status : "success"
        })
    )
    return result
}
import { NodeProps } from "@xyflow/react";
import{memo, useState} from "react"
import { BaseTriggerNode } from "../base-trigger-node";
import { GoogleFormTriggerDialog } from "./dialog";
import { useNodeStatus } from "@/features/executions/hooks/use-node-status";
import { GOOGLE_FORM_TRIGGER_CHANNEL_NAME } from "@/inngest/channels/gogle-form-trigger";
import { fetchGoogleFormTriggerRealtimeToken } from "./actions";

export const GoogleFormTrigger = memo((props: NodeProps) =>{
    const [dialogOpen , setDialogOpen] = useState(false)
    const handleOpenSetting = ()=>setDialogOpen(true)
    const nodeStatus = useNodeStatus({
            nodeId: props.id ,
            channel: GOOGLE_FORM_TRIGGER_CHANNEL_NAME,
            topic:"status",
            refreshToken: fetchGoogleFormTriggerRealtimeToken
         })
    
    return (
        <>
        <GoogleFormTriggerDialog open={dialogOpen} onOpenChange={setDialogOpen}/>
    <BaseTriggerNode
        {...props}
        icon = "/googleform.svg"
        name = "Google Form"
        description="when from is sumbited"
        status = {nodeStatus}
        onSettings={handleOpenSetting}
        onDoubleClick={handleOpenSetting}
    />
    </>
    )
})
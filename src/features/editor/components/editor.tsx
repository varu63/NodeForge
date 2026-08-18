"use client"

import { LoadingView  , ErrorView} from "@/components/entity-components"
import { useSupenseWorkflow } from "@/features/workflows/hooks/use-workflows"

export const EditorLoading =()=>{
    return<LoadingView message="Loading editor.."/>
}

export const EditorError =()=>{
    return<ErrorView message="Error loading editor.."/>
}

export const Editor =({workflowId}: {workflowId :string}) =>{
    const {data : workflow} = useSupenseWorkflow(workflowId)
    return(
        <p>
            {JSON.stringify(workflow,null,2)}
        </p>
    )
}
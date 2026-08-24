import { NonRetriableError } from "inngest";
import { inngest } from "./client";
import prisma from "@/lib/db";
import { topologicalSort } from "./utils";
import { NodeType } from "@/generated/prisma";
import { getExecutor } from "@/features/executions/lib/executor-registry";
import { httpRequestChannel } from "./channels/http-request";
import { manualtriggerChannel } from "./channels/manual-trigger";
import { googleFormTriggerChannel } from "./channels/gogle-form-trigger";

export const executeWorkflow = inngest.createFunction(
  {
    id: "execute-workflow",
  },
  {
      event: "workflows/execute-workflow",
      channels:[
        httpRequestChannel(),
        manualtriggerChannel(),
        googleFormTriggerChannel(),
      ]
  },
  async ({ event, step , publish}) => {
    const workflowId = event.data.workflowId
    if(!workflowId){
      throw new NonRetriableError("Worflow ID is missing")
    }
    const sortedNodes = await step.run("prepare-workflow" , async()=>{
      const workflow = await prisma.workflow.findUniqueOrThrow({
        where:{
          id : workflowId
        },
        include :{
          nodes: true,
          connections: true
        }
      })
      return topologicalSort(workflow.nodes , workflow.connections)
    })
    //initialize the context with any initial data from the trigger
    let context = event.data.initialData || {}

    //exectue each node
    for(const node of sortedNodes){
      const executor = getExecutor(node.type as NodeType)
      context = await executor({
        data: node.data as Record<string , string>,
        nodeId : node.id,
        context,
        step,
        publish
      })
    }

    return{workflowId , result: context}
  },
);
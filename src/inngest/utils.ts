import { Connection , Node } from "@/generated/prisma";
import toposort from "toposort"
import { inngest } from "./client";

export const topologicalSort = (
    nodes: Node[] ,
    connections : Connection[]
): Node[] =>{
    if(connections.length === 0){
        return nodes
    }

// create edges array for toposort
    const edges : [string , string][] = connections.map((conn)=>[
        conn.fromNodeId,
        conn.toNodeId
    ])
// Add notes with no connection as self
    const connectedNodeIds = new Set<string>()
    for(const conn of connections){
        connectedNodeIds.add(conn.fromNodeId)
        connectedNodeIds.add(conn.toNodeId)
    }
    for(const node of nodes){
        if(!connectedNodeIds.has(node.id)){
            edges.push([node.id , node.id])
        }
    }

    // preform topological sort
    let sorteNodeIds : string[]

    try{
        sorteNodeIds = toposort(edges)
        //Remove dulicates (from self edges)
        sorteNodeIds = [...new Set(sorteNodeIds)]
    }
    catch(error){
        if(error instanceof Error && error.message.includes("Cyclic")){
            throw new Error("Workflow contains a cycle")
        }
        throw error
    }
    //Map sorted IDs back to node object
    const nodeMap = new Map(nodes.map((n)=>[n.id , n]))
    return sorteNodeIds.map((id)=>nodeMap.get(id)!).filter(Boolean)
}


export const sendWorkflowExecution = async (data:{
    workflowId: string 
    [key: string] : any
})=>{
    return inngest.send({
        name:"workflows/execute-workflow",
        data,
    }
    )
}
import {useQueryClient, useSuspenseQuery , useMutation} from "@tanstack/react-query";
import { useTRPC } from "@/trpc/client";
import { toast } from "sonner";
import { useWrokflowsParams } from "./use-workflows-params";

//Hooks for fetching workflows data using suspense queries
export const useSupspenseWorkflows =()=>{
    const trpc = useTRPC();
    const [params] = useWrokflowsParams()
    return useSuspenseQuery(trpc.workflows.getAll.queryOptions(params))
}

// Hooks for creating a new workflow
export const useCreateWorkflow =()=>{
    const queryClient = useQueryClient();
    const trpc = useTRPC();

    return useMutation(
        trpc.workflows.create.mutationOptions({
            onSuccess:(data)=>{
                toast.success(`Workflow "${data.name}" created successfully`);
                queryClient.invalidateQueries
                (
                    trpc.workflows.getAll.queryOptions({})
                );
            },
            onError:(error)=>{
                toast.error(`Failed to create workflow: ${error.message}`);
            }
        })
    )
}

export const useRemoveWorkflow =() =>{
    const queryClient = useQueryClient();
    const trpc = useTRPC();
    return useMutation(
        trpc.workflows.remove.mutationOptions({
            onSuccess(data) {
                toast.success(`Workflow"${data.name}" removed`)
                queryClient.invalidateQueries(trpc.workflows.getAll.queryOptions({}))
                queryClient.invalidateQueries(
                    trpc.workflows.getOne.queryFilter({id: data.id})
                )
                
            },
        })
    )

}

export const useSupenseWorkflow = (id: string) =>{
    const trpc = useTRPC()
    return useSuspenseQuery(trpc.workflows.getOne.queryOptions({id}))
}

// Hooks for update the workflow name
export const useUpdateWorkflowsName=()=>{
    const queryClient = useQueryClient();
    const trpc = useTRPC();

    return useMutation(
        trpc.workflows.updateName.mutationOptions({
            onSuccess:(data)=>{
                toast.success(`Workflow "${data.name}" updated`);
                queryClient.invalidateQueries
                (
                    trpc.workflows.getAll.queryOptions({})
                );
                queryClient.invalidateQueries(
                    trpc.workflows.getOne.queryOptions({id: data.id})
                )
            },
            onError:(error)=>{
                toast.error(`Failed to update workflow name: ${error.message}`);
            }
        })
    )
}

import {useQueryClient, useSuspenseQuery , useMutation, useQuery} from "@tanstack/react-query";
import { useTRPC } from "@/trpc/client";
import { toast } from "sonner";
import { useCredentialsParams } from "./use-credentials-params";
import { CredentialType } from "@/generated/prisma";

//Hooks for fetching all the credentials
export const useSupspenseCredentials =()=>{
    const trpc = useTRPC();
    const [params] = useCredentialsParams()
        
    return useSuspenseQuery(trpc.credentials.getAll.queryOptions(params))
}

// Hooks for creating a new credentials
export const useCreateCredentials =()=>{
    const queryClient = useQueryClient();
    const trpc = useTRPC();

    return useMutation(
        trpc.credentials.create.mutationOptions({
            onSuccess:(data)=>{
                toast.success(`Credential "${data.name}" created successfully`);
                queryClient.invalidateQueries(
                    trpc.credentials.getAll.queryOptions({})
                );
            },
            onError:(error)=>{
                toast.error(`Failed to create credential: ${error.message}`);
            }
        })
    )
}

export const useRemoveCredentials =() =>{
    const queryClient = useQueryClient();
    const trpc = useTRPC();
    return useMutation(
        trpc.credentials.remove.mutationOptions({
            onSuccess(data) {
                toast.success(`Credential"${data.name}" removed`)
                queryClient.invalidateQueries(trpc.credentials.getAll.queryOptions({}))
                queryClient.invalidateQueries(
                    trpc.credentials.getOne.queryFilter({id: data.id})
                )
                
            },
        })
    )

}

export const useSupenseCredential = (id: string) =>{
    const trpc = useTRPC()
    return useSuspenseQuery(trpc.credentials.getOne.queryOptions({id}))
}


// update the credientials
export const useUpdateCredential=()=>{
    const queryClient = useQueryClient();
    const trpc = useTRPC();

    return useMutation(
        trpc.credentials.update.mutationOptions({
            onSuccess:(data)=>{
                toast.success(`Credential "${data.name}"saved`);
                queryClient.invalidateQueries
                (
                    trpc.credentials.getAll.queryOptions({})
                );
                queryClient.invalidateQueries(
                    trpc.credentials.getOne.queryOptions({id: data.id})
                )
            },
            onError:(error)=>{
                toast.error(`Failed to save credential : ${error.message}`);
            }
        })
    )
}

//fetch credentials by type
export const useCredentialsByType = (type: CredentialType)=>{
    const trpc = useTRPC()
    return useQuery(trpc.credentials.getByType.queryOptions({type}))
}

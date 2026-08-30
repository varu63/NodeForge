import { useSuspenseQuery} from "@tanstack/react-query";
import { useTRPC } from "@/trpc/client";
import { useExecutionsParams} from "./use-executions-params";


//Hooks for fetching all the credentials
export const useSupspenseExecutions =()=>{
    const trpc = useTRPC();
    const [params] = useExecutionsParams()
        
    return useSuspenseQuery(trpc.executions.getAll.queryOptions(params))
}

//Hooks to fetch a single execution using suspennse
export const useSupenseExecution = (id: string) =>{
    const trpc = useTRPC()
    return useSuspenseQuery(trpc.executions.getOne.queryOptions({id}))
}

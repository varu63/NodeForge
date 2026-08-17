import { useQueryStates } from "nuqs";
import { workflowsParams } from "../params";

export const useWrokflowsParams =()=>{
    return useQueryStates(workflowsParams)
}
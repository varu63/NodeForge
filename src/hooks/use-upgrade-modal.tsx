import { TRPCClientError } from "@trpc/client";
import {useState} from "react"
import { UpgradeModel } from "@/components/upgrade-modal";

export const useUpgradeModal =()=>{
    const[open , setOpen] = useState(false)
    const handleError = (error: unknown)=>{
        if(error instanceof TRPCClientError){
            if(error.data?.code === "FORBIDOEN"){
                setOpen(true);
                return true
            }
        }
        return false
    }
    const model = <UpgradeModel open={open} onOpenChange={setOpen}/>
    return {handleError , model}

}
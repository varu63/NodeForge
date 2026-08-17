"use client"
import { EntityContainer, EntityHeader, EntityPagination, EntitySearch } from "@/components/entity-components"
import{useCreateWorkflow, useSupspenseWorkflows} from "@/features/workflows/hooks/use-workflows"
import { useUpgradeModal } from "@/hooks/use-upgrade-modal"
import { error } from "console"
import { useRouter } from "next/navigation"
import { useWrokflowsParams } from "../hooks/use-workflows-params"
import { useEntitySearch } from "@/hooks/use-entity-search"

export const WorkflowsSearch =()=>{
  const [params , setParams] = useWrokflowsParams();
  const{searchValue , onSearchChange} = useEntitySearch({
    params ,
    setParams
  })
  return(
    <EntitySearch
    value={searchValue}
    onChange={onSearchChange}
    placeholder="Search workflows"/>
  )
}

export const Workflowlist = () => {
  const workflows = useSupspenseWorkflows()

  return(
    <p>
        {JSON.stringify(workflows.data , null , 2)}
    </p>
  )
}

export const WorkflowsHeader =({disabled}:{disabled?:boolean})=>{
   const createWorkflow = useCreateWorkflow()
   const {handleError , model} = useUpgradeModal()
   const router = useRouter();
   const handleCreate = ()=>{
    createWorkflow.mutate(undefined ,{
      onSuccess:(data) =>{
          router.push(`/workflows/${data.id}`)
      },
      onError :(error) =>{
        handleError(error)
      }
    })
   }
  return(
    <>
    {model}
    <EntityHeader
    title = "Workflows"
    description = "Manage your workflows"
    onNew = {handleCreate}
    newButtonLabel = "New Workflow"
    disabled = {disabled}
    isCreating = {createWorkflow.isPending}
    />
    </>
  )
}
export const WorkflowsPagination =() =>{
  const workflows = useSupspenseWorkflows();
  const [params , setParams] = useWrokflowsParams()

  return(
    <EntityPagination
    page ={workflows.data.page}
    totalPage={workflows.data.totalPages}
    onPageChange={(page)=>setParams({...params ,page})}
    disabled = {workflows.isFetching}
    />
  )

}

export const WorkflowsContainer =({children}:{children:React.ReactNode})=>{
  return(
    <EntityContainer
    header = {<WorkflowsHeader disabled={false}/>}
    search = {<WorkflowsSearch/>}
    pagination = {<WorkflowsPagination/>}
    >
        {children}
    </EntityContainer>
  )
}

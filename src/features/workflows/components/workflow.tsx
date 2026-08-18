"use client"
import { EntityContainer, EntityHeader, EntityPagination, EntitySearch, ErrorView, LoadingView, EmptyView , EntityList, EntityItem} from "@/components/entity-components"
import{useCreateWorkflow, useRemoveWorkflow, useSupspenseWorkflows} from "@/features/workflows/hooks/use-workflows"
import { useUpgradeModal } from "@/hooks/use-upgrade-modal"
import { useRouter } from "next/navigation"
import { useWrokflowsParams } from "../hooks/use-workflows-params"
import { useEntitySearch } from "@/hooks/use-entity-search"
import { Workflow } from "@/generated/prisma";
import { WorkflowIcon } from "lucide-react"
import {formatDistanceToNow} from "date-fns"


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
    <EntityList
    items={workflows.data.items}
    getKey={(workflow) => workflow.id}
    renderItem={(workflow)=><WorkflowItem data={workflow}/> }
    emptyView={<WorkflowsEmpty/>}
    />
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


export const WorkflowsLoading = ()=>{
  return <LoadingView message="Loading workflows...."/>
}

export const WorkflowsError =()=>{
  return <ErrorView message="Error loading workflows.."/>
}

export const WorkflowsEmpty = ()=>{
  const router = useRouter()
  const createWorkflow = useCreateWorkflow()
  const {handleError , model} = useUpgradeModal()
  const handelCreate = ()=>{
    createWorkflow.mutate(undefined , {
      onError: (error)=>{
        handleError(error)
      },
      onSuccess:(data) =>{
        router.push(`/workflows/${data.id}`)
      }
    })
  }
  return(
    <> 
    {model}
    <EmptyView 
    onNew={handelCreate}
    message ="You haven't created any workflows yet, Get started by
    creating your first workflow"/>
    </>
  )
}

export const WorkflowItem=({data,}:{data:Workflow}) =>{
  const removeWorkflow = useRemoveWorkflow()
  const handleRemove =() =>{
    removeWorkflow.mutate({id:data.id})
  }
  return(
    <EntityItem
    href={`/workflows/${data.id}`}
    title = {data.id}
    subtitle ={
      <>
      Update {formatDistanceToNow(data.updatedAt,{addSuffix : true})}{" "}
      &bull; Created{" "}
      {formatDistanceToNow(data.createdAt,{addSuffix : true})}
      </>
    }
    image={
      <div className="size-8 flex items-center justify-center">
       <WorkflowIcon className="size-5 text-muted-foreground"/>
      </div>
    }
     onRemove={handleRemove}
     isRemoving={removeWorkflow.isPending}
    />
  )
}
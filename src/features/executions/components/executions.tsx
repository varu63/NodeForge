"use client";
import {
  EntityContainer,
  EntityHeader,
  EntityPagination,
  ErrorView,
  LoadingView,
  EmptyView,
  EntityList,
  EntityItem,
} from "@/components/entity-components";
import { useExecutionsParams } from "../hooks/use-executions-params";
import {Execution, ExecutionStatus } from "@/generated/prisma";
import { formatDistanceToNow } from "date-fns";
import {
  useSupspenseExecutions,
} from "../hooks/use-executions";
import { CheckCircle2Icon, ClockIcon, Loader2Icon, XCircleIcon } from "lucide-react";


export const Executionslist = () => {
  const executions = useSupspenseExecutions();
  return (
    <EntityList
      items={executions.data.items}
      getKey={(execution) => execution.id}
      renderItem={(execution) => <ExecutionsItem data={execution} />}
      emptyView={<ExecutionsEmpty />}
    />
  );
};

export const ExecutionsHeader = () => {
  return (
    <>
      <EntityHeader
        title="Executions"
        description="View your workflow execution history"
        
      />
    </>
  );
};
export const ExecutionsPagination = () => {
  const executions = useSupspenseExecutions();
  const [params, setParams] = useExecutionsParams();

  return (
    <EntityPagination
      page={executions.data.page}
      totalPage={executions.data.totalPages}
      onPageChange={(page) => setParams({ ...params, page })}
      disabled={executions.isFetching}
    />
  );
};

export const ExecutionsContainer = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  return (
    <EntityContainer
      header={<ExecutionsHeader/>}
      pagination={<ExecutionsPagination />}
    >
      {children}
    </EntityContainer>
  );
};

export const ExecutionsLoading = () => {
  return <LoadingView message="Loading executions...." />;
};

export const ExecutionsError = () => {
  return <ErrorView message="Error loading executions.." />;
};

export const ExecutionsEmpty = () => {

  return (
    <EmptyView
      message="You haven't created any executions yet. Get started by running your first workflow"
    />
  );
};
const getStatusIcon =(status:ExecutionStatus)=>{
  switch(status){
    case ExecutionStatus.SUCCESS:
      return <CheckCircle2Icon className="size-5 text-green-600"/>
    case ExecutionStatus.FAILED:
      return <XCircleIcon className="size-5 text-red-600"/>
    case ExecutionStatus.RUNNING:
      return <Loader2Icon className="size-5 text-blue-600 animate-spin"/>
    default:
      return <ClockIcon className="size-5 text-muted-foreground"/>
  }
}

const formaStatus = (status: ExecutionStatus)=>{
  return status.charAt(0) + status.slice(1).toLowerCase();
}
export const ExecutionsItem = ({ data }: { data: Execution &{workflow:{id: string; name: string}} }) => {
 const durations = data.completedAt
 ?Math.round(
  (new Date(data.completedAt).getTime()- new Date(data.startedAt).getTime())/1000
 )
 :null
  return (
    <EntityItem
      href={`/executions/${data.id}`}
      title={formaStatus(data.status)}
      subtitle={
        <>
        {data.workflow.name} &bull: Started(" ")
        {formatDistanceToNow(data.startedAt,{addSuffix: true})}
        {durations !== null && <> &bull; Took {durations}s</>}
        </>
      }
      image={
        <div className="size-8 flex items-center justify-center">
         {getStatusIcon(data.status)}
        </div>
      }
    />
  );
};

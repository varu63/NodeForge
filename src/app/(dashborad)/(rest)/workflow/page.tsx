import { prefetchWorkflows } from '@/features/workflows/server/prefetch'
import { requireAuth } from '@/lib/auth-utils'
import { HydrateClient } from '@/trpc/server'
import { ErrorBoundary } from 'react-error-boundary'
import { Suspense } from 'react'
import {Workflowlist, WorkflowsContainer} from "@/features/workflows/components/workflow"
import { SearchParams } from 'nuqs/server'
import { workflowsParamsLoader } from '@/features/workflows/server/params-loader'

type Props ={
  searchParams : Promise<SearchParams>
}


const page = async({searchParams} : Props) => {
await requireAuth()
const params = await workflowsParamsLoader(searchParams)
prefetchWorkflows(params)
  return (
    <WorkflowsContainer>
    <HydrateClient>
      <ErrorBoundary fallback ={<p>Error</p>}>
      <Suspense fallback={<p>Loading...</p>}>
      <Workflowlist/>
      </Suspense>

      </ErrorBoundary>
    </HydrateClient>
    </WorkflowsContainer>
  )
}

export default page

"use client"

import { createId } from "@paralleldrive/cuid2"
import { useReactFlow } from "@xyflow/react"
import {
    GlobeIcon,
    MousePointerIcon,
} from "lucide-react"
import React, { useCallback } from "react"
import { toast } from "sonner"

import {
    Sheet,
    SheetContent,
    SheetDescription,
    SheetHeader,
    SheetTitle,
    SheetTrigger,
} from "@/components/ui/sheet"
import { NodeType } from "@/generated/prisma"

export type NodeTypeOption = {
    type: NodeType
    label: string
    description: string
    icon: React.ComponentType<{ className?: string }> | string
}

const triggerNode: NodeTypeOption[] = [
    {
        type: NodeType.MANUAL_TRIGGER,
        label: "Trigger manually",
        description:
            "Runs the flow when you click a button. Good for getting started quickly.",
        icon: MousePointerIcon,
    },
]

const executionNodes: NodeTypeOption[] = [
    {
        type: NodeType.HTTP_REQUEST,
        label: "HTTP Request",
        description: "Makes an HTTP request.",
        icon: GlobeIcon,
    },
]

interface NodeSelectorProps {
    open: boolean
    onOpenChange: (open: boolean) => void
    children: React.ReactNode
}

export function NodeSelector({
    open,
    onOpenChange,
    children,
}: NodeSelectorProps) {
    const {setNodes , getNodes , screenToFlowPosition} = useReactFlow()
    const handleNodeSelect = useCallback((selection : NodeTypeOption)=>{
        if(selection.type === NodeType.MANUAL_TRIGGER){
            const nodes = getNodes()
            const hasManualTrigger = nodes.some(
                (node) => node.type === NodeType.MANUAL_TRIGGER
            )
            if(hasManualTrigger){
                toast.error("Only one manual trigger is allowed per workflow")
            }
        }
        setNodes((nodes)=>{
            const hasInitialTrigger = nodes.some(
                (node) => node.type === NodeType.INITIAL
            )
            const centerX = window.innerHeight/2
            const centerY = window.innerHeight/2

            const flowPosition = screenToFlowPosition({
                x: centerX + (Math.random() - 0.5)* 200,
                y: centerY + (Math.random() - 0.5) * 200,
            })

            const newNode = {
                id: createId(),
                data : {},
                position : flowPosition,
                type : selection.type,
            }
            if(hasInitialTrigger){
                return[newNode]
            }
            return [...nodes , newNode]

        })
        onOpenChange(false)
    },[
        setNodes,
        getNodes,
        onOpenChange,
        screenToFlowPosition,
    ])
    return (
        <Sheet open={open} onOpenChange={onOpenChange}>
            <SheetTrigger asChild>
                {children}
            </SheetTrigger>

            <SheetContent
                side="right"
                className="w-full overflow-y-auto sm:max-w-md"
            >
                <SheetHeader>
                    <SheetTitle>
                        What triggers this workflow?
                    </SheetTitle>

                    <SheetDescription>
                        A trigger is a step that starts your workflow.
                    </SheetDescription>
                </SheetHeader>

                <div className="mt-6">
                    <div className="mb-2 px-4 text-sm font-medium text-muted-foreground">
                        Triggers
                    </div>

                    {triggerNode.map((nodeType) => {
                        const Icon = nodeType.icon

                        return (
                            <div
                                key={nodeType.type}
                                className="flex w-full cursor-pointer items-center gap-4 border-l-2 border-transparent px-4 py-4 transition-colors hover:border-l-primary hover:bg-muted/50"
                                onClick={() =>
                                    handleNodeSelect(nodeType)
                                }
                            >
                                {typeof Icon === "string" ? (
                                    <img
                                        src={Icon}
                                        alt={nodeType.label}
                                        className="size-5 rounded-sm object-contain"
                                    />
                                ) : (
                                    <Icon className="size-5 shrink-0" />
                                )}
                                  <div className="flex flex-col items-start text-left">
                                    <span className="font-medium text-sm">
                                        {nodeType.label}
                                    </span>
                                    <span className="text-xs text-muted-foreground">
                                        {nodeType.description}
                                    </span>
                                  </div>
                         
                            </div>
                        )
                    })}

                    <div className="mb-2 mt-6 px-4 text-sm font-medium text-muted-foreground">
                        Actions
                    </div>

                    {executionNodes.map((nodeType) => {
                        const Icon = nodeType.icon

                        return (
                            <div
                                key={nodeType.type}
                                className="flex w-full cursor-pointer items-center gap-4 border-l-2 border-transparent px-4 py-4 transition-colors hover:border-l-primary hover:bg-muted/50"
                                onClick={() =>
                                    handleNodeSelect(nodeType)
                                }
                            >
                                {typeof Icon === "string" ? (
                                    <img
                                        src={Icon}
                                        alt={nodeType.label}
                                        className="size-5 rounded-sm object-contain"
                                    />
                                ) : (
                                    <Icon className="size-5 shrink-0" />
                                )}

                                <div className="flex flex-col items-start text-left">
                                    <span className="font-medium text-sm">
                                        {nodeType.label}
                                    </span>
                                    <span className="text-xs text-muted-foreground">
                                        {nodeType.description}
                                    </span>
                                </div>
                            </div>
                        )
                    })}
                </div>
            </SheetContent>
        </Sheet>
    )
}
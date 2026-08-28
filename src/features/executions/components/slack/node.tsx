"use client";

import { Node, NodeProps, useReactFlow } from "@xyflow/react";
import { memo, useState } from "react";
import { BaseExecutionNode } from "../base-execution-node";
import { SlackFormValues, SlackDialog, } from "./dialog";
import { useNodeStatus } from "../../hooks/use-node-status";
import { fetchSlackRealtimeToken} from "./actions";

import { SLACK_CHANNEL_NAME } from "@/inngest/channels/slack";

type SlackNodeData = {
 webhookUrl?: string
 content?: string
};

type SlackNodeType = Node<SlackNodeData>;

export const SlackNode = memo((props: NodeProps<SlackNodeType>) => {
  const nodeData = props.data;
  const [dialogOpen, setDialogOpen] = useState(false);
  const { setNodes } = useReactFlow();
  const nodeStatus = useNodeStatus({
    nodeId: props.id,
    channel:SLACK_CHANNEL_NAME,
    topic: "status",
    refreshToken: fetchSlackRealtimeToken,
  });
  const handleOpenSetting = () => setDialogOpen(true);
  const handleSubmit = (values: SlackFormValues) => {
    setNodes((nodes) =>
      nodes.map((node) => {
        if (node.id === props.id) {
          return {
            ...node,
            data: {
              ...node.data,
              ...values,
            },
          };
        }
        return node;
      }),
    );
  };
  const description = nodeData?.content
    ? `Sennd : ${nodeData.content.slice(0, 50)}`
    : "Not configured";

  return (
    <>
      <SlackDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        onSubmit={handleSubmit}
        defaultValues={nodeData}
      />
      <BaseExecutionNode
        {...props}
        id={props.id}
        icon="/slack.svg"
        name="Slack"
        status={nodeStatus}
        description={description}
        onSettings={handleOpenSetting}
        onDoubleClick={handleOpenSetting}
      />
    </>
  );
});

SlackNode.displayName = "SlackNode";

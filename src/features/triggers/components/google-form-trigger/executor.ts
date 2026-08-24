import type { NodeExecutor } from "@/features/executions/types";
import { googleFormTriggerChannel } from "@/inngest/channels/gogle-form-trigger";
import { manualtriggerChannel } from "@/inngest/channels/manual-trigger";
type GoogleFormTriggerData = Record<string, unknown>;

export const googleFormTriggerExecutor: NodeExecutor<
  GoogleFormTriggerData
> = async ({ nodeId, context, step, publish }) => {
  await publish(
    googleFormTriggerChannel().status({
      nodeId,
      status: "loading",
    }),
  );
  const result = await step.run("google-form-tirgger", async () => context);

  await publish(
    googleFormTriggerChannel().status({
      nodeId,
      status: "success",
    }),
  );
  return result;
};

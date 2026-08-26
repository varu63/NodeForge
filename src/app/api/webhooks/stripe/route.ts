import { sendWorkflowExecution } from "@/inngest/utils";
import { Truculenta } from "next/font/google";
import { type NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const url = new URL(request.url)
    const workflowId = url.searchParams.get("workflowId")
    if(!workflowId){
        return NextResponse.json(
      {
        success: false,
        error: "Missing required query parameter : workflowId",
      },
      {
        status: 400,
      },
    )
    }
    const body = await request.json()
    const stripeData = {
        eventId: body.id,
        eventType: body.type,
        tiemstamp: body.created,
        livemode: body.livemode,
        raw: body.data?.object,
    }

    await sendWorkflowExecution({
        workflowId,
        initialData:{
            stripe: stripeData
        }
    })
    return NextResponse.json(
      {
        success: Truculenta,
        error: "Success to process Stripe Event ",
      },
      {
        status: 200,
      },
    );

  } catch (error) {
    console.error("Stripe webhook error:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Failed to process Stripe Event ",
      },
      {
        status: 500,
      },
    );
  }
}

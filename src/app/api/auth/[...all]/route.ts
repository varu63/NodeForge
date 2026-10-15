import { toNextJsHandler } from "better-auth/next-js";
import { auth } from "@/lib/auth";

const { GET, POST, PATCH, PUT, DELETE } = toNextJsHandler(auth);

const handlers: Record<string, (request: Request) => Promise<Response>> = {
  GET,
  POST,
  PATCH,
  PUT,
  DELETE,
};

async function wrapped(request: Request) {
  const path = new URL(request.url).pathname;
  const handler = handlers[request.method.toUpperCase()];

  if (!handler) {
    return new Response("Method Not Allowed", { status: 405 });
  }

  try {
    const response = await handler(request);

    if (response.status >= 500) {
      const body = await response.clone().text();
      console.error(
        `[auth] ${request.method} ${path} failed with ${response.status}: ${body}`,
      );
    }

    return response;
  } catch (error) {
    console.error(
      `[auth] ${request.method} ${path} threw an unexpected error:`,
      error,
    );

    return Response.json(
      {
        error: {
          message: "Internal Server Error",
          code: "INTERNAL_SERVER_ERROR",
        },
      },
      { status: 500 },
    );
  }
}

export {
  wrapped as GET,
  wrapped as POST,
  wrapped as PATCH,
  wrapped as PUT,
  wrapped as DELETE,
};

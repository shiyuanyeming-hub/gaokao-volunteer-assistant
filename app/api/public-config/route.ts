import { getPublicServerApiStatus } from "@/lib/server-api";

export const runtime = "edge";

export async function GET() {
  return Response.json(getPublicServerApiStatus(), {
    headers: {
      "Cache-Control": "no-store",
    },
  });
}

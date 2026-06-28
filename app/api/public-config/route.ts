import { getPublicServerApiStatus } from "@/lib/server-api";

export const runtime = "nodejs";

export async function GET() {
  return Response.json(getPublicServerApiStatus(), {
    headers: {
      "Cache-Control": "no-store",
    },
  });
}

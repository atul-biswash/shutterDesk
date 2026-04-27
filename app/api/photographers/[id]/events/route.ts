import { NextResponse } from "next/server";
import { getPhotographerCompletedEvents } from "@/lib/data";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const events = await getPhotographerCompletedEvents(id);
  return NextResponse.json({ events });
}

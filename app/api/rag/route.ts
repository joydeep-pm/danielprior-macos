import { NextResponse } from "next/server"
import { getRagAnswer } from "@/lib/rag"

export const runtime = "nodejs"

export async function POST(req: Request) {
  try {
    const body = (await req.json()) as { message?: string }
    const message = body?.message?.trim()

    if (!message) {
      return NextResponse.json({ error: "Message is required." }, { status: 400 })
    }

    const result = await getRagAnswer(message)
    return NextResponse.json(result)
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to process request."
    return NextResponse.json({ error: message }, { status: 500 })
  }
}

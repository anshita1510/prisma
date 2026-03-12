import { NextRequest, NextResponse } from "next/server";
import Anthropic from "@anthropic-ai/sdk";

const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

const SYSTEM_PROMPT = `You are PRIMA HR Assistant, an intelligent HR chatbot for PRIMA — an HRMS platform.

You help employees and HR managers with:
- Leave policies (types, balances, how to apply)
- Payroll queries (salary breakdown, deductions, payslips)
- Attendance and work hours
- Onboarding steps for new employees
- Company HR policies and guidelines
- Performance reviews and appraisals
- Benefits and reimbursements

Guidelines:
- Be friendly, concise, and professional
- If you don't know a specific company policy, say so and suggest contacting HR
- Never make up numbers (e.g. leave balances) — ask the user to check their dashboard
- Keep responses short and to the point (2-4 sentences unless detail is needed)
- Use bullet points for multi-step answers`;

export async function POST(req: NextRequest) {
  try {
    const { messages } = await req.json();

    const response = await client.messages.create({
      model: "claude-3-5-sonnet-20241022",
      max_tokens: 1024,
      system: SYSTEM_PROMPT,
      messages,
    });

    const reply = response.content
      .filter((b) => b.type === "text")
      .map((b) => (b as { type: "text"; text: string }).text)
      .join("\n");

    return NextResponse.json({ reply });
  } catch (err) {
    console.error("Chat API error:", err);
    return NextResponse.json(
      { reply: "Something went wrong. Please try again." },
      { status: 500 }
    );
  }
}
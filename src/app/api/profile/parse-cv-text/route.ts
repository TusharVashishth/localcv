import { NextResponse } from "next/server";
import { z } from "zod";
import { extractCvDataFromPdfDataUrl } from "@/lib/cv-extraction";

const requestSchema = z.object({
  fileName: z.string().trim().min(1),
  fileDataUrl: z.string().trim().startsWith("data:application/pdf;base64,"),
});

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const parsed = requestSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { success: false, error: "Invalid request payload." },
        { status: 400 },
      );
    }

    const { fileDataUrl } = parsed.data;
    const { rawText, extracted } = await extractCvDataFromPdfDataUrl(fileDataUrl);
    const text = rawText.trim();

    if (!text) {
      return NextResponse.json(
        { success: false, error: "Unable to extract text from this PDF." },
        { status: 400 },
      );
    }

    return NextResponse.json({
      success: true,
      rawText: text.slice(0, 3000),
      extracted,
    });
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : "Unable to parse CV.",
      },
      { status: 400 },
    );
  }
}

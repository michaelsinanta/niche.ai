import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const keywords = searchParams.get("keywords");

  if (!keywords) {
    return NextResponse.json({ error: "Missing keywords" }, { status: 400 });
  }

  try {
    const apiKey = process.env.REED_API_KEY; 
    const url = `https://www.reed.co.uk/api/1.0/search?keywords=${encodeURIComponent(
      keywords
    )}`;
    
    const response = await fetch(url, {
      headers: {
        Authorization: `Basic ${Buffer.from(`${apiKey}:`).toString("base64")}`, 
      },
    });

    if (!response.ok) {
      return NextResponse.json({ error: "Failed to fetch jobs" }, { status: response.status });
    }

    const data = await response.json();
    return NextResponse.json({ success: true, jobs: data.results });
  } catch (error) {
    console.error("Error fetching jobs:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

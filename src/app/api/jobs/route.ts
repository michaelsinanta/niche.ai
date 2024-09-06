import { NextRequest, NextResponse } from "next/server";
import { doc, setDoc, updateDoc } from "firebase/firestore";
import { CohereClient } from "cohere-ai";
import { db } from "@/components/firebase";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const keywords = searchParams.get("keywords");

  if (!keywords) {
    return NextResponse.json({ error: "Missing keywords" }, { status: 400 });
  }

  try {
    const apiKey = process.env.REED_API_KEY;
    const url = `https://www.reed.co.uk/api/1.0/search?keywords=${encodeURIComponent(
      keywords,
    )}`;

    const response = await fetch(url, {
      headers: {
        Authorization: `Basic ${Buffer.from(`${apiKey}:`).toString("base64")}`,
      },
    });

    if (!response.ok) {
      return NextResponse.json(
        { error: "Failed to fetch jobs" },
        { status: response.status },
      );
    }

    const data = await response.json();
    return NextResponse.json({ success: true, jobs: data.results });
  } catch (error) {
    console.error("Error fetching jobs:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 },
    );
  }
}

const cohere = new CohereClient({
  token: process.env.COHERE_API_KEY || "",
});

export async function POST(req: NextRequest) {
  try {
    const { userId, jobDescription } = await req.json();

    if (!userId || !jobDescription) {
      return NextResponse.json(
        { error: "Missing userId or jobDescription" },
        { status: 400 },
      );
    }

    const prompt = `
      You are an expert recruiter reviewing a job description. 
      Your task is to extract a list of technical skills that are explicitly or implicitly required in the job description.

      - Focus on hard skills (such as programming languages, software tools, specific methodologies).
      - List each skill individually, avoiding repetition.
      - Include skills even if they are mentioned in a general or implicit manner.

      Here is the job description:
      -----
      ${jobDescription}
      -----

      ONLY return a JSON object with an array of extracted skills. Example:
      ["Python", "JavaScript", "Java"]
    `;

    const response = await cohere.generate({
      model: "command-xlarge-nightly",
      prompt: prompt,
      maxTokens: 1000,
      temperature: 0.7,
    });

    const result = JSON.parse(response.generations[0].text.trim());

    return result;
  } catch (error) {
    console.error("Error processing job description:", error);
    return NextResponse.json(
      { error: "Error processing job description" },
      { status: 500 },
    );
  }
}

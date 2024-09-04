import { NextRequest, NextResponse } from "next/server";
import { doc, setDoc, updateDoc } from "firebase/firestore";
import { CohereClient } from "cohere-ai";
import { db } from "@/components/firebase";

const cohere = new CohereClient({
  token: process.env.COHERE_API_KEY || "",
});

export async function POST(req: NextRequest) {
  try {
    const { userId, cvText } = await req.json();

    if (!userId || !cvText) {
      return NextResponse.json({ error: "Missing userId or cvText" }, { status: 400 });
    }

    const prompt = `
      You are an HR manager who is an expert at determining an applicant's proficiency for a certain skill by looking at their CV/resume.
      You can gain an idea of their level of expertise by looking at how long they have been doing a relevant job, if they have any relevant skills,
      the number of relevant projects they've worked on, so on and so forth.
      Given the text in a CV/Resume, I want you to score the applicant's expertise on the following subjects on an integer scale of 0-6,
      (0 being a complete novice and 6 being a skilled):
      - Database Fundamentals
      - Computer Architecture
      - Distributed Computing Systems
      - Cyber Security
      - Networking
      - Software Development
      - Programming Skills
      - Project Management
      - Computer Forensics Fundamentals
      - Technical Communication	
      - AI/ML
      - Software Engineering
      - Business Analysis
      - Communication skills
      - Data Science
      - Troubleshooting skills
      - Graphics Designing

      Here is the cv/resume that you have to work with:
      -----
      ${cvText}
      -----

      ONLY return a json that has ALL the subjects as keys and the respective scores as integer values. Example:
      {
        "Database Fundamentals" : 3,
        "Computer Architecture" : 1,
        "Distributed Computing Systems": 4
        ...
      }
    `;

    const response = await cohere.generate({
      model: "command-xlarge-nightly",
      prompt: prompt,
      maxTokens: 1000,
      temperature: 0.7,
    });

    const result = JSON.parse(response.generations[0].text.trim());

    await setDoc(doc(db, "TechnicalScore", userId), {
      userId,
      ...result,
    });

    await updateDoc(doc(db, "UserInformation", userId), {
      onBoardingResume: true,
    });

    return NextResponse.json({ success: true, redirect: "/quiz", result }, { status: 200 });
  } catch (error) {
    console.error("Error processing resume:", error);
    return NextResponse.json({ error: "Error processing resume" }, { status: 500 });
  }
}

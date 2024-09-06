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
      return NextResponse.json(
        { error: "Missing userId or cvText" },
        { status: 400 },
      );
    }

    const prompt = `
      You are an HR manager who is an expert at determining an applicant's proficiency for a certain skill by looking at their CV/resume. 
      You will evaluate their expertise based on explicit mentions of experience, skills, tools used, and relevant projects.

      Be strict but fair: If there is no evidence in the CV for a specific skill or experience, give the applicant a score of 0. 
      If the skill is only mentioned without concrete supporting details (e.g., related projects, responsibilities, or tools), assign a low score (1 or 2). 
      However, when the candidate demonstrates solid, repeated experience across multiple projects and technologies, or leadership roles in this area, assign a higher score.

      Assign a score of 6 if the applicant demonstrates extensive evidence of proficiency, including multiple relevant projects, leadership roles, or advanced tools and technologies used. 

      Use the following integer scale:
      - 0: No mention or evidence of the skill at all
      - 1-3: Minimal mention or vague evidence
      - 4-5: Some experience or projects, but not deep expertise
      - 6: Significant experience and multiple projects demonstrating strong expertise (6 for exceptional depth)

      Please evaluate the following subjects from the CV/resume on a scale of 0 to 6:
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

      here is the cv/resume that you have to work with:
      -----
      ${cvText}
      -----

      ONLY return a json that has ALL the subjects as keys and the respective scores as integer values. Example:
      {{
        "Database Fundamentals" : 3,
        "Computer Architecture" : 1,
        "Distributed Computing Systems": 4
        ...
      }}
    `;

    const response = await cohere.generate({
      model: "command-xlarge-nightly",
      prompt: prompt,
      maxTokens: 1000,
      temperature: 0.7,
    });

    const result = JSON.parse(response.generations[0].text.trim());
    console.log(result);
    await setDoc(doc(db, "TechnicalScore", userId), {
      userId,
      ...result,
    });

    await updateDoc(doc(db, "UserInformation", userId), {
      onBoardingResume: true,
    });

    return NextResponse.json(
      { success: true, redirect: "/quiz", result },
      { status: 200 },
    );
  } catch (error) {
    console.error("Error processing resume:", error);
    return NextResponse.json(
      { error: "Error processing resume" },
      { status: 500 },
    );
  }
}

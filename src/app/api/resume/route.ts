import { CohereClient } from "cohere-ai";
import { NextRequest, NextResponse } from "next/server";

const cohere = new CohereClient({
  token: process.env.COHERE_API_KEY || "",
});

export async function POST(req: NextRequest) {
  try {
    const { cv_text } = await req.json();
    const prompt = `
    You are an HR manager who is an expert at determining an applicant's proficiency for a certain skill by looking at their CV/resume.
    You can gain an idea of their level of expertise by looking at how long they have been doing a relevant job, if they have any relevant skills,
    the number of relevant projects they've worked on, so on and so forth.
    Given the text in a CV/Resume, I want you to score the applicant's expertise on the following subjects on an integer scale of 0-6,
    (0 being a complete novice and 6 being a master):
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
    ${cv_text}
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

    const result = response.generations[0].text;
    return NextResponse.json({ result });
  } catch (error) {
    console.error("Error generating response:", error);
    return NextResponse.json(
      { error: "Error generating response" },
      { status: 500 },
    );
  }
}

import { NextRequest, NextResponse } from "next/server";
import { doc, setDoc, updateDoc, getDoc } from "firebase/firestore";
import { db } from "@/components/firebase";
import { CohereClient } from "cohere-ai";

const cohere = new CohereClient({
  token: process.env.COHERE_API_KEY || "",
});

export async function POST(req: NextRequest) {
  try {
    const { userId, nonTechnicalScores } = await req.json();

    await setDoc(doc(db, "NonTechnicalScore", userId), {
      userId,
      ...nonTechnicalScores,
    });

    const technicalScoresDoc = await getDoc(doc(db, "TechnicalScore", userId));
    const technicalScores = technicalScoresDoc.data();

    if (!technicalScores) {
      return NextResponse.json(
        { error: "Technical scores not found" },
        { status: 400 },
      );
    }

    const { userId: _, ...technicalScoresWithoutUserId } = technicalScores;

    const combinedScores = [
      technicalScoresWithoutUserId["Database Fundamentals"],
      technicalScoresWithoutUserId["Computer Architecture"],
      technicalScoresWithoutUserId["Distributed Computing Systems"],
      technicalScoresWithoutUserId["Cyber Security"],
      technicalScoresWithoutUserId["Networking"],
      technicalScoresWithoutUserId["Software Development"],
      technicalScoresWithoutUserId["Programming Skills"],
      technicalScoresWithoutUserId["Project Management"],
      technicalScoresWithoutUserId["Computer Forensics Fundamentals"],
      technicalScoresWithoutUserId["Technical Communication"],
      technicalScoresWithoutUserId["AI/ML"],
      technicalScoresWithoutUserId["Software Engineering"],
      technicalScoresWithoutUserId["Business Analysis"],
      technicalScoresWithoutUserId["Communication skills"],
      technicalScoresWithoutUserId["Data Science"],
      technicalScoresWithoutUserId["Troubleshooting skills"],
      technicalScoresWithoutUserId["Graphics Designing"],
      nonTechnicalScores["openness"],
      nonTechnicalScores["conscientousness"],
      nonTechnicalScores["extraversion"],
      nonTechnicalScores["agreeableness"],
      nonTechnicalScores["emotionalRange"],
      nonTechnicalScores["conservation"],
      nonTechnicalScores["opennessToChange"],
      nonTechnicalScores["hedonism"],
      nonTechnicalScores["selfEnhancement"],
      nonTechnicalScores["selfTranscendence"],
    ];

    const predictedRole = await callRolePredictionAPI(combinedScores);

    const specificNiches = await generateNicheRoles(predictedRole);

    await updateDoc(doc(db, "UserInformation", userId), {
      onBoardingQuiz: true,
      predicted_role: predictedRole,
      nicheJobs: specificNiches,
    });

    return NextResponse.json({ success: true, predictedRole, specificNiches });
  } catch (error) {
    console.error("Error processing quiz results:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 },
    );
  }
}

async function callRolePredictionAPI(features: number[]) {
  const response = await fetch(`${process.env.AI_BASE_URL}/predict-role`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ features }),
  });

  if (!response.ok) {
    throw new Error(`Prediction API error: ${response.statusText}`);
  }

  const data = await response.json();
  return data.predicted_role;
}

async function generateNicheRoles(jobTitle: string) {
  const prompt = `
    You are a tech expert that is familiar with the roles in the industry.
    Given a job title, your task is to generate 5 jobs that are nicher versions of the given job title.
    The job title is ${jobTitle}.
    Output your response as a valid JSON array of 5 strings. Example:
    ["Job 1", "Job 2", "Job 3", "Job 4", "Job 5"]
  `;

  const response = await cohere.generate({
    model: "command-xlarge-nightly",
    prompt: prompt,
    maxTokens: 1000,
    temperature: 0.7,
  });

  const generatedText = response.generations[0].text.trim();

  try {
    const nicheJobs = JSON.parse(generatedText);

    if (!Array.isArray(nicheJobs) || nicheJobs.length !== 5) {
      throw new Error("Invalid niche jobs format received from Cohere.");
    }

    return nicheJobs;
  } catch (error) {
    console.error("Error parsing niche jobs from Cohere:", generatedText);
    throw new Error("Failed to parse the niche jobs from the Cohere response.");
  }
}

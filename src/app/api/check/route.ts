import { NextRequest, NextResponse } from "next/server";
import { doc, getDoc } from "firebase/firestore";
import { db } from "@/components/firebase";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const userId = searchParams.get("userId");

  if (!userId) {
    return NextResponse.json({ error: "Invalid userId" }, { status: 400 });
  }

  try {
    const userDocRef = doc(db, "UserInformation", userId);
    const userDoc = await getDoc(userDocRef);

    if (!userDoc.exists()) {
      return NextResponse.json({ redirect: "/resume" }, { status: 200 });
    }

    const userData = userDoc.data();

    if (!userData?.onBoardingResume) {
      return NextResponse.json({ redirect: "/resume" }, { status: 200 });
    }

    if (!userData?.onBoardingQuiz) {
      return NextResponse.json({ redirect: "/quiz" }, { status: 200 });
    }

    return NextResponse.json(
      { redirect: "/result", predictedRole: userData.predicted_role },
      { status: 200 },
    );
  } catch (error) {
    console.error("Error checking user information:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 },
    );
  }
}

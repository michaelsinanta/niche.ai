"use client";
import AuthGuard from "@/components/elements/AuthGuard";
import QuizPage from "@/components/modules/QuizModule";

const Quiz: React.FC = () => {
  return <QuizPage />;
};

export default AuthGuard(Quiz);

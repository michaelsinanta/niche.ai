'use client'
import AuthGuard from "@/components/elements/AuthGuard";
import ResultPage from "@/components/modules/ResultModule";

const Result: React.FC = () => {
  return <ResultPage />;
};

export default AuthGuard(Result);

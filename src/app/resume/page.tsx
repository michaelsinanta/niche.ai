"use client";
import AuthGuard from "@/components/elements/AuthGuard";
import ResumePage from "@/components/modules/ResumeModule";

const Resume: React.FC = () => {
  return <ResumePage />;
};

export default AuthGuard(Resume);

"use client";
import React, { useState } from "react";
import { PageTemplate } from "@/components/elements/PageTemplate";
import { FileInput } from "@/components/elements/FileInput";
import pdfToText from "react-pdftotext";
import { Button } from "@/components/elements/Button";
import { useRouter } from "next/navigation";
import { useAuth } from "@/components/context/AuthContext";

export default function ResumePage() {
  const [pdfFile, setPdfFile] = useState<File | null>(null);
  const [pdfText, setPdfText] = useState("");
  const [analysisResult, setAnalysisResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const { user } = useAuth();

  const handleFileDrop = (files: File[]) => {
    setPdfFile(files[0]);
    setPdfText("");
    setAnalysisResult(null);
  };

  const handleReset = () => {
    setPdfFile(null);
    setPdfText("");
    setAnalysisResult(null);
  };

  const cleanCVText = (text: string) => {
    return text.replace(/\s+/g, " ").trim();
  };

  const handleProcessFile = () => {
    if (pdfFile) {
      pdfToText(pdfFile)
        .then((text) => {
          const cleanedText = cleanCVText(text);
          setPdfText(cleanedText);
          analyzeResume(cleanedText);
        })
        .catch((error) =>
          console.error("Failed to extract text from PDF", error),
        );
    } else {
      console.error("No file selected");
    }
  };

  const analyzeResume = async (text: any) => {
    if (!user || !user.uid) {
      console.error("User is not logged in");
      return;
    }

    setLoading(true);
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/processResume`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ userId: user.uid, cvText: text }),
        },
      );

      const data = await response.json();
      setAnalysisResult(data.result);

      if (data.success) {
        router.push(data.redirect);
      } else {
        console.error("Error in processing resume:", data.error);
      }
    } catch (error) {
      console.error("Failed to analyze resume:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <PageTemplate>
      <div className="flex flex-col items-center">
        <FileInput
          onDrop={handleFileDrop}
          onReset={handleReset}
          value={pdfFile ? "PDF Uploaded" : ""}
          secondaryMessage="Drop your resume here or click to browse"
          success={!!pdfFile}
        />
        {pdfFile && (
          <Button
            variant={"primary"}
            size={"md"}
            onClick={() => handleProcessFile()}
            className="mt-4"
          >
            <h3>{loading ? "Processing..." : "Process Resume"}</h3>
          </Button>
        )}
        {/* {pdfText && (
          <div className="mt-4 p-4 border rounded-md max-w-full overflow-auto">
            <h2 className="text-xl mb-2">Extracted Text:</h2>
            <pre className="whitespace-pre-wrap">{pdfText}</pre>
          </div>
        )}
        {analysisResult && (
          <div className="mt-4 p-4 border rounded-md max-w-full overflow-auto">
            <h2 className="text-xl mb-2">Analysis Results:</h2>
            <pre className="whitespace-pre-wrap">
              {JSON.stringify(analysisResult, null, 2)}
            </pre>
          </div>
        )} */}
      </div>
    </PageTemplate>
  );
}

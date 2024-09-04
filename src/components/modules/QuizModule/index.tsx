"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { questions } from "./questions";
import { PageTemplate } from "@/components/elements/PageTemplate";
import { calculateScore, ScoreResult } from "./scoring";
import { IoIosArrowBack, IoIosArrowForward } from "react-icons/io";
import { useAuth } from "@/components/context/AuthContext";

export default function QuizPage() {
  const router = useRouter();
  const { user } = useAuth();
  const [ratings, setRatings] = useState<number[]>(Array(questions.length).fill(3));
  const [currentPage, setCurrentPage] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(false);

  const questionsPerPage = 4;
  const totalPages = Math.ceil(questions.length / questionsPerPage);

  const handleRatingChange = (index: number, value: number) => {
    const newRatings = [...ratings];
    newRatings[index] = value;
    setRatings(newRatings);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const scores = calculateScore(ratings);

    if (user) {
      try {
        setLoading(true);

        const response = await fetch("/api/quiz", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            userId: user.uid,
            nonTechnicalScores: scores,
          }),
        });

        const data = await response.json();

        if (response.ok) {
          console.log("Predicted role:", data.predictedRole);
          router.push("/result");
        } else {
          console.error("Error processing quiz results:", data.error);
        }
      } catch (error) {
        console.error("Error submitting quiz:", error);
      } finally {
        setLoading(false);
      }
    } else {
      console.error("User not logged in");
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLFormElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
    }
  };

  const nextPage = () => {
    if (currentPage < totalPages - 1) {
      setCurrentPage(currentPage + 1);
      window.scrollTo(0, 0); 
    }
  };

  const prevPage = () => {
    if (currentPage > 0) {
      setCurrentPage(currentPage - 1);
      window.scrollTo(0, 0); 
    }
  };

  const currentQuestions = questions.slice(
    currentPage * questionsPerPage,
    currentPage * questionsPerPage + questionsPerPage,
  );

  const completedQuestions =
    currentPage * questionsPerPage + currentQuestions.length;

  return (
    <PageTemplate>
      <div className="flex flex-col items-center z-10 overflow-y-scroll mt-10">
        <div className="inline-flex items-center bg-gray-100 rounded-full px-4 py-2 shadow mb-5">
          <div className="font-bold text-black mr-3">Progress</div>
          <div className="bg-blue-600 text-white px-3 py-1 rounded-full">
            {completedQuestions} / {questions.length}
          </div>
        </div>

        <form onSubmit={handleSubmit} onKeyDown={handleKeyDown} autoComplete="off">
          {currentQuestions.map((question, index) => {
            const globalIndex = index + currentPage * questionsPerPage;
            return (
              <div key={globalIndex} className="mb-4">
                <label className="items-center text-center justify-center flex flex-col">
                  <h3>{question}</h3>
                  <div className="flex space-x-10 py-5">
                    {globalIndex < 50 ? (
                      [1, 2, 3, 4, 5].map((value) => (
                        <label key={value} className="flex flex-col items-center">
                          <input
                            type="radio"
                            name={`question-${globalIndex}`}
                            value={value}
                            checked={ratings[globalIndex] === value}
                            onChange={() => handleRatingChange(globalIndex, value)}
                            required
                          />
                          {["Disagree", "Slightly Disagree", "Neutral", "Slightly Agree", "Agree"][value - 1]}
                        </label>
                      ))
                    ) : (
                      [1, 2, 3, 4, 5, 6].map((value) => (
                        <label key={value} className="flex flex-col items-center">
                          <input
                            type="radio"
                            name={`question-${globalIndex}`}
                            value={value}
                            checked={ratings[globalIndex] === value}
                            onChange={() => handleRatingChange(globalIndex, value)}
                            required
                          />
                          {[
                            "Not like me at all",
                            "Not like me",
                            "A little like me",
                            "Somewhat like me",
                            "Like me",
                            "Very much like me",
                          ][value - 1]}
                        </label>
                      ))
                    )}
                  </div>
                </label>
              </div>
            );
          })}
          <div className="flex w-full justify-between mt-6">
            <button
              type="button"
              onClick={prevPage}
              disabled={currentPage === 0}
              className={`flex items-center rounded-lg px-4 py-2 font-bold space-x-2 ${
                currentPage === 0 ? 'bg-gray-400 cursor-not-allowed' : 'bg-blue-700 text-white'
              }`}
            >
              <IoIosArrowBack />
              <span>Previous</span>
            </button>

            {currentPage === totalPages - 1 ? (
              <button
                type="submit"
                className={`flex items-center rounded-lg px-4 py-2 font-bold space-x-2 ${
                  loading ? 'bg-gray-400 cursor-not-allowed' : 'bg-green-600 text-white'
                }`}
                disabled={loading}
              >
                <span>{loading ? "Submitting..." : "Finish"}</span>
              </button>
            ) : (
              <button
                type="button"
                onClick={nextPage}
                className="flex items-center rounded-lg bg-blue-700 text-white px-4 py-2 font-bold space-x-2"
              >
                <span>Next</span>
                <IoIosArrowForward />
              </button>
            )}
          </div>
        </form>
      </div>
    </PageTemplate>
  );
}

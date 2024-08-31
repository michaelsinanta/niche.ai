"use client";
import { useState, useEffect } from "react";
import { fetchQuestions, fetchToken } from "../../services/trivia";
import { Button } from "../../elements/Button/index";
import Lottie from "lottie-react";
import Plane from "../../../../public/assets/lottie/plane.json";
import { useRouter } from "next/navigation";
import { questions } from "./questions";
import { PageTemplate } from "@/components/elements/PageTemplate";
import { calculateScore, ScoreResult } from "./scoring";
import { IoIosArrowBack, IoIosArrowForward } from "react-icons/io";

export default function QuizPage() {
  const router = useRouter();
  const [ratings, setRatings] = useState<number[]>(
    Array(questions.length).fill(3),
  );
  const [result, setResult] = useState<ScoreResult | null>(null);
  const [currentPage, setCurrentPage] = useState<number>(0);

  const questionsPerPage = 4;
  const totalPages = Math.ceil(questions.length / questionsPerPage);

  const handleRatingChange = (index: number, value: number) => {
    const newRatings = [...ratings];
    newRatings[index] = value;
    setRatings(newRatings);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const scores = calculateScore(ratings);
    setResult(scores);
  };

  const nextPage = () => {
    if (currentPage < totalPages - 1) {
      setCurrentPage(currentPage + 1);
    }
  };

  const prevPage = () => {
    if (currentPage > 0) {
      setCurrentPage(currentPage - 1);
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

        <form onSubmit={handleSubmit}>
          {currentQuestions.map((question, index) => {
            const globalIndex = index + currentPage * questionsPerPage;
            return (
              <div key={globalIndex} className="mb-4">
                <label className="items-center text-center justify-center flex flex-col">
                  <h3>{question}</h3>
                  <div className="flex space-x-10 py-5">
                    {globalIndex < 50 ? (
                      <>
                        <label className="flex flex-col">
                          <input
                            type="radio"
                            name={`question-${globalIndex}`}
                            value="1"
                            checked={ratings[globalIndex] === 1}
                            onChange={(e) =>
                              handleRatingChange(
                                globalIndex,
                                parseInt(e.target.value, 10),
                              )
                            }
                          />
                          Disagree
                        </label>
                        <label className="flex flex-col">
                          <input
                            type="radio"
                            name={`question-${globalIndex}`}
                            value="2"
                            checked={ratings[globalIndex] === 2}
                            onChange={(e) =>
                              handleRatingChange(
                                globalIndex,
                                parseInt(e.target.value, 10),
                              )
                            }
                          />
                          Slightly Disagree
                        </label>
                        <label className="flex flex-col">
                          <input
                            type="radio"
                            name={`question-${globalIndex}`}
                            value="3"
                            checked={ratings[globalIndex] === 3}
                            onChange={(e) =>
                              handleRatingChange(
                                globalIndex,
                                parseInt(e.target.value, 10),
                              )
                            }
                          />
                          Neutral
                        </label>
                        <label className="flex flex-col">
                          <input
                            type="radio"
                            name={`question-${globalIndex}`}
                            value="4"
                            checked={ratings[globalIndex] === 4}
                            onChange={(e) =>
                              handleRatingChange(
                                globalIndex,
                                parseInt(e.target.value, 10),
                              )
                            }
                          />
                          Slightly Agree
                        </label>
                        <label className="flex flex-col">
                          <input
                            type="radio"
                            name={`question-${globalIndex}`}
                            value="5"
                            checked={ratings[globalIndex] === 5}
                            onChange={(e) =>
                              handleRatingChange(
                                globalIndex,
                                parseInt(e.target.value, 10),
                              )
                            }
                          />
                          Agree
                        </label>
                      </>
                    ) : (
                      <>
                        <label className="flex flex-col">
                          <input
                            type="radio"
                            name={`question-${globalIndex}`}
                            value="1"
                            checked={ratings[globalIndex] === 1}
                            onChange={(e) =>
                              handleRatingChange(
                                globalIndex,
                                parseInt(e.target.value, 10),
                              )
                            }
                          />
                          Not like me at all
                        </label>
                        <label className="flex flex-col">
                          <input
                            type="radio"
                            name={`question-${globalIndex}`}
                            value="2"
                            checked={ratings[globalIndex] === 2}
                            onChange={(e) =>
                              handleRatingChange(
                                globalIndex,
                                parseInt(e.target.value, 10),
                              )
                            }
                          />
                          Not like me
                        </label>
                        <label className="flex flex-col">
                          <input
                            type="radio"
                            name={`question-${globalIndex}`}
                            value="3"
                            checked={ratings[globalIndex] === 3}
                            onChange={(e) =>
                              handleRatingChange(
                                globalIndex,
                                parseInt(e.target.value, 10),
                              )
                            }
                          />
                          A little like me
                        </label>
                        <label className="flex flex-col">
                          <input
                            type="radio"
                            name={`question-${globalIndex}`}
                            value="4"
                            checked={ratings[globalIndex] === 4}
                            onChange={(e) =>
                              handleRatingChange(
                                globalIndex,
                                parseInt(e.target.value, 10),
                              )
                            }
                          />
                          Somewhat like me
                        </label>
                        <label className="flex flex-col">
                          <input
                            type="radio"
                            name={`question-${globalIndex}`}
                            value="5"
                            checked={ratings[globalIndex] === 5}
                            onChange={(e) =>
                              handleRatingChange(
                                globalIndex,
                                parseInt(e.target.value, 10),
                              )
                            }
                          />
                          Like me
                        </label>
                        <label className="flex flex-col">
                          <input
                            type="radio"
                            name={`question-${globalIndex}`}
                            value="6"
                            checked={ratings[globalIndex] === 6}
                            onChange={(e) =>
                              handleRatingChange(
                                globalIndex,
                                parseInt(e.target.value, 10),
                              )
                            }
                          />
                          Very much like me
                        </label>
                      </>
                    )}
                  </div>
                </label>
              </div>
            );
          })}
          <div className="flex w-full justify-between">
            <button
              type="button"
              onClick={prevPage}
              disabled={currentPage === 0}
              className="flex items-center rounded-lg bg-blue-700 shadow-sm px-3 py-2 text-white font-bold space-x-3"
            >
              <IoIosArrowBack />
              <h4>Previous</h4>
            </button>

            {currentPage === totalPages - 1 ? (
              <button
                type="submit"
                className="flex items-center rounded-lg bg-blue-700 shadow-sm px-3 py-2 text-white font-bold space-x-3"
              >
                <h4>Finish</h4>
              </button>
            ) : (
              <button
                type="button"
                onClick={nextPage}
                disabled={currentPage === totalPages - 1}
                className="flex items-center rounded-lg bg-blue-700 shadow-sm px-3 py-2 text-white font-bold space-x-3"
              >
                <IoIosArrowForward />
                <h4>Next</h4>
              </button>
            )}
          </div>
        </form>
        {result && (
          <div style={{ marginTop: "20px" }}>
            <h2>Results</h2>
            {/* Display calculated results */}
            <p>
              <strong>Extraversion:</strong> {result.extraversion}
            </p>
            <p>
              <strong>Agreeableness:</strong> {result.agreeableness}
            </p>
            <p>
              <strong>Conscientousness:</strong> {result.conscientousness}
            </p>
            <p>
              <strong>Emotional Range:</strong> {result.emotionalRange}
            </p>
            <p>
              <strong>Openness:</strong> {result.openness}
            </p>
            <p>
              <strong>Conservation:</strong> {result.conservation.toFixed(2)}
            </p>
            <p>
              <strong>Openness to Change:</strong>{" "}
              {result.opennessToChange.toFixed(2)}
            </p>
            <p>
              <strong>Hedonism:</strong> {result.hedonism.toFixed(2)}
            </p>
            <p>
              <strong>Self-Enhancement:</strong>{" "}
              {result.selfEnhancement.toFixed(2)}
            </p>
            <p>
              <strong>Self-Transcendence:</strong>{" "}
              {result.selfTranscendence.toFixed(2)}
            </p>
          </div>
        )}
      </div>
    </PageTemplate>
  );
}

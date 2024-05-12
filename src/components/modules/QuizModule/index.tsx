"use client";
import { useState, useEffect } from "react";
import { fetchQuestions, fetchToken } from "../../services/trivia";
import { Question } from "./interface";
import { Button } from "../../elements/Button/index";
import Lottie from "lottie-react";
import Plane from "../../../../public/assets/lottie/plane.json";
import { IoMdTimer } from "react-icons/io";
import { useRouter } from "next/navigation";

export default function QuizPage() {
  const [token, setToken] = useState<string | null>(null);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [correctAnswersCount, setCorrectAnswersCount] = useState(0);
  const [totalQuestionsAnswered, setTotalQuestionsAnswered] = useState(0);
  const [timeLeft, setTimeLeft] = useState<number>(600);
  const router = useRouter();

  useEffect(() => {
    const initQuiz = async () => {
      const savedState = localStorage.getItem("quizState");
      let newToken;
      if (savedState) {
        const {
          token: savedToken,
          questions: savedQuestions,
          currentQuestionIndex: savedCurrentQuestionIndex,
          correctAnswersCount: savedCorrectAnswersCount,
          totalQuestionsAnswered: savedTotalQuestionsAnswered,
          timeLeft: savedTimeLeft,
        } = JSON.parse(savedState);

        newToken = savedToken ? savedToken : await fetchToken();
        setToken(newToken);

        if (!savedToken || newToken !== savedToken) {
          localStorage.setItem(
            "quizState",
            JSON.stringify({ ...JSON.parse(savedState), token: newToken }),
          );
          fetchAndSetQuestions(newToken);
        } else {
          setQuestions(savedQuestions);
          setCurrentQuestionIndex(savedCurrentQuestionIndex);
          setCorrectAnswersCount(savedCorrectAnswersCount);
          setTotalQuestionsAnswered(savedTotalQuestionsAnswered);
          setTimeLeft(savedTimeLeft);
        }
      } else {
        newToken = await fetchToken();
        setToken(newToken);
        fetchAndSetQuestions(newToken);
      }
    };

    initQuiz();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const fetchAndSetQuestions = async (token: string) => {
    const data = await fetchQuestions(token);
    if (data.results) {
      setQuestions(data.results.map(formatQuestion));
    }
  };

  useEffect(() => {
    if (token) {
      localStorage.setItem(
        "quizState",
        JSON.stringify({
          token,
          questions,
          currentQuestionIndex,
          correctAnswersCount,
          totalQuestionsAnswered,
          timeLeft,
        }),
      );
    }
  }, [
    token,
    questions,
    currentQuestionIndex,
    correctAnswersCount,
    totalQuestionsAnswered,
    timeLeft,
  ]);

  useEffect(() => {
    if (timeLeft > 0) {
      const timerId = setTimeout(() => {
        setTimeLeft(timeLeft - 1);
      }, 1000);
      return () => clearTimeout(timerId);
    } else if (timeLeft === 0) {
      handleQuizCompletion();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [timeLeft]);

  function formatQuestion(question: any) {
    const formattedQuestion = decodeHtml(question.question);
    const formattedCorrectAnswer = decodeHtml(question.correct_answer);
    const formattedIncorrectAnswers =
      question.incorrect_answers.map(decodeHtml);
    return {
      ...question,
      question: formattedQuestion,
      correct_answer: formattedCorrectAnswer,
      incorrect_answers: formattedIncorrectAnswers,
      random_answers: shuffle([
        formattedCorrectAnswer,
        ...formattedIncorrectAnswers,
      ]),
    };
  }

  function handleAnswer(answer: string) {
    const isCorrect = answer === questions[currentQuestionIndex].correct_answer;
    if (isCorrect) {
      setCorrectAnswersCount((prev) => prev + 1);
    }

    setTotalQuestionsAnswered((prev) => prev + 1);

    const nextQuestionIndex = currentQuestionIndex + 1;
    if (nextQuestionIndex < questions.length) {
      setCurrentQuestionIndex(nextQuestionIndex);
    } else {
      handleQuizCompletion();
    }
  }

  function handleQuizCompletion() {
    setTimeout(() => {
      router.push("/result");
    }, 100);
  }

  function decodeHtml(html: string) {
    let txt = document.createElement("textarea");
    txt.innerHTML = html;
    return txt.value;
  }

  function shuffle(array: string[]) {
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
  }

  const currentQuestion = questions[currentQuestionIndex];

  const formatTime = () => {
    const minutes = Math.floor(timeLeft / 60);
    const seconds = timeLeft % 60;
    return `${minutes}:${seconds < 10 ? "0" : ""}${seconds}`;
  };

  return (
    <main className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden">
      <div className="container flex flex-col items-center justify-center px-[10vw]">
        <div className="hidden lg:block absolute -left-32 -top-48 z-0 h-[80vh] w-[80vh] rounded-full bg-[#5056ED]/[.42]"></div>
        <div className="hidden lg:block absolute -left-40 top-64 z-0 h-[50vh] w-[50vh] rounded-full bg-[#111692]/[.42]"></div>
        <div className="hidden lg:block absolute -right-48 bottom-12 z-0 h-[40vh] w-[40vh] rounded-full bg-[#111692]/[.42]"></div>
        <div className="hidden lg:block absolute -bottom-56 -right-24 z-0 h-[64vh] w-[64vh] rounded-full bg-[#946CE8]/[.62]"></div>
        {questions.length ? (
          <>
            <p className="flex font-bold text-center bg-blue-200 rounded-lg p-4 items-center gap-x-2 mb-7">
              <IoMdTimer size="20" />
              Time Remaining: {formatTime()}
            </p>
            <h3>Question {currentQuestionIndex + 1} / 10</h3>
            <h2 className="text-center">{currentQuestion.question}</h2>
            <div className="flex-row mt-6 grid grid-cols-2 gap-4 items-center justify-stretch">
              {currentQuestion.random_answers.map((answer, index) => (
                <Button
                  className="text-center items-center justify-center"
                  key={index}
                  onClick={() => handleAnswer(answer)}
                  variant="primary"
                  size="md"
                >
                  <h3>{answer}</h3>
                </Button>
              ))}
            </div>
          </>
        ) : (
          <Lottie animationData={Plane} />
        )}
      </div>
    </main>
  );
}

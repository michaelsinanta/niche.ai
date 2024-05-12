"use client";
import { useState, useEffect } from "react";
import { fetchQuestions, fetchToken } from "../../services/trivia";
import { Question } from "./interface";
import { Button } from "../../elements/Button/index";
import Lottie from "lottie-react";
import Plane from '../../../../public/assets/lottie/plane.json';

export default function QuizPage() {
  const [token, setToken] = useState<string | null>(null);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [correctAnswersCount, setCorrectAnswersCount] = useState(0);
  const [totalQuestionsAnswered, setTotalQuestionsAnswered] = useState(0);

  useEffect(() => {
    const initQuiz = async () => {
      const newToken = await fetchToken();
      setToken(newToken);
    };
    initQuiz();
  }, []);

  useEffect(() => {
    if (token) {
      const loadQuestions = async () => {
        const data = await fetchQuestions(token);
        if (data.results) {
          const decodedQuestions = data.results.map((question: Question) => {
            const formattedQuestion = decodeHtml(question.question);
            const formattedCorrectAnswer = decodeHtml(question.correct_answer);
            const formattedIncorrectAnswers =
              question.incorrect_answers.map(decodeHtml);

            const answers = [
              formattedCorrectAnswer,
              ...formattedIncorrectAnswers,
            ];
            shuffle(answers);

            return {
              ...question,
              question: formattedQuestion,
              correct_answer: formattedCorrectAnswer,
              incorrect_answers: formattedIncorrectAnswers,
              random_answers: answers,
            };
          });
          setQuestions(decodedQuestions);
        }
      };

      loadQuestions();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token]);

  function shuffle(array: any[]) {
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
  }

  function decodeHtml(html: string): string {
    var txt = document.createElement("textarea");
    txt.innerHTML = html;
    return txt.value;
  }

  const handleAnswer = (answer: string) => {
    const isCorrect = answer === questions[currentQuestionIndex].correct_answer;
    if (isCorrect) {
      setCorrectAnswersCount(prev => prev + 1);
    }

    setTotalQuestionsAnswered(prev => prev + 1);

    const nextQuestionIndex = currentQuestionIndex + 1;
    if (nextQuestionIndex < questions.length) {
      setCurrentQuestionIndex(nextQuestionIndex);
    } else {
      handleQuizCompletion();
    }
  };

  const currentQuestion = questions[currentQuestionIndex];

  return (
    <main className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden">
      <div className="container flex flex-col items-center justify-center px-[10vw]">
        <div className=" absolute -left-32 -top-48 z-0 h-[80vh] w-[80vh] rounded-full bg-[#5056ED]/[.42]"></div>
        <div className=" absolute -left-40 top-64 z-0 h-[50vh] w-[50vh] rounded-full bg-[#111692]/[.42]"></div>
        <div className=" absolute -right-48 bottom-12 z-0 h-[40vh] w-[40vh] rounded-full bg-[#111692]/[.42]"></div>
        <div className=" absolute -bottom-56 -right-24 z-0 h-[64vh] w-[64vh] rounded-full bg-[#946CE8]/[.62]"></div>
        {questions.length ? (
          <>
            <h3>Question {currentQuestionIndex + 1}:</h3>
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

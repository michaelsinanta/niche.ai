"use client";

import React, {
  type Dispatch,
  type SetStateAction,
  createContext,
  useContext,
  useState,
} from "react";

interface QuizContextType {
  isInQuiz: boolean;
  setIsInQuiz: Dispatch<SetStateAction<boolean>>;
}

const QuizContext = createContext<QuizContextType>({
  isInQuiz: false,
  setIsInQuiz: () => {},
});

export const useQuiz = () => useContext(QuizContext);

export const QuizProvider = ({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) => {
  const [isInQuiz, setIsInQuiz] = useState(false);

  return (
    <QuizContext.Provider value={{ isInQuiz, setIsInQuiz }}>
      {children}
    </QuizContext.Provider>
  );
};

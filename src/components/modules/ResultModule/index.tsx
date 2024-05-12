"use client";

import Head from "next/head";
import { useEffect, useState } from "react";

export default function ResultPage() {
  const [correctAnswersCount, setCorrectAnswersCount] = useState(0);
  const [totalQuestionsAnswered, setTotalQuestionsAnswered] = useState(0);

  useEffect(() => {
    const savedState = localStorage.getItem('quizState');
    if(savedState){
      const {
        correctAnswersCount: savedCorrectAnswersCount,
        totalQuestionsAnswered: savedTotalQuestionsAnswered,
      } = JSON.parse(savedState);

      setCorrectAnswersCount(savedCorrectAnswersCount);
      setTotalQuestionsAnswered(savedTotalQuestionsAnswered);

      localStorage.removeItem('quizState');
    }
  }, []);

  return (
    <>
      <Head>
        <title>Create T3 App</title>
        <meta name="description" content="Generated by create-t3-app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden">
        <div className="container flex flex-col items-center justify-center px-[10vw]">
          <div className=" absolute -left-32 -top-48 z-0 h-[80vh] w-[80vh] rounded-full bg-[#5056ED]/[.42]"></div>
          <div className=" absolute -left-40 top-64 z-0 h-[50vh] w-[50vh] rounded-full bg-[#111692]/[.42]"></div>
          <div className=" absolute -right-48 bottom-12 z-0 h-[40vh] w-[40vh] rounded-full bg-[#111692]/[.42]"></div>
          <div className=" absolute -bottom-56 -right-24 z-0 h-[64vh] w-[64vh] rounded-full bg-[#946CE8]/[.62]"></div>
          <h2 className="text-center mb-10 flex font-bold bg-blue-200 rounded-lg p-4">Hasil</h2>
          <h2>Jumlah Benar ✅ : {correctAnswersCount}</h2>
          <h2>Jumlah Salah ❎ : {10 - correctAnswersCount}</h2>
          <h2>Jumlah Jawab ✍️: {totalQuestionsAnswered}</h2>
        </div>
      </main>
    </>
  );
}

"use client";

import Head from "next/head";
import { Button } from "@/components/elements/Button";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { ReactTyped } from "react-typed";
import { IoRocket } from "react-icons/io5";
import Image from "next/image";
import { useAuth } from "@/components/context/AuthContext";

export default function LandingPage() {
  const router = useRouter();
  const { user } = useAuth();

  useEffect(() => {
    if (user) {
      fetch(`/api/check?userId=${user.uid}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      })
        .then((res) => res.json())
        .then((data) => {
          if (data.redirect) {
            router.push(data.redirect);
          } else {
            console.error("Redirect URL is not defined");
          }
        })
        .catch((err) => {
          console.error("Error fetching redirect data:", err);
        });
    }
  }, [router, user]);

  const handleStartQuiz = () => {
    if (user) {
      router.push("/resume");
    } else {
      toast.error("Please log in first!", {
        position: "top-center",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });
    }
  };

  return (
    <>
      {/* Hero */}
      <main className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden">
        <div className="container flex flex-col items-center justify-center px-[10vw]">
          <div className="hidden md:block lg:block absolute -left-32 -top-48 z-0 h-[80vh] w-[80vh] rounded-full bg-[#5056ED]/[.42]"></div>
          <div className="hidden md:block lg:block absolute -left-40 top-64 z-0 h-[50vh] w-[50vh] rounded-full bg-[#111692]/[.42]"></div>
          <div className="hidden md:block lg:block absolute -right-48 bottom-12 z-0 h-[40vh] w-[40vh] rounded-full bg-[#111692]/[.42]"></div>
          <div className="hidden md:block lg:block absolute -bottom-56 -right-24 z-0 h-[64vh] w-[64vh] rounded-full bg-[#946CE8]/[.62]"></div>

          <h1 className="text-center text-5xl font-bold mt-10">
            Don&apos;t know what job in IT suits you?
          </h1>
          <p className="text-center mt-4 text-xl max-w-2xl">
            Our AI will analyze your CV, recommend some niches, and build your
            personalized learning roadmap.
          </p>

          <Button
            variant={"primary"}
            size={"md"}
            onClick={() => handleStartQuiz()}
            className="flex space-x-3 items-center mt-8"
          >
            <h3>Find your niche</h3>
            <IoRocket color="white" size={25} />
          </Button>

          <div className="flex items-center space-x-6 mt-5">
            <Image
              src="/assets/robot.svg"
              alt="Robot"
              width={200}
              height={200}
              className="object-contain"
            />
            <div className="relative bg-white px-6 py-4 rounded-lg shadow-md">
              <h2 className="text-xl font-semibold text-gray-800">
                Your niche roles could be
              </h2>
              <h2 className="text-3xl font-bold text-primary">
                <ReactTyped
                  strings={[
                    "Database Developer",
                    "Software Engineer",
                    "UI/UX Engineer",
                    "DevOps Specialist",
                    "Cybersecurity Analyst",
                  ]}
                  typeSpeed={50}
                  backSpeed={30}
                  loop
                />
              </h2>
              <div className="absolute bottom-0 left-0 w-4 h-4 bg-white rotate-45 transform -translate-x-1/2 translate-y-1/2"></div>
            </div>
          </div>
        </div>
      </main>
      <ToastContainer />
    </>
  );
}
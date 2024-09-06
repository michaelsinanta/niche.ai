"use client";

import { PageTemplate } from "@/components/elements/PageTemplate";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/components/context/AuthContext";
import { doc, getDoc } from "firebase/firestore";
import { db } from "@/components/firebase";
import { Button } from "@/components/elements/Button";
import {
  MdKeyboardDoubleArrowLeft,
  MdKeyboardArrowLeft,
  MdKeyboardArrowRight,
  MdKeyboardDoubleArrowRight,
} from "react-icons/md";
import Image from "next/image";
interface Job {
  jobId: number;
  jobTitle: string;
  locationName: string;
  minimumSalary: number;
  maximumSalary: number;
  currency: string;
  expirationDate: string;
  jobUrl: string;
  employerName: string;
  jobDescription: string;
}

export default function ResultPage() {
  const { user } = useAuth();
  const [predictedRole, setPredictedRole] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [nicheJobs, setNicheJobs] = useState<string[]>([]);
  const [selectedNiche, setSelectedNiche] = useState<string | null>(null);
  const [jobs, setJobs] = useState<Job[]>([]);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [jobsPerPage] = useState<number>(6);
  const router = useRouter();

  useEffect(() => {
    const fetchUserInformation = async () => {
      if (user) {
        try {
          const userDocRef = doc(db, "UserInformation", user.uid);
          const userDoc = await getDoc(userDocRef);

          if (userDoc.exists()) {
            const userData = userDoc.data();
            setPredictedRole(userData?.predicted_role);
            const nichesFromFirestore = userData?.nicheJobs || [];
            setNicheJobs(nichesFromFirestore);
            setSelectedNiche(nichesFromFirestore[0] || null);
          } else {
            setError("User information not found");
          }
        } catch (err) {
          console.error("Error fetching user information:", err);
          setError("Failed to fetch user information");
        } finally {
          setLoading(false);
        }
      } else {
        setError("User not logged in");
        setLoading(false);
      }
    };

    fetchUserInformation();
  }, [user]);

  useEffect(() => {
    if (selectedNiche) {
      fetchJobsForNiche(selectedNiche);
    }
  }, [selectedNiche]);

  const fetchJobsForNiche = async (niche: string) => {
    try {
      const response = await fetch(
        `${
          process.env.NEXT_PUBLIC_API_BASE_URL
        }/getJobs?keywords=${encodeURIComponent(niche)}`,
      );
      const data = await response.json();

      if (response.ok) {
        setJobs(data.jobs || []);
      } else {
        console.error("Error fetching jobs:", data.error);
      }
    } catch (error) {
      console.error("Error fetching jobs:", error);
    }
  };

  const totalItems = jobs.length;
  const totalPages = Math.ceil(totalItems / jobsPerPage);

  const indexOfLastJob = currentPage * jobsPerPage;
  const indexOfFirstJob = indexOfLastJob - jobsPerPage;
  const currentJobs = jobs.slice(indexOfFirstJob, indexOfLastJob);

  const handleFirstPage = () => setCurrentPage(1);
  const handleLastPage = () => setCurrentPage(totalPages);
  const handleNextPage = () =>
    setCurrentPage((prev: number) => Math.min(prev + 1, totalPages));
  const handlePreviousPage = () =>
    setCurrentPage((prev: number) => Math.max(prev - 1, 1));
  const handlePageNumberClick = (page: number) => {
    setCurrentPage(page);
  };

  const getVisiblePages = () => {
    const visiblePages = [];
    const maxPagesToShow = 5;

    const startPage = Math.max(1, currentPage - Math.floor(maxPagesToShow / 2));
    const endPage = Math.min(totalPages, startPage + maxPagesToShow - 1);

    for (let i = startPage; i <= endPage; i++) {
      visiblePages.push(i);
    }

    return visiblePages;
  };

  const visiblePages = getVisiblePages();

  if (loading) {
    return (
      <PageTemplate>
        <div className="flex flex-col items-center justify-center h-full">
          <Image
            src="/assets/logo.png"
            alt="Robot"
            width={200}
            height={200}
            className="object-contain"
          />
          <h3 className="text-3xl text-primary">Loading...</h3>
        </div>
      </PageTemplate>
    );
  }

  if (error) {
    return (
      <PageTemplate>
        <div className="flex items-center justify-center h-full">
          <p>{error}</p>
        </div>
      </PageTemplate>
    );
  }

  return (
    <PageTemplate>
      <div className="flex flex-col items-center justify-center h-full mt-28 z-10">
        <h1 className="text-3xl font-bold mb-4">Your Perfect Career Match</h1>
        <p className="text-xl">
          Based on your resume and personality, we believe you&apos;d excel as a{" "}
          <span className="font-semibold text-[#6d00f9]">{predictedRole}</span>.
        </p>

        <h2 className="text-2xl font-bold mt-8 mb-4">
          Explore Your Recommended Niche Career Roles
        </h2>
        {nicheJobs.length > 0 ? (
          <div className="flex flex-wrap justify-center space-x-3 space-y-3 mb-10">
            {nicheJobs.map((niche, index) => (
              <Button
                key={index}
                variant={selectedNiche === niche ? "primary" : "white"}
                onClick={() => setSelectedNiche(niche)}
                size={"md"}
                className="hover:text-white"
              >
                {niche}
              </Button>
            ))}
          </div>
        ) : (
          <p>No specialized career paths available at the moment.</p>
        )}

        <h2 className="text-xl font-bold ">Job Listings for {selectedNiche}</h2>
        <p className="font-medium mt-6 mb-10">
          Showing {indexOfFirstJob + 1} - {Math.min(indexOfLastJob, totalItems)}{" "}
          of {totalItems}
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {currentJobs.length === 0 ? (
            <p>No jobs available for the selected niche</p>
          ) : (
            currentJobs.map((job) => (
              <div
                key={job.jobId}
                className="relative p-6 pb-16 border border-gray-200 rounded-lg shadow-md bg-white"
              >
                <h3 className="font-bold text-xl text-[#6d00f9] mb-2">
                  {job.jobTitle}
                </h3>
                <p className="mb-2">
                  <span className="font-bold text-gray-700">Location:</span>{" "}
                  <span className="text-gray-600">{job.locationName}</span>
                </p>
                <p className="mb-2">
                  <span className="font-bold text-gray-700">Salary:</span>{" "}
                  <span className="text-gray-600">
                    {job.currency} {job.minimumSalary} - {job.maximumSalary}
                  </span>
                </p>
                <p className="mb-2">
                  <span className="font-bold text-gray-700">Employer:</span>{" "}
                  <span className="text-gray-600">{job.employerName}</span>
                </p>
                <p className="mb-4">
                  <span className="font-bold text-gray-700">
                    Expiration Date:
                  </span>{" "}
                  <span className="text-gray-600">{job.expirationDate}</span>
                </p>

                <a
                  href={`/job/${job.jobId}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="absolute text-md bottom-4 right-4 bg-[#6d00f9] text-white font-bold py-2 px-4 rounded-lg shadow hover:bg-[#5801c7] transition duration-300 ease-in-out"
                >
                  Find More
                </a>
              </div>
            ))
          )}
        </div>

        {/* Pagination */}

        <div className="flex items-center justify-center space-x-3 m-12">
          <div
            className={`${
              currentPage === 1
                ? "text-gray-400 cursor-not-allowed"
                : "text-black cursor-pointer"
            } flex space-x-3`}
          >
            <MdKeyboardDoubleArrowLeft onClick={handleFirstPage} size={30} />
            <MdKeyboardArrowLeft onClick={handlePreviousPage} size={30} />
          </div>
          {visiblePages.map((pageNumber) => (
            <span
              key={pageNumber}
              className={`cursor-pointer px-3 py-1 ${
                currentPage === pageNumber
                  ? "bg-[#6d00f9] text-white rounded-lg font-bold"
                  : "bg-[#e1dffb] text-black rounded-lg"
              } hover:bg-[#6d00f9] hover:text-white transition-colors duration-300`}
              onClick={() => handlePageNumberClick(pageNumber)}
            >
              {pageNumber}
            </span>
          ))}

          <div
            className={`${
              currentPage === totalPages
                ? "text-gray-400 cursor-not-allowed"
                : "text-black cursor-pointer"
            } flex space-x-3`}
          >
            <MdKeyboardArrowRight onClick={handleNextPage} size={30} />
            <MdKeyboardDoubleArrowRight onClick={handleLastPage} size={30} />
          </div>
        </div>
      </div>
    </PageTemplate>
  );
}

"use client";

import { useEffect, useState } from "react";
import { PageTemplate } from "@/components/elements/PageTemplate";
import Image from "next/image";
import { FaArrowLeft } from "react-icons/fa";
import { useRouter } from "next/navigation";

interface JobDetail {
  employerId: number;
  employerName: string;
  jobId: number;
  jobTitle: string;
  locationName: string;
  minimumSalary: number;
  maximumSalary: number;
  yearlyMinimumSalary: number;
  yearlyMaximumSalary: number;
  currency: string;
  salaryType: string;
  salary: string;
  datePosted: string;
  expirationDate: string;
  externalUrl: string | null;
  jobUrl: string;
  partTime: boolean;
  fullTime: boolean;
  contractType: string;
  jobDescription: string;
  applicationCount: number;
}

interface YouTubeVideo {
  title: string;
  videoId: string;
  thumbnailUrl: string;
}

export default function JobDetailPage({ params }: { params: { id: string } }) {
  const { id } = params;
  const [job, setJob] = useState<JobDetail | null>(null);
  const [skills, setSkills] = useState<string[]>([]);
  const [youtubeVideos, setYoutubeVideos] = useState<{
    [key: string]: YouTubeVideo | null;
  }>({});
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [showFullDescription, setShowFullDescription] = useState(false);
  const router = useRouter();

  const handleGoBack = () => {
    router.push("/result");
  };

  const toggleDescription = () => {
    setShowFullDescription((prevState) => !prevState);
  };

  useEffect(() => {
    if (id) {
      fetchJobDetail(id);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  const fetchJobDetail = async (id: string) => {
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/getJobById?id=${id}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        },
      );
      const data = await response.json();
      if (response.ok) {
        setJob(data.job);
        const extractedSkills = await extractSkillsFromJob(
          data.job.jobDescription,
        );
        setSkills(extractedSkills);
        const videos = await fetchYouTubeVideosForSkills(extractedSkills);
        setYoutubeVideos(videos);
      } else {
        setError(data.error);
      }
    } catch (err) {
      console.error("Error fetching job details:", err);
      setError("Failed to fetch job details");
    } finally {
      setLoading(false);
    }
  };

  const extractSkillsFromJob = async (jobDescription: string) => {
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/extractJobSkills`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ jobDescription: jobDescription }),
        },
      );
      const data = await response.json();
      if (response.ok) {
        return data.skills.skills;
      } else {
        console.error("Error extracting skills:", data.error);
        return [];
      }
    } catch (err) {
      console.error("Error extracting skills:", err);
      return [];
    }
  };

  const fetchYouTubeVideosForSkills = async (skills: string[]) => {
    const videos: { [key: string]: YouTubeVideo | null } = {};
    for (const skill of skills) {
      const video = await fetchYouTubeTutorial(skill);
      videos[skill] = video;
    }
    return videos;
  };

  const fetchYouTubeTutorial = async (
    skill: string,
  ): Promise<YouTubeVideo | null> => {
    try {
      const response = await fetch(
        `https://www.googleapis.com/youtube/v3/search?part=snippet&type=video&q=${encodeURIComponent(
          `${skill} tech tutorial`,
        )}&maxResults=1&key=${process.env.NEXT_PUBLIC_YOUTUBE_API_KEY}`,
      );

      const data = await response.json();

      if (data.items && data.items.length > 0) {
        const video = data.items[0];
        return {
          title: video.snippet.title,
          videoId: video.id.videoId,
          thumbnailUrl: video.snippet.thumbnails.high.url,
        };
      } else {
        console.error(`No video found for skill: ${skill}`);
        return null;
      }
    } catch (error) {
      console.error(`Error fetching YouTube video for skill: ${skill}`, error);
      return null;
    }
  };

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

  const shortDescription = job?.jobDescription.substring(0, 400) + "...";

  return (
    <main className="relative flex min-h-screen flex-col items-center overflow-hidden">
      <div className="container flex flex-col items-center justify-center px-[5vw]">
        <div className="hidden md:block lg:block absolute -left-32 -top-48 z-0 h-[80vh] w-[80vh] rounded-full bg-[#5056ED]/[.42]"></div>
        <div className="hidden md:block lg:block absolute -left-40 top-64 z-0 h-[50vh] w-[50vh] rounded-full bg-[#111692]/[.42]"></div>
        <div className="hidden md:block lg:block absolute -right-48 bottom-12 z-0 h-[40vh] w-[40vh] rounded-full bg-[#111692]/[.42]"></div>
        <div className="hidden md:block lg:block absolute -bottom-56 -right-24 z-0 h-[64vh] w-[64vh] rounded-full bg-[#946CE8]/[.62]"></div>
        <div className=" z-10 my-32">
          <button
            onClick={handleGoBack}
            className="flex items-center bg-white px-4 py-2 rounded-lg text-primary font-bold transition mb-3 border border-2 border-primary"
          >
            <FaArrowLeft className="mr-2" />
            Go Back
          </button>
          <div className="flex flex-col items-center justify-center h-full bg-[#F5E8FF] p-8 rounded-lg shadow-lg w-full">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 w-full">
              <div className="bg-white rounded-lg p-6 shadow-md">
                <h1 className="text-4xl font-extrabold mb-6 text-[#6d00f9]">
                  {job?.jobTitle}
                </h1>
                <p className="text-md font-bold text-[#6d00f9] mb-2">
                  Location:{" "}
                  <span className="text-gray-700 font-normal">
                    {job?.locationName}
                  </span>
                </p>
                <p className="text-md font-bold mb-2 text-[#6E00FA]">
                  Salary:{" "}
                  <span className="text-gray-700 font-normal">
                    {job?.currency} {job?.minimumSalary} - {job?.maximumSalary}{" "}
                    ({job?.salaryType})
                  </span>
                </p>
                <p className="text-md text-[#6d00f9] font-bold mb-2">
                  Contract Type:{" "}
                  <span className="text-gray-700 font-normal">
                    {job?.contractType}
                  </span>
                </p>
                <p className="text-md text-[#6d00f9] font-bold mb-2">
                  Full-Time:{" "}
                  <span className="text-gray-700 font-normal">
                    {job?.fullTime ? "Yes" : "No"}
                  </span>
                </p>
                <p className="text-md text-[#6d00f9] font-bold mb-2">
                  Part-Time:{" "}
                  <span className="text-gray-700 font-normal">
                    {job?.partTime ? "Yes" : "No"}
                  </span>
                </p>
                <p className="text-md text-[#6d00f9] font-bold mt-2">
                  Applications:{" "}
                  <span className="text-gray-700 font-normal">
                    {job?.applicationCount}
                  </span>
                </p>
                <a
                  href={job?.jobUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-[#6d00f9] text-white font-bold py-3 px-8 rounded-lg shadow hover:bg-[#5801c7] transition duration-300 ease-in-out mt-6 inline-block"
                >
                  Apply Here
                </a>
              </div>

              {/* Right Section: Job Description */}
              <div className="bg-white rounded-lg p-6 shadow-md">
                <h2 className="text-3xl font-bold text-[#6d00f9] mb-4">
                  Job Description
                </h2>
                <div
                  className="text-md mb-6 text-gray-600 leading-relaxed"
                  dangerouslySetInnerHTML={{
                    __html: showFullDescription
                      ? job?.jobDescription || ""
                      : shortDescription || "",
                  }}
                ></div>

                <button
                  onClick={toggleDescription}
                  className="bg-[#6d00f9] text-white font-bold py-2 px-6 rounded-lg shadow hover:bg-[#5801c7] transition duration-300 ease-in-out"
                >
                  {showFullDescription ? "Show Less" : "Show More"}
                </button>
              </div>
            </div>

            <div className="w-full bg-white rounded-lg p-6 shadow-md mt-8">
              <h2 className="text-4xl font-bold text-[#6d00f9] mb-4">
                Skills you should learned
              </h2>
              {skills.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {skills.map((skill, index) => (
                    <div key={index} className="mb-6">
                      <div className="font-semibold">{skill}</div>
                      {youtubeVideos[skill] ? (
                        <div className="mt-2">
                          <iframe
                            width="100%"
                            height="315"
                            src={`https://www.youtube.com/embed/${youtubeVideos[skill]?.videoId}`}
                            title={youtubeVideos[skill]?.title}
                            frameBorder="0"
                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                            allowFullScreen
                          ></iframe>
                        </div>
                      ) : (
                        <p className="text-sm text-gray-500">
                          No video available for this skill.
                        </p>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-md text-gray-600">No skills extracted.</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}

"use client";

import { PageTemplate } from "@/components/elements/PageTemplate";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/components/context/AuthContext";
import { doc, getDoc } from "firebase/firestore";
import { db } from "@/components/firebase";
import { Button } from "@/components/elements/Button";

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
}

export default function ResultPage() {
  const { user } = useAuth();
  const [predictedRole, setPredictedRole] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [nicheJobs, setNicheJobs] = useState<string[]>([]);
  const [selectedNiche, setSelectedNiche] = useState<string | null>(null);
  const [jobs, setJobs] = useState<Job[]>([]);
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
      const response = await fetch(`/api/jobs?keywords=${encodeURIComponent(niche)}`);
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
  

  if (loading) {
    return (
      <PageTemplate>
        <div className="flex items-center justify-center h-full">
          <p>Loading...</p>
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
      <div className="flex flex-col items-center justify-center h-full">
        <h1 className="text-3xl font-bold mb-4">Your Predicted Role</h1>
        <p className="text-xl">{predictedRole}</p>

        <h2 className="text-2xl font-bold mt-8 mb-4">Niche Roles</h2>
        {nicheJobs.length > 0 ? (
          <div className="flex flex-wrap space-x-4 mb-8">
            {nicheJobs.map((niche, index) => (
              <Button
                key={index}
                variant={selectedNiche === niche ? "primary" : "white"}
                onClick={() => setSelectedNiche(niche)} 
                size={"md"}             
              >
                {niche}
              </Button>
            ))}
          </div>
        ) : (
          <p>No niche roles available</p>
        )}

        <h2 className="text-2xl font-bold mb-4">Job Listings for {selectedNiche}</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {jobs.length === 0 ? (
            <p>No jobs available for the selected niche</p>
          ) : (
            jobs.map((job) => (
              <div key={job.jobId} className="p-4 border rounded-lg shadow-md">
                <h3 className="font-semibold text-lg">{job.jobTitle}</h3>
                <p>{job.locationName}</p>
                <p>
                  Salary: {job.currency} {job.minimumSalary} - {job.maximumSalary}
                </p>
                <p>Employer: {job.employerName}</p>
                <p>Expiration Date: {job.expirationDate}</p>
                <a
                  href={job.jobUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-500 underline"
                >
                  View Job
                </a>
              </div>
            ))
          )}
        </div>
      </div>
    </PageTemplate>
  );
}

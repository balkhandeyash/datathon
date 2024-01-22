// Dashboard.js
import React, { useState, useEffect, useRef } from "react";
import "./Dashboard.css";
import JobDetailsCard from "./JobDetailsCard.js";

const Dashboard = () => {
  const [jobs, setJobs] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedJob, setSelectedJob] = useState(null);
  const jobsPerPage = 15;
  const jobListingRef = useRef(null);

  // Dummy data for jobs (replace this with your actual job data)
  const dummyJobs = Array.from({ length: 50 }, (_, index) => ({
    id: index + 1,
    title: `Job ${index + 1}`,
    company: `Company ${index + 1}`,
    location: `Location ${index + 1}`,
    description: `Description for Job ${
      index + 1
    }. This is a sample job description.`,
  }));

  // Calculate the index range for jobs on the current page
  const indexOfLastJob = currentPage * jobsPerPage;
  const indexOfFirstJob = indexOfLastJob - jobsPerPage;
  const currentJobs = jobs.slice(indexOfFirstJob, indexOfLastJob);

  useEffect(() => {
    // In a real-world scenario, fetch jobs from an API or a database
    setJobs(dummyJobs);
  }, [dummyJobs]);

  const handleNextPage = () => {
    setCurrentPage((prevPage) => prevPage + 1);
    setSelectedJob(null); // Reset selected job when changing the page
  };

  const handlePreviousPage = () => {
    setCurrentPage((prevPage) => prevPage - 1);
    setSelectedJob(null); // Reset selected job when changing the page
  };

  const handleJobClick = (jobId) => {
    setSelectedJob(jobId);
  };

  const handleDocumentClick = (event) => {
    if (
      jobListingRef.current &&
      !jobListingRef.current.contains(event.target)
    ) {
      // Clicked outside the job listing container
      setSelectedJob(null);
    }
  };

  useEffect(() => {
    document.addEventListener("click", handleDocumentClick);

    return () => {
      document.removeEventListener("click", handleDocumentClick);
    };
  }, []);

  return (
    <div className="Dashboard-body">
      <h2>Job Listings</h2>
      <div
        ref={jobListingRef}
        className={`job-listing-container ${selectedJob ? "zoomed" : ""}`}
      >
        <div className="job-grid">
          {currentJobs.map((job) => (
            <div
              key={job.id}
              className={`job-card ${selectedJob === job.id ? "selected" : ""}`}
              onClick={() => handleJobClick(job.id)}
            >
              <h3>{job.title}</h3>
              <p>{job.company}</p>
              <p>{job.location}</p>
              <p className="job-description">{job.description}</p>
            </div>
          ))}
        </div>
        <div className="pagination">
          <button onClick={handlePreviousPage} disabled={currentPage === 1}>
            Previous
          </button>
          <span>{`Page ${currentPage}`}</span>
          <button
            onClick={handleNextPage}
            disabled={indexOfLastJob >= jobs.length}
          >
            Next
          </button>
        </div>
      </div>

      {selectedJob && (
        <JobDetailsCard
          job={jobs.find((job) => job.id === selectedJob)}
          onClose={() => setSelectedJob(null)}
        />
      )}
    </div>
  );
};

export default Dashboard;

// JobDetailsCard.js
import React from "react";

const JobDetailsCard = ({ job, onClose }) => {
  return (
    <div className="job-details-card">
      <h2>{job.title}</h2>
      <p>{job.companyName}</p>
      <p>{job.location}</p>
      <p>{job.description}</p>
      <p>{job.link}</p>
      <button className="close-button" onClick={onClose}>
        Close
      </button>
    </div>
  );
};

export default JobDetailsCard;

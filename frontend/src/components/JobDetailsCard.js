// JobDetailsCard.js
import React from "react";

const JobDetailsCard = ({ job, onClose }) => {
  return (
    <div className="job-details-card">
      <h2>{job.title}</h2>
      <p>{job.company}</p>
      <p>{job.location}</p>
      <p>{job.description}</p>
      <button className="close-button" onClick={onClose}>
        Close
      </button>
    </div>
  );
};

export default JobDetailsCard;

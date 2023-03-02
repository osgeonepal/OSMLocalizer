import React from "react";
// import { Link } from "react-router-dom";

const ChallengeCard = ({ challenge, onChallengeClick, detailView }) => {
  const progress = Math.round((challenge.stats.total-challenge.stats.to_localize) / challenge.stats.total * 100, 2);
  const cardClass = detailView
    ? "col-xs-10 col-sm-8 col-md-5 col-lg-5 card overflow-hidden"
    : "col-xs-10 col-sm-8 col-md-4 col-lg-3 card overflow-hidden";
  return (
    <div
      onClick={() => onChallengeClick(challenge)}
      className={cardClass}
      style={{ height: "368px", cursor: "pointer" }}
    >
      <div className="card-body">
        <div className="d-flex justify-content-end mb-1">
          <div className="badge border border-secondary-subtle text-secondary rounded-0 p-2">
            <i className="fa fa-clock-o" aria-hidden="true"></i>
            <span className=""> {challenge.due_date} days left</span>
          </div>
        </div>
        <div className="card-title fs-5 fw-bold pb-2">
          <span className="text-secondary">#{challenge.id}</span>{" "}
          {challenge.name.toUpperCase()}
        </div>
        <h6 className="card-subtitle mb-2 text-muted pb-2">
          {challenge.country}
        </h6>
        <p
          className="card-text overflow-hidden text-muted pb-2"
          style={{ height: "100px" }}
        >
          {challenge.description}
        </p>
        <div className="text-muted pt-2" style={{ fontSize: "0.8rem" }}>
          Last contribution {challenge.last_updated}
        </div>
        <div className="progress rounded-0 mt-2" style={{ height: "8px" }}>
          <div
            className="progress-bar"
            role="progressbar"
            style={{ width: progress+"%" }}
          ></div>
        </div>
        <div className="text-dark pt-2" style={{ fontSize: "0.8rem" }}>
          {progress}%
          <span className="text-muted"> ({challenge.stats.localized} out of {challenge.stats.total} Localized)</span>
        </div>
      </div>
    </div>
  );
};
export default ChallengeCard;

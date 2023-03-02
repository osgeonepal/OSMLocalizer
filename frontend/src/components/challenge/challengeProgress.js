import React from "react";
import { Link } from "react-router-dom";

export const ChallengeProgress = (props) => {
  return (
    <div
      className="challenge-progress align-bottom d-flex flex-column justify-content-end"
      style={{ height: "15vh" }}
    >
      <div className="d-flex flex-row p-2">
        <span className="text-secondary flex-grow-1">12 Contributors</span>
        <span className="text-secondary">
          Task Data Sourced: October 21, 2022
        </span>
      </div>
      <div className="progress" style={{ height: "12px" }}>
        <div
          className="progress-bar"
          role="progressbar"
          style={{ width: "25%" }}
          aria-valuenow="25"
          aria-valuemin="0"
          aria-valuemax="100"
        >
          25%
        </div>
      </div>
      <div className="d-flex p-2 mt-2">
        <div className="flex-grow-1">
          <div className="badge border border-secondary-subtle text-secondary rounded-0 p-2">
            <i className="fa fa-clock-o" aria-hidden="true"></i>
            <span className=""> {props.challenge.due_date} days left</span>
          </div>
        </div>
        <Link to={`/challenge/${props.challenge.id}`} className="">
          <button className="btn btn-primary">Localize</button>
        </Link>
      </div>
    </div>
  );
};

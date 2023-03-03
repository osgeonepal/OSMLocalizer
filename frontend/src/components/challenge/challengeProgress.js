import React from "react";
import { Link } from "react-router-dom";
import { Tooltip } from "react-tooltip";
import "react-tooltip/dist/react-tooltip.css";

const ProgressBar = (props) => {
  return (
    <>
      <div
        className="progress"
        style={{ width: props.value + "%" }}
        data-tooltip-id={props.label}
        data-tooltip-content={props.label}
      >
        <div className={`progress-bar bg-${props.color}`} />
      </div>
      <Tooltip
        place="top"
        className={`bg-${props.color}`}
        effect="solid"
        id={props.label}
      />
    </>
  );
};

export const ChallengeProgress = (props) => {
  const featureStatuses = {
    localized: { color: "primary text-white", label: "Localized" },
    skipped: { color: "info text-black", label: "Skipped" },
    already_localized: {
      color: "success text-white",
      label: "Already Localized",
    },
    invalid_data: { color: "warning text-black", label: "Invalid Data" },
    too_hard: { color: "danger-subtle text-black", label: "Too Hard" },
  };

  return (
    <div
      className="challenge-progress align-bottom d-flex flex-column justify-content-end"
      style={{ height: "15vh" }}
    >
      <div className="d-flex flex-row p-2">
        <span className="text-secondary flex-grow-1">12 Contributors</span>
        <span className="text-secondary">
          Task Data Sourced: {props.challenge.created}
        </span>
      </div>
      <div className="progress-stacked">
        {Object.keys(featureStatuses).map((status) => {
          return (
            <ProgressBar
              key={status}
              value={props.challenge.stats[status]}
              color={featureStatuses[status]["color"]}
              label={
                featureStatuses[status]["label"] +
                `- (${props.challenge.stats[status]}%)`
              }
            />
          );
        })}
      </div>
      <div className="d-flex p-2 mt-2">
        <div className="flex-grow-1">
          <div className="badge border border-secondary-subtle text-secondary rounded-0 p-2">
            <i className="fa fa-clock-o" aria-hidden="true"></i>
            <span className=""> {props.challenge.due_date} days left</span>
          </div>
        </div>
        <Link to={`/challenge/${props.challenge.id}`} className="">
          <button
            className="btn btn-primary"
            disabled={props.challenge.stats.to_localize === 0}
          >
            Localize
          </button>
        </Link>
      </div>
    </div>
  );
};

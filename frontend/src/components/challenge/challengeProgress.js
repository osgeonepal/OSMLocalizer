import React from "react";
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
        style={{ fontSize: "0.8rem" }}
        id={props.label}
      />
    </>
  );
};

const ProgressText = ({ label, total, value }) => {
  return (
    <div>
      <span className="text-primary me-2 fw-bold">{Math.round((value / total) * 100, 2)}%</span>
      <span className="text-secondary me-2">{label}</span>
      <span className="text-secondary">({value}/{total})</span>
    </div>
  );
};

export const ChallengeProgress = (props) => {
  const stats = props.challenge.stats;

  const getPercentage = (value) => {
    return Math.round((value / stats.total) * 100, 2);
  };

  const totalLocalized = stats.localized + stats.already_localized + stats.too_hard + stats.invalid_data + stats.skipped + stats.validated;
  const daysLeft = Math.round((new Date(props.challenge.due_date) - new Date()) / (1000 * 60 * 60 * 24));

  const featureStatuses = {
    localized: {
      color: "success text-white",
      label: "Localized",
      value: getPercentage(stats.localized),
    },
    already_localized: {
      color: "primary text-white",
      label: "Already Localized",
      value: getPercentage(stats.already_localized),
    },
    skipped: {
      color: "info text-black",
      label: "Skipped",
      value: getPercentage(stats.skipped),
    },
    invalid_data: {
      color: "warning text-black",
      label: "Invalid Data",
      value: getPercentage(stats.invalid_data),
    },
    too_hard: {
      color: "danger text-white",
      label: "Too Hard",
      value: getPercentage(stats.too_hard),
    },
  };

  const createdDate = new Date(props.challenge.created);
  const formattedDate = createdDate.toLocaleDateString('en-US', {
    day: '2-digit',
    month: 'short',
    year: 'numeric'
  });


  return (
    <div
      className="challenge-progress align-bottom"
    >
      <div className="d-flex flex-row pb-2">
        <span className="text-secondary flex-grow-1">
          {props.challenge.total_contributors} Contributors
        </span>
        <span className="text-secondary">
          Task Data Sourced: {formattedDate}
        </span>
      </div>
      <div className="progress-stacked">
        {Object.keys(featureStatuses).map((status) => {
          return (
            <ProgressBar
              key={status}
              value={featureStatuses[status]["value"]}
              color={featureStatuses[status]["color"]}
              label={
                featureStatuses[status]["label"] +
                `: (${featureStatuses[status]["value"]}%)`
              }
            />
          );
        })}
      </div>
      <div className="pt-2 d-flex justify-content-between align-items-center">
        <div>
          <ProgressText
            value={totalLocalized}
            total={stats.total}
            label="Localized"
          />
          <ProgressText
            value={stats.validated}
            total={stats.total}
            label="Validated"
          />
        </div>
        <div className="badge border border-secondary text-secondary rounded-0 p-2">
          <i className="fa fa-clock-o" aria-hidden="true"></i>
          <span className=""> {daysLeft > 0 ? `${daysLeft} days left` : "Expired"}</span>
        </div>
      </div>
    </div>
  );
};

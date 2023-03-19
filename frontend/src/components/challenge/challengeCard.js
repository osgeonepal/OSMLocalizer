import React from "react";
import { Tooltip } from "react-tooltip";
import "react-tooltip/dist/react-tooltip.css";

const ChallengeCard = ({ challenge, onChallengeClick, detailView }) => {
  const skipped =
    challenge.stats.invalid_data +
    challenge.stats.skipped +
    challenge.stats.too_hard;
  const localized =
    challenge.stats.localized + challenge.stats.already_localized;
  const progress = Math.round(
    ((skipped + localized) / challenge.stats.total) * 100,
    2
  );

  const cardClass = detailView
    ? "col-xs-10 col-sm-8 col-md-5 col-lg-5 card overflow-hidden"
    : "col-xs-10 col-sm-8 col-md-4 col-lg-3 card overflow-hidden";
  return (
    <div
      onClick={() => onChallengeClick(challenge)}
      className={cardClass}
      style={{ height: "368px", cursor: "pointer" }}
    >
      <div className="card-body d-flex justify-content-between flex-column">
        <div>
          <div className="d-flex justify-content-end mb-2">
            <div className="flex-grow-1">
              <div className="badge border border-secondary-subtle text-secondary rounded-0 p-3 pt-2 pb-2">
                <i
                  className="fa fa-map-marker me-1 text-primary"
                  aria-hidden="true"
                ></i>
                <span className=""> {challenge.country} </span>
              </div>
            </div>
            <div className="badge border border-secondary-subtle text-secondary rounded-0 p-2">
              <i className="fa fa-clock-o" aria-hidden="true"></i>
              <span className=""> {challenge.due_date} days left</span>
            </div>
          </div>
          <div style={{ boxSizing: "border-box" }}>
            <div
              className="card-title fs-6 fw-bold overflow-hidden"
              style={{
                textOverflow: "ellipsis",
                display: "-webkit-box",
                WebkitLineClamp: "2",
                WebkitBoxOrient: "vertical",
              }}
            >
              <span className="text-secondary">#{challenge.id}</span>{" "}
              {challenge.name}
            </div>
            <p
              className="card-text overflow-hidden text-muted"
              style={{
                textOverflow: "ellipsis",
                display: "-webkit-box",
                WebkitLineClamp: "3",
                WebkitBoxOrient: "vertical",
                fontSize: "0.9rem",
              }}
            >
              {challenge.description}
            </p>
          </div>
        </div>
        <div>
          {/* <div className="text-muted pt-2" style={{ fontSize: "0.8rem" }}>
            Last contribution {challenge.last_updated}
          </div> */}
          <div
            className="progress rounded-0 mt-2"
            style={{ height: "8px" }}
            data-tooltip-id={"progress-" + challenge.id}
            data-tooltip-content={`
              ${progress}% (${localized} out of ${challenge.stats.total} localized, ${skipped} skipped)`}
          >
            <div
              className="progress-bar"
              role="progressbar"
              style={{ width: progress + "%" }}
            ></div>
            <Tooltip
              place="top-start"
              className="bg-primary"
              effect="float"
              id={"progress-" + challenge.id}
              style={{ fontSize: "0.7rem" }}
            />
          </div>
          <div className="text-dark pt-2" style={{ fontSize: "0.8rem" }}>
            Last contribution {challenge.last_updated}
          </div>
        </div>
      </div>
    </div>
  );
};
export default ChallengeCard;

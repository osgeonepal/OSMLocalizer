import React from "react";

export function ChallengeInstructions({
  challenge,
  nearbyTask,
  setNearbyTask,
}) {
  return (
    <div className="bg-body-tertiary">
      <div className="text-align-center p-2 title">
        <span className="text-secondary fs-5">#{challenge.id}</span>
        <span className="text-body fs-5 fw-bold text-uppercase ms-2">
          {challenge.name}
        </span>
      </div>
      <div className="p-2 mt-2">
        <div className="form-check form-switch ms-2">
          <input className="form-check-input" type="checkbox" role="switch" />
          <label className="form-check-label" htmlFor="flexSwitchCheckDefault">
            Validation Mode
          </label>
        </div>
        <div className="form-check form-switch ms-2">
          <input
            className="form-check-input"
            type="checkbox"
            role="switch"
            checked={nearbyTask}
            onChange={() => setNearbyTask(!nearbyTask)}
          />
          <label className="form-check-label" htmlFor="flexSwitchCheckDefault">
            Nearby Tasks
          </label>
        </div>
      </div>
      <div
        className="mt-2 p-3 overflow-auto border-top border-subtle"
        style={{ height: "35vh" }}
      >
        <h4 className="text-dark-emphasis ">Instructions</h4>
        <div className="text-secondary">{challenge.feature_instructions}</div>
      </div>
    </div>
  );
}

import { ChallengeMap } from "./challengeMap";
import { ChallengeProgress } from "./challengeProgress";

export default function ChallengeInfo(props) {
  return (
    <div className="d-flex flex-column overflow-auto bg-light p-4 pb-0 pt-1">
      <div className="d-flex p-2 mb-2 border-bottom border-secondary-subtle ">
        <div className="flex-grow-1 title fw-bold" style={{ height: "4vh" }}>
          <span className="text-secondary fs-5">#{props.challenge.id}</span>
          <span className="text-body fs-5 ms-1">{props.challenge.name}</span>
        </div>
        <button
          className="btn btn-close btn-outline-close"
          onClick={() => props.onChallengeInfoClose()}
        />
      </div>
      <ChallengeMap challenge={props.challenge} />
      <div className="p-1 pb-0 border-top mt-2" style={{ height: "30vh" }}>
        <h5 className="text-secondary">Description</h5>
        <div
          className="text-secondary overflow-auto"
          style={{ height: "25vh" }}
        >
          {props.challenge.description}
        </div>
      </div>
      <ChallengeProgress challenge={props.challenge} />
    </div>
  );
}

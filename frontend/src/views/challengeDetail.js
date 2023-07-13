import { React, useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { Tooltip } from "react-tooltip";
import "react-tooltip/dist/react-tooltip.css";

import { useViewport } from "../utills/hooks";
import { fetchLocalJSONAPI } from "../utills/fetch";
import { ChallengeMap } from "../components/challenge/challengeMap";
import { ChallengeProgress } from "../components/challenge/challengeProgress";

const ChallengeHeader = ({ id, name }) => {
  const { user } = useSelector((state) => state.auth);
  const navigate = useNavigate();
  return (
    <div
      className="d-flex border-bottom border-secondary-subtle pb-2 justify-content-between align-items-center"
      style={{ height: "8vh" }}
    >
      <div className="title fw-bold text-wrap">
        <span className="text-secondary fs-4">#{id}</span>
        <span className="text-body fs-4 ms-1 text-uppercase">{name}</span>
      </div>
      <div>
        {user?.role === "1" && (
          <button
            className="btn btn-sm btn-outline-primary ms-2 ps-2 pe-2"
            onClick={() =>
              navigate(`/manage/challenge/${id}`)
            }
          >
            Edit
          </button>
        )}
      </div>
    </div>
  )
}


const ChallengeInfoSection = ({ challenge, height }) => {
  const headingClass = "text-secondary fw-bold";
  const badgeClass = "badge border border-secondary text-secondary rounded-0 p-2"
  const maxMargin = "mt-2"
  const maxPadding = "pt-2"

  return (
    <div
      className={`d-flex flex-column justify-content-between pb-4 ${maxPadding}`}
      style={{ height: height }}
    >
      <div>
        <div>
          <div className={maxMargin} >
            <span className={headingClass}>Created by:</span>
            <span className="text-secondary ms-2">{challenge.author}</span>
          </div>

          <div className="mt-1">
            <span className={headingClass}>Challenge Data Sourced:</span>
            <span className="text-secondary ms-2">{challenge.created}</span>
          </div>
        </div>

        <div className={maxMargin}>
          <span className={headingClass}>Description:</span>
          <div
            className="text-secondary overflow-auto text-wrap"
            style={{ height: height === "76vh" ? "25vh" : "15vh" }}
          >
            {challenge.description}
          </div>
        </div>

      </div>

      <div>
        {height === "76vh" ? ( // only show location and tags in lg view
          <div className={`d-flex justify-content-between ${maxMargin}`}>
            <div className="d-flex flex-column">
              <span className={headingClass}>Location</span>
              <span className={`${badgeClass} mt-2`}>{challenge.country}</span>
            </div>
            <div className="d-flex flex-column">
              <span className={headingClass}>Tags to Edit</span>
              <div className="mt-2">
                {challenge.language_tags.split(",").map((tag) => {
                  return (
                    <span
                      key={tag}
                      className={`${badgeClass} me-2`}
                    >
                      {tag}
                    </span>
                  );
                }
                )}
              </div>
            </div>
          </div>) : null}
        <div className="mt-4">
          <ChallengeProgress challenge={challenge} />
        </div>
      </div>
    </div>
  );
}

const ChallengeDetailFooter = ({ id, stats }) => {
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.auth);
  const toValidate =
    stats.localized +
    stats.already_localized +
    stats.too_hard +
    stats.invalid_data +
    stats.skipped -
    stats.validated;

  return (
    <div
      className="d-flex p-3 pe-0 bg-light border-top border-secondary-subtle justify-content-end align-items-center"
      style={{ height: "8vh" }}
    >
      <button
        className="btn btn-outline-secondary me-3"
        onClick={() => navigate(`/challenge/${id}/leaderboard`)}
      >
        Leaderboard
      </button>
      {(user?.role === "1" || user?.role === "2") && ( // only show validate button to admins and validators
        <div
          data-tooltip-id="validate"
          data-tooltip-content="No features are available to validate"
        >
          <button
            onClick={() => navigate(`/challenge/validate/${id}`)}
            className="btn btn-secondary me-3"
            disabled={toValidate === 0}
          >
            Validate
          </button>
          {
            toValidate === 0 &&
            <Tooltip
              place="top"
              className="bg-secondary z-3"
              effect="solid"
              style={{ fontSize: "0.8rem" }}
              id="validate"
            />
          }
        </div>)}
      <div
        data-tooltip-id="localize"
        data-tooltip-content="No features are available to localize"
      >
        <button
          onClick={() => navigate(`/challenge/localize/${id}`)}
          className="btn btn-primary"
          disabled={stats.to_localize === 0}
        >
          Localize
        </button>
        {
          stats.to_localize === 0 &&
          <Tooltip
            place="top"
            className="bg-primary z-3"
            effect="solid"
            style={{ fontSize: "0.8rem" }}
            id="localize"
          />
        }
      </div>
    </div>)
}


const ChallengeDetailLg = ({ challenge }) => {
  return (
    <div>
      <div className="row" style={{ "height": "84vh" }}>
        <div className="col-6">
          <ChallengeHeader id={challenge.id} name={challenge.name} />
          <ChallengeInfoSection challenge={challenge} height="76vh" />
        </div>
        <div className="col-6">
          <ChallengeMap challenge={challenge} height={"84vh"} />
        </div>
      </div>
      <ChallengeDetailFooter id={challenge.id} stats={challenge.stats} />
    </div>
  )
}

const ChallengeDetailSm = ({ challenge }) => {
  return (
    <div>
      <div style={{ "height": "84vh" }} >
        <ChallengeHeader id={challenge.id} name={challenge.name} />
        <ChallengeMap challenge={challenge} height={"30vh"} />
        <ChallengeInfoSection challenge={challenge} height={"46vh"} />
      </div>
      <ChallengeDetailFooter id={challenge.id} stats={challenge.stats} />
    </div>
  )
}


export default function ChallengeDetailView() {
  const { id } = useParams();
  const [challenge, setChallenge] = useState({});
  const [isChallenegeLoaded, setIsChallengeLoaded] = useState(false);

  const breakpoint = 768;
  const { width } = useViewport();

  useEffect(() => {
    fetchLocalJSONAPI(`challenge/${id}/`).then((data) => {
      setChallenge(data);
      setIsChallengeLoaded(true);
    });
  }, [id]);

  return (
    <div>
      {isChallenegeLoaded ? (
        <div>
          {width > breakpoint ?
            < ChallengeDetailLg challenge={challenge} />
            : <ChallengeDetailSm challenge={challenge} />
          }
        </div>
      ) : (
        <div>Loading...</div>
      )
      }
    </div >
  );
}

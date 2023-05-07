import { useEffect, useState } from "react";

import { fetchLocalJSONAPI } from "../utills/fetch";
import ChallengeCard from "../components/challenge/challengeCard";
import ChallengeInfo from "../components/challenge/challengeInfo";
import Pagination from "../components/pagination";
import { useViewport } from "../utills/hooks";

const WithoutDetailView = ({ challenges, onChallengeClick, detailView }) => {
  return (
    <div className="row gap-2">
      {challenges?.length > 0
        ? challenges.map((challenge) => (
            <ChallengeCard
              challenge={challenge}
              key={challenge.id}
              onChallengeClick={onChallengeClick}
              detailView={detailView}
            />
          ))
        : null}
    </div>
  );
};

const WithDetailView = ({
  challenges,
  challenge,
  onChallengeClick,
  onChallengeInfoClose,
  detailView,
}) => {
  const { width } = useViewport();
  const breakpoint = 995;
  return (
    <div className="row">
      <div className="col-xs-12 col-sm-12 col-md-12 col-lg-6">
        {width > breakpoint ? (
          <WithoutDetailView
            challenges={challenges}
            onChallengeClick={onChallengeClick}
            detailView={detailView}
          />
        ) : (
          <ChallengeInfo
            challenge={challenge}
            onChallengeInfoClose={onChallengeInfoClose}
          />
        )}
      </div>
      <div className="col-xs-12 col-sm-12 col-md-12 col-lg-6">
        {width > breakpoint ? (
          <ChallengeInfo
            challenge={challenge}
            onChallengeInfoClose={onChallengeInfoClose}
          />
        ) : (
          <WithoutDetailView
            challenges={challenges}
            onChallengeClick={onChallengeClick}
            detailView={detailView}
          />
        )}
      </div>
    </div>
  );
};

const ChallengesView = () => {
  const [page, setPage] = useState(
    new URLSearchParams(window.location.search).get("page") || 1
  );

  const [challenges, setChallenges] = useState([]);
  const [detailView, setDetailView] = useState(false);
  const [challenge, setChallenge] = useState({});
  const status =
    new URLSearchParams(window.location.search).get("status") || "ALL";

  const onChallengeClick = (challenge) => {
    setChallenge(challenge);
    setDetailView(true);
  };

  const onChallengeInfoClose = () => {
    setDetailView(false);
  };

  const onPageChange = (page) => {
    setPage(page + 1); // react-paginate starts from 0 but our API starts from 1
  };

  useEffect(() => {
    fetchLocalJSONAPI(`challenges/?status=${status}&page=${page}`).then(
      (data) => {
        setChallenges(data);
      }
    );
  }, [status, page]);

  return (
    <div className="pt-2 pb-2">
      {detailView ? (
        <WithDetailView
          challenges={challenges?.challenges}
          challenge={challenge}
          onChallengeInfoClose={onChallengeInfoClose}
          detailView={detailView}
          onChallengeClick={onChallengeClick}
        />
      ) : (
        <WithoutDetailView
          challenges={challenges?.challenges}
          onChallengeClick={onChallengeClick}
          detailView={detailView}
        />
      )}
      <Pagination
        pageCount={challenges?.pagination?.total_pages}
        onPageChange={onPageChange}
        currentPage={page}
      />
    </div>
  );
};

export default ChallengesView;

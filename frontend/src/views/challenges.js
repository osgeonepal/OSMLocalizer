import { useEffect, useState } from "react";
import { useSelector } from "react-redux";

import { fetchLocalJSONAPI } from "../utills/fetch";
import ChallengeCard from "../components/challenge/challengeCard";
import ChallengeInfo from "../components/challenge/challengeInfo";
import Pagination from "../components/pagination";
import { useViewport } from "../utills/hooks";
import { ChallengeFilter } from "../components/challenge/challengeFilter";

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
  const user = useSelector((state) => state.auth.user);

  const [page, setPage] = useState(
    new URLSearchParams(window.location.search).get("page") || 1
  );

  const [status, setStatus] = useState(
    new URLSearchParams(window.location.search).get("status") || "PUBLISHED"
  );

  const [challenges, setChallenges] = useState([]);
  const [detailView, setDetailView] = useState(false);
  const [challenge, setChallenge] = useState({});
  const [search, setSearch] = useState("");
  const [language, setLanguage] = useState("ALL");
  const [myChallenges, setMyChallenges] = useState(false);
  const [sort, setSort] = useState("NEWEST");

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

  const url = `challenges/?status=${status}&to_language=${language}&sort_by=${sort}&page=${page}${
    myChallenges ? `&created_by=${user?.user_id}` : ""
  }${search ? `&name=${search}` : ""}`;

  useEffect(() => {
    fetchLocalJSONAPI(url).then((data) => {
      setChallenges(data);
    });
  }, [url]);

  return (
    <div className="pt-2 pb-2">
      <ChallengeFilter
        status={status}
        sort={sort}
        search={search}
        language={language}
        myChallenges={myChallenges}
        setStatus={setStatus}
        setLanguage={setLanguage}
        setSearch={setSearch}
        setSort={setSort}
        setMyChallenges={setMyChallenges}
      />
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

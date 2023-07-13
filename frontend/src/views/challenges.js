import { useEffect, useState } from "react";
import { useSelector } from "react-redux";

import { fetchLocalJSONAPI } from "../utills/fetch";
import ChallengeCard from "../components/challenge/challengeCard";
import Pagination from "../components/pagination";
import { ChallengeFilter } from "../components/challenge/challengeFilter";

const ChallengeList = ({ challenges }) => {
  return (
    <div className="row gap-2">
      {challenges?.length > 0
        ? challenges.map((challenge) => (
            <ChallengeCard challenge={challenge} key={challenge.id} />
          ))
        : null}
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
  const [search, setSearch] = useState("");
  const [language, setLanguage] = useState("ALL");
  const [myChallenges, setMyChallenges] = useState(false);
  const [sort, setSort] = useState("NEWEST");

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
      <ChallengeList challenges={challenges?.challenges} />
      <Pagination
        pageCount={challenges?.pagination?.total_pages}
        onPageChange={onPageChange}
        currentPage={page}
      />
    </div>
  );
};

export default ChallengesView;

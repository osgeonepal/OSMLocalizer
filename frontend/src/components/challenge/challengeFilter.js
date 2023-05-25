import React from "react";
import Select from "react-select";

import { SwitchButton } from "../input";
import languageJson from "../../assets/json/language.json";

const languageOptions = Object.keys(languageJson).map((key) => {
  if (key === "---") {
    return { label: "Any", value: "" };
  }
  return { label: key, value: languageJson[key] };
});

const SelectFilter = (props) => {
  return (
    <div>
      <Select
        styles={{
          control: (provided, state) => ({
            ...provided,
            border: "1px solid #ced4da",
            borderRadius: "0.25rem",
            width: props.width ? props.width : "10rem",
            boxShadow: state.isFocused
              ? "0 0 0 0.25rem rgba(13, 110, 253, 0.25)"
              : null,
            "&:hover": {
              borderColor: "#80bdff",
              boxShadow: "0 0 0 0.25rem rgba(13, 110, 253, 0.25)",
            },
          }),
        }}
        id={props.id}
        name={props.name}
        options={props.options}
        defaultValue={props.defaultValue}
        isSearchable={props.isSearchable}
        onChange={(e) => props.onChange(e)}
        placeholder={props.placeholder}
      />
    </div>
  );
};

export const ChallengeFilter = ({
  status,
  sort,
  search,
  language,
  myChallenges,
  setStatus,
  setLanguage,
  setSearch,
  setSort,
  setMyChallenges,
}) => {
  const statusOptions = [
    { value: "all", label: "All" },
    { value: "PUBLISHED", label: "Published" },
    { value: "DRAFT", label: "Draft" },
    { value: "ARCHIVED", label: "Archived" },
  ];

  const sortOptions = [
    { value: "NEWEST", label: "Newest" },
    { value: "OLDEST", label: "Oldest" },
  ];

  return (
    <div className="mb-4 mt-2 d-flex justify-content-between">
      <div className="d-flex flex-row gap-4 align-items-center">
        <div>
          <SelectFilter
            id="status"
            name="status"
            options={statusOptions}
            isSearchable={false}
            placeholder="Status"
            value={status}
            onChange={(e) => setStatus(e.value)}
          />
        </div>
        <div>
          <SelectFilter
            id="sort"
            name="sort"
            options={languageOptions}
            isSearchable={true}
            placeholder="Language"
            value={language}
            onChange={(e) => setLanguage(e.value)}
          />
        </div>
        <div>
          <SelectFilter
            id="sort"
            name="sort"
            options={sortOptions}
            isSearchable={false}
            placeholder="Sort"
            value={sort}
            onChange={(e) => setSort(e.value)}
          />
        </div>
        <div>
          <input
            className="form-control"
            type="text"
            placeholder="Search Challenge"
            aria-label="Search"
            onChange={(e) => setSearch(e.target.value)}
            value={search}
          />
        </div>
        <div>
          <SwitchButton
            checked={myChallenges}
            onChange={() => setMyChallenges(!myChallenges)}
            label="My Challenges"
          />
        </div>
      </div>
    </div>
  );
};

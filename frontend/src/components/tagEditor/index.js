import React, { useState, useEffect } from "react";
import { osmAuth } from "osm-auth";
import { useSelector } from "react-redux";

import ShowError from "../error";
import {
  fetchExternalJSONAPI,
  fetchLocalJSONAPI,
  pushToLocalJSONAPI,
} from "../../utills/fetch";
import { TagEditorForm } from "./editForm";
import { uploadToOSM } from "../../utills/osm";
import { SideBar, ChangesTab, UploadDialog } from "./sideBar";
import {
  ChallengeInstructions,
  ChallengeTitle,
} from "../challengeInstructions";
import { useViewport } from "../../utills/hooks";
import { OAUTH_CLIENT_ID, OAUTH_CLIENT_SECRET } from "../../config";

const EditorNavBar = ({
  activeTab,
  onTabClick,
  onUpload,
  isUploading,
  allChanges,
  displayUploadDialog,
  setDisplayUploadDialog,
}) => {
  const editorTabs = ["Editor", "Instructions", "Changes"];
  const isDisabled = isUploading || Object.keys(allChanges).length === 0;

  const EditorTab = (name, activeTab, onTabClick) => {
    return (
      <li className="nav-item">
        <span
          className={`nav-link + ${
            activeTab === name ? "active text-body" : "text-secondary"
          }`}
          onClick={() => onTabClick(name)}
        >
          {name}
        </span>
      </li>
    );
  };

  return (
    <div className="col-12 d-flex justify-content-between align-items-center pb-3 pt-3 bg-white border-top border-light-subtle">
      <ul className="nav nav-tabs">
        {editorTabs.map((name) => EditorTab(name, activeTab, onTabClick))}
      </ul>
      <div className="">
        <button
          className="btn btn-secondary"
          type="submit"
          disabled={isDisabled}
          onClick={() => setDisplayUploadDialog(true)}
        >
          {isUploading ? (
            <i className="fa fa-spinner fa-spin"></i>
          ) : (
            <div>
              <i className="fa fa-upload"></i>
              <span className="badge">{Object.keys(allChanges).length}</span>
            </div>
          )}
        </button>
        {displayUploadDialog ? (
          <UploadDialog
            isModal={true}
            isUploading={isUploading}
            isDisabled={isDisabled}
            onUpload={onUpload}
            setDisplayUploadDialog={setDisplayUploadDialog}
          />
        ) : null}
      </div>
    </div>
  );
};

export default function TagEditor({
  challenge,
  nearbyTask,
  setNearbyTask,
  validationMode,
}) {
  const [element, setElement] = useState();
  const [allChanges, setAllChanges] = useState({});
  const [isLoading, setLoading] = useState(true);
  const [isUploading, setUploading] = useState(false);
  const [feature, setFeature] = useState();
  const osm_token = useSelector((state) => state.auth.osmToken);
  const jwt_token = useSelector((state) => state.auth.jwtToken);
  const [error, setError] = useState();
  const [activeTab, setActiveTab] = useState("Editor");
  const [displayUploadDialog, setDisplayUploadDialog] = useState(false);

  const onTabClick = (name) => {
    setActiveTab(name);
  };

  const challenge_id = challenge.id;

  const { width } = useViewport();
  const breakpoint = 768;
  const isMobileView = width < breakpoint;
  const getMobileClass = (tabName) => {
    return `col-12 pb-2 ${activeTab === tabName ? "d-block" : "d-none"}`;
  };

  const options = {
    url: "https://www.openstreetmap.org",
    client_id: OAUTH_CLIENT_ID,
    client_secret: OAUTH_CLIENT_SECRET,
    redirect_uri: "http//127.0.0.1:3000/authorized",
    access_token: osm_token,
  };

  var auth = osmAuth(options);

  const getFeature = async () => {
    let url = `challenge/${challenge_id}/feature/get-feature-to-localize/?validationMode=${validationMode}`;
    if (nearbyTask && feature) {
      url = url + `&lastFeature=${feature.feature.properties.id}`;
    }
    const data = await fetchLocalJSONAPI(url, jwt_token).catch((error) => {
      setError(error.message);
    });
    setFeature(data);
  };

  useEffect(() => {
    setLoading(true);
    fetchLocalJSONAPI(
      `challenge/${challenge_id}/feature/get-feature-to-localize/?validationMode=${validationMode}`,
      jwt_token
    )
      .then((data) => {
        setFeature(data);
        setLoading(false);
      })
      .catch((error) => {
        setError(error.message);
      });
  }, [challenge_id, jwt_token, validationMode]);

  useEffect(() => {
    feature &&
      (async () => {
        const url = `https://api.openstreetmap.org/api/0.6/
        ${feature.feature.properties.osm_type}/
        ${feature.feature.properties.id}.json`.replace(/\s/g, "");
        const data = await fetchExternalJSONAPI(url);
        setElement(data["elements"][0]);
      })();
  }, [feature]);

  const changeFeatureStatus = async (featureIds, status) => {
    const payload = {
      featureIds: featureIds,
      status: status,
    };
    pushToLocalJSONAPI(
      `challenge/${challenge_id}/feature/`,
      JSON.stringify(payload),
      jwt_token
    );
  };

  const onUpload = async (changeset_comment, reviewEdits) => {
    const changedFeatures = Object.keys(allChanges).map(
      (key) => allChanges[key].id
    );
    setUploading(true);
    await uploadToOSM(
      auth,
      Object.values(allChanges),
      changeset_comment,
      reviewEdits
    );
    await changeFeatureStatus(changedFeatures, "LOCALIZED");
    setAllChanges({});
    setUploading(false);
  };

  const onDone = async () => {
    getFeature();
  };

  const onSkip = async (status) => {
    await changeFeatureStatus([feature.feature.properties.id], status);
    getFeature();
  };

  const onValidate = async () => {
    await changeFeatureStatus([feature.feature.properties.id], "VALIDATED");
    getFeature();
  };

  const onInvalidate = async (status) => {
    await changeFeatureStatus([feature.feature.properties.id], "INVALIDATED");
    getFeature();
  };

  const onDelete = (key) => {
    const newAllChanges = { ...allChanges };
    delete newAllChanges[key];
    setAllChanges(newAllChanges);
  };

  const onElementClick = (key) => {
    const clickedElement = allChanges[key];
    setElement(clickedElement);
  };

  return (
    <div className="">
      {element ? (
        <div className="row">
          <div
            className={`${
              isMobileView
                ? null
                : "col-3 p-0 border border-end-0 border-light-subtle"
            }`}
          >
            <ChallengeTitle challenge={challenge} />
            <div className="d-md-none">
              <EditorNavBar
                activeTab={activeTab}
                onTabClick={onTabClick}
                onUpload={onUpload}
                isUploading={isUploading}
                allChanges={allChanges}
                displayUploadDialog={displayUploadDialog}
                setDisplayUploadDialog={setDisplayUploadDialog}
              />
            </div>
            <div
              className={`${
                isMobileView ? getMobileClass("Instructions") : "p-0"
              }`}
            >
              <ChallengeInstructions
                challenge={challenge}
                nearbyTask={nearbyTask}
                setNearbyTask={setNearbyTask}
              />
            </div>
          </div>
          <div
            className={`${
              isMobileView
                ? getMobileClass("Editor")
                : "col-5 border border-light-subtle p-2 pt-0"
            }`}
          >
            <TagEditorForm
              feature={feature}
              element={element}
              isLoading={isLoading}
              allChanges={allChanges}
              setElement={setElement}
              setAllChanges={setAllChanges}
              onDone={onDone}
              onSkip={onSkip}
              onValidate={onValidate}
              onInvalidate={onInvalidate}
              getFeature={getFeature}
              tags={challenge.language_tags}
              translateEngine={challenge.translate_engine}
              challenge_id={challenge.id}
              translate_to={challenge.to_language}
              validationMode={validationMode}
            />
          </div>
          <div
            className={`col-3 p-0 border border-start-0 border-light-subtle d-none d-md-block`}
          >
            <SideBar
              allChanges={allChanges}
              onUpload={onUpload}
              isUploading={isUploading}
              onDelete={onDelete}
              onElementClick={onElementClick}
              displayUploadDialog={displayUploadDialog}
              setDisplayUploadDialog={setDisplayUploadDialog}
            />
          </div>
          <div className={`d-md-none ${getMobileClass("Changes")}`}>
            <ChangesTab
              height="80vh"
              allChanges={allChanges}
              onDelete={onDelete}
              onElementClick={onElementClick}
            />
          </div>
        </div>
      ) : (
        <div>Loading...</div>
      )}
      {error && <ShowError error={error} setError={setError} />}
    </div>
  );
}

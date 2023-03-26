import React, { useState, useEffect } from "react";
import { osmAuth } from "osm-auth";
import { useSelector } from "react-redux";
import ShowError from "../error";
import {
  fetchExternalJSONAPI,
  fetchLocalJSONAPI,
  pushToLocalJSONAPI,
} from "../../utills/fetch";
import Map from "./map";
import { TagEditorForm } from "./editForm";
import { uploadToOSM } from "../../utills/osm";
import { SideBar } from "./sideBar";
import { OAUTH_CLIENT_ID, OAUTH_CLIENT_SECRET } from "../../config";

export default function TagEditor({
  challenge_id,
  challengeTags,
  translateEngine,
  nearbyTask,
  translate_to,
}) {
  const [element, setElement] = useState();
  const [allChanges, setAllChanges] = useState({});
  const [isLoading, setLoading] = useState(true);
  const [isUploading, setUploading] = useState(false);
  const [feature, setFeature] = useState();
  const osm_token = useSelector((state) => state.auth.osmToken);
  const jwt_token = useSelector((state) => state.auth.jwtToken);
  const [error, setError] = useState();

  const options = {
    url: "https://www.openstreetmap.org",
    client_id: OAUTH_CLIENT_ID,
    client_secret: OAUTH_CLIENT_SECRET,
    redirect_uri: "http//127.0.0.1:3000/authorized",
    access_token: osm_token,
  };

  var auth = osmAuth(options);

  const getFeature = async () => {
    let url = `challenge/${challenge_id}/feature/get-feature-to-localize/`;
    if (nearbyTask && feature) {
      url = url + `?lastFeature=${feature.feature.properties.id}`;
    }
    const data = await fetchLocalJSONAPI(url, jwt_token).catch((error) => {
      setError(error.message);
    });
    setFeature(data);
  };

  useEffect(() => {
    setLoading(true);
    fetchLocalJSONAPI(
      `challenge/${challenge_id}/feature/get-feature-to-localize/`,
      jwt_token
    )
      .then((data) => {
        setFeature(data);
        setLoading(false);
      })
      .catch((error) => {
        setError(error.message);
      });
  }, [challenge_id, jwt_token]);

  useEffect(() => {
    feature &&
      (async () => {
        // setLoading(true);
        const data = await fetchExternalJSONAPI(
          `https://api.openstreetmap.org/api/0.6/${feature.feature.properties.osm_type}/${feature.feature.properties.id}.json`
        );
        setElement(data["elements"][0]);
        // setLoading(false);
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
    getFeature();
  };

  const onDone = async () => {
    getFeature();
  };

  const onSkip = async (status) => {
    await changeFeatureStatus([feature.feature.properties.id], status);
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
      {element === undefined ? (
        <div>Loading...</div>
      ) : (
        <div className="row">
          <div className="col-8 border border-secondary-subtle p-2 pt-0">
            <Map element={element} isLoading={isLoading} />
            <TagEditorForm
              element={element}
              allChanges={allChanges}
              setElement={setElement}
              setAllChanges={setAllChanges}
              onDone={onDone}
              onSkip={onSkip}
              tags={challengeTags}
              translateEngine={translateEngine}
              challenge_id={challenge_id}
              translate_to={translate_to}
            />
          </div>
          <div className="col-4 p-0 border border-start-0 border-secondary-subtle">
            <SideBar
              allChanges={allChanges}
              onUpload={onUpload}
              isUploading={isUploading}
              onDelete={onDelete}
              onElementClick={onElementClick}
            />
          </div>
        </div>
      )}
      {error && <ShowError error={error} setError={setError} />}
    </div>
  );
}

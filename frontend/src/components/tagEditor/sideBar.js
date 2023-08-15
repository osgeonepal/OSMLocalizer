import React, { useState } from "react";

import { DEFAULT_CHANGESET_COMMENT } from "../../config";
import { useSelector } from "react-redux";
import { alertComponent } from "./inputToolForm";
import userAvatar from "../../assets/icons/user_avatar.png";

export const UploadSuccess = (props) => {
  return (
    <div className="alert alert-success position-fixed start-50 top-0 p-2 m-2">
      <br />
      <span>Hurray! Changeset uploaded successfully.</span>
      &nbsp;
      <span
        className="btn btn-sm btn-close btn-outline-success"
        onClick={() => props.setUploaded(false)}
      />
      <br />
      <br />
    </div>
  );
};

const EditorHeader = (props) => {
  const user = useSelector((state) => state.auth.user);
  return (
    <div className="border-bottom border-light-subtle overflow-hidden">
      <div className="row ps-2 pb-2">
        <div className="col-7 d-flex justify-content-start border border-light-subtle p-1">
          {user ? (
            <div className="row ">
              <div className="col-4">
                <img
                  src={
                    user.picture_url !== "null" ? user.picture_url : userAvatar
                  }
                  alt={user["username"]}
                  className="img-fluid col-12"
                />
              </div>
              <div
                className="col-8 d-flex align-items-center text-secondary"
                style={{ fontSize: "0.9rem" }}
              >
                {user["username"]}
              </div>
            </div>
          ) : null}
        </div>
        <div className="col-5 d-flex justify-content-end align-items-center">
          <button
            className="btn btn-secondary ms-2"
            type="submit"
            disabled={props.isDisabled}
            onClick={() => props.setDisplayUploadDialog(true)}
          >
            {props.isUploading ? (
              <i className="fa fa-spinner fa-spin"></i>
            ) : (
              <div>
                <i className="fa fa-upload"></i>
                <span className="badge">
                  {Object.keys(props.allChanges).length}
                </span>
              </div>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export const UploadDialog = ({
  isModal,
  isUploading,
  isDisabled,
  onUpload,
  setDisplayUploadDialog,
}) => {
  const [changesetComment, setChangesetComment] = useState(
    DEFAULT_CHANGESET_COMMENT
  );
  const [reviewEdits, setReviewEdits] = useState(false);
  const [isUploaded, setUploaded] = useState(false);

  const onChangesetComment = (e) => {
    setChangesetComment(e.target.value);
  };

  const onUploadClick = () => {
    async function upload() {
      await onUpload(changesetComment, reviewEdits);
      setUploaded(true);
      setTimeout(() => {
        setUploaded(false);
        setDisplayUploadDialog(false);
      }, 1500);
    }
    upload();
  };

  return (
    <div>
      <div
        className={`${
          isModal
            ? "d-block modal fade show"
            : "border-bottom border-light-subtle pb-4"
        }`}
      >
        <div className={`${isModal ? "modal-dialog" : ""}`}>
          <div className={`${isModal ? "modal-content" : ""}`}>
            <div
              className={`${
                isModal
                  ? "modal-header"
                  : "text-secondary fw-bold pb-2 d-block text-center"
              }`}
            >
              Upload to OpenstreetMap
            </div>
            <div className={`${isModal ? "modal-body pb-2" : "pb-3"}`}>
              <span
                className="text-secondary border d-block p-1 bg-light"
                style={{ fontSize: "0.9rem" }}
              >
                Changeset comment
              </span>
              <textarea
                className="form-control border border-top-0 p-1 rounded-0"
                name="changeset_comment"
                type="text"
                defaultValue={changesetComment}
                onChange={(e) => onChangesetComment(e)}
                rows="3"
              />
              <div
                className="text-secondary pt-1"
                style={{ fontSize: "0.9rem" }}
              >
                <div className="form-check">
                  <input
                    type="checkbox"
                    className="form-check-input"
                    checked={reviewEdits}
                    onChange={() => setReviewEdits(!reviewEdits)}
                  />
                  <span className="form-check-label">
                    I would like someone to review my edits.
                  </span>
                </div>
              </div>
            </div>
            <div
              className={`${
                isModal ? "modal-footer" : "d-flex justify-content-evenly"
              }`}
            >
              <button
                className="btn btn-secondary"
                onClick={() => setDisplayUploadDialog(false)}
              >
                Cancel
              </button>
              <button
                className="btn btn-primary"
                disabled={isDisabled}
                onClick={() => onUploadClick()}
              >
                {isUploading ? (
                  <i className="fa fa-spinner fa-spin"></i>
                ) : (
                  "Upload"
                )}
              </button>
            </div>
          </div>
        </div>

        {isUploaded ? <UploadSuccess setUploaded={setUploaded} /> : null}
      </div>
      {isModal && <div className="modal-backdrop fade show"></div>}
    </div>
  );
};

const ChangesCard = ({ change, onDelete, onElementClick }) => {
  const [isCopied, setCopied] = useState(false);
  const handleCopy = (value) => {
    navigator.clipboard.writeText(value);
    setCopied(true);
    setTimeout(() => {
      setCopied(false);
    }, 1200);
  };

  const key = `${change.type}-${change.id}`;
  return (
    <div
      className=" d-flex p-1 align-items-center border-bottom border-light-subtle"
      style={{ fontSize: "0.9rem" }}
    >
      <div
        className="flex-grow-1 fw-bold "
        style={{ cursor: "pointer" }}
        onClick={() => onElementClick(key)}
      >
        <span className="text-primary">{change.tags.name}</span>
      </div>
      <button
        className="btn btn-sm btn-light border border-light-subtle"
        onClick={() => handleCopy(change.tags.name)}
      >
        <i className="fa fa-clone text-secondary"></i>
      </button>
      <button
        className="btn btn-sm btn-light ps-2 border border-light-subtle"
        onClick={() => onDelete(key)}
      >
        <i className="fa fa-trash text-danger"></i>
      </button>
      {isCopied ? alertComponent() : null}
    </div>
  );
};

export const ChangesTab = ({
  allChanges,
  onDelete,
  onElementClick,
  height,
}) => {
  return (
    <div className="overflow-auto" style={{ height: height }}>
      <div className="text-secondary fw-bold">Changes</div>
      <div>
        {Object.keys(allChanges).length === 0 ? (
          <div className="text-secondary">No changes to upload</div>
        ) : (
          <div className="text-secondary">
            {Object.keys(allChanges).map((key, index) => {
              return (
                <ChangesCard
                  change={allChanges[key]}
                  key={index}
                  onDelete={onDelete}
                  onElementClick={onElementClick}
                />
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export const SideBar = ({
  isUploading,
  allChanges,
  onUpload,
  onDelete,
  onElementClick,
  displayUploadDialog,
  setDisplayUploadDialog,
}) => {
  const isDisabled = isUploading || Object.keys(allChanges).length === 0;

  return (
    <div className="p-2 pt-2 overflow-auto">
      <EditorHeader
        isUploading={isUploading}
        onUpload={onUpload}
        allChanges={allChanges}
        isDisabled={isDisabled}
        setDisplayUploadDialog={setDisplayUploadDialog}
      />
      {displayUploadDialog ? (
        <UploadDialog
          isModal={false}
          isUploading={isUploading}
          onUpload={onUpload}
          isDisabled={isDisabled}
          displayUploadDialog={displayUploadDialog}
          setDisplayUploadDialog={setDisplayUploadDialog}
        />
      ) : null}
      <ChangesTab
        height={displayUploadDialog ? "40%" : "85%"}
        allChanges={allChanges}
        displayUploadDialog={displayUploadDialog}
        onDelete={onDelete}
        onElementClick={onElementClick}
      />
    </div>
  );
};

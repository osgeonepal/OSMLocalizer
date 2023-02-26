import React, { useState } from "react";
import { DEFAULT_CHANGESET_COMMENT } from '../../config';
import { useSelector } from "react-redux";

const EditorHeader = (props) => {
    const user = useSelector((state) => state.auth.user);
    return (
        <div className='border-bottom border-secondary-subtle overflow-hidden'>
            <div className='row p-3 pb-2'>
                <div className="col-7 d-flex justify-content-start border border-secondary-subtle p-1">
                    {user ? (
                        <div className='row '>
                            <div className="col-4">
                                <img
                                    src={user["picture_url"]}
                                    alt={user["username"]}
                                    className="img-fluid col-12"
                                />
                            </div>
                            <div
                                className='col-8 d-flex align-items-center text-secondary'
                                style={{ fontSize: "0.9rem" }}
                            >
                                {user["username"]}
                                {/* <p>Changesets: {user["changesets"]["count"]}</p> */}
                            </div>
                        </div>
                    ) : null}
                </div>
                <div className='col-5 d-flex justify-content-end align-items-center'>
                    {/* <div>
                        <button className="btn btn-secondary">
                            <i className="fa fa-undo " aria-hidden="true"></i>
                        </button>
                        <button className="btn btn-secondary">
                            <i className="fa fa-repeat" aria-hidden="true"></i>
                        </button>
                    </div> */}
                    <button
                        className="btn btn-secondary ms-2"
                        type="submit"
                        disabled={props.isDisabled}
                        onClick={()=>props.setDisplayUploadDialog(true)}
                    >
                        {props.isUploading ? <i className="fa fa-spinner fa-spin"></i> : (
                            <div>
                                <i className="fa fa-upload"></i>
                                <span className='badge'>{Object.keys(props.allChanges).length}</span>
                            </div>
                        )}
                    </button>
                </div>
            </div>
        </div>
    )
}

const UploadDialog = (props) => {
    const [changesetComment, setChangesetComment] = useState(DEFAULT_CHANGESET_COMMENT);
    const [reviewEdits, setReviewEdits] = useState(false);
    const onChangesetComment = (e) => {
        setChangesetComment( e.target.value)
    }
    return (
        <div className="border-bottom border-secondary-subtle pb-4">
            <div className="text-secondary fw-bold pb-2 d-block text-center">
                Upload to OpenstreetMap
            </div>
            <div className="pb-3">
                <span
                    className="text-secondary border d-block p-1 bg-light"
                    style={{ fontSize: "0.9rem" }}
                >
                    Changeset comment
                </span>
                <textarea
                    className="form-control border border-top-0 p-1 rounded-bottom"
                    name="changeset_comment"
                    type="text"
                    defaultValue={changesetComment}
                    onChange={(e) => onChangesetComment(e)}
                    rows="3"
                />
            </div>
            <div className="text-secondary pb-3" style={{ fontSize: "0.9rem" }}>
                {/* <div className="pb-4">
                        <span>The changes you upload as </span>
                        <a href={`https://openstreetmap.org/user/${props.username}`} >{props.username}</a>
                        <span> will be visible on all maps that use OpenStreetMap data.</span>
                    </div> */}
                <div className="form-check">
                    <input
                        type="checkbox"
                        className="form-check-input"
                        checked={reviewEdits}
                        onChange={() => setReviewEdits(!reviewEdits)}
                    />
                    <span className="form-check-label">I would like someone to review my edits.</span>
                </div>
            </div>
            <div className="d-flex justify-content-evenly">
                <button  
                    className="btn btn-secondary"
                    onClick={()=>props.setDisplayUploadDialog(false)}
                >
                    Cancel
                </button>
                <button
                    className="btn btn-primary"
                    disabled={props.isDisabled}
                    onClick={()=>props.onUpload(changesetComment, reviewEdits)}
                >
                    {props.isUploading ? <i className="fa fa-spinner fa-spin"></i>: "Upload"}
                </button>
            </div>
        </div>
    )
}

const Changes = (props) => {
    const height = props.displayUploadDialog ? "40%" : "85%";
    return (
        <div className="overflow-auto" style={{ height: height }}>
            <div className="text-secondary fw-bold">Changes</div>
            <div>
                {Object.keys(props.allChanges).length === 0 ? (
                    <div className="text-secondary">No changes to upload</div>
                ) : (
                    <div className="text-secondary">
                        {Object.keys(props.allChanges).map((key, index) => {
                            return (
                                <div key={index}>
                                    {[props.allChanges[key]].map((change, index) => {
                                        return (
                                            <div className="bg-light d-flex p-1 align-items-center" key={index} style={{ fontSize: "0.9rem" }}>
                                                <div className="flex-grow-1 fw-bold">
                                                    <span className="text-secondary">{change.type}: </span>
                                                    <span className="text-primary">{change.id}</span>
                                                </div>
                                                <span className="btn btn-sm btn-secondary ps-2">
                                                    <i className="fa fa-trash text-danger" aria-hidden="true"></i>
                                                </span>
                                            </div>
                                        )
                                    })}
                                </div>
                            )
                        }
                        )}
                    </div>
                )}

            </div>
        </div>
    )
}

export const SideBar = (props) => {
    const isDisabled = (props.isUploading || Object.keys(props.allChanges).length === 0) ? true : false;
    const [displayUploadDialog, setDisplayUploadDialog] = useState(false);

    return (
        <div className="p-2 pt-2 overflow-auto">
            <EditorHeader
                isUploading={props.isUploading}
                onUpload={props.onUpload}
                allChanges={props.allChanges}
                isDisabled={isDisabled}
                setDisplayUploadDialog={setDisplayUploadDialog}
            />
            {displayUploadDialog ? (
                <UploadDialog
                    isUploading={props.isUploading}
                    onUpload={props.onUpload}
                    isDisabled={isDisabled}
                    setDisplayUploadDialog={setDisplayUploadDialog}
                />
                ) : null
            }
            <Changes
                allChanges={props.allChanges}
                displayUploadDialog={displayUploadDialog}
            />
        </div>
    )
}
import React, { useState, useEffect } from 'react';

import { fetchExternalJSONAPI } from "../../utills/fetch";
import Map from './map';
import { TagEditorForm } from './editForm';
import { getUserDetails } from '../../utills/osm';
import { uploadToOSM } from '../../utills/osm';
import { DEFAULT_CHANGESET_COMMENT } from '../../config';

var id = 9928590059;
var type = "node";

export default function TagEditor() {
    const [element, setElement] = useState([]);
    const [allChanges, setAllChanges] = useState({});
    const [user, setUser] = useState();
    const [isLoading, setLoading] = useState(true);
    const [isUploading, setUploading] = useState(false);
    useEffect(() => {
        (async () => {
            setLoading(true);
            const data = await fetchExternalJSONAPI(`https://api.openstreetmap.org/api/0.6/${type}/${id}.json`);
            setElement(data["elements"][0]);
            setLoading(false);
        })();
    }, []);


    useEffect(() => {
        getUserDetails()
            .then((response) => JSON.parse(response))
            .then((data) => {
                setUser(data["user"]);
            });

    }, []);

    const onUpload = () => {
        setUploading(true)
        uploadToOSM(Object.values(allChanges), DEFAULT_CHANGESET_COMMENT)
            .then(
                setUploading(false),
                setAllChanges({})
            )
    }

    return (
        <div className='h-auto border border-secondary-subtle p-2 pt-0'>
            {isLoading ? <div>Loading...</div> :
                (<div>
                    <div className='row p-2'>
                        <div className="col-5 d-flex justify-content-start border border-secondary-subtle p-1">
                            {user ? (
                                <div className='row '>
                                    <div className="col-4">
                                        <img
                                            src={user["img"]["href"]}
                                            alt={user["display_name"]}
                                            className="img-fluid col-8"
                                        />
                                    </div>
                                    <div className='col-7 d-flex align-items-center text-secondary'>
                                        {user["display_name"]}
                                        {/* <p>Changesets: {user["changesets"]["count"]}</p> */}
                                    </div>
                                </div>
                            ) : null}
                        </div>
                        <div className='col-7 d-flex justify-content-end align-items-center'>
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
                                disabled={(isUploading || Object.keys(allChanges).length === 0) ? true : false}
                                onClick={onUpload}
                            >
                                {isUploading ? <i className="fa fa-spinner fa-spin"></i> : (
                                    <div>
                                        <i className="fa fa-upload"></i>
                                        <span className='badge'>{Object.keys(allChanges).length}</span>
                                    </div>
                                )}

                            </button>
                        </div>
                    </div>
                    <Map element={element} />
                    <TagEditorForm
                        element={element}
                        allChanges={allChanges}
                        setElement={setElement}
                        setAllChanges={setAllChanges}
                    />
                </div>)
            }
        </div>
    );
}

import React, { useState, useEffect } from 'react';

import { fetchExternalJSONAPI, fetchLocalJSONAPI } from "../../utills/fetch";
import Map from './map';
import { TagEditorForm } from './editForm';
import { getUserDetails } from '../../utills/osm';
import { uploadToOSM } from '../../utills/osm';
import { SideBar } from './sideBar';

const challenge_id = 1;

export default function TagEditor() {
    const [element, setElement] = useState([]);
    const [allChanges, setAllChanges] = useState({});
    const [user, setUser] = useState();
    const [isLoading, setLoading] = useState(true);
    const [isUploading, setUploading] = useState(false);
    const [feature, setFeature] = useState();

    useEffect(() => {
        const url = (feature ? `challenge/${challenge_id}/feature/${feature.nearby.id}/?nearby=true` :
                `challenge/${challenge_id}/features/random/?nearby=true`);
        (async () => {
            setLoading(true);
            const data = await fetchLocalJSONAPI(url)
            setFeature(data);
        })();
    }, []);

    useEffect(() => {
        (async () => {
            setLoading(true);
            const data = await fetchExternalJSONAPI(
                `https://api.openstreetmap.org/api/0.6/${feature.feature.properties.osm_type}/${feature.feature.properties.osm_id}.json`
            );
            setElement(data["elements"][0]);
            setLoading(false);
        })();
    }, [feature]);


    useEffect(() => {
        getUserDetails()
            .then((response) => JSON.parse(response))
            .then((data) => {
                setUser(data["user"]);
            });

    }, []);

    const onUpload = (changeset_comment, reviewEdits) => {
        setUploading(true)
        uploadToOSM(Object.values(allChanges), changeset_comment, reviewEdits)
            .then(
                setUploading(false),
                setAllChanges({})
            )
    }

    const onDone = () => {
        const url = (feature ? `challenge/${challenge_id}/feature/${feature.nearby.id}/?nearby=true` :
                `challenge/${challenge_id}/features/random/?nearby=true`);
        (async () => {
            setLoading(true);
            const data = await fetchLocalJSONAPI(url)
            setFeature(data);
        })();
    }

    return (
        <div className=''>
            {isLoading ? <div>Loading...</div> :
                (<div className='row'>
                    <div className='col-8 vh-90 border border-secondary-subtle p-2 pt-0'>
                        <Map element={element} />
                        <TagEditorForm
                            element={element}
                            allChanges={allChanges}
                            setElement={setElement}
                            setAllChanges={setAllChanges}
                            onDone={onDone}
                        />
                    </div>
                    <div className='col-4 p-0 border border-start-0 border-secondary-subtle'>
                        <SideBar
                            user={user}
                            allChanges={allChanges}
                            onUpload={onUpload}
                            isUploading={isUploading}
                        />
                    </div>
                </div>)
            }
        </div>
    );
}

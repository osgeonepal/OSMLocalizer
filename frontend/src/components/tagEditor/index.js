import React, { useState, useEffect } from 'react';

import { fetchExternalJSONAPI, fetchLocalJSONAPI, pushToLocalJSONAPI } from "../../utills/fetch";
import Map from './map';
import { TagEditorForm } from './editForm';
import { getUserDetails } from '../../utills/osm';
import { uploadToOSM } from '../../utills/osm';
import { SideBar } from './sideBar';


export default function TagEditor({ challenge_id }) {
    const [element, setElement] = useState();
    const [allChanges, setAllChanges] = useState({});
    const [user, setUser] = useState();
    const [isLoading, setLoading] = useState(true);
    const [isUploading, setUploading] = useState(false);
    const [feature, setFeature] = useState();
    const [changedFeatures, setChangedFeatures] = useState([]);

    const getFeature = async () => {
        const url = (feature ? `challenge/${challenge_id}/feature/${feature.nearby.id}/?nearby=true` :
            `challenge/${challenge_id}/features/random/?nearby=true`);
        const data = await fetchLocalJSONAPI(url)
        setFeature(data);
    }


    useEffect(() => {
        setLoading(true);
        fetchLocalJSONAPI(`challenge/${challenge_id}/features/random/?nearby=true`)
            .then((data) => {
                setFeature(data);
                setLoading(false);
            }
            );

    }, [challenge_id]);

    useEffect(() => {
        feature && (async () => {
            // setLoading(true);
            const data = await fetchExternalJSONAPI(
                `https://api.openstreetmap.org/api/0.6/${feature.feature.properties.osm_type}/${feature.feature.properties.osm_id}.json`
            );
            setElement(data["elements"][0]);
            // setLoading(false);
        })();
    }, [feature]);


    useEffect(() => {
        getUserDetails()
            .then((response) => JSON.parse(response))
            .then((data) => {
                setUser(data["user"]);
            });

    }, []);

    const changeFeatureStatus = async (featureIds, status) => {
        const payload = {
            featureIds: featureIds,
            status: status
        }
        pushToLocalJSONAPI(
            `challenge/${challenge_id}/feature/`,
            JSON.stringify(payload),
        )
    }


    const onUpload = async (changeset_comment, reviewEdits) => {
        setUploading(true)
        await uploadToOSM(Object.values(allChanges), changeset_comment, reviewEdits)
        await changeFeatureStatus(changedFeatures, "LOCALIZED")
        setAllChanges({})
        setUploading(false)
        setChangedFeatures([])
        getFeature();
    }

    const onDone = async () => {
        // setLoading(true);
        await changeFeatureStatus([feature.feature.properties.id], "TO_UPLOAD");
        setChangedFeatures([...changedFeatures, feature.feature.properties.id]);
        getFeature();
    }

    const onSkip = async () => {
        // setLoading(true);
        await changeFeatureStatus([feature.feature.properties.id], "SKIPPED");
        getFeature()
    }


    return (

        <div className=''>
            {element===undefined ? <div>Loading...</div> : (
                <div className='row'>
                    <div className='col-8 border border-secondary-subtle p-2 pt-0'>
                        <Map
                            element={element}
                            isLoading={isLoading}
                        />
                        <TagEditorForm
                            element={element}
                            allChanges={allChanges}
                            setElement={setElement}
                            setAllChanges={setAllChanges}
                            onDone={onDone}
                            onSkip={onSkip}
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
                </div>
            )}
        </div>
    );
}

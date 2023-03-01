import React, { useState, useEffect } from 'react';
import { osmAuth } from 'osm-auth';
import { useSelector } from 'react-redux';

import { fetchExternalJSONAPI, fetchLocalJSONAPI, pushToLocalJSONAPI } from "../../utills/fetch";
import Map from './map';
import { TagEditorForm } from './editForm';
import { uploadToOSM } from '../../utills/osm';
import { SideBar } from './sideBar';
import { OAUTH_CLIENT_ID, OAUTH_CLIENT_SECRET } from '../../config';


export default function TagEditor({ challenge_id, challengeTags, translateEngine }) {
    const [element, setElement] = useState();
    const [allChanges, setAllChanges] = useState({});
    const [isLoading, setLoading] = useState(true);
    const [isUploading, setUploading] = useState(false);
    const [feature, setFeature] = useState();
    const [changedFeatures, setChangedFeatures] = useState([]);
    const osm_token  = useSelector(state => state.auth.osmToken)
    const jwt_token = useSelector(state => state.auth.jwtToken)

    const options = {
        url: "https://www.openstreetmap.org",
        client_id: OAUTH_CLIENT_ID,
        client_secret: OAUTH_CLIENT_SECRET,
        redirect_uri: "http//127.0.0.1:3000/authorized",
        access_token: osm_token,
    
    }

    var auth = osmAuth(options);

    const getFeature = async () => {
        const url = (feature && feature.nearby.id ? `challenge/${challenge_id}/feature/${feature.nearby.id}/?nearby=true` :
            `challenge/${challenge_id}/features/random/?nearby=true`);
        const data = await fetchLocalJSONAPI(url, jwt_token)
        setFeature(data);
    }


    useEffect(() => {
        setLoading(true);
        fetchLocalJSONAPI(`challenge/${challenge_id}/features/random/?nearby=true`, jwt_token)
            .then((data) => {
                setFeature(data);
                setLoading(false);
            }
            );
    }, [challenge_id, jwt_token]);

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


    const changeFeatureStatus = async (featureIds, status) => {
        const payload = {
            featureIds: featureIds,
            status: status
        }
        pushToLocalJSONAPI(
            `challenge/${challenge_id}/feature/`,
            JSON.stringify(payload),
            jwt_token
        )
    }


    const onUpload = async (changeset_comment, reviewEdits) => {
        setUploading(true)
        await uploadToOSM(auth, Object.values(allChanges), changeset_comment, reviewEdits)
        await changeFeatureStatus(changedFeatures, "LOCALIZED")
        setAllChanges({})
        setUploading(false)
        setChangedFeatures([])
        getFeature();
    }

    const onDone = async () => {
        setChangedFeatures([...changedFeatures, feature.feature.properties.id]);
        getFeature();
    }

    const onSkip = async (status) => {
        await changeFeatureStatus([feature.feature.properties.id], status);
        getFeature();
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
                            tags={challengeTags}
                            translateEngine={translateEngine}
                            challenge_id={challenge_id}
                        />
                    </div>
                    <div className='col-4 p-0 border border-start-0 border-secondary-subtle'>
                        <SideBar
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

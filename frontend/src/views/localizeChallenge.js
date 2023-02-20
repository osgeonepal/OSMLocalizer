import React, { useState, useEffect } from "react";

import ChallengeEditor from '../components/tagEditor';
import { fetchLocalJSONAPI } from "../utills/fetch";

export const LocalizeChallengeView = () => {
    const [challenge, setChallenge] = useState({});
    const [isChallenegeLoaded, setIsChallengeLoaded] = useState(false);
    useEffect(() => {
        fetchLocalJSONAPI("challenge/1/").then((data) => {
            setChallenge(data);
            setIsChallengeLoaded(true);
        });
    }, [])
    return (
        <div>
            {isChallenegeLoaded ? (
                <div className="row">
                    <div className="col-4">
                    </div>
                    <div className="col-8">
                        <ChallengeEditor challenge={challenge} />
                    </div>
                </div>
            ) : <div>Loading...</div>
            }
        </div>
    );
}


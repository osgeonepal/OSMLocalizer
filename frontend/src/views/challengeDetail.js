
import { React, useState, useEffect } from "react";
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';

import { fetchLocalJSONAPI } from "../utills/fetch";
import ChallengeInfo from '../components/challenge/challengeInfo';
import ChallengeEditor from '../components/tagEditor';

export default function ChallengeDetailView() {
    const [challenge, setChallenge] = useState({});
    useEffect(() => {
        fetchLocalJSONAPI("challenge/10/").then((data) => {
            setChallenge(data);
        });
    }, [])

    return (
        <div>
            <Row>
                <Col>
                    <ChallengeInfo challenge={challenge} />
                </Col>
                <Col className="col-5">
                    <ChallengeEditor />
                </Col>
            </Row>

        </div>
    );
};

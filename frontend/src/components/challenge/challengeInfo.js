import {ChallengeMap} from "./challengeMap";
import { ChallengeProgress } from "./challengeProgress";
export default function ChallengeInfo(props) {
    return (
        <div className="d-flex flex-column overflow-auto" style={{height: "90vh"}}>
            <div className="border-bottom border-secondary-subtle p-1 mb-2" style={{height: "4vh"}}>
                <span className="text-secondary fs-5">#{props.challenge.id}</span>
                <span className="text-body fs-5 ms-1">{props.challenge.name.toUpperCase()}</span>
            </div>
            <ChallengeMap challenge={props.challenge}/>
            <div className="p-1 pb-0 border-top mt-2" style={{"height": "30vh"}}>
                <h5 className="text-secondary">Description</h5>
                <div className="text-secondary overflow-auto" style={{"height": "25vh"}}>
                    {props.challenge.description}
                </div>
            </div>
            <ChallengeProgress className="align-items-end"/>
        </div>
    );
    }

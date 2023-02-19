import React from "react";

export const ChallengeProgress = (props) => {
    return (
        <div className="challenge-progress align-bottom d-flex flex-column justify-content-end" style={{height: "15vh"}}>
                <div className="d-flex flex-row p-2">
                    <span className="text-secondary flex-grow-1">12 Contributors</span>
                    <span className="text-secondary">Task Data Sourced: October 21, 2022</span>
                </div>
                <div className="progress" style={{height:"12px"}}>
                    <div
                        className="progress-bar" 
                        role="progressbar" 
                        style={{width: "25%"}} 
                        aria-valuenow="25" 
                        aria-valuemin="0" 
                        aria-valuemax="100"
                    >
                        25%
                    </div>
                </div>
                <div className="d-flex p-2 mt-2">
                    <div className="flex-grow-1" >
                        <span className="badge text-wrap bg-secondary ">25 days left</span>
                    </div>
                    <button className="btn btn-primary">Localize</button>
                </div>
        </div>
    );
};
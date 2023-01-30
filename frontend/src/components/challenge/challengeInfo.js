export default function ChallengeInfo(props) {
    return (
        <div className="col-5">
            <div>
                <h1>{props.challenge.name}</h1>
                <p>{props.challenge.description}</p>
            </div>
        </div>
    );
    }

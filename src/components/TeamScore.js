import React from 'react'

function TeamScore(props) {
    const team = props.team;
    const score = props.score;
    const teamTag = props.teamTag;
    const selectTeam = props.selectTeam;

    let divClass = "team-score";
    let iconClass = "team-icon";
    // set selected or not
    if (selectTeam === team) {
        divClass += " square-select";
    }
    // set team-icon class
    iconClass += " team-" + teamTag;
    return (
        <div className={divClass} onClick={props.onClick}>
            <div className={iconClass}>{teamTag}</div>
            <p className="team-score-text">Score: {score}</p>
        </div>
    );
}

export default TeamScore;
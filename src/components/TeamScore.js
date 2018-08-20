import React from 'react'
import makeBlockie from 'ethereum-blockies-base64'

function TeamScore(props) {
    const team = props.team;
    const score = props.score;
    const teamTag = props.teamTag;
    const selectTeam = props.selectTeam;
    let bidders = props.bidders;
    let bidderIcons = [];
    if (bidders) {
        for (let i = 0; i < bidders.length; ++i) {
            let icon = makeBlockie(bidders[i].name);
            let bidder = <img className="bidder-icon" src={icon} key={i} alt='User' />;
            bidderIcons.push(bidder);
        }
    }

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
            <div className="bidder-icon-container">
                {bidderIcons}
            </div>
        </div>
    );
}

export default TeamScore;
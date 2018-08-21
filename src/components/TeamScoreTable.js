import React from 'react'

import TeamScore from './TeamScore'

class TeamScoreTable extends React.Component {
    render () {
        let teams = this.props.teams;
        let rows = [];

        if (teams) {
            teams.sort(function(a, b) {
                if (a.score > b.score) return -1;
                if (a.score < b.score) return 1;
                return 0;
            });
        }
        for (let i = 0; i < teams.length; ++i) {
            const element = teams[i];
            let teamBidders = null;
            if (this.props.teamBidders) {
                teamBidders = this.props.teamBidders.find(function(b){
                    return b.name === element.team;
                })
            }
            rows.push(
                <TeamScore 
                    key={element.team}
                    team={element.team}
                    score={element.score}
                    teamTag={element.teamTag}
                    selectTeam={this.props.selectTeam}
                    bidders={teamBidders.bidders}
                    onClick={() => this.props.onSelectTeam(element.team)}
                />
            );
        }
        if (this.props.toggle) {
            return (
                <div className="dark">
                    <div className="bid-table">
                        <div>
                            {rows}
                        </div>
                    </div>
                </div>
            );
        } else {
            return (null);
        }
    }
}

export default TeamScoreTable;
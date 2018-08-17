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
            rows.push(
                <TeamScore 
                    key={element.team}
                    team={element.team}
                    score={element.score}
                    teamTag={element.teamTag}
                    selectTeam={this.props.selectTeam}
                    onClick={() => this.props.onSelectTeam(element.team)}
                />
            );
        }
        return (
            <div className="dark">
                <div className="bid-table">
                    <div>
                        {rows}
                    </div>
                </div>
            </div>
        );
    }
}

export default TeamScoreTable;
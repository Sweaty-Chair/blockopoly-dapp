import React from 'react'

import TeamScore from './TeamScore'

class TeamScoreTable extends React.Component {
    render () {
        let rows = [];
        for (let i = 0; i < this.props.teams.length; ++i) {
            const element = this.props.teams[i];
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
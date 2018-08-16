import React from 'react'

import Square from './Square'

import { BOARD_ROWS } from '../constants';
import { BOARD_COLUMNS } from '../constants';
import { DOUBLE_POS } from '../constants';
import { TRIPPLE_POS } from '../constants';
import { POINTS_POS } from '../constants';

class Board extends React.Component {
    renderSquare(i) {
        let className = "square";
        let content = "";
        let info = "";

        // set className
        if (this.props.selectId === i) {
            className += " square-select";
        }
        // set content
        let currentSquare = this.props.squares[i];
        if (currentSquare) {
            const teamName = currentSquare.team;
            className += " " + teamName;
            content = teamName.split("-")[1];
        }
        // set info
        if (POINTS_POS.includes(i)) {
            info = "+10";
        } else if (DOUBLE_POS.includes(i)) {
            info = "x2";
        } else if (TRIPPLE_POS.includes(i)) {
            info = "x3";
        }
        return (
            <Square
                className={className}
                content={content}
                info={info}
                onClick={() => this.props.onClick(i)}
            />
        );
    }

    render() {
        return (
            <div className="gridboard">
                <div className="board-row">
                    {this.renderSquare(0)}
                    {this.renderSquare(1)}
                    {this.renderSquare(2)}
                    {this.renderSquare(3)}
                    {this.renderSquare(4)}
                    {this.renderSquare(5)}
                    {this.renderSquare(6)}
                </div>
                <div className="board-row">
                    {this.renderSquare(7)}
                    {this.renderSquare(8)}
                    {this.renderSquare(9)}
                    {this.renderSquare(10)}
                    {this.renderSquare(11)}
                    {this.renderSquare(12)}
                    {this.renderSquare(13)}
                </div>
                <div className="board-row">
                    {this.renderSquare(14)}
                    {this.renderSquare(15)}
                    {this.renderSquare(16)}
                    {this.renderSquare(17)}
                    {this.renderSquare(18)}
                    {this.renderSquare(19)}
                    {this.renderSquare(20)}
                </div>
                <div className="board-row">
                    {this.renderSquare(21)}
                    {this.renderSquare(22)}
                    {this.renderSquare(23)}
                    {this.renderSquare(24)}
                    {this.renderSquare(25)}
                    {this.renderSquare(26)}
                    {this.renderSquare(27)}
                </div>
                <div className="board-row">
                    {this.renderSquare(28)}
                    {this.renderSquare(29)}
                    {this.renderSquare(30)}
                    {this.renderSquare(31)}
                    {this.renderSquare(32)}
                    {this.renderSquare(33)}
                    {this.renderSquare(34)}
                </div>
                <div className="board-row">
                    {this.renderSquare(35)}
                    {this.renderSquare(36)}
                    {this.renderSquare(37)}
                    {this.renderSquare(38)}
                    {this.renderSquare(39)}
                    {this.renderSquare(40)}
                    {this.renderSquare(41)}
                </div>
            </div>
        );
    }
}

export default Board;
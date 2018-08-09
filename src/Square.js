import React from 'react'

function Square(props) {
    return (
        <button className={props.className} onClick={props.onClick}>
            {props.content}
            <span className="square-info">{props.info}</span>
        </button>
    );
}

export default Square
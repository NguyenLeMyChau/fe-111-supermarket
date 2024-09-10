import React from 'react';
import './Button.scss';

export default function Button(props) {

    return (
        <button
            type={props.type || 'button'}
            className='button'
            style={{ width: `${props.width}px`, height: `${props.height}px`, color: props.color, backgroundColor: props.backgroundColor }}
        >
            {props.text}
        </button>

    );
}
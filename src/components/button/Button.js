import React from 'react';
import './Button.scss';

export default function Button(props) {

    return (
        <button
            type={props.type || 'button'}
            className={`button ${props.className || ''} ${props.disabled ? 'button-disabled' : ''}`}
            style={{
                width: `${props.width}px`,
                height: `${props.height}px`,
                color: props.color,
                backgroundColor: props.backgroundColor || 'transparent',
                backgroundImage: props.backgroundImage,
                border: props.border,
                alignSelf: props.alignSelf,
                marginTop: props.marginTop,
            }}
            onClick={props.onClick}
            disabled={props.disabled}
        >
            {props.icon && <span style={{ marginTop: '5px', marginRight: '5px' }}>{props.icon}</span>}
            {props.text}
        </button>

    );
}
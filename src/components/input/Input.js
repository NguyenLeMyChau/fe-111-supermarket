import React from 'react';
import './Input.scss';

export default function Input(props) {

    return (
        <div className='input-container'>
            <label className={`input-label }`} style={{ color: props.color }}>{props.label}</label>
            <input
                type={props.type || 'text'}
                placeholder={props.placeholder}
                className='input-field'
                style={{ width: `${props.width}px`, height: `${props.height}px` }}
            />
        </div>

    );
}
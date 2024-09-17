import React from 'react';
import './Input.scss';
import { IoIosSearch } from "react-icons/io";

export default function Input(props) {
    return (
        <div className='input-container'>
            <label className='input-label' style={{ color: props.color }}>{props.label}</label>
            <div className='input-wrapper'>
                {props.type === 'search' && <IoIosSearch className='input-icon' />}
                <input
                    type={props.type || 'text'}
                    placeholder={props.placeholder}
                    className='input-field'
                    style={{ width: `${props.width}px`, height: `${props.height}px` }}
                    value={props.value}
                    onChange={props.onChange}
                />
            </div>
        </div>
    );
}
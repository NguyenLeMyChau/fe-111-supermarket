import React from 'react';
import './Input.scss';
import { IoIosSearch } from "react-icons/io";

export default function Input(props) {
    const directionClass = props.direction === 'column' ? 'input-container-column' : 'input-container-row';

    return (
        <div className={`${directionClass}`}>
            <label className='input-label' style={{ color: props.color }}>{props.label}</label>
            <div className='input-wrapper'>
                {props.type === 'search' && <IoIosSearch className='input-icon' />}
                {props.type === 'radio' ? (
                    props.options.map((option, index) => (
                        <label key={index} className='radio-option'>
                            <input
                                type='radio'
                                name={props.name}
                                value={option.value}
                                checked={props.value === option.value}
                                onChange={() => props.onChange(option.value)}
                            />
                            {option.label}
                        </label>
                    ))
                ) : (
                    <input
                        type={props.type || 'text'}
                        placeholder={props.placeholder}
                        className='input-field'
                        style={{ width: `${props.width}px`, height: `${props.height}px` }}
                        name={props.name}
                        value={props.value}
                        onChange={props.onChange}
                    />
                )}
            </div>
        </div>
    );
}
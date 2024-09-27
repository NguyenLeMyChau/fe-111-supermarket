import React from 'react';
import './Input.scss';
import { IoIosSearch } from "react-icons/io";
import { RiErrorWarningLine } from "react-icons/ri";

export default function Input(props) {
    const directionClass = props.direction === 'column' ? 'input-container-column' : 'input-container-row';

    return (
        <div className={`${directionClass}`}>
            <label className='input-label' style={{ color: props.color }}>{props.label}</label>
            <div className='input-wrapper'>
                {props.type === 'search' && <IoIosSearch className='input-icon' />}
                {props.type === 'radio' ? (
                    props.options.map((option, index) => (
                        <label key={index} className='radio-option' style={{ margin: '5px 0px' }}>
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
                    <div className='input-container-column'>
                        <input
                            type={props.type || 'text'}
                            placeholder={props.placeholder}
                            className={`input-field ${props.error ? 'input-error' : ''}`}
                            style={{ width: `${props.width}px`, height: `${props.height}px` }}
                            name={props.name}
                            value={props.value}
                            onChange={props.onChange}
                        />
                        {/* {props.error && (
                            <span className='error-message'>
                                <RiErrorWarningLine className='error-icon' color="var(--danger-color)" size={20} />
                                {props.error}
                            </span>
                        )} */}
                    </div>
                )}
            </div>
        </div>

    );
}
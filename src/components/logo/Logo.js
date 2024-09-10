import React from 'react';
import logo from '../../assets/logo-supermarket-removebg.png';
import './Logo.scss';

export default function Logo(props) {
    return (
        <img
            src={logo}
            alt="logo"
            className='logo'
            style={{ width: `${props.width}px`, height: `${props.height}px` }}
        />
    );
}


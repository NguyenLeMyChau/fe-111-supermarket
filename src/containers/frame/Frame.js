import React from 'react';
import './Frame.scss';
import Menu from '../menu/Menu';
import Header from '../header/Header';

export default function Frame() {
    return (
        <div className='frame-container'>
            <Menu />
            <Header />
        </div>
    );
}

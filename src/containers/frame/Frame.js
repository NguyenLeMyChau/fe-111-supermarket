import React from 'react';
import './Frame.scss';
import Menu from '../menu/Menu';
import Header from '../header/Header';
import useCommonData from '../../hooks/useCommonData';
import { Outlet } from 'react-router';

export default function Frame() {
    useCommonData();

    const handleMenuChange = (selectedPath) => {
        console.log(selectedPath);
    };

    return (
        <div className='frame-container'>
            <Menu onchange={handleMenuChange} />
            <div className='frame-content'>
                <Header />
                <main className='main-content'>
                    <Outlet />
                </main>
            </div>
        </div>
    );
}

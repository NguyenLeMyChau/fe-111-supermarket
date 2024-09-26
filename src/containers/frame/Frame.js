import React, { useState } from 'react';
import './Frame.scss';
import Menu from '../menu/Menu';
import Header from '../header/Header';
import useCommonData from '../../hooks/useCommonData';
import User from '../user/User';

export default function Frame() {
    const [currentContent, setCurrentContent] = useState(<User />);
    useCommonData();

    const handleMenuChange = (selectedItem) => {
        setCurrentContent(selectedItem);
    };

    return (
        <div className='frame-container'>
            <Menu onchange={handleMenuChange} />
            <div className='frame-content'>
                <Header />
                <main className='main-content'>
                    {currentContent}
                </main>
            </div>
        </div>
    );
}

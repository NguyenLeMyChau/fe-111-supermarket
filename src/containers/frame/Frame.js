import React, { useState } from 'react';
import './Frame.scss';
import Menu from '../menu/Menu';
import Header from '../header/Header';
import Inventory from '../../pages/inventory/Inventory';
import Orders from '../../pages/orders/Orders';

export default function Frame() {
    const [currentContent, setCurrentContent] = useState('Dashboard');

    const contentMap = {
        'Inventory': <Inventory />,
        'Orders': <Orders />,
    };

    const handleMenuChange = (selectedItem) => {
        setCurrentContent(selectedItem);
    };

    return (
        <div className='frame-container'>
            <Menu onchange={handleMenuChange} />
            <div className='frame-content'>
                <Header />
                <main className='main-content'>
                    {contentMap[currentContent] || <Inventory />}
                </main>
            </div>
        </div>
    );
}

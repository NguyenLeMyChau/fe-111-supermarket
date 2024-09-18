import React, { useEffect, useState } from 'react';
import './Frame.scss';
import Menu from '../menu/Menu';
import Header from '../header/Header';
import Inventory from '../../pages/inventory/Inventory';
import Orders from '../../pages/orders/Orders';
import { useNavigate } from 'react-router';
import { useSelector } from 'react-redux';

export default function Frame() {
    const [currentContent, setCurrentContent] = useState('Dashboard');
    const navigate = useNavigate();
    const login = useSelector((state) => state.auth?.login?.currentUser);

    useEffect(() => {
        console.log('login', login);
        if (!login || !login?.accessToken) {
            alert('Vui lòng đăng nhập để thực hiện chức năng này!');
            navigate('/login');
        } else if (login?.role !== 'manager') {
            alert('Chỉ có quản lý mới có thể truy cập trang này!');
            navigate('/login');
        }
    }, [login, navigate]);

    const contentMap = {
        'Inventory': <Inventory />,
        'Orders': <Orders />,
    };

    if (!login || login?.role !== 'manager') {
        return <div className='frame-access-denied'></div>;
    }

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

import React, { useEffect, useState } from 'react';
import './Frame.scss';
import { useNavigate } from 'react-router';
import { useSelector } from 'react-redux';
import Menu from '../menu/Menu';
import Header from '../header/Header';

export default function Frame() {
    const [currentContent, setCurrentContent] = useState('Dashboard');
    const navigate = useNavigate();
    const logout = useSelector((state) => state.auth?.login?.isLogout);
    const login = useSelector((state) => state.auth?.login?.currentUser);

    useEffect(() => {
        console.log('login', login);
        if (!login && !logout) {
            alert('Vui lòng đăng nhập để thực hiện chức năng này!');
            navigate('/login');
        } else if (login?.role !== 'manager' && !logout) {
            alert('Chỉ có quản lý mới có thể truy cập trang này!');
            navigate('/login');
        }
    }, [login, logout, navigate]);

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
                    {currentContent}
                </main>
            </div>
        </div>
    );
}

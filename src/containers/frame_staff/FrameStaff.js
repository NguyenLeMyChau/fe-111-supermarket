import React, { useEffect, useState } from 'react';
import Menu from '../menu/Menu';
import Header from '../header/Header';
import { useNavigate } from 'react-router';
import { useSelector } from 'react-redux';

export default function FrameStaff() {
    const [currentContent, setCurrentContent] = useState('User');
    const navigate = useNavigate();
    const logout = useSelector((state) => state.auth?.login?.isLogout);
    const login = useSelector((state) => state.auth?.login?.currentUser);

    useEffect(() => {
        console.log('login', login);
        if (!login && !logout) {
            alert('Vui lòng đăng nhập để thực hiện chức năng này!');
            navigate('/login');
        } else if (login?.role !== 'staff' && !logout) {
            alert('Chỉ có nhân viên mới có thể truy cập trang này!');
            navigate('/login');
        }
    }, [login, logout, navigate]);

    if (!login || login?.role !== 'staff') {
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

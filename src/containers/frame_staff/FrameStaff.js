import React, { useEffect, useState } from 'react';
import Menu from '../menu/Menu';
import Header from '../header/Header';
import { Outlet, useNavigate } from 'react-router';
import { useSelector } from 'react-redux';
import User from '../user/User';
import { toast } from 'react-toastify';
import useCommonDataEmployee from '../../hooks/useCommonDataEmployee';

export default function FrameStaff() {
    useCommonDataEmployee();
    const [currentContent, setCurrentContent] = useState(<User />);
    const navigate = useNavigate();
    const logout = useSelector((state) => state.auth?.login?.isLogout);
    const login = useSelector((state) => state.auth?.login?.currentUser);

    useEffect(() => {
        if (!login && !logout) {
            toast.info('Vui lòng đăng nhập để thực hiện chức năng này!');
            navigate('/login');
        } else if (login?.role !== 'staff' && !logout) {
            toast.info('Chỉ có nhân viên mới có thể truy cập trang này!');
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
                    {/* {currentContent} */}
                       <Outlet />
                </main>
            </div>
        </div>
    );
}

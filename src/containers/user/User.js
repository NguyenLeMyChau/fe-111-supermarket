import React from 'react';
import { useSelector } from 'react-redux';
import './User.scss';

const User = () => {
    const user = useSelector((state) => state.auth?.login?.currentUser);

    if (!user) {
        return <div className="user-container">No user data available.</div>;
    }

    return (
        <div className="user-container">
            <h3>Thông tin người dùng</h3>
            <div className="user-info">
                <div className="user-info-item">
                    <span className="label">Họ tên:</span>
                    <span className="value">{user.user.name}</span>
                </div>
                <div className="user-info-item">
                    <span className="label">Số điện thoại:</span>
                    <span className="value">{user.user.phone}</span>
                </div>
                <div className="user-info-item">
                    <span className="label">Chức vụ:</span>
                    <span className="value">{user.role === 'manager' ? 'Quản lý' : 'Nhân viên'}</span>
                </div>
                <div className="user-info-item">
                    <span className="label">Email:</span>
                    <span className="value">{user.user.email}</span>
                </div>
                <div className="user-info-item">
                    <span className="label">Giới tính:</span>
                    <span className="value">{user.user.gender ? 'Nữ' : 'Nam'}</span>
                </div>
                <div className="user-info-item">
                    <span className="label">Địa chỉ:</span>
                    <span className="value">{user.user.address}</span>
                </div>
            </div>
        </div>
    );
};

export default User;
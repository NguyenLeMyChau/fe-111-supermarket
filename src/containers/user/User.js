import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import './User.scss';
import Button from '../../components/button/Button';
import Modal from '../../components/modal/Modal';
import UpdateUser from './UpdateUser';

const User = () => {
    const user = useSelector((state) => state.auth?.login?.currentUser);
    const [isModalOpen, setIsModalOpen] = useState(false);

    const handleOpenModal = () => {
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
    };

    if (!user) {
        return <div className="user-container">No user data available.</div>;
    }

    return (
        <div className="user-container">
            <header className='flex-row-space-between'>
                <h3>Thông tin người dùng</h3>
                <div className='flex-row-align-center'>
                    <Button
                        text={'Cập nhật thông tin'}
                        backgroundColor='#1366D9'
                        className='text-sm font-weight-medium'
                        onClick={handleOpenModal}
                    />
                </div>
            </header>
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
                    <span className="value">{user.user.address.street}, {user.user.address.ward}, <br />
                        {user.user.address.district}, {user.user.address.city}</span>
                </div>
            </div>
            {
                isModalOpen && (
                    <Modal
                        title='Cập nhật thông tin'
                        isOpen={isModalOpen}
                        onClose={handleCloseModal}
                        width={'30%'}
                    >
                        <UpdateUser
                            user={user}
                        />
                    </Modal>
                )
            }
        </div>

    );
};

export default User;
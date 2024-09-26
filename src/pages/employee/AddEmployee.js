import React, { useState } from 'react';
import './Employee.scss';
import Modal from '../../components/modal/Modal';
import Input from '../../components/input/Input';
import Button from '../../components/button/Button';

export default function AddEmployee({ isOpen, onClose, onAdd }) {
    const [employeeData, setEmployeeData] = useState({ name: '', phone: '', email: '', gender: false, address: '' });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setEmployeeData((prevData) => ({ ...prevData, [name]: value }));
    };

    const handleGenderChange = (value) => {
        setEmployeeData((prevData) => ({
            ...prevData,
            gender: value
        }));
    };


    const handleSubmit = (e) => {
        e.preventDefault();
        onAdd(employeeData); // Gọi hàm onAdd và xử lý logic
        setEmployeeData({ name: '', phone: '', email: '', gender: false, address: '' });
        onClose(); // Đóng modal sau khi thêm
    };

    return (
        <Modal
            title="Thêm nhân viên"
            isOpen={isOpen}
            onClose={onClose}
            width={'30%'}
        >
            <div className='flex-column-center'>

                <form onSubmit={handleSubmit}>

                    <Input
                        label='Họ và tên'
                        placeholder='Nhập họ và tên'
                        name='name'
                        value={employeeData.name}
                        onChange={handleChange}
                    />
                    <Input
                        type='phone'
                        label='Số điện thoại'
                        name='phone'
                        placeholder='Nhập số điện thoại'
                        value={employeeData.phone}
                        onChange={handleChange}
                    />

                    <Input
                        type='email'
                        label='Email'
                        name='email'
                        placeholder='Nhập email'
                        value={employeeData.email}
                        onChange={handleChange}
                    />

                    <Input
                        type='radio'
                        label='Giới tính'
                        name='gender'
                        value={employeeData.gender}
                        onChange={handleGenderChange}
                        options={[
                            { label: 'Nam', value: false },
                            { label: 'Nữ', value: true }
                        ]}
                    />

                    <Input
                        label='Địa chỉ'
                        placeholder='Nhập địa chỉ'
                        name='address'
                        value={employeeData.address}
                        onChange={handleChange}
                    />

                    <div className='flex-row-center'>
                        <div className='login-button ' style={{ width: 200 }}>
                            <Button
                                type='submit'
                                text='Thêm nhân viên'
                            />
                        </div>
                    </div>

                </form>
            </div>

        </Modal>
    );
}

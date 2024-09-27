import React, { useState } from 'react';
import './Employee.scss';
import Modal from '../../components/modal/Modal';
import Input from '../../components/input/Input';
import Button from '../../components/button/Button';
import { registerEmployee } from '../../services/employeeRequest';
import { useAccessToken, useAxiosJWT } from '../../utils/axiosInstance';
import { validateEmployeeData } from '../../utils/validation';

export default function AddEmployee({ isOpen, onClose }) {
    const axiosJWT = useAxiosJWT();
    const accessToken = useAccessToken();

    const [errors, setErrors] = useState({});
    const [employeeData, setEmployeeData] = useState(
        {
            name: '',
            phone: '',
            email: '',
            gender: false,
            address: '',
            role: 'staff',
            password: '123456789'
        });

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

    const handleAddEmployee = async (e) => {
        e.preventDefault();

        // Kiểm tra dữ liệu
        const validationErrors = validateEmployeeData(employeeData);
        console.log('validationErrors:', validationErrors);

        // Nếu có lỗi, hiển thị thông báo và không gọi API
        if (Object.keys(validationErrors).length > 0) {
            setErrors(validationErrors);
            alert('Vui lòng kiểm tra lại thông tin.');
            return;
        }

        // Nếu không có lỗi, gọi API để thêm nhân viên
        try {
            const response = await registerEmployee(employeeData, accessToken, axiosJWT);
            if (response) {
                console.log('Employee registered:', response);
                // Xóa dữ liệu sau khi thêm thành công
                setEmployeeData({ name: '', phone: '', email: '', gender: false, address: '' });
                setErrors({});
                alert('Đăng ký nhân viên thành công');
            }
        } catch (error) {
            console.error('Failed to register employee:', error);
            alert('Có lỗi xảy ra khi thêm nhân viên.');
        }
    };

    return (
        <Modal
            title="Thêm nhân viên"
            isOpen={isOpen}
            onClose={onClose}
            width={'30%'}
        >
            <div className='flex-column-center'>

                <form onSubmit={handleAddEmployee}>

                    <Input
                        label='Họ và tên'
                        placeholder='Nhập họ và tên'
                        name='name'
                        value={employeeData.name}
                        onChange={handleChange}
                        error={errors.name}
                    />
                    <Input
                        type='phone'
                        label='Số điện thoại'
                        name='phone'
                        placeholder='Nhập số điện thoại'
                        value={employeeData.phone}
                        onChange={handleChange}
                        error={errors.phone}
                    />

                    <Input
                        type='email'
                        label='Email'
                        name='email'
                        placeholder='Nhập email'
                        value={employeeData.email}
                        onChange={handleChange}
                        error={errors.email}
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
                        error={errors.address}
                    />

                    <div className='flex-row-center'>
                        <div className='login-button' style={{ width: 200 }}>
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

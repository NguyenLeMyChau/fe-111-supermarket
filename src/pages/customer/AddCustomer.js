import React, { useState } from 'react';
import Modal from '../../components/modal/Modal';
import Input from '../../components/input/Input';
import Button from '../../components/button/Button';
import { registerCustomer } from '../../services/employeeRequest';
import { validateCustomerData } from '../../utils/validation';

export default function AddCustomer({ isOpen, onClose }) {

    const [errors, setErrors] = useState({});
    const [employeeData, setEmployeeData] = useState({
        name: '',
        phone: '',
        email: '',
        gender: false,
        address: {
            street: '',
            ward: '',
            district: '',
            city: '',
        },
        role: 'customer',
        password: '',
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setEmployeeData((prevData) => ({
            ...prevData,
            [name]: value,
            password: name === 'phone' ? value : prevData.password,
        }));
    };
    const handleAddressChange = (e) => {
        const { name, value } = e.target;
        setEmployeeData((prevData) => ({
            ...prevData,
            address: {
                ...prevData.address,
                [name]: value,
            },
        }));
    };

    const handleGenderChange = (value) => {
        setEmployeeData((prevData) => ({
            ...prevData,
            gender: value,
        }));
    };

    const handleAddEmployee = async (e) => {
        e.preventDefault();
        const validationErrors = validateCustomerData(employeeData);
        if (Object.keys(validationErrors).length > 0) {
            setErrors(validationErrors);
            alert('Vui lòng kiểm tra lại thông tin.');
            return;
        }

        try {
            const response = await registerCustomer(employeeData);
            if (response) {
                console.log('Customer registered:', response);
                setEmployeeData({
                    name: '',
                    phone: '',
                    email: '',
                    gender: false,
                    address: { street: '', ward: '', district: '', city: '' },
                    role: 'customer',
                    password: '',
                });
                setErrors({});
            }
        } catch (error) {
            console.error('Failed to register employee:', error);
            alert('Có lỗi xảy ra khi thêm nhân viên.');
        }
    };

    return (
        <Modal
            title="Thêm khách hàng"
            isOpen={isOpen}
            onClose={onClose}
            width={'30%'}
        >
            <div className="flex-column-center">
                <form onSubmit={handleAddEmployee}>
                    <Input
                        label="Họ và tên"
                        placeholder="Nhập họ và tên"
                        name="name"
                        value={employeeData.name}
                        onChange={handleChange}
                        error={errors.name}
                    />
                    <Input
                        type="phone"
                        label="Số điện thoại"
                        name="phone"
                        placeholder="Nhập số điện thoại"
                        value={employeeData.phone}
                        onChange={handleChange}
                        error={errors.phone}
                    />
                    <Input
                        type="email"
                        label="Email"
                        name="email"
                        placeholder="Nhập email"
                        value={employeeData.email}
                        onChange={handleChange}
                        error={errors.email}
                    />
                    <Input
                        type="radio"
                        label="Giới tính"
                        name="gender"
                        value={employeeData.gender}
                        onChange={handleGenderChange}
                        options={[
                            { label: 'Nam', value: false },
                            { label: 'Nữ', value: true },
                        ]}
                    />

                    <Input
                        label="Số nhà và tên đường"
                        placeholder="Nhập số nhà và tên đường"
                        name="street"
                        value={employeeData.address.street}
                        onChange={handleAddressChange}
                        error={errors.address?.street}
                    />
                    <Input
                        label="Phường/Xã"
                        placeholder="Nhập phường/xã"
                        name="ward"
                        value={employeeData.address.ward}
                        onChange={handleAddressChange}
                        error={errors.address?.ward}
                    />
                    <Input
                        label="Quận/Huyện"
                        placeholder="Nhập quận/huyện"
                        name="district"
                        value={employeeData.address.district}
                        onChange={handleAddressChange}
                        error={errors.address?.district}
                    />
                    <Input
                        label="Tỉnh/Thành phố"
                        placeholder="Nhập tỉnh/thành phố"
                        name="city"
                        value={employeeData.address.city}
                        onChange={handleAddressChange}
                        error={errors.address?.city}
                    />

                    <div className="flex-row-center">
                        <div className="login-button" style={{ width: 200 }}>
                            <Button type="submit" text="Thêm khách hàng" />
                        </div>
                    </div>
                </form>
            </div>
        </Modal>
    );
}

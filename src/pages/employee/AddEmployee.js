import React, { useState } from 'react';
import './Employee.scss';
import Modal from '../../components/modal/Modal';
import Input from '../../components/input/Input';
import Button from '../../components/button/Button';
import { registerEmployee } from '../../services/employeeRequest';
import { useAccessToken, useAxiosJWT } from '../../utils/axiosInstance';
import { validateEmployeeData } from '../../utils/validation';
import ClipLoader from 'react-spinners/ClipLoader';
import { toast } from 'react-toastify';

export default function AddEmployee({ isOpen, onClose }) {
    const axiosJWT = useAxiosJWT();
    const accessToken = useAccessToken();

    const [errors, setErrors] = useState({});
    const [loading, setLoading] = useState(false); // Trạng thái loading
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
        role: 'staff',
        password: '123456789',
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setEmployeeData((prevData) => ({ ...prevData, [name]: value }));
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

        const validationErrors = validateEmployeeData(employeeData);
        if (Object.keys(validationErrors).length > 0) {
            setErrors(validationErrors);
            toast.warning('Vui lòng kiểm tra lại thông tin.');
            return;
        }

        setLoading(true); // Bắt đầu loading

        try {
            const response = await registerEmployee(employeeData, accessToken, axiosJWT);
            if (response) {
                console.log('Employee registered:', response);
                setEmployeeData({
                    name: '',
                    phone: '',
                    email: '',
                    gender: false,
                    address: { street: '', ward: '', district: '', city: '' },
                    role: 'staff',
                    password: '123456789',
                });
                setErrors({});
                toast.success('Đăng ký nhân viên thành công');
            }
        } catch (error) {
            console.error('Failed to register employee:', error);
            toast.error('Có lỗi xảy ra khi thêm nhân viên.');
        } finally {
            setLoading(false); // Kết thúc loading
        }
    };

    return (
        <Modal
            title="Thêm nhân viên"
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
                        {loading ? (
                            <ClipLoader size={30} color="#2392D0" loading={loading} />
                        ) : (
                            <div className="login-button" style={{ width: 200 }}>
                                <Button type="submit" text="Thêm nhân viên" />
                            </div>

                        )}
                    </div>
                </form>
            </div>
        </Modal>
    );
}

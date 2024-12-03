import React, { useState } from 'react';
import Button from '../../components/button/Button';
import Input from '../../components/input/Input';
import { updateUser } from '../../services/authRequest';
import { useAccessToken, useAxiosJWT } from '../../utils/axiosInstance';
import { useNavigate } from 'react-router';
import { useDispatch } from 'react-redux';
import { toast } from 'react-toastify';

const UpdateUser = ({ user }) => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const accessToken = useAccessToken();
    const axiosJWT = useAxiosJWT();

    const [formData, setFormData] = useState({
        name: user.user.name,
        phone: user.user.phone,
        email: user.user.email,
        gender: user.user.gender,
        address: {
            street: user.user.address?.street || '',
            ward: user.user.address?.ward || '',
            district: user.user.address?.district || '',
            city: user.user.address?.city || '',
        },
    });
    const [errors, setErrors] = useState({});

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prevData) => ({
            ...prevData,
            [name]: value,
        }));
    };

    const handleGenderChange = (value) => {
        setFormData((prevData) => ({
            ...prevData,
            gender: value,
        }));
    };

    const handleAddressChange = (e) => {
        const { name, value } = e.target;
        setFormData((prevData) => ({
            ...prevData,
            address: {
                ...prevData.address,
                [name]: value,
            },
        }));
    };

    const validateForm = () => {
        const newErrors = {};
        if (!formData.phone) newErrors.phone = 'Số điện thoại không được để trống.';
        if (!formData.email) newErrors.email = 'Email không được để trống.';
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!validateForm()) return;

        try {
            await updateUser(user.id, formData, dispatch, navigate, accessToken, axiosJWT);
            toast.success('Cập nhật thông tin thành công!');
        } catch (error) {
            console.error('Error updating user:', error);
            toast.error('Cập nhật thất bại. Vui lòng thử lại.');
        }
    };

    return (
        <div className='flex-column-center'>
            <form onSubmit={handleSubmit}>
                <Input
                    label='Họ và tên'
                    placeholder='Nhập họ và tên'
                    name='name'
                    value={formData.name}
                    onChange={handleChange}
                    disabled={true}
                />
                <Input
                    type='phone'
                    label='Số điện thoại'
                    name='phone'
                    placeholder='Nhập số điện thoại'
                    value={formData.phone}
                    onChange={handleChange}
                    error={errors.phone}
                />
                <Input
                    type='email'
                    label='Email'
                    name='email'
                    placeholder='Nhập email'
                    value={formData.email}
                    onChange={handleChange}
                    error={errors.email}
                />
                <Input
                    type='radio'
                    label='Giới tính'
                    name='gender'
                    value={formData.gender}
                    onChange={handleGenderChange}
                    options={[
                        { label: 'Nam', value: false },
                        { label: 'Nữ', value: true },
                    ]}
                />

                <Input label='Số nhà, tên đường' placeholder='Nhập số nhà và tên đường' name='street' value={formData.address.street} onChange={handleAddressChange} />
                <Input label='Phường/Xã' placeholder='Nhập phường/xã' name='ward' value={formData.address.ward} onChange={handleAddressChange} />
                <Input label='Quận/Huyện' placeholder='Nhập quận/huyện' name='district' value={formData.address.district} onChange={handleAddressChange} />
                <Input label='Tỉnh/Thành phố' placeholder='Nhập tỉnh/thành phố' name='city' value={formData.address.city} onChange={handleAddressChange} />

                <div className='flex-row-center'>
                    <div className='login-button' style={{ width: 200 }}>
                        <Button type='submit' text='Cập nhật thông tin' />
                    </div>
                </div>
            </form>
        </div>
    );
};

export default UpdateUser;

import React, { useState } from 'react';
import Button from '../../components/button/Button';
import Input from '../../components/input/Input';
import { updateUser } from '../../services/authRequest';
import { useAccessToken, useAxiosJWT } from '../../utils/axiosInstance';
import { useNavigate } from 'react-router';
import { useDispatch } from 'react-redux';

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
        address: user.user.address,
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value,
        });
    };

    const handleGenderChange = (value) => {
        setFormData((prevData) => ({
            ...prevData,
            gender: value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        console.log('user', user);
        console.log('Form data:', formData);
        // Gọi API cập nhật thông tin người dùng
        await updateUser(user.id, formData, dispatch, navigate, accessToken, axiosJWT);
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
                />

                <Input
                    type='email'
                    label='Email'
                    name='email'
                    placeholder='Nhập email'
                    value={formData.email}
                    onChange={handleChange}
                />

                <Input
                    type='radio'
                    label='Giới tính'
                    name='gender'
                    value={formData.gender}
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
                    value={formData.address}
                    onChange={handleChange}
                />

                <div className='flex-row-center'>
                    <div className='login-button' style={{ width: 200 }}>
                        <Button
                            type='submit'
                            text='Cập nhật thông tin'
                        />
                    </div>
                </div>

            </form>
        </div>
    );
};

export default UpdateUser;
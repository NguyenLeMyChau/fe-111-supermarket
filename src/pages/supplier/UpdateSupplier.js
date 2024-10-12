import React, { useState } from 'react';
import Button from '../../components/button/Button';
import Input from '../../components/input/Input';
import { useAccessToken, useAxiosJWT } from '../../utils/axiosInstance';
import { updateSupplier } from '../../services/supplierRequest';

const UpdateSupplier = ({ supplier }) => {
    const accessToken = useAccessToken();
    const axiosJWT = useAxiosJWT();

    const [formData, setFormData] = useState({
        name: supplier.name,
        phone: supplier.phone,
        email: supplier.email,
        address: supplier.address,
        description: supplier.description,
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value,
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        // Call API to update user data
        await updateSupplier(supplier._id, formData, accessToken, axiosJWT);
    };

    return (
        <div className='flex-column-center'>

            <form onSubmit={handleSubmit}>

                <Input
                    label='Nhà cung cấp'
                    name='name'
                    placeholder='Nhập tên nhà cung cấp'
                    value={formData.name}
                    onChange={handleChange}
                    width={500}
                />

                <Input
                    label='Số điện thoại'
                    name='phone'
                    placeholder='Nhập số điện thoại'
                    value={formData.phone}
                    onChange={handleChange}
                    width={500}
                />

                <Input
                    label='Email'
                    placeholder='Nhập email'
                    name='email'
                    value={formData.email}
                    onChange={handleChange}
                    width={500}
                />

                <Input
                    label='Địa chỉ'
                    name='address'
                    placeholder='Nhập địa chỉ'
                    value={formData.address}
                    onChange={handleChange}
                    width={500}
                />

                <Input
                    label='Mô tả'
                    name='description'
                    placeholder='Nhập mô tả'
                    value={formData.description}
                    onChange={handleChange}
                    width={500}
                />

                <div className='flex-row-center'>
                    <div className='login-button' style={{ width: 200 }}>
                        <Button
                            type='submit'
                            text='Cập nhật'
                        />
                    </div>
                </div>

            </form>
        </div>
    );
};

export default UpdateSupplier;
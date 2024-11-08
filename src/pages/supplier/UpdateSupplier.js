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
        address: {
            street: supplier.address?.street || '',
            ward: supplier.address?.ward || '',
            district: supplier.address?.district || '',
            city: supplier.address?.city || '',
        },
        description: supplier.description,
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value,
        });
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
                />

                <Input
                    label='Mô tả'
                    name='description'
                    placeholder='Nhập mô tả'
                    value={formData.description}
                    onChange={handleChange}
                />

                <Input
                    label='Số điện thoại'
                    name='phone'
                    placeholder='Nhập số điện thoại'
                    value={formData.phone}
                    onChange={handleChange}
                />

                <Input
                    label='Email'
                    placeholder='Nhập email'
                    name='email'
                    value={formData.email}
                    onChange={handleChange}
                />

                <Input label='Số nhà, tên đường' placeholder='Nhập số nhà và tên đường' name='street' value={formData.address.street} onChange={handleAddressChange} />
                <Input label='Phường/Xã' placeholder='Nhập phường/xã' name='ward' value={formData.address.ward} onChange={handleAddressChange} />
                <Input label='Quận/Huyện' placeholder='Nhập quận/huyện' name='district' value={formData.address.district} onChange={handleAddressChange} />
                <Input label='Tỉnh/Thành phố' placeholder='Nhập tỉnh/thành phố' name='city' value={formData.address.city} onChange={handleAddressChange} />



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
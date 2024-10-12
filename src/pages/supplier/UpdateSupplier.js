import React, { useState } from 'react';
import Button from '../../components/button/Button';
import Input from '../../components/input/Input';

const UpdateSupplier = ({ supplier }) => {
    const [formData, setFormData] = useState({
        name: supplier.name,
        phone: supplier.phone,
        email: supplier.email,
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value,
        });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        // Call API to update user data
    };

    return (
        <div className='flex-column-center'>

            <form onSubmit={handleSubmit}>

                <Input
                    label='Tên nhà cung cấp'
                    name='name'
                    placeholder='Nhập tên nhà cung cấp'
                    value={formData.name}
                    onChange={handleChange}
                />

                <Input
                    label='Số điện thoại'
                    name='phone'
                    placeholder='Nhập số điện thoại'
                    value={formData.phone}
                    onChange={handleChange}
                    disabled={true}
                />

                <Input
                    label='Email'
                    placeholder='Nhập email'
                    name='email'
                    value={formData.email}
                    onChange={handleChange}
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
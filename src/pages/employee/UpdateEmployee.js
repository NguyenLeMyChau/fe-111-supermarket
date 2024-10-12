import React, { useState } from 'react';
import Button from '../../components/button/Button';
import Input from '../../components/input/Input';

const UpdateEmployee = ({ employee }) => {
    const [formData, setFormData] = useState({
        name: employee.name,
        phone: employee.phone,
        email: employee.email,
        gender: employee.gender,
        address: employee.address,
        active: employee.active,
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

    const handleActiveChange = (value) => {
        setFormData((prevData) => ({
            ...prevData,
            active: value
        }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        // Call API to update user data
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
                    disabled={true}
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

                <Input
                    type='radio'
                    label='Trạng thái'
                    name='active'
                    value={formData.active}
                    onChange={handleActiveChange}
                    options={[
                        { label: 'Không hoạt động', value: false },
                        { label: 'Hoạt động', value: true }
                    ]}
                />

                <div className='flex-row-center'>
                    <div className='login-button' style={{ width: 200 }}>
                        <Button
                            type='submit'
                            text='Cập nhật nhân viên'
                        />
                    </div>
                </div>

            </form>
        </div>
    );
};

export default UpdateEmployee;
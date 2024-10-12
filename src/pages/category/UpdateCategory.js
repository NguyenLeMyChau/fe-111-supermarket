import React, { useState } from 'react';
import Button from '../../components/button/Button';
import Input from '../../components/input/Input';
import { useAccessToken, useAxiosJWT } from '../../utils/axiosInstance';
import { updateCategory } from '../../services/productRequest';

const UpdateCategory = ({ category }) => {
    const accessToken = useAccessToken();
    const axiosJWT = useAxiosJWT();

    const [formData, setFormData] = useState({
        name: category.name,
        description: category.description,
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
        await updateCategory(category._id, formData, accessToken, axiosJWT);
    };

    return (
        <div className='flex-column-center'>

            <form onSubmit={handleSubmit}>

                <Input
                    label='Loại sản phẩm'
                    placeholder='Nhập loại sản phẩm'
                    name='name'
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

export default UpdateCategory;
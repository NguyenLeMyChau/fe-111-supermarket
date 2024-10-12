import React, { useState } from 'react';
import Button from '../../components/button/Button';
import Input from '../../components/input/Input';

const UpdateProduct = ({ product }) => {
    const [formData, setFormData] = useState({
        item_code: product.item_code,
        name: product.name,
        description: product.description,
        barcode: product.barcode,
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
                    label='Mã hàng'
                    placeholder='Nhập mã hàng'
                    name='item_code'
                    value={formData.item_code}
                    onChange={handleChange}
                    disabled={true}
                />
                <Input
                    label='Tên sản phẩm'
                    name='name'
                    placeholder='Nhập tên sản phẩm'
                    value={formData.name}
                    onChange={handleChange}
                />

                <Input
                    label='Mô tả'
                    name='description'
                    placeholder='Nhập mô tả'
                    value={formData.description}
                    onChange={handleChange}
                    disabled={true}
                />

                <Input
                    label='Barcode'
                    placeholder='Nhập barcode'
                    name='barcode'
                    value={formData.barcode}
                    onChange={handleChange}
                />

                <div className='flex-row-center'>
                    <div className='login-button' style={{ width: 200 }}>
                        <Button
                            type='submit'
                            text='Cập nhật sản phẩm'
                        />
                    </div>
                </div>

            </form>
        </div>
    );
};

export default UpdateProduct;
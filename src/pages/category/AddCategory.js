import React, { useState } from 'react';
import Modal from '../../components/modal/Modal';
import Input from '../../components/input/Input';
import Button from '../../components/button/Button';
import { useAccessToken, useAxiosJWT } from '../../utils/axiosInstance';
import { addCategory } from '../../services/productRequest';

export default function AddCategory({ isOpen, onClose }) {
    const axiosJWT = useAxiosJWT();
    const accessToken = useAccessToken();

    const [categoryData, setCategoryData] = useState({ name: '', description: '' });


    const handleChange = (e) => {
        const { name, value } = e.target;
        setCategoryData({
            ...categoryData,
            [name]: value,
        });
    };


    const handleAddCategory = async (e) => {
        e.preventDefault();

        try {
            const response = await addCategory(categoryData, accessToken, axiosJWT);
            if (response) {
                setCategoryData({ name: '', description: '' });
            }
        } catch (error) {
            console.error('Failed to add category:', error);
            alert('Có lỗi xảy ra khi thêm loại sản phẩm.');
        }
    };

    return (
        <Modal
            title="Thêm loại sản phẩm"
            isOpen={isOpen}
            onClose={onClose}
            width={'30%'}
        >
            <div className='flex-column-center'>

                <form onSubmit={handleAddCategory}>

                    <Input
                        label='Loại sản phẩm'
                        placeholder='Nhập loại sản phẩm'
                        name='name'
                        value={categoryData.name}
                        onChange={handleChange}
                    />
                    <Input
                        label='Mô tả'
                        name='description'
                        placeholder='Nhập mô tả'
                        value={categoryData.description}
                        onChange={handleChange}
                    />

                    <div className='flex-row-center'>
                        <div className='login-button' style={{ width: 200 }}>
                            <Button
                                type='submit'
                                text='Thêm loại sản phẩm'
                            />
                        </div>
                    </div>

                </form>
            </div>

        </Modal>
    );
}

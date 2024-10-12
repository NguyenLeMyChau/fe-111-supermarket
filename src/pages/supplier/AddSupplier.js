import React, { useState } from 'react';
import Modal from '../../components/modal/Modal';
import Input from '../../components/input/Input';
import Button from '../../components/button/Button';
import { useAccessToken, useAxiosJWT } from '../../utils/axiosInstance';
import { addSupplier } from '../../services/supplierRequest';

export default function AddSuplier({ isOpen, onClose }) {
    const axiosJWT = useAxiosJWT();
    const accessToken = useAccessToken();

    const [supplierData, setSupplierData] = useState({ name: '', description: '', phone: '', email: '', address: '' });
    const [errors, setErrors] = useState({});

    const handleChange = (e) => {
        const { name, value } = e.target;
        setSupplierData({
            ...supplierData,
            [name]: value,
        });
        setErrors({
            ...errors,
            [name]: '',
        });
    };

    


    const handleAddSupplier = async (e) => {
        e.preventDefault();

        try {
            const response = await addSupplier(supplierData, accessToken, axiosJWT);
            if (response) {
                setSupplierData({ name: '', description: '', phone: '', email: '', address: '' });
            }
        } catch (error) {
            console.error('Failed to add category:', error);
            alert('Có lỗi xảy ra khi thêm nhà cung cấp.');
        }
    };

    return (
        <Modal
            title="Thêm nhà cung cấp"
            isOpen={isOpen}
            onClose={onClose}
            width={'30%'}
        >
            <div className='flex-column-center'>

                <form onSubmit={handleAddSupplier}>

                    <Input
                        label='Nhà cung cấp'
                        placeholder='Nhập tên nhà cung cấp'
                        name='name'
                        value={supplierData.name}
                        onChange={handleChange}
                    />
                    <Input
                        label='Mô tả'
                        name='description'
                        placeholder='Nhập mô tả'
                        value={supplierData.description}
                        onChange={handleChange}
                    />

                    <Input
                        type='phone'
                        label='Số điện thoại'
                        name='phone'
                        placeholder='Nhập số điện thoại'
                        value={supplierData.phone}
                        onChange={handleChange}
                    />

                    <Input
                        type='email'
                        label='Email'
                        name='email'
                        placeholder='Nhập email'
                        value={supplierData.email}
                        onChange={handleChange}
                    />

                    <Input
                        label='Địa chỉ'
                        name='address'
                        placeholder='Nhập địa chỉ'
                        value={supplierData.address}
                        onChange={handleChange}
                    />



                    <div className='flex-row-center'>
                        <div className='login-button' style={{ width: 200 }}>
                            <Button
                                type='submit'
                                text='Thêm nhà cung cấp'
                            />
                        </div>
                    </div>

                </form>
            </div>

        </Modal>
    );
}

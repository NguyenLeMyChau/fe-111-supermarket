import React, { useState } from 'react';
import Modal from '../../components/modal/Modal';
import Input from '../../components/input/Input';
import Button from '../../components/button/Button';
import { useAccessToken, useAxiosJWT } from '../../utils/axiosInstance';
import { addSupplier } from '../../services/supplierRequest';
import { validateSupplierData } from '../../utils/validation';
import { toast } from 'react-toastify';

export default function AddSuplier({ isOpen, onClose }) {
    const axiosJWT = useAxiosJWT();
    const accessToken = useAccessToken();

    const [supplierData, setSupplierData] = useState(
        {
            name: '',
            description: '',
            phone: '',
            email: '',
            address: {
                street: '',
                ward: '',
                district: '',
                city: '',
            },
        }
    );
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

    const handleAddressChange = (e) => {
        const { name, value } = e.target;
        setSupplierData((prevData) => ({
            ...prevData,
            address: {
                ...prevData.address,
                [name]: value,
            },
        }));
    };

    const handleAddSupplier = async (e) => {
        e.preventDefault();
        const newErrors = validateSupplierData(supplierData);
        if (Object.keys(newErrors).length > 0) {
            toast.warning('Vui lòng kiểm tra lại thông tin.');
            setErrors(newErrors);
            return;
        }
        try {
            const response = await addSupplier(supplierData, accessToken, axiosJWT);
            if (response) {
                setSupplierData({
                    name: '',
                    description: '',
                    phone: '',
                    email: '',
                    address: { street: '', ward: '', district: '', city: '' },
                });
                setErrors({});
            }
        } catch (error) {
            console.error('Failed to add category:', error);
            toast.error('Có lỗi xảy ra khi thêm nhà cung cấp.');
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
                        error={errors.name}
                    />
                    <Input
                        label='Mô tả'
                        name='description'
                        placeholder='Nhập mô tả'
                        value={supplierData.description}
                        onChange={handleChange}
                        error={errors.description}
                    />

                    <Input
                        type='phone'
                        label='Số điện thoại'
                        name='phone'
                        placeholder='Nhập số điện thoại'
                        value={supplierData.phone}
                        onChange={handleChange}
                        error={errors.phone}
                    />

                    <Input
                        type='email'
                        label='Email'
                        name='email'
                        placeholder='Nhập email'
                        value={supplierData.email}
                        onChange={handleChange}
                        error={errors.email}
                    />

                    <Input
                        label="Số nhà và tên đường"
                        placeholder="Nhập số nhà và tên đường"
                        name="street"
                        value={supplierData.address.street}
                        onChange={handleAddressChange}
                        error={errors.address?.street}
                    />
                    <Input
                        label="Phường/Xã"
                        placeholder="Nhập phường/xã"
                        name="ward"
                        value={supplierData.address.ward}
                        onChange={handleAddressChange}
                        error={errors.address?.ward}
                    />
                    <Input
                        label="Quận/Huyện"
                        placeholder="Nhập quận/huyện"
                        name="district"
                        value={supplierData.address.district}
                        onChange={handleAddressChange}
                        error={errors.address?.district}
                    />
                    <Input
                        label="Tỉnh/Thành phố"
                        placeholder="Nhập tỉnh/thành phố"
                        name="city"
                        value={supplierData.address.city}
                        onChange={handleAddressChange}
                        error={errors.address?.city}
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

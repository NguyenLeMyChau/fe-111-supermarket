import React, { useState } from 'react';
import Button from '../../components/button/Button';
import Input from '../../components/input/Input';
import { useAccessToken, useAxiosJWT } from '../../utils/axiosInstance';
import { updateEmployee } from '../../services/employeeRequest';
import { useNavigate } from 'react-router';
import ClipLoader from 'react-spinners/ClipLoader';

const UpdateEmployee = ({ employee }) => {
    const accessToken = useAccessToken();
    const axiosJWT = useAxiosJWT();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);

    const [formData, setFormData] = useState({
        name: employee.name,
        phone: employee.phone,
        email: employee.email,
        gender: employee.gender,
        address: {
            street: employee.address?.street || '',
            ward: employee.address?.ward || '',
            district: employee.address?.district || '',
            city: employee.address?.city || '',
        },
        active: employee.active,
        account_id: employee.account_id,
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

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        await updateEmployee(employee._id, formData, accessToken, axiosJWT);
        navigate('/admin/employee');
        setLoading(false);
    };

    return (
        <div className='flex-column-center'>
            <form onSubmit={handleSubmit}>
                <Input label='Họ và tên' placeholder='Nhập họ và tên' name='name' value={formData.name} onChange={handleChange} disabled={true} />
                <Input type='phone' label='Số điện thoại' name='phone' placeholder='Nhập số điện thoại' value={formData.phone} onChange={handleChange} />
                <Input type='email' label='Email' name='email' placeholder='Nhập email' value={formData.email} onChange={handleChange} />

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

                <Input label='Số nhà, tên đường' placeholder='Nhập số nhà và tên đường' name='street' value={formData.address.street} onChange={handleAddressChange} />
                <Input label='Phường/Xã' placeholder='Nhập phường/xã' name='ward' value={formData.address.ward} onChange={handleAddressChange} />
                <Input label='Quận/Huyện' placeholder='Nhập quận/huyện' name='district' value={formData.address.district} onChange={handleAddressChange} />
                <Input label='Tỉnh/Thành phố' placeholder='Nhập tỉnh/thành phố' name='city' value={formData.address.city} onChange={handleAddressChange} />

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
                    {loading ? (
                        <ClipLoader size={30} color="#2392D0" loading={loading} />
                    ) : (
                        <div className='login-button' style={{ width: 200 }}>
                            <Button type="submit" text="Cập nhật" />
                        </div>
                    )}
                </div>
            </form>
        </div>
    );
};

export default UpdateEmployee;

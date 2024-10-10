import React, { useState } from 'react';
import './Promotion.scss';
import Modal from '../../components/modal/Modal';
import Input from '../../components/input/Input';
import Button from '../../components/button/Button';
import { addPromotionHeader } from '../../services/promotionRequest'; // API call to add promotion header
import { useAccessToken, useAxiosJWT } from '../../utils/axiosInstance';
import { validatePromotionHeaderData } from '../../utils/validation'; // Validation function for promotion header data

export default function AddPromotionHeader({ isOpen, onClose }) {
    const axiosJWT = useAxiosJWT();
    const accessToken = useAccessToken();

    const [errors, setErrors] = useState({});
    const [promotionData, setPromotionData] = useState({
        description: '',
        startDate: '',
        endDate: ''
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setPromotionData((prevData) => ({ ...prevData, [name]: value }));
    };

    const handleAddPromotionHeader = async (e) => {
        e.preventDefault();

        // Kiểm tra dữ liệu
        const validationErrors = validatePromotionHeaderData(promotionData);
        if (Object.keys(validationErrors).length > 0) {
            setErrors(validationErrors);
            alert(Error);
            return;
        }

        // Gọi API để thêm promotion header
        try {
            const response = await addPromotionHeader(promotionData, accessToken, axiosJWT);
            if (response) {
                console.log('Promotion header added:', response);
                // Xóa dữ liệu sau khi thêm thành công
                setPromotionData({ description: '', startDate: '', endDate: '' });
                setErrors({});
                alert('Đã thêm chương trình khuyến mãi thành công');
            }
        } catch (error) {
            console.error('Failed to add promotion header:', error);
            alert('Có lỗi xảy ra khi thêm chương trình khuyến mãi.');
        }
    };

    return (
        <Modal
            title="Thêm chương trình khuyến mãi"
            isOpen={isOpen}
            onClose={onClose}
            width={'30%'}
        >
            <div className='flex-column-center'>
                <form onSubmit={handleAddPromotionHeader}>
                    <Input
                        label='Mô tả chương trình'
                        placeholder='Nhập mô tả'
                        name='description'
                        value={promotionData.description}
                        onChange={handleChange}
                        error={errors.description}
                    />

                    <Input
                        type='date'
                        label='Ngày bắt đầu'
                        name='startDate'
                        value={promotionData.startDate}
                        onChange={handleChange}
                        error={errors.startDate}
                    />

                    <Input
                        type='date'
                        label='Ngày kết thúc'
                        name='endDate'
                        value={promotionData.endDate}
                        onChange={handleChange}
                        error={errors.endDate}
                    />

                    <div className='flex-row-center'>
                        <div className='login-button' style={{ width: 200 }}>
                            <Button
                                type='submit'
                                text='Thêm chương trình'
                            />
                        </div>
                    </div>
                </form>
            </div>
        </Modal>
    );
}

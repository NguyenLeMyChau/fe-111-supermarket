import React, { useState } from 'react';
import './Promotion.scss'; 
import Modal from '../../components/modal/Modal';
import Input from '../../components/input/Input';
import Button from '../../components/button/Button';
import Select from 'react-select'; // Import React Select
import { addPromotionLine } from '../../services/promotionRequest';
import { useAccessToken, useAxiosJWT } from '../../utils/axiosInstance';
import { validatePromotionLineData } from '../../utils/validation';

export default function AddPromotionLine({ isOpen, onClose, promotionHeader }) {
    const axiosJWT = useAxiosJWT();
    const accessToken = useAccessToken();

    const [errors, setErrors] = useState({});
    const [promotionLineData, setPromotionLineData] = useState({
        description: '',
        startDate: '',
        endDate: '',
        type: { value: 'percentage', label: 'Phần trăm' }, // Mặc định là percentage
        status: { value: 'active', label: 'Active' }, // Mặc định là active
        promotionHeaderId: promotionHeader.id
    });

    const handleChange = (selectedOption, action) => {
        const { name } = action;
        setPromotionLineData((prevData) => ({ ...prevData, [name]: selectedOption }));
    };

    const handleAddPromotionLine = async (e) => {
        e.preventDefault();

        const validationErrors = validatePromotionLineData(promotionLineData);
        if (Object.keys(validationErrors).length > 0) {
            setErrors(validationErrors);
            return;
        }

        try {
            const response = await addPromotionLine(promotionLineData, accessToken, axiosJWT);
            if (response) {
                console.log('Promotion line added:', response);
                setPromotionLineData({
                    description: '',
                    startDate: '',
                    endDate: '',
                    type: { value: 'percentage', label: 'Phần trăm' },
                    status: { value: 'active', label: 'Active' },
                    promotionHeaderId: promotionHeader.id
                });
                setErrors({});
                alert('Đã thêm dòng khuyến mãi thành công');
            }
        } catch (error) {
            console.error('Failed to add promotion line:', error);
            alert('Có lỗi xảy ra khi thêm dòng khuyến mãi.');
        }
    };

    const typeOptions = [
        { value: 'percentage', label: 'Phần trăm' },
        { value: 'amount', label: 'Số tiền' },
        { value: 'quantity', label: 'Số lượng' }
    ];

    const statusOptions = [
        { value: 'active', label: 'Active' },
        { value: 'inactive', label: 'Inactive' }
    ];

    return (
        <Modal
            title={`${promotionHeader.description}`}
            isOpen={isOpen}
            onClose={onClose}
            width={'30%'}
           
        >
            <div className='flex-column-center' >
                <form onSubmit={handleAddPromotionLine} >
                    <Input
                        label='Mô tả dòng khuyến mãi'
                        placeholder='Nhập mô tả'
                        name='description'
                        value={promotionLineData.description}
                        onChange={(e) => setPromotionLineData({ ...promotionLineData, description: e.target.value })}
                        error={errors.description}
                    />

                    <Input
                        type='date'
                        label='Ngày bắt đầu'
                        name='startDate'
                        value={promotionLineData.startDate}
                        onChange={(e) => setPromotionLineData({ ...promotionLineData, startDate: e.target.value })}
                        error={errors.startDate}
                    />

                    <Input
                        type='date'
                        label='Ngày kết thúc'
                        name='endDate'
                        value={promotionLineData.endDate}
                        onChange={(e) => setPromotionLineData({ ...promotionLineData, endDate: e.target.value })}
                        error={errors.endDate}
                    />

                    <label htmlFor='type'>Loại khuyến mãi:</label>
                    <Select
                        name='type'
                        options={typeOptions}
                        value={promotionLineData.type}
                        onChange={handleChange}
                        classNamePrefix="select"
                    />

                    <label htmlFor='status'>Trạng thái:</label>
                    <Select
                        name='status'
                        options={statusOptions}
                        value={promotionLineData.status}
                        onChange={handleChange}
                        classNamePrefix="select"
                        
                    />

                    <div className='flex-row-center' style={{paddingTop:100}}>
                        <div className='login-button' style={{ width: 200 }}>
                            <Button
                                type='submit'
                                text='Thêm dòng khuyến mãi'
                            />
                        </div>
                    </div>
                </form>
            </div>
        </Modal>
    );
}

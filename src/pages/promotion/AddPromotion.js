import React, { useState, useEffect } from 'react';
import './Promotion.scss';
import Modal from '../../components/modal/Modal';
import Input from '../../components/input/Input';
import Button from '../../components/button/Button';
import { addPromotionHeader } from '../../services/promotionRequest'; // API call to add promotion header
import { useAccessToken, useAxiosJWT } from '../../utils/axiosInstance';
import { validatePromotionHeaderData } from '../../utils/validation'; // Validation function for promotion header data
import { format } from 'date-fns';
import { useDispatch } from 'react-redux';
import ClipLoader from 'react-spinners/ClipLoader';

export default function AddPromotionHeader({ isOpen, onClose }) {
    const axiosJWT = useAxiosJWT();
    const accessToken = useAccessToken();
    const dispatch = useDispatch();

    const [loading, setLoading] = useState(false); 
    const [errors, setErrors] = useState({});
    const [promotionData, setPromotionData] = useState({
        description: '',
        startDate: format(new Date(), 'yyyy-MM-dd'), // Default to today
        endDate: '',
        isActive: false,
    });

    // Update the end date min whenever the start date changes
    useEffect(() => {
        if (promotionData.startDate) {
            setPromotionData(prev => ({
                ...prev,
                endDate: prev.endDate && prev.endDate < prev.startDate ? prev.startDate : prev.endDate,
            }));
        }
    }, [promotionData.startDate]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setPromotionData((prevData) => ({ ...prevData, [name]: value }));
    };

    const handleAddPromotionHeader = async (e) => {
        e.preventDefault();
        setLoading(true)
        // Kiểm tra dữ liệu
        const validationErrors = validatePromotionHeaderData(promotionData);
        if (Object.keys(validationErrors).length > 0) {
            setErrors(validationErrors);
            setLoading(false)
            alert(errors);
            return;
        }

        // Gọi API để thêm promotion header
        try {
            const response = await addPromotionHeader(promotionData, accessToken,dispatch, axiosJWT);
            if (response) {
                console.log('Promotion header added:', response);
                // Xóa dữ liệu sau khi thêm thành công
                setPromotionData({ description: '', startDate: format(new Date(), 'yyyy-MM-dd'), endDate: '' });
                setErrors({});
                setLoading(false)
                alert('Đã thêm chương trình khuyến mãi thành công');
                
                onClose();
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
                        min={format(new Date(), 'yyyy-MM-dd')} // Minimum date is today
                    />

                    <Input
                        type='date'
                        label='Ngày kết thúc'
                        name='endDate'
                        value={promotionData.endDate}
                        onChange={handleChange}
                        error={errors.endDate}
                        min={promotionData.startDate} // Minimum end date is start date
                    />

                    <div className='flex-row-center'>
                    {loading ? (
          <ClipLoader size={30} color="#2392D0" loading={loading} />
        ) : (
            <div className='login-button' style={{ width: 200 }}>      
              <Button type='submit' text='Thêm' disabled={loading}/>
            </div>
          )}
                    </div>
                </form>
            </div>
        </Modal>
    );
}

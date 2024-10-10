import React, { useState } from 'react';
import './Promotion.scss';
import Modal from '../../components/modal/Modal';
import Input from '../../components/input/Input';
import Button from '../../components/button/Button';
import { addPromotionDetail } from '../../services/promotionRequest';
import { useAccessToken, useAxiosJWT } from '../../utils/axiosInstance';
import { validatePromotionDetailData } from '../../utils/validation';

export default function AddPromotionDetail({ isOpen, onClose, promotionLine }) {
    const axiosJWT = useAxiosJWT();
    const accessToken = useAccessToken();

    const [errors, setErrors] = useState({});
    const [promotionDetailData, setPromotionDetailData] = useState({
        product_id: '',
        unit_id: '',
        quantity: '',
        product_donate: '',
        quantity_donate: '',
        amount_sales: '',
        amount_donate: '',
        percent: '',
        amount_limit: '',
        promotionLine_id:promotionLine._id
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setPromotionDetailData((prevData) => ({ ...prevData, [name]: value }));
    };

    const handleAddPromotionDetail = async (e) => {
        e.preventDefault();

        // Kiểm tra dữ liệu
        const validationErrors = validatePromotionDetailData(promotionDetailData);
        if (Object.keys(validationErrors).length > 0) {
            setErrors(validationErrors);
            return;
        }

        // Gọi API để thêm promotion detail
        try {
            
            const response = await addPromotionDetail({ ...promotionDetailData  }, accessToken, axiosJWT);
            if (response) {
                console.log('Promotion detail added:', response);
                // Xóa dữ liệu sau khi thêm thành công
                setPromotionDetailData({
                    product_id: '',
                    unit_id: '',
                    quantity: '',
                    product_donate: '',
                    quantity_donate: '',
                    amount_sales: '',
                    amount_donate: '',
                    percent: '',
                    amount_limit: ''
                });
                setErrors({});
                alert('Đã thêm chi tiết khuyến mãi thành công');
                onClose(); // Đóng modal
            }
        } catch (error) {
            console.error('Failed to add promotion detail:', error);
            alert('Có lỗi xảy ra khi thêm chi tiết khuyến mãi.');
        }
    };

    return (
        <Modal
            title="Thêm Chi Tiết Khuyến Mãi"
            isOpen={isOpen}
            onClose={onClose}
            width={'30%'}
        >
            <div className='flex-column-center'>
                <form onSubmit={handleAddPromotionDetail}>
                    {promotionLine.type === 'percentage' && (
                        <>
                            <Input
                                type='number'
                                label='Số tiền bán'
                                name='amount_sales'
                                value={promotionDetailData.amount_sales}
                                onChange={handleChange}
                                error={errors.amount_sales}
                            />
                            <Input
                                type='number'
                                label='Phần trăm'
                                name='percent'
                                value={promotionDetailData.percent}
                                onChange={handleChange}
                                error={errors.percent}
                            />
                            <Input
                                type='number'
                                label='Giới hạn số tiền'
                                name='amount_limit'
                                value={promotionDetailData.amount_limit}
                                onChange={handleChange}
                                error={errors.amount_limit}
                            />
                        </>
                    )}

                    {promotionLine.type === 'amount' && (
                        <Input
                            type='number'
                            label='Số tiền tặng kèm'
                            name='amount_donate'
                            value={promotionDetailData.amount_donate}
                            onChange={handleChange}
                            error={errors.amount_donate}
                        />
                    )}

                    {promotionLine.type === 'product' && (
                        <>
                            <Input
                                label='Product ID'
                                placeholder='Nhập ID sản phẩm'
                                name='product_id'
                                value={promotionDetailData.product_id}
                                onChange={handleChange}
                                error={errors.product_id}
                            />
                            <Input
                                label='Unit ID'
                                placeholder='Nhập ID đơn vị'
                                name='unit_id'
                                value={promotionDetailData.unit_id}
                                onChange={handleChange}
                                error={errors.unit_id}
                            />
                            <Input
                                type='number'
                                label='Số lượng'
                                name='quantity'
                                value={promotionDetailData.quantity}
                                onChange={handleChange}
                                error={errors.quantity}
                            />
                            <Input
                                label='Sản phẩm tặng kèm'
                                placeholder='Nhập ID sản phẩm tặng kèm'
                                name='product_donate'
                                value={promotionDetailData.product_donate}
                                onChange={handleChange}
                                error={errors.product_donate}
                            />
                            <Input
                                type='number'
                                label='Số lượng tặng kèm'
                                name='quantity_donate'
                                value={promotionDetailData.quantity_donate}
                                onChange={handleChange}
                                error={errors.quantity_donate}
                            />
                        </>
                    )}

                    <div className='flex-row-center'>
                        <div className='login-button' style={{ width: 200 }}>
                            <Button
                                type='submit'
                                text='Thêm Chi Tiết'
                            />
                        </div>
                    </div>
                </form>
            </div>
        </Modal>
    );
}

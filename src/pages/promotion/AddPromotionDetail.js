import React, { useEffect, useState } from 'react';
import './Promotion.scss';
import Modal from '../../components/modal/Modal';
import Input from '../../components/input/Input';
import Button from '../../components/button/Button';
import { addPromotionDetail } from '../../services/promotionRequest';
import { useAccessToken, useAxiosJWT } from '../../utils/axiosInstance';
import { validatePromotionDetailData } from '../../utils/validation';

import Dropdownpicker from '../../components/dropdownpicker/dropdownpicker';
import { getAllProducts } from '../../services/productRequest';
import { useDispatch } from 'react-redux';

export default function AddPromotionDetail({ isOpen, onClose, promotionLine }) {
    const axiosJWT = useAxiosJWT();
    const accessToken = useAccessToken();
    const dispatch = useDispatch();
    const [errors, setErrors] = useState({});
    const [products, setProducts] = useState([]);
    const [promotionDetailData, setPromotionDetailData] = useState({
        product_id: '',
        quantity: '',
        product_donate: '',
        quantity_donate: '',
        amount_sales: '',
        amount_donate: '',
        percent: '',
        amount_limit: '',
        promotionLine_id: promotionLine._id
    });

    const fetchProducts = async () => {
        try {
            const productsData = await getAllProducts(accessToken, axiosJWT,dispatch);
            setProducts(productsData);
        } catch (error) {
            console.error('Failed to fetch products:', error);
        }
    };

    useEffect(() => {
        if ((promotionLine.type === 'quantity' ||promotionLine.type === 'amount') && products.length===0) {
            fetchProducts();
        }
    }, [promotionLine.type, accessToken, axiosJWT, dispatch]);
    console.log(products);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setPromotionDetailData((prevData) => ({ ...prevData, [name]: value }));
    };
    const handleDropdownChange = (name, value) => {
        setPromotionDetailData((prevData) => ({ ...prevData, [name]: value }));
    };
    const handleAddPromotionDetail = async (e) => {
        e.preventDefault();

        const validationErrors = validatePromotionDetailData(promotionDetailData);
        if (Object.keys(validationErrors).length > 0) {
            setErrors(validationErrors);
            return;
        }

        try {
            const response = await addPromotionDetail({ ...promotionDetailData }, accessToken, axiosJWT);
            if (response) {
                console.log('Promotion detail added:', response);
                setPromotionDetailData({
                    product_id: '',
                    quantity: '',
                    product_donate: '',
                    quantity_donate: '',
                    amount_sales: '',
                    amount_donate: '',
                    percent: '',
                    amount_limit: '',
                    voucher:'',
                    promotionLine_id: promotionLine._id
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
            <div className='add-promotion-detail-modal'>
                <form className='promotion-detail-form' onSubmit={handleAddPromotionDetail}>
                    {promotionLine.type === 'percentage' && (
                        <>
                        <Input
                                className='promotion-input'
                                type='text'
                                label='Mã voucher'
                                name='voucher'
                                value={promotionDetailData.voucher}
                                onChange={handleChange}
                                error={errors.voucher}
                            />
                            <Input
                                className='promotion-input'
                                type='number'
                                label='Số tiền bán'
                                name='amount_sales'
                                value={promotionDetailData.amount_sales}
                                onChange={handleChange}
                                error={errors.amount_sales}
                            />
                            <Input
                                className='promotion-input'
                                type='number'
                                label='Phần trăm'
                                name='percent'
                                value={promotionDetailData.percent}
                                onChange={handleChange}
                                error={errors.percent}
                            />
                            <Input
                                className='promotion-input'
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
                        <>
                        <Dropdownpicker
                        className='promotion-dropdown'
                        label='Sản phẩm'
                        options={products.map((product) => ({
                            value: product._id,
                            label: product.name,
                        }))}
                        value={promotionDetailData.product_id}
                        onChange={(value) => handleDropdownChange('product_id', value)}
                        error={errors.product_id}
                    />
                      <Input
                                className='promotion-input'
                                type='number'
                                label='Số lượng'
                                name='quantity'
                                value={promotionDetailData.quantity}
                                onChange={handleChange}
                                error={errors.quantity}
                            />
                        <Input
                            className='promotion-input'
                            type='number'
                            label='Số tiền tặng kèm'
                            name='amount_donate'
                            value={promotionDetailData.amount_donate}
                            onChange={handleChange}
                            error={errors.amount_donate}
                        />
                        </>
                    )}

                    {promotionLine.type === 'quantity' && (
                        
                        <>
                            <Dropdownpicker
                                className='promotion-dropdown'
                                label='Sản phẩm'
                                options={products.map((product) => ({
                                    value: product._id,
                                    label: product.name,
                                }))}
                                value={promotionDetailData.product_id}
                                onChange={(value) => handleDropdownChange('product_id', value)}
                                error={errors.product_id}
                            />
                            <Input
                                className='promotion-input'
                                type='number'
                                label='Số lượng'
                                name='quantity'
                                value={promotionDetailData.quantity}
                                onChange={handleChange}
                                error={errors.quantity}
                            />
                            <Dropdownpicker
                                className='promotion-dropdown'
                                label='Sản phẩm tặng kèm'
                                options={products.map((product) => ({
                                    value: product._id,
                                    label: product.name,
                                }))}
                                value={promotionDetailData.product_donate}
                                onChange={(value) => handleDropdownChange('product_donate', value)}
                                error={errors.product_donate}
                            />
                            <Input
                                className='promotion-input'
                                type='number'
                                label='Số lượng tặng kèm'
                                name='quantity_donate'
                                value={promotionDetailData.quantity_donate}
                                onChange={handleChange}
                                error={errors.quantity_donate}
                            />
                        </>
                    )}

                    <div className='flex-row-center' >
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

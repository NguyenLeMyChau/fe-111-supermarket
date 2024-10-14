import React, { useState, useEffect } from 'react';
import Button from '../../components/button/Button';
import Input from '../../components/input/Input';
import { updatePromotionDetail } from '../../services/promotionRequest';
import { useAccessToken, useAxiosJWT } from '../../utils/axiosInstance';
import { validatePromotionDetailData } from '../../utils/validation';
import Dropdownpicker from '../../components/dropdownpicker/dropdownpicker';
import { getAllProducts } from '../../services/productRequest';
import { useDispatch } from 'react-redux';

const UpdatePromotionDetail = ({ promotionDetail, onClose, promotionLine }) => {
    const axiosJWT = useAxiosJWT();
    const accessToken = useAccessToken();
    const dispatch = useDispatch();
    const [errors, setErrors] = useState({});
    const [isLoading, setIsLoading] = useState(false);
    const [products, setProducts] = useState([]);

    const [formData, setFormData] = useState({
        product_id: promotionDetail.product_id || '',
        quantity: promotionDetail.quantity || '',
        product_donate: promotionDetail.product_donate?._id || '',
        quantity_donate: promotionDetail.quantity_donate || '',
        amount_sales: promotionDetail.amount_sales || '',
        amount_donate: promotionDetail.amount_donate || '',
        percent: promotionDetail.percent || '',
        amount_limit: promotionDetail.amount_limit || '',
        voucher: promotionDetail.voucher || '',
        promotionLine_id: promotionDetail.promotionLine_id,
    });

    const fetchProducts = async () => {
        try {
            const productsData = await getAllProducts(accessToken, axiosJWT, dispatch);
            setProducts(productsData);
        } catch (error) {
            console.error('Failed to fetch products:', error);
        }
    };

    useEffect(() => {
        if ((promotionLine.type === 'quantity' || promotionLine.type === 'amount') && products.length === 0) {
            fetchProducts();
        }
    }, [promotionLine.type, accessToken, axiosJWT, dispatch]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value,
        });
    };

    const handleDropdownChange = (name, value) => {
        setFormData((prevData) => ({ ...prevData, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const validationErrors = validatePromotionDetailData(formData);
        if (Object.keys(validationErrors).length > 0) {
            setErrors(validationErrors);
            alert(errors)
            return;
        }
        try {
            setIsLoading(true);
            await updatePromotionDetail(promotionDetail._id, formData, accessToken, axiosJWT);
            alert('Cập nhật chi tiết khuyến mãi thành công');
            onClose();
            window.location.reload()
        } catch (error) {
            alert('Cập nhật chi tiết khuyến mãi thất bại: ' + error.message);
        } finally {
            setIsLoading(false);
        }
    };

    // Kiểm tra xem promotionLine.isActive có phải là true không
    const isActive = promotionLine.isActive;

    return (
        <div className="flex-column-center">
            {isActive ? (
               <div className="promotion-message">
               <p>Chi tiết khuyến mãi không thể được sửa đổi vì chương trình đang hoạt động.</p>
               <Button text="Đóng" onClick={onClose} />
             </div>
            ) : (
                <form onSubmit={handleSubmit}>
                    {promotionLine.type === 'percentage' && (
                        <>
                            <Input
                                className='promotion-input'
                                type='text'
                                label='Mã voucher'
                                name='voucher'
                                value={formData.voucher}
                                onChange={handleChange}
                                error={errors.voucher}
                            />
                            <Input
                                label="Số tiền bán"
                                name="amount_sales"
                                value={formData.amount_sales}
                                type="number"
                                onChange={handleChange}
                                error={errors.amount_sales}
                            />
                            <Input
                                label="Phần trăm"
                                name="percent"
                                value={formData.percent}
                                type="number"
                                onChange={handleChange}
                                error={errors.percent}
                            />
                            <Input
                                label="Giới hạn số tiền"
                                name="amount_limit"
                                value={formData.amount_limit}
                                type="number"
                                onChange={handleChange}
                                error={errors.amount_limit}
                            />
                        </>
                    )}

                    {promotionLine.type === 'amount' && (
                        <>
                            <Dropdownpicker
                                label="Sản phẩm"
                                options={products.map((product) => ({
                                    value: product._id,
                                    label: product.name,
                                }))}
                                value={formData.product_id}
                                onChange={(value) => handleDropdownChange('product_id', value)}
                                error={errors.product_id}
                            />
                            <Input
                                label="Số lượng"
                                name="quantity"
                                value={formData.quantity}
                                type="number"
                                onChange={handleChange}
                                error={errors.quantity}
                            />
                            <Input
                                label="Số tiền tặng kèm"
                                name="amount_donate"
                                value={formData.amount_donate}
                                type="number"
                                onChange={handleChange}
                                error={errors.amount_donate}
                            />
                        </>
                    )}

                    {promotionLine.type === 'quantity' && (
                        <>
                            <Dropdownpicker
                                label="Sản phẩm"
                                options={products.map((product) => ({
                                    value: product._id,
                                    label: product.name,
                                }))}
                                value={formData.product_id}
                                onChange={(value) => handleDropdownChange('product_id', value)}
                                error={errors.product_id}
                            />
                            <Input
                                label="Số lượng"
                                name="quantity"
                                value={formData.quantity}
                                type="number"
                                onChange={handleChange}
                                error={errors.quantity}
                            />
                            <Dropdownpicker
                                label="Sản phẩm tặng kèm"
                                options={products.map((product) => ({
                                    value: product._id,
                                    label: product.name,
                                }))}
                                value={formData.product_donate}
                                onChange={(value) => handleDropdownChange('product_donate', value)}
                                error={errors.product_donate}
                            />
                            <Input
                                label="Số lượng tặng kèm"
                                name="quantity_donate"
                                value={formData.quantity_donate}
                                type="number"
                                onChange={handleChange}
                                error={errors.quantity_donate}
                            />
                        </>
                    )}

                    <div className="flex-row-center">
                        <div className="login-button" style={{ width: 200 }}>
                            <Button
                                type="submit"
                                text={isLoading ? 'Đang cập nhật...' : 'Cập nhật chi tiết khuyến mãi'}
                                disabled={isLoading}
                            />
                        </div>
                    </div>
                </form>
            )}
        </div>
    );
};

export default UpdatePromotionDetail;

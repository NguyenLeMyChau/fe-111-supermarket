import React, { useCallback, useEffect, useState } from 'react';
import Input from '../../components/input/Input';
import Button from '../../components/button/Button';
import { useAxiosJWT, useAccessToken } from '../../utils/axiosInstance';
import { validatePriceDetailData } from '../../utils/validation';
import { updateProductPriceDetail } from '../../services/priceRequest'; // Update this to your actual service path
import { useDispatch } from 'react-redux';
import { getAllProducts } from '../../services/productRequest';

export default function UpdatePriceDetail({ priceDetail,priceDetailid }) {
    const axiosJWT = useAxiosJWT();
    const accessToken = useAccessToken();
    const dispatch = useDispatch();
    const [products, setProducts] = useState([]);
    const [productPriceData, setProductPriceData] = useState({
        product_id: priceDetail.product_id || '',
        price: priceDetail.price || '',
        productPriceHeader_id: priceDetail.productPriceHeader_id || '',
    });

    const [errors, setErrors] = useState({});

    const fetchProducts = useCallback(async () => {
        try {
            const productsData = await getAllProducts(accessToken, axiosJWT, dispatch);
            setProducts(productsData);
        } catch (error) {
            console.error('Failed to fetch products:', error);
        }
    }, [accessToken, axiosJWT, dispatch]);

    useEffect(() => {
        fetchProducts();
    }, [fetchProducts]);

    useEffect(() => {
        // Set the product price data when the priceDetail prop changes
        if (priceDetail) {
            setProductPriceData({
                product_id: priceDetail.product_id,
                price: priceDetail.price,
                productPriceHeader_id: priceDetail.productPriceHeader_id,
            });
        }
    }, [priceDetail]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setProductPriceData((prevData) => ({ ...prevData, [name]: value }));
    };

    const handleUpdateProductPrice = async (e) => {
        e.preventDefault();

        const validationErrors = validatePriceDetailData(productPriceData);
        if (Object.keys(validationErrors).length > 0) {
            setErrors(validationErrors);
            alert(JSON.stringify(validationErrors)); // Displaying the validation errors properly
            return;
        }

        try {
            const updatedPrice = await updateProductPriceDetail(accessToken, axiosJWT, productPriceData,priceDetailid); // Use your updated service

            if (updatedPrice) {
                console.log('Product price updated:', updatedPrice.data);
                setProductPriceData({
                    product_id: '',
                    price: '',
                    productPriceHeader_id: priceDetail.productPriceHeader_id,
                });
                setErrors({});
                alert('Cập nhật chương trình giá thành công');
                window.location.reload()
            }
        } catch (error) {
            console.error('Failed to update product price:', error);
            alert('Lỗi khi cập nhật sản phẩm');
        }
    };

    return (
            <div className='flex-column-center'>
                <form onSubmit={handleUpdateProductPrice}>
                   
                      <Input
                        label='Sản phẩm'
                        placeholder='Nhập giá sản phẩm'
                        name='price'
                        value={
                            products.find(product => product._id === productPriceData.product_id)?.name || ''
                        }
                        onChange={handleChange}
                        error={errors.price}
                        type='text'
                        disabled='true'
                    />

                    <Input
                        label='Giá'
                        placeholder='Nhập giá sản phẩm'
                        name='price'
                        value={productPriceData.price}
                        onChange={handleChange}
                        error={errors.price}
                        type='number'
                    />

                    <div className='flex-row-center'>
                        <div className='login-button' style={{ width: 200 }}>
                            <Button type='submit' text='Cập nhật chương trình giá' />
                        </div>
                    </div>
                </form>
            </div>
    );
}

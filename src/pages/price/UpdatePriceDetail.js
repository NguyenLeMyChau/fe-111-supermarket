import React, { useCallback, useEffect, useState } from 'react';
import Input from '../../components/input/Input';
import Button from '../../components/button/Button';
import { useAxiosJWT, useAccessToken } from '../../utils/axiosInstance';
import { validatePriceDetailData } from '../../utils/validation';
import { updateProductPriceDetail } from '../../services/priceRequest'; // Update this to your actual service path
import { useDispatch, useSelector } from 'react-redux';
import { getAllProducts } from '../../services/productRequest';

export default function UpdatePriceDetail({ priceDetail,priceDetailid,onClose,updateProductPriceHeader ,updateProductPriceDe}) {
    const axiosJWT = useAxiosJWT();
    const accessToken = useAccessToken();
    const units = useSelector((state) => state.unit?.units) || [];
    const dispatch = useDispatch();
    const [products, setProducts] = useState([]);
    const [productPriceData, setProductPriceData] = useState({
        name:priceDetail.product.name||'',
        item_code: priceDetail.item_code || '',
        unit_id:priceDetail.unit_id._id,
        price: priceDetail.price || '',
        productPriceHeader_id: priceDetail.productPriceHeader_id || '',
    });
console.log(priceDetail,priceDetailid)
    const [errors, setErrors] = useState({});

    const fetchProducts = async () => {
        try {
          const productsData = await getAllProducts(
            accessToken,
            axiosJWT,
            dispatch
          );
      
          setProducts(productsData);
        } catch (error) {
          console.error("Failed to fetch products:", error);
        }
      };
    
      useEffect(() => {
          fetchProducts();
      }, []);

    useEffect(() => {
        // Set the product price data when the priceDetail prop changes
        if (priceDetail) {
            setProductPriceData({
                name:priceDetail.product.name,
                item_code: priceDetail.item_code ,
                unit_id:priceDetail.unit_id._id,
                price: priceDetail.price ,
                productPriceHeader_id: priceDetail.productPriceHeader_id ,
            });
        }
    }, [priceDetail]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setProductPriceData((prevData) => ({ ...prevData, [name]: value }));
    };

    const handleUpdateProductPrice = async (e) => {
        e.preventDefault();
        console.log(1)
        const validationErrors = validatePriceDetailData(productPriceData);
        if (Object.keys(validationErrors).length > 0) {
            setErrors(validationErrors);
            alert(JSON.stringify(validationErrors)); // Displaying the validation errors properly
            return;
        }
        console.log(1)
        try {
            const updatedPrice = await updateProductPriceDetail(accessToken, axiosJWT,dispatch, productPriceData,priceDetailid); // Use your updated service
            console.log(1)
            console.log(updatedPrice.data)
            if (updatedPrice) {
                console.log('Product price updated:', updatedPrice);
                setProductPriceData({
                    name:'',
                    item_code: '',
                    unit_id:'',
                    price: '',
                    productPriceHeader_id: priceDetail.productPriceHeader_id,
                });
                setErrors({});
                alert(updatedPrice.message);
                const updatedProductPriceHeader = updatedPrice.data.find(
                  (item) => item._id === productPriceData.productPriceHeader_id
                );
          
                if (updatedProductPriceHeader) {
                  const productDetail = updatedProductPriceHeader.productPrices || [];
                  console.log("Product Price Header:", updatedProductPriceHeader);
                  console.log("Product Detail:", productDetail);
                  updateProductPriceHeader(updatedProductPriceHeader)
                  updateProductPriceDe(productDetail)
                  onClose();
                }
            }
            console.log(2)
        } catch (error) {
            console.error('Failed to update product price:', error);
            alert(error);
        }
    };

    return (
            <div className='flex-column-center'>
                <form onSubmit={handleUpdateProductPrice}>
                <Input
                        label='Mã sản phẩm'
                        placeholder='Nhập mã sản phẩm'
                        name='price'
                        value={
                            productPriceData.item_code
                        }
                        onChange={handleChange}
                        error={errors.price}
                        type='text'
                        disabled='true'                    />
                      <Input
                        label='Sản phẩm'
                        placeholder='Nhập tên sản phẩm'
                        name='price'
                        value={
                            productPriceData.name
                        }
                        onChange={handleChange}
                        error={errors.price}
                        type='text'
                        disabled='true'
                    />
                    <Input
                        label='Đơn vị tính'
                        placeholder='Nhập đơn vị tính'
                        name='price'
                        value={
                            units.find((unit)=>unit._id===productPriceData.unit_id).description
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

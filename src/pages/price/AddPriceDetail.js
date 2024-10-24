import React, {  useEffect, useState } from 'react';
import Modal from '../../components/modal/Modal';
import Input from '../../components/input/Input';
import Button from '../../components/button/Button';
import { useAxiosJWT, useAccessToken } from '../../utils/axiosInstance';
import { validatePriceDetailData } from '../../utils/validation';
import { addProductPriceDetail, getProductNoPrice } from '../../services/priceRequest'; 
import Dropdownpicker from '../../components/dropdownpicker/dropdownpicker';

export default function AddProductPriceDetail({ isOpen, onClose,productPriceHeader }) {
  const axiosJWT = useAxiosJWT();
  const accessToken = useAccessToken();
  const [products, setProducts] = useState([]);
  const [productPriceData, setProductPriceData] = useState({
    product_id: '',
    price: '', 
    productPriceHeader_id:productPriceHeader._id
  });

  const [errors, setErrors] = useState({});
  const fetchProducts = async () => {
    try {
      const productPriceHeaderId = productPriceHeader?._id;
      const productsData = await getProductNoPrice(accessToken, axiosJWT, productPriceHeaderId);
      setProducts(productsData);
    } catch (error) {
      console.error('Failed to fetch products:', error);
    }
  };

  useEffect(() => {
    if (isOpen) {
      fetchProducts();
    }
  }, [isOpen]);
  const handleChange = (e) => {
    const { name, value } = e.target;
    setProductPriceData((prevData) => ({ ...prevData, [name]: value }));
  };
  const handleDropdownChange = (name, value) => {
    setProductPriceData((prevData) => ({ ...prevData, [name]: value }));
};
  const handleAddProductPrice = async (e) => {
    e.preventDefault();
    
    const validationErrors = validatePriceDetailData(productPriceData);
    if (Object.keys(validationErrors).length > 0) {
        setErrors(validationErrors);
        alert(JSON.stringify(validationErrors)); // Displaying the validation errors properly
        return;
    }
    
    try {
        const addedPrice = await addProductPriceDetail(accessToken, axiosJWT, productPriceData); // Use your updated service

        if (addedPrice) {
          console.log('Product price added:', addedPrice.data);
          setProductPriceData({ 
            product_id: '',
            price: '', 
            productPriceHeader_id:productPriceHeader._id
          });
          setErrors({});
          alert('Thêm chương trình giá thành công');
          onClose();
          window.location.reload()
        }
    } catch (error) {
      console.error('Failed to add product price:', error);
      alert('Lỗi khi thêm sản phẩm');
    }
  };

  return (
    <Modal title="Thêm giá sản phẩm" isOpen={isOpen} onClose={onClose} width={'30%'}>
      <div className='flex-column-center'>
        <form onSubmit={handleAddProductPrice}>
        
                 <Dropdownpicker
                        className='promotion-dropdown'
                        label='Sản phẩm'
                        options={products.map((product) => ({
                            value: product._id,
                            label: product.name,
                        }))}
                        value={productPriceData.product_id}
                        onChange={(value) => handleDropdownChange('product_id', value)}
                        error={errors.product_id}
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
              <Button type='submit' text='Thêm chương trình giá' />
            </div>
          </div>
        </form>
      </div>
    </Modal>
  );
}

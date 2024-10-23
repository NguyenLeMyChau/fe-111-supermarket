import React, { useState } from 'react';
import Modal from '../../components/modal/Modal';
import Input from '../../components/input/Input';
import Button from '../../components/button/Button';
import { useAxiosJWT, useAccessToken } from '../../utils/axiosInstance';
import { format } from 'date-fns';
import { validatePriceHeaderData } from '../../utils/validation';
import { addProductPrice } from '../../services/priceRequest';

export default function AddProductPrice({ isOpen, onClose }) {
  const axiosJWT = useAxiosJWT();
  const accessToken = useAccessToken();

  const [productPriceData, setProductPriceData] = useState({
    description: '',
    startDate: format(new Date(), 'yyyy-MM-dd'), // Default to today
    endDate: '',
    status: 'inactive',
  });

  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProductPriceData((prevData) => ({ ...prevData, [name]: value }));
  };

  const handleAddProductPrice = async (e) => {
    e.preventDefault();
    
    const validationErrors = validatePriceHeaderData(productPriceData);
    if (Object.keys(validationErrors).length > 0) {
        setErrors(validationErrors);
        alert(errors);
        return;
    }
    try {
        const addedPrice = await addProductPrice(accessToken, axiosJWT, productPriceData);

      if (addedPrice) {
        console.log('Product price added:', addedPrice.data);
        setProductPriceData({ description: '', startDate: format(new Date(), 'yyyy-MM-dd'), endDate: '', status: 'inactive' });
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
    <Modal title="Thêm chương trình giá" isOpen={isOpen} onClose={onClose} width={'30%'}>
      <div className='flex-column-center'>
        <form onSubmit={handleAddProductPrice}>
          <Input
            label='Description'
            placeholder='Nhập mô tả chương trình giá'
            name='description'
            value={productPriceData.description}
            onChange={handleChange}
            error={errors.description}
          />

          <Input
            type='date'
            label='Start Date'
            name='startDate'
            value={productPriceData.startDate}
            onChange={handleChange}
            error={errors.startDate}
            min={format(new Date(), 'yyyy-MM-dd')}
          />

          <Input
            type='date'
            label='End Date'
            name='endDate'
            value={productPriceData.endDate}
            onChange={handleChange}
            error={errors.endDate}
            min={productPriceData.startDate}
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

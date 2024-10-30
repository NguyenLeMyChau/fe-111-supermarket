import React, { useState } from 'react';
import Modal from '../../components/modal/Modal';
import Input from '../../components/input/Input';
import Button from '../../components/button/Button';
import { useAxiosJWT, useAccessToken } from '../../utils/axiosInstance';
import { format } from 'date-fns';
import { validatePriceHeaderData } from '../../utils/validation';
import { addProductPrice, copyProductPrice } from '../../services/priceRequest';
import { useDispatch } from 'react-redux';
import ClipLoader from 'react-spinners/ClipLoader';

export default function AddProductPrice({ isOpen, onClose ,productPriceHeader,title}) {
  const axiosJWT = useAxiosJWT();
  const accessToken = useAccessToken();
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false); 
console.log(productPriceHeader)
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
    setLoading(true)
    e.preventDefault();
    
    const validationErrors = validatePriceHeaderData(productPriceData);
    if (Object.keys(validationErrors).length > 0) {
        setErrors(validationErrors);
        console.log(validationErrors)
        alert(errors);
        setLoading(false)
        return;
    }
    try {
      let addedPrice=null
      if(productPriceHeader){
          addedPrice = await copyProductPrice(accessToken, axiosJWT,dispatch, productPriceData,productPriceHeader._id);
      }else {  addedPrice = await addProductPrice(accessToken, axiosJWT,dispatch, productPriceData);}
      if (addedPrice) {
        console.log('Product price added:', addedPrice.data);
        setProductPriceData({ description: '', startDate: format(new Date(), 'yyyy-MM-dd'), endDate: '', status: 'inactive' });
        setErrors({});
        alert('Thêm chương trình giá thành công');
        setLoading(false)
        onClose();
      }
    } catch (error) {
      console.error('Failed to add product price:', error);
      alert('Lỗi khi thêm sản phẩm');
      setLoading(false)
    }
  };

  return (
    <Modal title={title} isOpen={isOpen} onClose={onClose} width={'50%'}>
      <div className='flex-column-center'>
        <form onSubmit={handleAddProductPrice}>
          <Input
            label='Nhập mô tả'
            placeholder='Nhập mô tả chương trình giá'
            name='description'
            value={productPriceData.description}
            onChange={handleChange}
            error={errors.description}
          />

          <Input
            type='date'
            label='Ngày bắt đầu'
            name='startDate'
            value={productPriceData.startDate}
            onChange={handleChange}
            error={errors.startDate}
            min={format(new Date(), 'yyyy-MM-dd')}
          />

          <Input
            type='date'
            label='Ngày kết thúc'
            name='endDate'
            value={productPriceData.endDate}
            onChange={handleChange}
            error={errors.endDate}
            min={productPriceData.startDate}
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

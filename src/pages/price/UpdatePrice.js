import React, { useEffect, useState } from 'react';
import Input from '../../components/input/Input';
import Button from '../../components/button/Button';
import { useAxiosJWT, useAccessToken } from '../../utils/axiosInstance';
import { format } from 'date-fns';
import { validatePriceHeaderData } from '../../utils/validation';
import { updateProductPrice } from '../../services/priceRequest';
import { useDispatch } from 'react-redux';
import ClipLoader from 'react-spinners/ClipLoader';
import { toast } from 'react-toastify';

export default function EditProductPrice({ onClose, priceId, initialData }) {
  const axiosJWT = useAxiosJWT();
  const accessToken = useAccessToken();
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false); 

  const [productPriceData, setProductPriceData] = useState(initialData || {
    productPriceHeaderId:'',
    description: '',
    startDate: format(new Date(), 'dd-MM-yyyy'), 
    endDate: '',
    status: 'inactive',
  });

  useEffect(() => {
    if (initialData.startDate) {
        const formattedStartDate = new Date(initialData.startDate).toISOString().slice(0, 10);
        setProductPriceData(prev => ({ ...prev, startDate: formattedStartDate }));
    }
    if (initialData.endDate) {
        const formattedEndDate = new Date(initialData.endDate).toISOString().slice(0, 10);
        setProductPriceData(prev => ({ ...prev, endDate: formattedEndDate }));
    }
}, [initialData]);


  console.log(initialData)
  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProductPriceData((prevData) => ({ ...prevData, [name]: value }));
  };
  const handleCheckboxChange = (e) => {
    const { checked } = e.target;
  
    if (initialData.status === 'inactive') {
      setProductPriceData((prevData) => ({
        ...prevData,
        status: checked ? 'active' : 'inactive', // Update status based on checkbox
      }));
    } else {
      setProductPriceData((prevData) => ({
        ...prevData,
        status: checked ? 'active' : 'inactive', // Update status based on checkbox
      }));
    }
  };
  
  const handleUpdateProductPrice = async (e) => {
    e.preventDefault();
    setLoading(true)
    const validationErrors = validatePriceHeaderData(productPriceData);
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      toast.success(errors)
        setLoading(false)
      return;
    }

    try {
      const { updatedPrice, messages } = await updateProductPrice(accessToken, axiosJWT,dispatch, priceId, productPriceData);

      if (updatedPrice) {
        console.log('Product price updated:', updatedPrice);
        toast.success('Cập nhật chương trình giá thành công');
        setLoading(false)
        onClose()      
      }else {
        setLoading(false)
        toast.error(messages.join('\n'));}
    } catch (error) {
      console.error('Failed to update product price:', error);
      setLoading(false)
      toast.error('Lỗi khi cập nhật sản phẩm');
    }
  };

  return (
      <div className='flex-column-center'>
        <form onSubmit={handleUpdateProductPrice}>
        <Input
            label='Mã bảng giá'
           
            name='productPriceHeaderId'
            value={productPriceData.productPriceHeaderId}
            onChange={handleChange}
            disabled={true}
          />
          <Input
            label='Mô tả'
            placeholder='Nhập mô tả chương trình giá'
            name='description'
            value={productPriceData.description}
            onChange={handleChange}
            error={errors.description}
            disabled={initialData.status !== 'inactive'}
          />

          <Input
            type='date'
            label='Ngày bắt đầu'
            name='startDate'
            value={productPriceData.startDate}
            onChange={handleChange}
            error={errors.startDate}
            // min={initialData.status !== 'active' ? format(new Date(), 'yyyy-MM-dd') : null}
            disabled={initialData.status !== 'inactive'}
          />

          <Input
            type='date'
            label='Ngày kết thúc'
            name='endDate'
            value={productPriceData.endDate}
            onChange={handleChange}
            error={errors.endDate}
            min={productPriceData.endDate < format(new Date(), 'yyyy-MM-dd')
              ? productPriceData.endDate
              : format(new Date(), 'yyyy-MM-dd')}            
              max={productPriceData.endDate < format(new Date(), 'yyyy-MM-dd')
                ? productPriceData.endDate
                : null}  
            />
          <Input
                    label='Trạng thái'
                    name='isActive'
                    type='checkbox'
                    defaultChecked={productPriceData.status==='active'}
                    onChange={handleCheckboxChange}
          />
          <div className='flex-row-center'>
          {loading ? ( <ClipLoader size={30} color="#2392D0" loading={loading} />
        ) : (
            <div className='login-button' style={{ width: 200 }}>      
            <Button type='submit' text='Cập nhật' />
            </div>
          )}
           
          </div>
        </form>
      </div>
  );
}

import React, { useState, useEffect } from 'react';
import Button from '../../components/button/Button';
import Input from '../../components/input/Input';
import { updatePromotionHeader } from '../../services/promotionRequest';
import { useAccessToken, useAxiosJWT } from '../../utils/axiosInstance';
import { validatePromotionHeaderData } from '../../utils/validation';
import ClipLoader from 'react-spinners/ClipLoader';
import { useDispatch } from 'react-redux';
import { toast } from 'react-toastify';

const UpdatePromotionHeader = ({ promotionHeader, onClose }) => {
    const axiosJWT = useAxiosJWT();
    const accessToken = useAccessToken();
    const [errors, setErrors] = useState({});
    const dispatch = useDispatch();
    const [loading, setLoading] = useState(false); 
    const [formData, setFormData] = useState({
        description: promotionHeader.description || '',
        startDate: '',
        endDate: '',
        isActive: promotionHeader.isActive || false,
    });

    // Convert date values from promotionHeader to a suitable format
    useEffect(() => {
        if (promotionHeader.startDate) {
            const formattedStartDate = new Date(promotionHeader.startDate).toISOString().slice(0, 10);
            setFormData(prev => ({ ...prev, startDate: formattedStartDate }));
        }
        if (promotionHeader.endDate) {
            const formattedEndDate = new Date(promotionHeader.endDate).toISOString().slice(0, 10);
            setFormData(prev => ({ ...prev, endDate: formattedEndDate }));
        }
    }, [promotionHeader]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value,
        });
        console.log(formData);
    };

    const handleCheckboxChange = (e) => {
        setFormData({
            ...formData,
            isActive: e.target.checked,
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true)
        const validationErrors = validatePromotionHeaderData(formData);
        if (Object.keys(validationErrors).length > 0) {
            setErrors(validationErrors);
            toast.info(errors);
            setLoading(false)
            return;
        }
        try {
            await updatePromotionHeader(promotionHeader._id, formData, dispatch,accessToken, axiosJWT);
            toast.success('Cập nhật thành công khuyến mãi');
            setLoading(false)
            onClose();
        } catch (error) {
            toast.error('Cập nhật khuyến mãi thất bại: ' + error);
        }
    };

    // Get today's date in YYYY-MM-DD format for min validation
    const today = new Date().toISOString().slice(0, 10);

    return (
        <div className='flex-column-center'>
            <form onSubmit={handleSubmit}>
                <Input
                    label='Mô tả'
                    placeholder='Nhập mô tả'
                    name='description'
                    value={formData.description}
                    onChange={handleChange}
                />
                
                <Input
                    label='Ngày bắt đầu'
                    placeholder='Chọn ngày bắt đầu'
                    name='startDate'
                    value={formData.startDate}
                    type='date'
                    onChange={handleChange}
                    disabled={true} // Disable if promotion is active
                />
                
                <Input
                    label='Ngày kết thúc'
                    placeholder='Chọn ngày kết thúc'
                    name='endDate'
                    value={formData.endDate}
                    type='date'
                    onChange={handleChange}
                     min={formData.startDate} // Min is today or start date
                />
                
                {/* <Input
                    label='Trạng thái'
                    name='isActive'
                    type='checkbox'
                    defaultChecked={formData.isActive}
                    onChange={handleCheckboxChange}
                /> */}
                
                <div className='flex-row-center'>
                  
                    {loading ? (
          <ClipLoader size={30} color="#2392D0" loading={loading} />
        ) : (
            <div className='login-button' style={{ width: 200 }}>      
              <Button type='submit' text='Cập nhật' disabled={loading}/>
            </div>
          )}
                </div>
            </form>
        </div>
    );
};

export default UpdatePromotionHeader;

import React, { useState, useEffect } from 'react';
import Button from '../../components/button/Button';
import Input from '../../components/input/Input';
import { updatePromotionLine } from '../../services/promotionRequest';
import { useAccessToken, useAxiosJWT } from '../../utils/axiosInstance';
import { validatePromotionLineData } from '../../utils/validation';
import { useDispatch } from 'react-redux';

const UpdatePromotionLine = ({ promotionLine, onClose, promotionHeader }) => {
    const axiosJWT = useAxiosJWT();
    const accessToken = useAccessToken();
    const dispatch = useDispatch();
    const [errors, setErrors] = useState({});
    const [isLoading, setIsLoading] = useState(false);
    console.log(promotionLine,promotionHeader)
    const [formData, setFormData] = useState({
        description: promotionLine?.description || '',
        startDate: '',
        endDate: '',
        status: promotionLine.status || '',
        type: promotionLine.type || '',
        promotionHeader_id: promotionLine.promotionHeader_id,
    });

    useEffect(() => {
        if (promotionLine.startDate) {
            const formattedStartDate = new Date(promotionLine.startDate).toISOString().slice(0, 10);
            setFormData((prev) => ({ ...prev, startDate: formattedStartDate }));
        }
        if (promotionLine.endDate) {
            const formattedEndDate = new Date(promotionLine.endDate).toISOString().slice(0, 10);
            setFormData((prev) => ({ ...prev, endDate: formattedEndDate }));
        }
    }, [promotionLine]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value,
        });
    };

    const handleCheckboxChange = (e) => {
        const { checked } = e.target;
      
        if (promotionLine.status === 'inactive') {
          setFormData((prevData) => ({
            ...prevData,
            status: checked ? 'active' : 'inactive', // Update status based on checkbox
          }));
        } else {
            setFormData((prevData) => ({
            ...prevData,
            status: checked ? 'active' : 'pauseactive', // Update status based on checkbox
          }));
        }
      };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const validationErrors = validatePromotionLineData(formData);
        if (Object.keys(validationErrors).length > 0) {
            setErrors(validationErrors);
            alert(errors)
            return;
        }
        try {
            setIsLoading(true);
            const updateLine =  await updatePromotionLine(promotionLine._id,dispatch, formData, accessToken, axiosJWT);
            if(!updateLine)
            alert(updateLine.message);
        else {alert(updateLine.message);
            onClose();}
        } catch (error) {
            alert('Cập nhật dòng khuyến mãi thất bại');
        } 
    };

    const today = new Date().toISOString().slice(0, 10);

    return (
        <div className="flex-column-center">
            <form onSubmit={handleSubmit}>
                <Input
                    label="Mô tả"
                    placeholder="Nhập mô tả"
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                    error={errors.description}
                    disabled={promotionLine.status !== 'inactive'}
                />

                <Input
                    label="Ngày bắt đầu"
                    placeholder="Chọn ngày bắt đầu"
                    name="startDate"
                    value={formData.startDate}
                    type="date"
                    onChange={handleChange}
                    disabled={promotionLine.status !== 'inactive'}
                    min={formData.startDate}
                    max={formData.endDate}
                    error={errors.startDate}
                />

                <Input
                    label="Ngày kết thúc"
                    placeholder="Chọn ngày kết thúc"
                    name="endDate"
                    value={formData.endDate}
                    type="date"
                    onChange={handleChange}
                    min={today > formData.startDate ? today : formData.startDate}
                    max={formData.endDate}
                    error={errors.endDate}
                    disabled={promotionLine.status !== 'inactive'}
                />

                <Input
                label='Trạng thái'
                name='status'
                type='checkbox'
                defaultChecked={formData.status==='active'}
                onChange={handleCheckboxChange}
      />

                <div className="flex-row-center">
                    <div className="login-button" style={{ width: 200 }}>
                        <Button
                            type="submit"
                            text={isLoading ? 'Đang cập nhật...' : 'Cập nhật'}
                            disabled={isLoading}
                        />
                    </div>
                </div>
            </form>
        </div>
    );
};

export default UpdatePromotionLine;

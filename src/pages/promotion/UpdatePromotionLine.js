import React, { useState, useEffect } from 'react';
import Button from '../../components/button/Button';
import Input from '../../components/input/Input';
import { updatePromotionLine } from '../../services/promotionRequest';
import { useAccessToken, useAxiosJWT } from '../../utils/axiosInstance';
import { validatePromotionLineData } from '../../utils/validation';

const UpdatePromotionLine = ({ promotionLine, onClose, promotionHeader }) => {
    const axiosJWT = useAxiosJWT();
    const accessToken = useAccessToken();
    const [errors, setErrors] = useState({});
    const [isLoading, setIsLoading] = useState(false);

    const [formData, setFormData] = useState({
        description: promotionLine.description || '',
        startDate: '',
        endDate: '',
        isActive: promotionLine.isActive || false,
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
        setFormData({
            ...formData,
            isActive: e.target.checked,
        });
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
            await updatePromotionLine(promotionLine._id, formData, accessToken, axiosJWT);
            alert('Cập nhật dòng khuyến mãi thành công');
            onClose();
        } catch (error) {
            alert('Cập nhật dòng khuyến mãi thất bại: ' + error.message);
        } finally {
            setIsLoading(false);
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
                />

                <Input
                    label="Ngày bắt đầu"
                    placeholder="Chọn ngày bắt đầu"
                    name="startDate"
                    value={formData.startDate}
                    type="date"
                    onChange={handleChange}
                    disabled={promotionHeader.isActive}
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
                />

                <Input
                    label="Trạng thái"
                    name="status"
                    type="checkbox"
                    checked={formData.isActive}
                    onChange={handleCheckboxChange}
                    error={errors.status}
                />

                <div className="flex-row-center">
                    <div className="login-button" style={{ width: 200 }}>
                        <Button
                            type="submit"
                            text={isLoading ? 'Đang cập nhật...' : 'Cập nhật dòng khuyến mãi'}
                            disabled={isLoading}
                        />
                    </div>
                </div>
            </form>
        </div>
    );
};

export default UpdatePromotionLine;

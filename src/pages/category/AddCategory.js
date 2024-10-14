import React, { useState } from 'react';
import Modal from '../../components/modal/Modal';
import Input from '../../components/input/Input';
import Button from '../../components/button/Button';
import { useAccessToken, useAxiosJWT } from '../../utils/axiosInstance';
import { addCategory } from '../../services/productRequest';
import ClipLoader from 'react-spinners/ClipLoader';
import { uploadImageVideo } from '../../services/uploadRequest';

export default function AddCategory({ isOpen, onClose }) {
    const axiosJWT = useAxiosJWT();
    const accessToken = useAccessToken();

    const [categoryData, setCategoryData] = useState({ name: '', description: '', img: '' });
    const [errors, setErrors] = useState({});
    const [isLoadingImage, setIsLoadingImage] = useState(false); // Trạng thái tải ảnh

    const handleChange = (e) => {
        const { name, value } = e.target;
        setCategoryData({
            ...categoryData,
            [name]: value,
        });
        setErrors({
            ...errors,
            [name]: '',
        });
    };

    const validate = () => {
        const newErrors = {};
        if (!categoryData.name) newErrors.name = 'Tên loại sản phẩm không được để trống';
        if (!categoryData.description) newErrors.description = 'Mô tả không được để trống';
        return newErrors;
    };

    const handleAddCategory = async (e) => {
        e.preventDefault();
        const newErrors = validate();
        if (Object.keys(newErrors).length > 0) {
            setErrors(newErrors);
            alert('Vui lòng kiểm tra lại thông tin.');
            return;
        }

        try {
            const response = await addCategory(categoryData, accessToken, axiosJWT);
            if (response) {
                setCategoryData({ name: '', description: '', img: '' });
                setErrors({});
            }
        } catch (error) {
            console.error('Failed to add category:', error);
            alert('Có lỗi xảy ra khi thêm loại sản phẩm.');
        }
    };

    const handleImageChange = async (e) => {
        const file = e.target.files[0];
        if (file) {
            const fileTypes = /jpeg|jpg|png/; // Chỉ cho phép các loại file hình ảnh

            // Kiểm tra định dạng file
            if (!fileTypes.test(file.type)) {
                alert('Vui lòng chọn file hình ảnh hợp lệ (jpeg, jpg, png).');
                return; // Nếu không hợp lệ, không tiếp tục
            }

            setIsLoadingImage(true); // Bắt đầu loading ảnh
            try {
                const uploadedImageUrl = await uploadImageVideo(file);
                setCategoryData((prevState) => ({
                    ...prevState,
                    img: uploadedImageUrl.avatar,
                }));
            } catch (error) {
                console.error('Failed to upload image:', error);
            } finally {
                setIsLoadingImage(false); // Kết thúc loading ảnh
            }
        }
    };

    return (
        <Modal
            title="Thêm loại sản phẩm"
            isOpen={isOpen}
            onClose={onClose}
            width={'30%'}
        >
            <div className='flex-column-center'>
                <form onSubmit={handleAddCategory}>
                    <div className='flex-column-center'>
                        <div style={{ marginTop: 30, marginBottom: 30 }}>
                            <label htmlFor="image" className='add-product-add-img'>
                                {categoryData.img ? (
                                    <img
                                        src={categoryData.img}
                                        alt="Uploaded"
                                        style={{ width: 150, height: 150, objectFit: 'contain' }}
                                    />
                                ) : (
                                    <>
                                        {isLoadingImage ? (
                                            <ClipLoader size={30} color="#2392D0" loading={isLoadingImage} />
                                        ) : (
                                            'Thêm ảnh'
                                        )}
                                    </>
                                )}
                                <input
                                    type="file"
                                    name='image'
                                    id="image"
                                    accept="image/*"
                                    style={{ display: 'none' }}
                                    onChange={handleImageChange}
                                />
                            </label>
                        </div>
                    </div>
                    <Input
                        label='Loại sản phẩm'
                        placeholder='Nhập loại sản phẩm'
                        name='name'
                        value={categoryData.name}
                        onChange={handleChange}
                        error={errors.name}
                    />
                    <Input
                        label='Mô tả'
                        name='description'
                        placeholder='Nhập mô tả'
                        value={categoryData.description}
                        onChange={handleChange}
                        error={errors.description}
                    />
                    <div className='flex-row-center'>
                        <div className='login-button' style={{ width: 200 }}>
                            <Button
                                type='submit'
                                text='Thêm loại sản phẩm'
                            />
                        </div>
                    </div>
                </form>
            </div>
        </Modal>
    );
}
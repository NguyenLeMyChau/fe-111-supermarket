import React, { useState } from 'react';
import Button from '../../components/button/Button';
import Input from '../../components/input/Input';
import { useAccessToken, useAxiosJWT } from '../../utils/axiosInstance';
import { updateCategory } from '../../services/productRequest';
import ClipLoader from 'react-spinners/ClipLoader';
import { uploadImageVideo } from '../../services/uploadRequest';
import { toast } from 'react-toastify';

const UpdateCategory = ({ category }) => {
    const accessToken = useAccessToken();
    const axiosJWT = useAxiosJWT();

    const [formData, setFormData] = useState({
        name: category.name,
        description: category.description,
        img: category.img,
    });
    const [isLoadingImage, setIsLoadingImage] = useState(false); // Trạng thái tải ảnh

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value,
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        // Call API to update user data
        await updateCategory(category._id, formData, accessToken, axiosJWT);
    };

    const handleImageChange = async (e) => {
        const file = e.target.files[0];
        if (file) {
            const fileTypes = /jpeg|jpg|png/; // Chỉ cho phép các loại file hình ảnh

            // Kiểm tra định dạng file
            if (!fileTypes.test(file.type)) {
                toast.warning('Vui lòng chọn file hình ảnh hợp lệ (jpeg, jpg, png).');
                return; // Nếu không hợp lệ, không tiếp tục
            }

            setIsLoadingImage(true); // Bắt đầu loading ảnh
            try {
                const uploadedImageUrl = await uploadImageVideo(file);
                setFormData((prevState) => ({
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
        <div className='flex-column-center'>

            <form onSubmit={handleSubmit}>

                <div className='flex-column-center'>
                    <div style={{ marginTop: 30, marginBottom: 30 }}>
                        <label htmlFor="image" className='add-product-add-img'>
                            {formData.img ? (
                                <img
                                    src={formData.img}
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
                    value={formData.name}
                    onChange={handleChange}
                />
                <Input
                    label='Mô tả'
                    name='description'
                    placeholder='Nhập mô tả'
                    value={formData.description}
                    onChange={handleChange}
                />

                <div className='flex-row-center'>
                    <div className='login-button' style={{ width: 200 }}>
                        <Button
                            type='submit'
                            text='Cập nhật'
                        />
                    </div>
                </div>

            </form>
        </div>
    );
};

export default UpdateCategory;
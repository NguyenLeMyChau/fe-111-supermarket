import React, { useState } from 'react';
import Modal from '../../components/modal/Modal';
import Input from '../../components/input/Input';
import Button from '../../components/button/Button';
import { useAccessToken, useAxiosJWT } from '../../utils/axiosInstance';
import { useSelector } from 'react-redux';
import Select from 'react-dropdown-select';
import { addProductWithWarehouse } from '../../services/productRequest';
import { uploadImageVideo } from '../../services/uploadRequest';

export default function AddProduct({ isOpen, onClose }) {
    const axiosJWT = useAxiosJWT();
    const accessToken = useAccessToken();

    const categories = useSelector((state) => state.category?.categories) || [];
    const suppliers = useSelector((state) => state.supplier?.suppliers) || [];
    const units = useSelector((state) => state.unit?.units) || [];

    const [productData, setProductData] = useState({
        name: '',
        description: '',
        item_code: '',
        barcode: '',
        min_stock_threshold: '',
        unit_id: '',
        category_id: '',
        supplier_id: '',
        img: '',
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setProductData({
            ...productData,
            [name]: value,
        });
    };

    const handleSelectChange = (selected, name) => {
        setProductData({
            ...productData,
            [name]: selected[0]?.value || '', // Lưu _id của đối tượng
        });
    };

    const handleImageChange = async (e) => {
        const file = e.target.files[0];
        if (file) {
            try {
                const uploadedImageUrl = await uploadImageVideo(file);
                setProductData((prevState) => ({
                    ...prevState,
                    img: uploadedImageUrl.avatar,
                }));
            } catch (error) {
                console.error('Failed to upload image:', error);
            }
        }
    };

    const handleAddProduct = async (e) => {
        e.preventDefault();
        try {
            // Gửi yêu cầu thêm sản phẩm
            await addProductWithWarehouse(productData, accessToken, axiosJWT);
            console.log('Product data:', productData);
            onClose();

        } catch (error) {
            console.error('Failed to add product:', error);
            alert('Có lỗi xảy ra khi thêm sản phẩm.');
        }
    };

    return (
        <Modal
            title="Thêm sản phẩm"
            isOpen={isOpen}
            onClose={onClose}
            width={'70%'}
            height={'80%'}
        >
            <div className='flex-column' style={{ paddingLeft: 60 }}>

                <form onSubmit={handleAddProduct}>

                    <div className='flex-row'>
                        <div className='flex-column'>
                            <Input
                                label='Tên sản phẩm'
                                placeholder='Nhập tên sản phẩm'
                                name='name'
                                value={productData.name}
                                onChange={handleChange}
                            />
                            <Input
                                label='Mô tả'
                                name='description'
                                placeholder='Nhập mô tả'
                                value={productData.description}
                                onChange={handleChange}
                            />

                            <Input
                                label='Barcode'
                                name='barcode'
                                placeholder='Nhập barcode'
                                value={productData.barcode}
                                onChange={handleChange}
                            />
                        </div>

                        <div className='flex-column'>
                            <div style={{ marginLeft: 160, marginTop: 30 }}>
                                {productData.img ? (
                                    <img
                                        src={productData.img}
                                        alt="Uploaded"
                                        style={{ width: 125, height: 125, objectFit: 'cover' }}
                                    />
                                ) : (
                                    <label htmlFor="image" className='add-product-add-img'>
                                        Thêm ảnh
                                        <input
                                            type="file"
                                            name='image'
                                            id="image"
                                            accept="image/*"
                                            style={{ display: 'none' }}
                                            onChange={handleImageChange}
                                        />
                                    </label>
                                )}
                            </div>
                        </div>
                    </div>

                    <div className='flex-row'>

                        <Input
                            label='Mã hàng'
                            name='item_code'
                            placeholder='Nhập mã hàng'
                            value={productData.item_code}
                            onChange={handleChange}
                        />


                        <Input
                            label='Ngưỡng giá trị'
                            name='min_stock_threshold'
                            placeholder='Nhập ngưỡng giá trị'
                            value={productData.min_stock_threshold}
                            onChange={handleChange}
                        />

                    </div>


                    <div className='flex-column' style={{ paddingRight: 50 }}>
                        <p style={{ fontSize: 14, fontWeight: 500 }}>Loại sản phẩm</p>
                        <Select
                            name='type'
                            options={categories.map(category => ({ value: category._id, label: category.name }))}
                            onChange={(selected) => handleSelectChange(selected, 'category_id')}
                            values={categories.filter(category => category._id === productData.category)}
                            placeholder="Chọn loại sản phẩm"

                        />

                        <p style={{ fontSize: 14, fontWeight: 500 }}>Đơn vị tính</p>
                        <Select
                            name='type'
                            options={units.map(unit => ({ value: unit._id, label: unit.description }))}
                            onChange={(selected) => handleSelectChange(selected, 'unit_id')}
                            values={units.filter(unit => unit._id === productData.unit)}
                            placeholder="Chọn đơn vị tính"
                        />

                        <p style={{ fontSize: 14, fontWeight: 500 }}>Nhà cung cấp</p>
                        <Select
                            name='type'
                            options={suppliers.map(supplier => ({ value: supplier._id, label: supplier.name }))}
                            onChange={(selected) => handleSelectChange(selected, 'supplier_id')}
                            values={suppliers.filter(supplier => supplier._id === productData.supplier)}
                            placeholder="Chọn nhà cung cấp"
                        />
                    </div>

                    <div className='flex-row-center'>
                        <div className='login-button' style={{ width: 200 }}>
                            <Button
                                type='submit'
                                text='Thêm sản phẩm'
                            />
                        </div>
                    </div>

                </form>
            </div>
        </Modal>
    );
}

import React, { useState } from 'react';
import Modal from '../../components/modal/Modal';
import Input from '../../components/input/Input';
import Button from '../../components/button/Button';
import { useAccessToken, useAxiosJWT } from '../../utils/axiosInstance';
import { useSelector } from 'react-redux';
import Select from 'react-dropdown-select';
import { addProductWithWarehouse } from '../../services/productRequest';
import { uploadImageVideo } from '../../services/uploadRequest';
import ClipLoader from 'react-spinners/ClipLoader'; // Import ClipLoader

export default function AddProduct({ isOpen, onClose }) {
    const axiosJWT = useAxiosJWT();
    const accessToken = useAccessToken();

    const categories = useSelector((state) => state.category?.categories) || [];
    const suppliers = useSelector((state) => state.supplier?.suppliers) || [];
    const units = useSelector((state) => state.unit?.units) || [];
    const warehouse = useSelector((state) => state.warehouse?.warehouse) || [];
    const products = useSelector((state) => state.product?.products) || [];

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

    const [loading, setLoading] = useState(false); // Trạng thái loading
    const [isLoadingImage, setIsLoadingImage] = useState(false); // Trạng thái tải ảnh

    const handleChange = (e) => {
        const { name, value } = e.target;
        setProductData({
            ...productData,
            [name]: value,
        });

        // Tìm kiếm item_code khi người dùng nhập
        if (name === 'item_code') {
            const foundProduct = products.find(product => product.item_code === value);
            const foundWarehouse = warehouse.find(item => item.item_code === value);

            console.log('Found product:', foundProduct);
            console.log('Found warehouse:', foundWarehouse);

            if (foundProduct) {
                setProductData(prevState => ({
                    ...prevState,
                    supplier_id: foundProduct.supplier_id,
                    category_id: foundProduct.category_id,
                }));
            } else {
                // Nếu không tìm thấy sản phẩm, giữ nguyên hoặc cho phép nhập
                setProductData(prevState => ({
                    ...prevState,
                    supplier_id: '', // Giữ nguyên
                    category_id: '', // Giữ nguyên
                }));
            }

            if (foundWarehouse) {
                setProductData(prevState => ({
                    ...prevState,
                    min_stock_threshold: foundWarehouse.min_stock_threshold,
                }));
            } else {
                // Nếu không tìm thấy kho hàng, giữ nguyên hoặc cho phép nhập
                setProductData(prevState => ({
                    ...prevState,
                    min_stock_threshold: '', // Giữ nguyên
                }));
            }
        }
    };

    const handleSelectChange = (selected, name) => {
        setProductData({
            ...productData,
            [name]: selected[0]?.value || '',
        });
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
                setProductData((prevState) => ({
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

    const handleAddProduct = async (e) => {
        e.preventDefault();
        setLoading(true); // Bắt đầu loading
        try {
            // Gửi yêu cầu thêm sản phẩm
            const result = await addProductWithWarehouse(productData, accessToken, axiosJWT);
            console.log('Product data:', productData);

            // Nếu thành công, mới gọi onClose()
            if (result) {
                onClose();
            }

        } catch (error) {
            console.error('Failed to add product:', error);
            alert('Có lỗi xảy ra khi thêm sản phẩm.');
        } finally {
            setLoading(false); // Kết thúc loading
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
                                <label htmlFor="image" className='add-product-add-img'>
                                    {productData.img ? (
                                        <img
                                            src={productData.img}
                                            alt="Uploaded"
                                            style={{ width: 125, height: 125, objectFit: 'cover' }}
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
                            values={productData.category_id ? [{ value: productData.category_id, label: categories.find(cat => cat._id === productData.category_id)?.name }] : []} // Update this line
                            placeholder="Chọn loại sản phẩm"
                        />

                        <p style={{ fontSize: 14, fontWeight: 500 }}>Đơn vị tính</p>
                        <Select
                            name='type'
                            options={units.map(unit => ({ value: unit._id, label: unit.description }))}
                            onChange={(selected) => handleSelectChange(selected, 'unit_id')}
                            values={units.filter(unit => unit._id === productData.unit_id)}
                            placeholder="Chọn đơn vị tính"
                        />

                        <p style={{ fontSize: 14, fontWeight: 500 }}>Nhà cung cấp</p>
                        <Select
                            name='type'
                            options={suppliers.map(supplier => ({ value: supplier._id, label: supplier.name }))}
                            onChange={(selected) => handleSelectChange(selected, 'supplier_id')}
                            values={productData.supplier_id ? [{ value: productData.supplier_id, label: suppliers.find(supplier => supplier._id === productData.supplier_id)?.name }] : []} // Update this line
                            placeholder="Chọn nhà cung cấp"
                        />
                    </div>

                    <div className='flex-row-center'>
                        <div className='login-button' style={{ width: 200 }}>
                            {
                                loading
                                    ?
                                    <ClipLoader size={30} color="#2392D0" loading={loading} />
                                    : <Button
                                        type='submit'
                                        text={'Thêm sản phẩm'}
                                    />
                            }
                        </div>
                    </div>

                </form>
            </div>
        </Modal>
    );
}

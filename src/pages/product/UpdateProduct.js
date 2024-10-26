import React, { useEffect, useState } from 'react';
import Button from '../../components/button/Button';
import Input from '../../components/input/Input';
import { useSelector } from 'react-redux';
import Select from 'react-dropdown-select';
import ClipLoader from 'react-spinners/ClipLoader';
import { useAccessToken, useAxiosJWT } from '../../utils/axiosInstance';
import { updateProduct } from '../../services/productRequest';
import { uploadImageVideo } from '../../services/uploadRequest';

const UpdateProduct = ({ product }) => {
    const axiosJWT = useAxiosJWT();
    const accessToken = useAccessToken();

    const categories = useSelector((state) => state.category?.categories) || [];
    const suppliers = useSelector((state) => state.supplier?.suppliers) || [];
    const units = useSelector((state) => state.unit?.units) || [];
    // eslint-disable-next-line react-hooks/exhaustive-deps
    const warehouses = useSelector((state) => state.warehouse?.warehouse) || [];

    const [loading, setLoading] = useState(false); // Trạng thái loading
    const [isLoadingImage, setIsLoadingImage] = useState(false); // Trạng thái tải ảnh

    const [formData, setFormData] = useState({
        item_code: product.item_code,
        name: product.name,
        description: product.description,
        barcode: product.barcode,
        img: product.img,
        unit_id: product.unit_id._id,
        category_id: product.category_id,
        supplier_id: product.supplier_id,
        min_stock_threshold: '',
    });

    useEffect(() => {
        const warehouse = warehouses.find(w => w.item_code === product.item_code);
        if (warehouse) {
            setFormData(prevState => ({
                ...prevState,
                min_stock_threshold: warehouse.min_stock_threshold
            }));
        }
    }, [warehouses, product.item_code]);


    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value,
        });
    };

    const handleSelectChange = (selected, name) => {
        setFormData({
            ...formData,
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

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true); // Bắt đầu loading
        try {

            await updateProduct(product._id, formData, accessToken, axiosJWT);

        } catch (error) {
            console.error('Failed to update product:', error);
            alert('Có lỗi xảy ra khi cập nhật sản phẩm.');
        } finally {
            setLoading(false); // Kết thúc loading
        }
    };

    return (
        <div className='flex-column' style={{ paddingLeft: 60 }}>

            <form onSubmit={handleSubmit}>

                <div className='flex-row'>
                    <div className='flex-column'>
                        <Input
                            label='Mã hàng'
                            name='item_code'
                            placeholder='Nhập mã hàng'
                            value={formData.item_code}
                            onChange={handleChange}
                            disabled={true}
                        />
                        <Input
                            label='Tên sản phẩm'
                            placeholder='Nhập tên sản phẩm'
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

                    </div>

                    <div className='flex-column'>
                        <div style={{ marginLeft: 160, marginTop: 30 }}>
                            <label htmlFor="image" className='add-product-add-img'>
                                {formData.img ? (
                                    <img
                                        src={formData.img}
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
                        label='Barcode'
                        name='barcode'
                        placeholder='Nhập barcode'
                        value={formData.barcode}
                        onChange={handleChange}
                    />

                    <Input
                        type='number'
                        min={1}
                        label='Ngưỡng giá trị'
                        name='min_stock_threshold'
                        placeholder='Nhập ngưỡng giá trị'
                        value={formData.min_stock_threshold}
                        onChange={handleChange}
                    />

                </div>

                <div className='flex-column' style={{ paddingRight: 50 }}>
                    <p style={{ fontSize: 14, fontWeight: 500 }}>Loại sản phẩm</p>
                    <Select
                        name='type'
                        options={categories.map(category => ({ value: category._id, label: category.name }))}
                        onChange={(selected) => handleSelectChange(selected, 'category_id')}
                        values={formData.category_id ? [{ value: formData.category_id, label: categories.find(cat => cat._id === formData.category_id)?.name }] : []} // Update this line
                        placeholder="Chọn loại sản phẩm"
                    />

                    <p style={{ fontSize: 14, fontWeight: 500 }}>Đơn vị tính</p>
                    <Select
                        name='type'
                        options={units.map(unit => ({ value: unit._id, label: unit.description }))}
                        onChange={(selected) => handleSelectChange(selected, 'unit_id')}
                        values={formData.unit_id ? [{ value: formData.unit_id, label: units.find(unit => unit._id === formData.unit_id)?.description }] : []} // Update this line
                        placeholder="Chọn đơn vị tính"
                    />

                    <p style={{ fontSize: 14, fontWeight: 500 }}>Nhà cung cấp</p>
                    <Select
                        name='type'
                        options={suppliers.map(supplier => ({ value: supplier._id, label: supplier.name }))}
                        onChange={(selected) => handleSelectChange(selected, 'supplier_id')}
                        values={formData.supplier_id ? [{ value: formData.supplier_id, label: suppliers.find(supplier => supplier._id === formData.supplier_id)?.name }] : []} // Update this line
                        placeholder="Chọn nhà cung cấp"
                    />
                </div>

                <div className='flex-row-center'>
                    {
                        loading
                            ?
                            <ClipLoader size={30} color="#2392D0" loading={loading} />
                            :
                            <div className='login-button' style={{ width: 200 }}>
                                <Button
                                    type='submit'
                                    text={'Cập nhật sản phẩm'}
                                />
                            </div>
                    }
                </div>

            </form>
        </div>
    );
};

export default UpdateProduct;
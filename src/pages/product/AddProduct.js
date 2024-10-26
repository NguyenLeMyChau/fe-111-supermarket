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
import { TiDelete } from "react-icons/ti";

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
    const [conversionUnits, setConversionUnits] = useState([]); // Array of conversion units

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
                    name: foundProduct.name,
                    supplier_id: foundProduct.supplier_id,
                    category_id: foundProduct.category_id,
                }));
            } else {
                // Nếu không tìm thấy sản phẩm, giữ nguyên hoặc cho phép nhập
                setProductData(prevState => ({
                    ...prevState,
                    name: '', // Giữ nguyên
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

    const handleAddConversionUnit = () => {
        setConversionUnits([
            ...conversionUnits,
            { unit: '', quantity: '', barcode: '', img: '' },
        ]);
    };

    const handleConversionUnitChange = (index, field, value) => {
        const updatedUnits = conversionUnits.map((unit, i) =>
            i === index ? { ...unit, [field]: value } : unit
        );
        setConversionUnits(updatedUnits);
    };
    const handleDeleteConversionUnit = (index) => {
        setConversionUnits((prevUnits) => prevUnits.filter((_, i) => i !== index));
    };

    const handleImageChangeForUnit = async (index, e) => {
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
                handleConversionUnitChange(index, 'img', uploadedImageUrl.avatar);
            } catch (error) {
                console.error('Failed to upload image:', error);
            } finally {
                setIsLoadingImage(false); // Kết thúc loading ảnh
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
        // Hiển thị hộp thoại xác nhận
        const isConfirmed = window.confirm('Bạn có chắc chắn muốn thêm sản phẩm này?');

        if (!isConfirmed) {
            return; // Nếu người dùng không xác nhận, dừng lại
        }

        setLoading(true); // Bắt đầu loading
        try {
            // Gửi yêu cầu thêm sản phẩm
            await addProductWithWarehouse(productData, accessToken, axiosJWT, onClose);
            console.log('Product data:', productData);

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
            <div className='flex-column' style={{ paddingLeft: 60, height: '550px' }}>

                <form onSubmit={handleAddProduct}>

                    <div className='flex-row'>
                        <div className='flex-column'>
                            <Input
                                label='Mã hàng'
                                name='item_code'
                                placeholder='Nhập mã hàng'
                                value={productData.item_code}
                                onChange={handleChange}
                            />
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

                        </div>

                        <div className='flex-column'>
                            <div style={{ marginLeft: 160, marginTop: 30 }}>
                                <label htmlFor="image" className='add-product-add-img'>
                                    {productData.img ? (
                                        <img
                                            src={productData.img}
                                            alt="Uploaded"
                                            style={{ width: 125, height: 125, objectFit: 'contain' }}
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
                            value={productData.barcode}
                            onChange={handleChange}
                        />

                        <Input
                            type='number'
                            min={1}
                            label='Ngưỡng giá trị'
                            name='min_stock_threshold'
                            placeholder='Nhập ngưỡng giá trị'
                            value={productData.min_stock_threshold}
                            onChange={handleChange}
                        />

                    </div>

                    <div className='flex-column' style={{ paddingRight: 50 }}>
                        <div style={{ display: 'flex', flexDirection: 'row', flex: 1 }}>
                            <div style={{ width: '550px', display: 'flex', flexDirection: 'row', alignItems: 'center' }}>
                                <div style={{ width: '100px', marginRight: '20px' }}> {/* Wrap <p> with a fixed width */}
                                    <p style={{ fontSize: 14, fontWeight: 500 }}>Loại sản phẩm</p>
                                </div>
                                <div style={{ width: '300px' }}>
                                    <Select
                                        values={
                                            productData.category_id
                                                ? [{ value: productData.category_id, label: categories.find(cat => cat._id === productData.category_id)?.name }]
                                                : []
                                        }
                                        options={categories.map(category => ({ value: category._id, label: category.name }))}
                                        onChange={(selected) => handleSelectChange(selected, 'category_id')}
                                        placeholder="Chọn loại sản phẩm"
                                    />
                                </div>
                            </div>


                            <div style={{ width: '500px', display: 'flex', flexDirection: 'row', alignItems: 'center', marginLeft: 40 }}>
                                <div style={{ width: '100px', marginRight: '20px' }}> {/* Wrap <p> with a fixed width */}
                                    <p style={{ fontSize: 14, fontWeight: 500 }}>Nhà cung cấp</p>
                                </div>
                                <div style={{ width: '300px' }}>
                                    <Select
                                        options={suppliers.map(supplier => ({ value: supplier._id, label: supplier.name }))}
                                        onChange={(selected) => handleSelectChange(selected, 'supplier_id')}
                                        values={productData.supplier_id ? [{ value: productData.supplier_id, label: suppliers.find(supplier => supplier._id === productData.supplier_id)?.name }] : []} // Update this line
                                        placeholder="Chọn nhà cung cấp"
                                    />
                                </div>
                            </div>
                        </div>


                        <div style={{ width: '100%', display: 'flex', flexDirection: 'row', alignItems: 'center' }}>
                            <div style={{ width: '100px', marginRight: '20px' }}> {/* Wrap <p> with a fixed width */}
                                <p style={{ fontSize: 14, fontWeight: 500 }}>Đơn vị cơ bản</p>
                            </div>
                            <div style={{ width: '88%' }}>
                                <Select
                                    options={units.map(unit => ({ value: unit._id, label: unit.description }))}
                                    onChange={(selected) => handleSelectChange(selected, 'unit_id')}
                                    values={units.filter(unit => unit._id === productData.unit_id)}
                                    placeholder="Chọn đơn vị cơ bản"
                                />
                            </div>
                        </div>
                    </div>

                    <div>
                        <button
                            type='button'
                            style={{
                                border: '2px dashed #323C64',
                                color: '#323C64',
                                backgroundColor: 'transparent',
                                padding: '5px 15px',
                                fontSize: '14px',
                                cursor: 'pointer',
                                marginTop: '20px',
                            }}
                            onClick={handleAddConversionUnit}
                        >
                            Thêm đơn vị quy đổi
                        </button>

                    </div>

                    {/* Conversion units table */}
                    {conversionUnits.length > 0 && (
                        <table style={{ marginTop: '20px', width: '100%', borderCollapse: 'collapse' }}>
                            <thead>
                                <tr>
                                    <th style={{ padding: '10px' }}>Đơn vị quy đổi</th>
                                    <th style={{ padding: '10px' }}>Số lượng</th>
                                    <th style={{ padding: '10px' }}>Barcode</th>
                                    <th style={{ padding: '10px' }}>Hình ảnh</th>
                                    <th>Hành động</th>
                                </tr>
                            </thead>
                            <tbody>
                                {conversionUnits.map((unit, index) => (
                                    <tr key={index}>
                                        <td style={{ padding: '10px', textAlign: 'center' }}>
                                            <Select
                                                options={units.map(unit => ({ value: unit._id, label: unit.description }))}
                                                onChange={(selected) => handleConversionUnitChange(index, 'unit', selected[0]?.value)}
                                                placeholder="Chọn đơn vị"
                                                styles={{
                                                    control: (provided) => ({
                                                        ...provided,
                                                        minWidth: '150px',
                                                        margin: '0 auto', // Center the select box
                                                    }),
                                                }}
                                            />
                                        </td>
                                        <td style={{ padding: '10px', textAlign: 'center' }}>
                                            <input
                                                type="number"
                                                name="quantity"
                                                placeholder="Số lượng"
                                                value={unit.quantity}
                                                onChange={(e) => handleConversionUnitChange(index, 'quantity', e.target.value)}
                                                style={{ width: '80px', height: '30px', margin: '0 auto', textAlign: 'center' }}
                                            />
                                        </td>
                                        <td style={{ padding: '10px', textAlign: 'center' }}>
                                            <input
                                                type="number"
                                                name="barcode"
                                                placeholder="Barcode"
                                                value={unit.barcode}
                                                onChange={(e) => handleConversionUnitChange(index, 'barcode', e.target.value)}
                                                style={{ width: '170px', height: '30px', margin: '0 auto', paddingLeft: 20 }}
                                            />
                                        </td>

                                        <td style={{ padding: '10px', textAlign: 'center' }}>
                                            <label htmlFor={`image-${index}`} style={{ width: 50, height: 50 }}>
                                                {unit.img ? (
                                                    <img
                                                        src={unit.img}
                                                        alt="Uploaded"
                                                        style={{ width: 50, height: 50, objectFit: 'contain' }}
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
                                                    id={`image-${index}`}
                                                    accept="image/*"
                                                    style={{ display: 'none' }}
                                                    onChange={(e) => handleImageChangeForUnit(index, e)}
                                                />
                                            </label>
                                        </td>

                                        <td style={{ textAlign: 'center' }}>
                                            <TiDelete
                                                size={30}
                                                color="red"
                                                style={{ cursor: 'pointer' }}
                                                onClick={() => handleDeleteConversionUnit(index)}
                                            />
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    )}


                    <div className='flex-row-center' style={{ position: 'sticky', bottom: 0, marginTop: '130px' }}>
                        {loading ? (
                            <ClipLoader size={30} color="#2392D0" loading={loading} />
                        ) : (
                            <div className='login-button' style={{ width: 200 }}>
                                <Button type='submit' text='Thêm sản phẩm' />
                            </div>
                        )}
                    </div>
                </form>
            </div>
        </Modal>
    );
}

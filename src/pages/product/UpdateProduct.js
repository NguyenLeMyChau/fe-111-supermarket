import React, { useState } from 'react';
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

    const [loading, setLoading] = useState(false); // Trạng thái loading
    const [isLoadingImage, setIsLoadingImage] = useState(false); // Trạng thái tải ảnh
    const [conversionUnits, setConversionUnits] = useState(product.unit_convert); // Array of conversion units

    const [formData, setFormData] = useState({
        item_code: product.item_code,
        name: product.name,
        description: product.description,
        barcode: product.barcode,
        img: product.img,
        unit_id: product.unit_id._id,
        category_id: product.category_id,
        supplier_id: product.supplier_id,
        unit_convert: [],
    });

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

    const handleCheckboxChange = (index) => {
        const updatedUnits = conversionUnits.map((unit, i) => {
            if (i === index) {
                // Nếu checkbox hiện tại đang là true và đây là checkbox cuối cùng được chọn, không cho phép bỏ chọn
                if (unit.checkBaseUnit && conversionUnits.filter(u => u.checkBaseUnit).length === 1) {
                    return unit;
                }
                return { ...unit, checkBaseUnit: !unit.checkBaseUnit, quantity: !unit.checkBaseUnit ? 1 : unit.quantity };
            } else {
                return { ...unit, checkBaseUnit: false };
            }
        });
        setConversionUnits(updatedUnits);
    };

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

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true); // Bắt đầu loading
        try {
            // Cập nhật formData để bao gồm conversionUnits
            const updatedformData = {
                ...formData,
                unit_convert: conversionUnits,
            };
            await updateProduct(product._id, updatedformData, accessToken, axiosJWT);

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

                <div className='flex-column'>
                    <div className='flex-row'>
                        <Input
                            label='Mã hàng'
                            name='item_code'
                            placeholder='Nhập mã hàng'
                            value={formData.item_code}
                            onChange={handleChange}
                        />
                        <Input
                            label='Tên sản phẩm'
                            placeholder='Nhập tên sản phẩm'
                            name='name'
                            value={formData.name}
                            onChange={handleChange}
                        />
                    </div>
                    <div className='flex-row'>

                        <Input
                            label='Mô tả'
                            name='description'
                            placeholder='Nhập mô tả'
                            value={formData.description}
                            onChange={handleChange}
                            width={770}
                        />

                    </div>

                </div>

                <div className='flex-column' style={{ paddingRight: 50 }}>
                    <div style={{ display: 'flex', flexDirection: 'row', flex: 1 }}>
                        <div style={{ width: '550px', display: 'flex', flexDirection: 'row', alignItems: 'center' }}>
                            <div style={{ width: '100px', marginRight: '20px' }}> {/* Wrap <p> with a fixed width */}
                                <p style={{ fontSize: 14, fontWeight: 500 }}>Loại sản phẩm</p>
                            </div>
                            <div style={{ width: '300px' }}>
                                <Select
                                    values={formData.category_id ? [{ value: formData.category_id, label: categories.find(cat => cat._id === formData.category_id)?.name }] : []}
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
                                    values={formData.supplier_id ? [{ value: formData.supplier_id, label: suppliers.find(supplier => supplier._id === formData.supplier_id)?.name }] : []} // Update this line
                                    placeholder="Chọn nhà cung cấp"
                                />
                            </div>
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
                                <th style={{ padding: '10px' }}>Đơn vị cơ bản</th>
                            </tr>
                        </thead>
                        <tbody>
                            {conversionUnits.map((unit, index) => (
                                <tr key={index}>
                                    <td style={{ padding: '10px' }}>
                                        <Select
                                            options={units.map(unit => ({ value: unit._id, label: unit.description }))}
                                            values={unit.unit ? [{ value: unit.unit, label: units.find(u => u._id === unit.unit)?.description }] : []}
                                            onChange={(selected) => handleConversionUnitChange(index, 'unit', selected[0]?.value)}
                                            placeholder="Chọn đơn vị"
                                            styles={{
                                                control: (provided) => ({
                                                    ...provided,
                                                    minWidth: '150px',
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
                                            disabled={unit.checkBaseUnit} // Vô hiệu hóa ô nhập liệu khi checkbox được chọn
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

                                    <td style={{ padding: '10px', textAlign: 'center' }}>
                                        <input
                                            type="checkbox"
                                            checked={unit.checkBaseUnit}
                                            onChange={() => handleCheckboxChange(index)}
                                            style={{ width: '15px', height: '15px' }}
                                        />
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}


                <div className='flex-row-center' style={{ marginTop: 10 }}>
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
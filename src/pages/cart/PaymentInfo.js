import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import './PaymentInfo.scss'; // Assuming you will style using CSS
import { usePaymentModal } from '../../context/PaymentModalProvider';
import { districts } from '../../utils/address';
import HeaderCustomer from '../../components/headerCustomer/HeaderCustomer';
import Select from 'react-dropdown-select';
import { IoChevronBackOutline } from "react-icons/io5";

const PaymentInfo = () => {
    const navigate = useNavigate();
    const user = useSelector(state => state.auth?.login?.currentUser.user);
    const { paymentInfo, setPaymentInfo } = usePaymentModal();

    // Sử dụng paymentInfo nếu có, nếu không sử dụng thông tin từ user
    const [phone, setPhone] = useState(paymentInfo?.phone || user?.phone || '');
    const [gender, setGender] = useState(paymentInfo?.gender || user?.gender || false);
    const [name, setName] = useState(paymentInfo?.name || user?.name || '');
    const [city] = useState('Hồ Chí Minh');
    const [district, setDistrict] = useState('');
    const [ward, setWard] = useState('');
    const [street, setStreet] = useState('');
    const [isButtonDisabled, setIsButtonDisabled] = useState(true);
    const [wards, setWards] = useState([]);

    const districtOptions = districts.map(districtItem => districtItem.name);

    const wardOptions = wards.map(wardItem => wardItem);


    useEffect(() => {
        if (!paymentInfo) {
            setDistrict(user.address.district || '');
            setWard(user.address.ward || '');
            setStreet(user.address.street || '');
            console.log('Chạy vào user')
        } else {
            setDistrict(paymentInfo.address.district || '');
            setWard(paymentInfo.address.ward || '');
            setStreet(paymentInfo.address.street || '');
            console.log('Chạy vào paymentInfo')
        }
    }, [user, paymentInfo]);

    useEffect(() => {
        if (phone && gender !== '' && name && district && ward && street) {
            setIsButtonDisabled(false);
        } else {
            setIsButtonDisabled(true);
        }
    }, [phone, gender, name, district, ward, street]);

    const handleDistrictChange = (selectedDistrict) => {
        setDistrict(selectedDistrict); // Sử dụng giá trị đã chọn
        const districtData = districts.find(d => d.name === selectedDistrict);
        setWards(districtData ? districtData.wards : []);
        setWard(''); // Reset phường/xã khi thay đổi quận/huyện
        console.log('district', district);
    };


    const handleSubmit = () => {
        const address = {
            street,
            district,
            ward,
            city
        };

        // Kết hợp thông tin paymentInfo với address
        const updatedPaymentInfo = {
            phone,
            gender,
            name,
            address
        };

        setPaymentInfo(updatedPaymentInfo); // Cập nhật paymentInfo với thông tin mới
        console.log('Payment Info:', updatedPaymentInfo); // Log thông tin mới

        // navigate(-1); // Quay lại trang trước
    };

    return (
        <div className='cart-customer-container'>
            <header>
                <HeaderCustomer />
            </header>
            <div className="payment-info-container">
                <div className="header">
                    <button onClick={() => navigate(-1)} style={{ border: 'none', backgroundColor: 'transparent' }}>
                        <IoChevronBackOutline size={25} />
                    </button>
                    <h1 className="title">Thông tin nhận hàng</h1>
                </div>

                {/* Phone Number */}
                <div className="input-container">
                    <label>Số điện thoại</label>
                    <input
                        type="tel"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                    />
                </div>

                {/* Gender */}
                <div className="gender-container">
                    <div className="radio-group">
                        <label>
                            <input
                                type="radio"
                                checked={gender === false}
                                onChange={() => setGender(false)}
                            />
                            Nam
                        </label>
                        <label>
                            <input
                                type="radio"
                                checked={gender === true}
                                onChange={() => setGender(true)}
                            />
                            Nữ
                        </label>
                    </div>
                </div>

                {/* Full Name */}
                <div className="input-container">
                    <label>Họ và tên</label>
                    <input
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                    />
                </div>

                {/* City and District */}
                <div className="row-container">
                    <div className="input-container-short">
                        <label>Thành phố</label>
                        <input
                            type="text"
                            value={city}
                            readOnly
                        />
                    </div>

                    <div className="input-container-short">
                        <label>Quận/Huyện</label>
                        <Select
                            name='district'
                            options={districtOptions.map(district => ({ value: district, label: district }))}
                            onChange={(selected) => handleDistrictChange(selected[0].value)}
                            value={district}
                            placeholder="Chọn Quận/Huyện"
                            className='district-select'
                        />

                    </div>
                </div>

                {/* Ward */}
                <div className="input-container">
                    <label>Phường/Xã</label>
                    <Select
                        name='ward'
                        options={wardOptions.map(ward => ({ value: ward, label: ward }))}
                        onChange={(selected) => setWard(selected[0].value)}
                        value={ward ? [{ value: ward, label: ward }] : []}
                        placeholder="Chọn Phường/Xã"
                        className='district-select'
                    />
                </div>

                {/* Address */}
                <div className="input-container">
                    <label>Số nhà, tên đường</label>
                    <input
                        type="text"
                        value={street}
                        onChange={(e) => setStreet(e.target.value)}
                    />
                </div>

                {/* Submit Button */}
                <button
                    className={`submit-button ${isButtonDisabled ? 'disabled' : ''}`}
                    onClick={handleSubmit}
                    disabled={isButtonDisabled}
                >
                    Xác nhận
                </button>
            </div>
        </div>
    );
};

export default PaymentInfo;

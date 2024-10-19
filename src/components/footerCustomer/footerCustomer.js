import React from 'react';
import './footerCustomer.scss';
import { FaFacebook, FaTwitter, FaInstagram, FaLinkedin } from 'react-icons/fa';

export default function FooterCustomer() {
    return (
        <footer className='footer-customer-container'>
            <div className='footer-section'>
                <h4>Về chúng tôi</h4>
                <p>Siêu thị CAPY SMART cung cấp các sản phẩm chất lượng cao với giá cả hợp lý. Chúng tôi luôn đặt khách hàng lên hàng đầu.</p>
            </div>
            <div className='footer-section'>
                <h4>Liên hệ</h4>
                <p>Địa chỉ: 123 Đường ABC, Quận 1, TP. Hồ Chí Minh</p>
                <p>Điện thoại: 0123 456 789</p>
                <p>Email: info@capysmart.com</p>
            </div>
            <div className='footer-section'>
                <h4>Theo dõi chúng tôi</h4>
                <div className='social-icons'>
                    <FaFacebook />
                    <FaTwitter />
                    <FaInstagram />
                    <FaLinkedin />
                </div>
            </div>
        </footer>
    );
}
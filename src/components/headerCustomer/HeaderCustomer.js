import './HeaderCustomer.scss';
import Logo from '../logo/Logo';
import { FaChevronDown, FaSearch, FaShoppingCart } from 'react-icons/fa';
import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router';
import { createAxiosInstance } from '../../utils/util';
import { logoutSuccess } from '../../store/reducers/authSlice';
import { logoutUser } from '../../services/authRequest';

export default function HeaderCustomer() {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const login = useSelector((state) => state.auth?.login?.currentUser);
    const axiosJWT = createAxiosInstance(login, dispatch, logoutSuccess);
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);

    const toggleDropdown = () => {
        setIsDropdownOpen(!isDropdownOpen);
    };

    const handleLogout = () => {
        // Xử lý đăng xuất
        console.log('Đăng xuất');
        logoutUser(dispatch, navigate, login?.accessToken, axiosJWT);
    };

    const handleUpdateInfo = () => {
        // Xử lý cập nhật thông tin
        console.log('Cập nhật thông tin');
    };

    const handleCart = () => {
        // Xử lý chuyển hướng đến trang giỏ hàng
        console.log('Chuyển hướng đến trang giỏ hàng');
        navigate('/customer/cart');
    }

    const handleShowOrder = () => {
        // Xử lý chuyển hướng đến trang đơn hàng
        console.log('Chuyển hướng đến trang đơn hàng');
        navigate('/customer/order');
    }

    return (
        <div className='header-customer-container'>
            <div className='flex-row-align-center' onClick={() => navigate('/home')}>
                <Logo />
                <h3 style={{ marginLeft: -20 }}>CAPY SMART</h3>
            </div>

            <div className='search-container'>
                <input
                    type="text"
                    placeholder="Tìm kiếm sản phẩm..."
                    className="search-input"
                />
                <div className="search-button">
                    <FaSearch />
                </div>
            </div>

            <div className='user-cart-container'>

                <button className='cart-icon' onClick={handleCart}>
                    <FaShoppingCart size={30} color='#323C64' />
                    <span className='cart-count'>3</span>
                </button>

                <div className='user-info' onClick={toggleDropdown}>
                    <div className='user-greeting'>
                        <span>Xin chào</span>
                        <span className='user-name'>Lê Anh Thư</span>
                    </div>
                    <FaChevronDown className={`dropdown-icon ${isDropdownOpen ? 'open' : ''}`} />

                    {isDropdownOpen && (
                        <div className='dropdown-menu'>
                            <div className='dropdown-item' onClick={handleUpdateInfo}>Sửa thông tin cá nhân</div>
                            <div className='dropdown-item' onClick={handleShowOrder}>Đơn hàng từng mua</div>
                            <div className='dropdown-item' onClick={handleLogout}>Đăng xuất</div>
                        </div>
                    )}
                </div>
            </div>

        </div>
    );

}
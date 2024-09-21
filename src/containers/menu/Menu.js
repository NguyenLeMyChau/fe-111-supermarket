import React, { useState } from 'react';
import './Menu.scss';
import Logo from '../../components/logo/Logo';
import { logoutUser } from '../../services/authRequest';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router';
import { createAxiosInstance } from '../../utils/util';
import { logoutSuccess } from '../../store/reducers/authSlice';
import useMenuItems from './useMenuItems';

function Menu({ onchange }) {
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const login = useSelector((state) => state.auth?.login?.currentUser);
    const [selectedItem, setSelectedItem] = useState(login?.role === 'manager' ? 'Dashboard' : 'User');
    const menuItems = useMenuItems(login?.role);


    const handleItemClick = (label, element) => {
        const axiosJWT = createAxiosInstance(login, dispatch, logoutSuccess);
        if (axiosJWT) {
            console.log('label menu:', label);
            if (label === 'Log Out') {
                const accessToken = login?.accessToken;
                logoutUser(dispatch, navigate, accessToken, axiosJWT);

            } else if (label === 'Stall') {
                navigate('/frame-staff/stall');
            }
            else {
                setSelectedItem(label);
                if (onchange) { // Kiểm tra nếu onchange được truyền vào
                    onchange(element);
                }
            }
        } else {
            console.error('axiosJWT is not initialized. User might not be logged in.');
        }
    };

    return (
        <div className='menu-body'>
            <div className='menu-logo'>
                <Logo />
                <p className='text-xl font-weight-semibold text-primary'>CAPY SMART</p>
            </div>

            {menuItems.map((menuSection) => (
                <div className={`menu-menu ${menuSection.section === 'Setting' ? 'menu-setting' : ''}`} key={menuSection.section}>
                    <div>
                        {menuSection.items.map(({ Icon, label, text, element }) => (
                            <div
                                className={`menu-detail ${selectedItem === label ? 'selected' : ''}`}
                                onClick={() => handleItemClick(label, element)}
                                key={label}
                            >
                                <Icon size={20} />
                                <p>{text}</p>
                            </div>
                        ))}
                    </div>
                </div>
            ))}

        </div>
    );
}

export default Menu;

import React, { useState } from 'react';
import './Menu.scss';
import Logo from '../../components/logo/Logo';
import { MdOutlineInventory2 } from "react-icons/md";
import { GoHome } from "react-icons/go";
import { BsClipboardCheck, BsBoxSeam, BsFileBarGraph } from "react-icons/bs";
import { IoIosLogOut } from "react-icons/io";
import { FaRegUser } from "react-icons/fa";
import { SlSettings } from "react-icons/sl";
import { logoutUser } from '../../services/authRequest';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router';
import { createAxiosInstance } from '../../utils/util';
import { logoutSuccess } from '../../store/reducers/authSlice';

function Menu({ onchange }) {
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const [selectedItem, setSelectedItem] = useState('Dashboard');
    const login = useSelector((state) => state.auth?.login?.currentUser);

    const menuItems = [
        {
            section: "Menu",
            items: [
                { Icon: GoHome, label: "Dashboard" },
                { Icon: MdOutlineInventory2, label: "Inventory" },
                { Icon: BsFileBarGraph, label: "Report" },
                { Icon: FaRegUser, label: "Suppliers" },
                { Icon: BsBoxSeam, label: "Orders" },
                { Icon: BsClipboardCheck, label: "Manage Store" }
            ],

        },
        {
            section: "Setting",
            items: [
                { Icon: SlSettings, label: "Setting" },
                { Icon: IoIosLogOut, label: "Log Out" }]
        }
    ];

    const handleItemClick = (label) => {
        const axiosJWT = createAxiosInstance(login, dispatch, logoutSuccess);
        if (axiosJWT) {
            console.log('label menu:', label);
            if (label === 'Log Out') {
                console.log('Log out axiosJWT:', axiosJWT);
                const accessToken = login?.accessToken;
                logoutUser(dispatch, navigate, accessToken, axiosJWT);

            } else {
                setSelectedItem(label);
                if (onchange) { // Kiểm tra nếu onchange được truyền vào
                    onchange(label);
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
                        {menuSection.items.map(({ Icon, label }) => (
                            <div
                                className={`menu-detail ${selectedItem === label ? 'selected' : ''}`}
                                onClick={() => handleItemClick(label)}
                                key={label}
                            >
                                <Icon size={20} />
                                <p>{label}</p>
                            </div>
                        ))}
                    </div>
                </div>
            ))}

        </div>
    );
}

export default Menu;

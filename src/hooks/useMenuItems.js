import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';

import { GoHome } from "react-icons/go";
import { MdOutlineInventory2, MdProductionQuantityLimits } from "react-icons/md";
import { BsFileBarGraph, BsBoxSeam, BsPersonVcard } from "react-icons/bs";
import { FaRegUser, FaCashRegister, FaUsers } from "react-icons/fa";
import { SlSettings } from "react-icons/sl";
import { IoIosLogOut } from "react-icons/io";
import { TbReport } from "react-icons/tb";
import { BiCategory } from "react-icons/bi";
import { AiOutlineTag } from "react-icons/ai";

import Supplier from "../pages/supplier/Supplier";
import Inventory from "../pages/inventory/Inventory";
import Orders from "../pages/orders/Orders";

import { createAxiosInstance } from '../utils/util';
import { logoutSuccess } from '../store/reducers/authSlice';
import { logoutUser } from '../services/authRequest';
import User from '../containers/user/User';
import Category from '../pages/category/Category';
import Employee from '../pages/employee/Employee';
import Product from '../pages/product/Product';
import Promotion from '../pages/promotion/Promotion';

const useMenuItems = (onchange) => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const login = useSelector((state) => state.auth?.login?.currentUser);
    const [selectedItem, setSelectedItem] = useState('User');

    const handleItemClick = (label, element) => {
        const axiosJWT = createAxiosInstance(login, dispatch, logoutSuccess);
        if (axiosJWT) {
            console.log('label menu:', label);
            if (label === 'Log Out') {
                const accessToken = login?.accessToken;
                logoutUser(dispatch, navigate, accessToken, axiosJWT);
            } else if (label === 'Stall') {
                navigate('/frame-staff/stall');
            } else {
                setSelectedItem(label);
                if (onchange) {
                    onchange(element);
                }
            }
        } else {
            console.error('axiosJWT is not initialized. User might not be logged in.');
        }
    };

    const menuItems = login?.role === 'manager' ? [
        {
            section: "Menu",
            items: [
                { Icon: FaRegUser, label: "User", text: "Thông tin", element: <User /> },
                { Icon: GoHome, label: "Dashboard", text: "Tổng quan" },
                { Icon: BiCategory, label: "Category", text: "Loại sản phẩm", element: <Category /> },
                { Icon: MdProductionQuantityLimits, label: "Product", text: "Sản phẩm", element: <Product /> },
                { Icon: BsPersonVcard, label: "Employee", text: "Nhân viên", element: <Employee /> },
                { Icon: AiOutlineTag, label: "Promotion", text: "Khuyến mãi", element: <Promotion /> },
                { Icon: MdOutlineInventory2, label: "Inventory", text: "Kho", element: <Inventory /> },
                { Icon: BsFileBarGraph, label: "Report", text: "Báo cáo" },
                { Icon: FaUsers, label: "Suppliers", text: "Nhà cung cấp", element: <Supplier /> },
                { Icon: BsBoxSeam, label: "Orders", text: "Đơn hàng", element: <Orders /> },
            ],
        },
        {
            section: "Setting",
            items: [
                { Icon: SlSettings, label: "Setting", text: "Cài đặt" },
                { Icon: IoIosLogOut, label: "Log Out", text: "Đăng xuất" }
            ]
        }
    ] : [
        {
            section: "Menu",
            items: [
                { Icon: FaRegUser, label: "User", text: "Thông tin" },
                { Icon: FaCashRegister, label: "Stall", text: "Quầy thu ngân" },
                { Icon: TbReport, label: "Online", text: "Đơn hàng online" },
            ],
        },
        {
            section: "Setting",
            items: [
                { Icon: SlSettings, label: "Setting", text: "Cài đặt" },
                { Icon: IoIosLogOut, label: "Log Out", text: "Đăng xuất" }
            ]
        }
    ];

    return {
        selectedItem,
        menuItems,
        handleItemClick,
    };
};

export default useMenuItems;
import { useEffect, useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useLocation, useNavigate } from 'react-router-dom';

import { GoHome } from "react-icons/go";
import { MdOutlineInventory2, MdProductionQuantityLimits } from "react-icons/md";
import { BsFileBarGraph, BsPersonVcard } from "react-icons/bs";
import { FaRegUser, FaCashRegister, FaUsers } from "react-icons/fa";
import { SlSettings } from "react-icons/sl";
import { IoIosLogOut } from "react-icons/io";
import { TbReport } from "react-icons/tb";
import { BiCategory, BiSolidOffer } from "react-icons/bi";
import { AiOutlineTag } from "react-icons/ai";
import { PiInvoice } from "react-icons/pi";

import { createAxiosInstance } from '../utils/util';
import { logoutSuccess } from '../store/reducers/authSlice';
import { logoutUser } from '../services/authRequest';


const getLabelFromPathname = (pathname, menuItems) => {
    for (const section of menuItems) {
        for (const item of section.items) {
            if (pathname.includes(item.path)) {
                return item.label;
            }
        }
    }
    return null;
};

const useMenuItems = (onchange) => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const location = useLocation();
    const login = useSelector((state) => state.auth?.login?.currentUser);
    const [selectedItem, setSelectedItem] = useState('User');

    const handleItemClick = (label, path) => {
        const axiosJWT = createAxiosInstance(login, dispatch, logoutSuccess);
        if (axiosJWT) {
            console.log('label menu:', label);
            if (label === 'Log Out') {
                logoutUser(dispatch, navigate, login?.accessToken, axiosJWT);
            } else if (label === 'Stall') {
                navigate('/frame-staff/stall');
            } else {
                setSelectedItem(label);
                if (onchange) {
                    navigate(path);
                    onchange(path);
                }
            }
        } else {
            console.error('axiosJWT is not initialized. User might not be logged in.');
        }
    };

    const menuItems = useMemo(() => login?.role === 'manager' ? [
        {
            section: "Menu",
            items: [
                { Icon: FaRegUser, label: "User", text: "Thông tin", path: '/admin/user' },
                { Icon: GoHome, label: "Dashboard", text: "Tổng quan", path: '/admin/dashboard' },
                { Icon: BiCategory, label: "Category", text: "Loại sản phẩm", path: '/admin/category' },
                { Icon: MdProductionQuantityLimits, label: "Product", text: "Sản phẩm", path: '/admin/product' },
                // { Icon: SlSettings, label: "Unit", text: "Đơn vị tính", path: '/admin/unit' },
                { Icon: BiSolidOffer, label: "Promotion", text: "Khuyến mãi", path: '/admin/promotion' },
                { Icon: AiOutlineTag, label: "Price", text: "Giá sản phẩm", path: '/admin/price' },
                { Icon: MdOutlineInventory2, label: "Inventory", text: "Kho", path: '/admin/inventory' },
                { Icon: BsFileBarGraph, label: "Bill", text: "Nhập kho", path: '/admin/bill' },
                { Icon: PiInvoice, label: "Invoice", text: "Hoá đơn khách", path: '/admin/invoice' },
                { Icon: BsPersonVcard, label: "Employee", text: "Nhân viên", path: '/admin/employee' },
                { Icon: FaUsers, label: "Suppliers", text: "Nhà cung cấp", path: '/admin/supplier' },
            ],
        },
        {
            section: "Setting",
            items: [
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
    ], [login]);

    // Cập nhật menu dựa trên URL khi trang được tải
    useEffect(() => {
        const path = location.pathname;
        const label = getLabelFromPathname(path, menuItems);
        if (label) {
            setSelectedItem(label);
        }
    }, [location, menuItems]);

    return {
        selectedItem,
        menuItems,
        handleItemClick,
    };
};

export default useMenuItems;
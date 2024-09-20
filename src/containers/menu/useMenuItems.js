import { GoHome } from "react-icons/go";
import { MdOutlineInventory2 } from "react-icons/md";
import { BsFileBarGraph, BsBoxSeam, BsClipboardCheck } from "react-icons/bs";
import { FaRegUser, FaCashRegister } from "react-icons/fa";
import { SlSettings } from "react-icons/sl";
import { IoIosLogOut } from "react-icons/io";
import { TbReport } from "react-icons/tb";
import Supplier from "../../pages/supplier/Supplier";
import Inventory from "../../pages/inventory/Inventory";
import Orders from "../../pages/orders/Orders";

const useMenuItems = (role) => {
    if (role === 'manager') {
        return [
            {
                section: "Menu",
                items: [
                    { Icon: GoHome, label: "Dashboard", text: "Tổng quan" },
                    { Icon: MdOutlineInventory2, label: "Inventory", text: "Kho", element: <Inventory /> },
                    { Icon: BsFileBarGraph, label: "Report", text: "Báo cáo" },
                    { Icon: FaRegUser, label: "Suppliers", text: "Nhà cung cấp", element: <Supplier /> },
                    { Icon: BsBoxSeam, label: "Orders", text: "Đơn hàng", element: <Orders /> },
                    { Icon: BsClipboardCheck, label: "Manage Store", text: "Quản lý cửa hàng" },
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
    } else {
        return [
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
    }
};

export default useMenuItems;
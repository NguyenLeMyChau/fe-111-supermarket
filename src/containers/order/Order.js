import React, { useState } from 'react';
import './Order.scss';
import FrameData from '../frameData/FrameData';
import { useSelector } from 'react-redux';
import { formatCurrency, formatDate } from '../../utils/fotmatDate';
import { useNavigate } from 'react-router';
import Modal from '../../components/modal/Modal';
import TableData from '../tableData/tableData';
import Select from 'react-select';
import Button from '../../components/button/Button';
import { updateOrderStatus } from '../../services/warehouseRequest';
import { useAccessToken, useAxiosJWT } from '../../utils/axiosInstance';

export default function Order() {
    const navigate = useNavigate();

    const axiosJWT = useAxiosJWT();
    const accessToken = useAccessToken();

    const orders = useSelector((state) => state.order?.orders);

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [orderDetail, setOrderDetail] = useState(null);
    const [orderStatus, setOrderStatus] = useState(false);

    const orderStatuses = [
        { value: 'Đang chờ xử lý', label: 'Đang chờ xử lý', color: '#FFA500' },
        { value: 'Đã duyệt', label: 'Đã duyệt', color: '#008000' },
        { value: 'Đang giao hàng', label: 'Đang giao hàng', color: '#0000FF' },
        { value: 'Đã giao hàng', label: 'Đã giao hàng', color: '#800080' },
        { value: 'Bị từ chối', label: 'Bị từ chối', color: '#FF0000' },
        { value: 'Đã hủy', label: 'Đã hủy', color: '#A9A9A9' },
    ];

    const getStatusColor = (status) => {
        const matchedStatus = orderStatuses.find(s => s.value === status);
        return matchedStatus ? matchedStatus.color : '#000000';
    };

    const orderColumn = [
        {
            title: 'Nhà cung cấp',
            dataIndex: 'supplierName',
            key: 'supplierName',
            width: '30%',
            render: (text, record) => record.supplier_id.name
        },
        {
            title: 'Người đặt',
            dataIndex: 'employeeName',
            key: 'employeeName',
            width: '20%',
            render: (text, record) => record.employee ? record.employee.name : 'Không xác định'
        },
        {
            title: 'Ngày đặt hàng',
            dataIndex: 'createdAt',
            key: 'createdAt',
            width: '20%',
            className: 'text-center',
            render: (date) => formatDate(date)
        },
        {
            title: 'Tổng giá trị',
            dataIndex: 'total',
            key: 'total',
            width: '10%',
            className: 'text-right',
            render: (total) => formatCurrency(total)
        },
        {
            title: 'Trạng thái',
            dataIndex: 'status',
            key: 'status',
            width: '20%',
            render: (status) => (
                <span style={{ color: getStatusColor(status), fontSize: 14, fontWeight: 500 }}>
                    {status}
                </span>
            ),
        },
    ];

    const productColumns = [
        { title: 'Tên sản phẩm', dataIndex: 'name', key: 'name', width: '35%' },
        { title: 'Số lượng', dataIndex: 'quantity', key: 'quantity', width: '35%', className: 'text-center' },
        { title: 'Giá nhập', dataIndex: 'price', key: 'price', width: '20%', className: 'text-center', render: (price) => formatCurrency(price) },
    ];

    const handleRowClick = (order) => {
        const orderProducts = Array.isArray(order.products) ? order.products : [];
        const matchedStatus = orderStatuses.find(status => status.value === order.status);

        const booleanStatus = ['Đã giao hàng', 'Bị từ chối', 'Đã hủy'].includes(matchedStatus.value);
        if (booleanStatus)
            setOrderStatus(true);
        else setOrderStatus(false);

        setOrderDetail({
            orderId: order._id,
            status: matchedStatus,
            products: orderProducts
        });

        setIsModalOpen(true);

    };

    const closeModal = () => {
        setIsModalOpen(false);
        setOrderDetail(null);
    };


    const handleStatusSelect = (selectedOption) => {
        setOrderDetail(prevDetail => ({
            ...prevDetail,
            status: selectedOption
        }));
    };

    const handleUpdateStatus = async () => {
        if (window.confirm('Bạn có chắc chắn muốn cập nhật trạng thái đơn hàng không?')) {
            try {
                await updateOrderStatus(accessToken, axiosJWT, orderDetail.orderId, orderDetail.status.value, orderDetail.products);
                alert('Cập nhật trạng thái đơn hàng thành công');
                navigate('/admin/order');
                // setIsModalOpen(false);
            } catch (error) {
                console.error('Failed to update status:', error);
            }
        }
    };


    return (
        <div>
            <FrameData
                title="Đơn hàng"
                buttonText="Thêm đơn hàng"
                data={orders}
                columns={orderColumn}
                onButtonClick={() => {
                    navigate('/admin/order/add-order');
                }}
                onRowClick={handleRowClick}
            />

            <Modal
                title={'Chi tiết đơn hàng'}
                isOpen={isModalOpen}
                onClose={closeModal}
            >
                <div className='order-container-status'>
                    <label>Trạng thái:</label>
                    <Select
                        value={orderDetail?.status}
                        onChange={handleStatusSelect}
                        options={orderStatuses}
                        isDisabled={orderStatus}
                        menuPortalTarget={document.body}
                        styles={{
                            menuPortal: base => ({ ...base, zIndex: 9999, width: 200 }),
                            option: (provided, state) => ({
                                ...provided,
                                color: state.data.color,
                                fontWeight: 500
                            }),
                            singleValue: (provided, state) => ({
                                ...provided,
                                color: state.data.color,
                                fontWeight: 500
                            }),
                        }}
                    />

                    {
                        !orderStatus && (
                            <Button
                                text="Cập nhật trạng thái"
                                backgroundColor="#1366D9"
                                onClick={handleUpdateStatus}
                                className="update-status-button"
                            />
                        )
                    }
                </div>


                {orderDetail?.products?.length > 0 ? (
                    <TableData
                        columns={productColumns}
                        data={orderDetail.products}
                    />
                ) : (
                    <p style={{ marginLeft: 30 }}>Không có sản phẩm nào trong danh mục này.</p>
                )}
            </Modal>
        </div>

    );
}


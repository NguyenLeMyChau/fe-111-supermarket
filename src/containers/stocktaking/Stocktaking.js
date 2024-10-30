import React, { useState } from 'react';
import { formatDate } from '../../utils/fotmatDate';
import FrameData from '../../containers/frameData/FrameData';
import { useLocation, useNavigate } from 'react-router';
import AddStocktaking from './AddStocktaking';
import { useSelector } from 'react-redux';
import Modal from '../../components/modal/Modal';
import { formatDistanceToNow } from 'date-fns';
import { vi } from 'date-fns/locale';
import { MdAutoDelete, MdCancel, MdCheckCircle } from "react-icons/md";
import { useAccessToken, useAxiosJWT } from '../../utils/axiosInstance';
import ClipLoader from 'react-spinners/ClipLoader'; // Import ClipLoader

export default function Stocktaking() {
    const navigate = useNavigate();
    const location = useLocation();
    const accessToken = useAccessToken();
    const axiosJWT = useAxiosJWT();

    const orders = useSelector((state) => state.order?.orders);
    const sortedOrders = [...orders].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

    const isAddBill = location.pathname.includes('add-stocktaking');
    const [isBillDetail, setIsBillDetail] = useState(false);
    const [selectedOrder, setSelectedOrder] = useState(null);
    const [loading, setLoading] = useState(false);
    const [loadingBillId, setLoadingBillId] = useState(null); // State to track the currently loading bill ID
    const [isCancelModalOpen, setIsCancelModalOpen] = useState(false); // State to control the cancel reason modal
    const [cancelBillId, setCancelBillId] = useState(null); // State to track the bill ID being canceled

    const orderColumn = [
        {
            title: 'Mã phiếu nhập kho',
            dataIndex: 'bill_id',
            key: 'bill_id',
            width: '15%',
        },
        {
            title: 'Người nhập phiếu',
            dataIndex: 'employeeName',
            key: 'employeeName',
            width: '20%',
            render: (text, record) => record.employee ? record.employee.name : 'Không xác định'
        },
        {
            title: 'Ngày nhập phiếu',
            dataIndex: 'createdAt',
            key: 'createdAt',
            width: '15%',
            render: (date) => (
                <div>
                    <div>{formatDate(date)}</div>
                    <div style={{ fontSize: '12px', color: 'gray' }}>
                        {formatDistanceToNow(new Date(date), { addSuffix: true, locale: vi })}
                    </div>
                </div>
            )
        },
        {
            title: 'Huỷ phiếu',
            key: 'edit',
            width: '10%',
            className: 'text-center',
            render: (text, record) => (
                record.status ? (
                    loading && loadingBillId === record._id ? (
                        <ClipLoader size={30} color="#2392D0" loading={loading} />
                    ) : (
                        <MdAutoDelete
                            style={{ color: 'red', cursor: 'pointer' }}
                            size={25}
                            onClick={(event) => {
                                event.stopPropagation(); // Ngăn chặn sự kiện click của hàng bảng
                                setCancelBillId(record._id); // Set the bill ID to be canceled
                                setIsCancelModalOpen(true); // Open the cancel reason modal
                            }}
                        />
                    )
                ) : (
                    <MdAutoDelete
                        style={{ color: 'gray', cursor: 'not-allowed' }}
                        size={25}
                    />
                )
            ),
        },
        {
            title: 'Trạng thái',
            key: 'status',
            width: '10%',
            className: 'text-center',
            render: (text, record) => (
                record.status ? (
                    <MdCheckCircle
                        style={{ color: 'green', cursor: 'pointer' }}
                        size={25}
                    />
                ) : (
                    <MdCancel
                        style={{ color: 'red', cursor: 'pointer' }}
                        size={25}
                    />
                )
            ),
        },
    ];


    const handleRowClick = async (order) => {
        setSelectedOrder(order);
        setIsBillDetail(true);
        console.log('order', order);
    };

    return (
        <div>
            {
                isAddBill ? (
                    <AddStocktaking />
                ) : isBillDetail ? (
                    <Modal
                        title={'Thông tin phiếu kiểm kê'}
                        isOpen={isBillDetail}
                        onClose={() => setIsBillDetail(false)}
                        width={'60%'}
                    >
                        {/* <BillDetail bill={selectedOrder} /> */}
                    </Modal>
                ) : (
                    <>
                        <FrameData
                            title="Phiếu kiểm kê kho"
                            buttonText="Thêm phiếu kiểm kê kho"
                            data={sortedOrders}
                            columns={orderColumn}
                            onRowClick={handleRowClick}
                            onButtonClick={() => {
                                navigate('/admin/stocktaking/add-stocktaking');
                            }}
                        />
                    </>
                )}

        </div>
    );
}
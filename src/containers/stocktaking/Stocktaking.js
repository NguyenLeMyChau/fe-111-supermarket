import React, { useState } from 'react';
import { formatDate } from '../../utils/fotmatDate';
import FrameData from '../../containers/frameData/FrameData';
import { useLocation, useNavigate } from 'react-router';
import AddStocktaking from './AddStocktaking';
import { useSelector } from 'react-redux';
import Modal from '../../components/modal/Modal';
import { formatDistanceToNow } from 'date-fns';
import { vi } from 'date-fns/locale';
import StocktakingDetail from './StocktakingDetail';

export default function Stocktaking() {
    const navigate = useNavigate();
    const location = useLocation();

    const stocktakings = useSelector((state) => state.stocktaking?.stocktakings) || [];
    const sortedOrders = Array.isArray(stocktakings)
        ? [...stocktakings].sort((a, b) => new Date(b.stocktakingHeader.createdAt) - new Date(a.stocktakingHeader.createdAt))
        : [];


        console.log(sortedOrders.map(item => item.stocktakingHeader?.createdAt));

    const isAddBill = location.pathname.includes('add-stocktaking');
    const [isBillDetail, setIsBillDetail] = useState(false);
    const [selectedOrder, setSelectedOrder] = useState(null);

    const orderColumn = [
        {
            title: 'Mã phiếu kiểm kê',
            dataIndex: 'stocktaking_id',
            key: 'stocktaking_id',
            width: '15%',
            render: (text, record) => record.stocktakingHeader ? record.stocktakingHeader.stocktaking_id : 'Không xác định'
        },
        {
            title: 'Người kiểm kê',
            dataIndex: 'employeeName',
            key: 'employeeName',
            width: '20%',
            render: (text, record) => record.employee ? record.employee.name : 'Không xác định'
        },
        {
            title: 'Lý do',
            dataIndex: 'reason',
            key: 'reason',
            width: '40%',
            render: (text, record) => record.stocktakingHeader ? record.stocktakingHeader.reason : 'Không xác định'

        },
        {
            title: 'Ngày tạo phiếu',
            dataIndex: 'createdAt',
            key: 'createdAt',
            width: '15%',
            render: (text, record) => {
                const validDate = record.stocktakingHeader.createdAt;
                return validDate ? (
                    <div>
                        <div>{formatDate(validDate)}</div>
                        <div style={{ fontSize: '12px', color: 'gray' }}>
                            {formatDistanceToNow(new Date(validDate), { addSuffix: true, locale: vi })}
                        </div>
                    </div>
                ) : (
                    <div>Không xác định</div>
                );
            }
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
                        <StocktakingDetail bill={selectedOrder} />
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
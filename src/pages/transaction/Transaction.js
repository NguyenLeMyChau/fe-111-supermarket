import React from 'react';
import { useSelector } from 'react-redux';
import FrameData from '../../containers/frameData/FrameData';
import { formatDate } from '../../utils/fotmatDate';
import { formatDistanceToNow } from 'date-fns';
import { vi } from 'date-fns/locale';

export default function Transaction() {

    const transactions = useSelector((state) => state.transaction?.transactions) || [];
    const sortedTransactions = [...transactions].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

    const transactionColumn = [
        { title: 'Mã giao dịch', dataIndex: '_id', key: '_id', width: '25%' },
        { title: 'Kiểu', dataIndex: 'type', key: 'type', width: '15%' },
        {
            title: 'Ngày giao dịch',
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
        { title: 'Số lượng', dataIndex: 'quantity', key: 'quantity', width: '15%', className: 'text-center' },
    ];

    return (
        <div>
            <FrameData
                title="Giao dịch"
                data={sortedTransactions}
                columns={transactionColumn}
            />
        </div>
    );
}
import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import FrameData from '../../containers/frameData/FrameData';
import { formatDate } from '../../utils/fotmatDate';
import { formatDistanceToNow } from 'date-fns';
import { vi } from 'date-fns/locale';
import useAddBill from '../../hooks/useAddBill';
import Modal from '../../components/modal/Modal';
import Select from 'react-select';
import Button from '../../components/button/Button';

export default function Transaction() {
    const transactions = useSelector((state) => state.transaction?.transactions) || [];
    const sortedTransactions = [...transactions].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    const { getItemCodeProduct, getNameProduct, getUnitDescription } = useAddBill();

    const [isFilterOpen, setIsFilterOpen] = useState(false);
    const [filters, setFilters] = useState({
        item_code: [],
        productName: [],
        startDate: '',
        endDate: '',
    });
    const [filteredTransactions, setFilteredTransactions] = useState(sortedTransactions);

    const transactionColumn = [
        { title: 'Mã hàng', dataIndex: 'product_id', key: 'product_item_code', width: '10%', render: (product_id) => getItemCodeProduct(product_id) },
        { title: 'Tên sản phẩm', dataIndex: 'product_id', key: 'product_name', width: '30%', render: (product_id) => getNameProduct(product_id) },
        { title: 'Đơn vị', dataIndex: 'unit_id', key: 'unit_description', width: '10%', render: (unit_id) => getUnitDescription(unit_id) },
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

    const uniqueItemCodeOptions = Array.from(new Set(transactions.map(transaction => getItemCodeProduct(transaction.product_id))))
        .map(item_code => ({ value: item_code, label: item_code }));

    const uniqueProductOptions = Array.from(new Set(transactions.map(transaction => getNameProduct(transaction.product_id))))
        .map(name => ({ value: name, label: name }));

    const handleFilterClick = () => {
        setIsFilterOpen(true);
    };

    const closeFilterModal = () => {
        setIsFilterOpen(false);
    };

    const applyFilters = () => {
        let filteredData = sortedTransactions;

        if (filters.item_code.length > 0) {
            filteredData = filteredData.filter(transaction => filters.item_code.includes(getItemCodeProduct(transaction.product_id)));
        }

        if (filters.productName.length > 0) {
            filteredData = filteredData.filter(transaction => filters.productName.includes(getNameProduct(transaction.product_id)));
        }

        if (filters.startDate) {
            filteredData = filteredData.filter(transaction => new Date(transaction.createdAt) >= new Date(filters.startDate));
        }

        if (filters.endDate) {
            filteredData = filteredData.filter(transaction => new Date(transaction.createdAt) <= new Date(filters.endDate));
        }

        setFilteredTransactions(filteredData);
        closeFilterModal();
    };

    const resetFilters = () => {
        setFilters({
            item_code: [],
            productName: [],
            startDate: '',
            endDate: '',
        });
        setFilteredTransactions(sortedTransactions);
    };

    return (
        <div>
            <FrameData
                title="Giao dịch"
                data={filteredTransactions}
                columns={transactionColumn}
                itemsPerPage={10}
                handleFilterClick={handleFilterClick}
            />

            <Modal
                title="Lọc giao dịch"
                isOpen={isFilterOpen}
                onClose={closeFilterModal}
                width={500}
                height='auto'
            >
                <div className="filter-modal-content">
                    <div className="filter-item">
                        <label>Mã hàng</label>
                        <Select
                            isMulti
                            value={uniqueItemCodeOptions.filter(option => filters.item_code.includes(option.value))}
                            options={uniqueItemCodeOptions}
                            onChange={(selectedOptions) => setFilters({ ...filters, item_code: selectedOptions.map(option => option.value) })}
                            styles={{
                                container: (provided) => ({ ...provided, width: '265px', zIndex: 9999 }),
                            }}
                        />
                    </div>
                    <div className="filter-item">
                        <label>Tên sản phẩm</label>
                        <Select
                            isMulti
                            value={uniqueProductOptions.filter(option => filters.productName.includes(option.value))}
                            options={uniqueProductOptions}
                            onChange={(selectedOptions) => setFilters({ ...filters, productName: selectedOptions.map(option => option.value) })}
                            styles={{
                                container: (provided) => ({ ...provided, width: '265px', zIndex: 8888 }),
                            }}
                        />
                    </div>
                    <div className="filter-item">
                        <label>Thời gian bắt đầu</label>
                        <input
                            type="date"
                            value={filters.startDate}
                            onChange={(e) => setFilters({ ...filters, startDate: e.target.value })}
                        />
                    </div>
                    <div className="filter-item">
                        <label>Thời gian kết thúc</label>
                        <input
                            type="date"
                            value={filters.endDate}
                            onChange={(e) => setFilters({ ...filters, endDate: e.target.value })}
                        />
                    </div>
                    <div className='button-filter'>
                        <Button
                            text='Lọc'
                            backgroundColor='#1366D9'
                            color='white'
                            width='150'
                            onClick={applyFilters}
                        />
                        <Button
                            text='Huỷ lọc'
                            backgroundColor='#FF0000'
                            color='white'
                            width='150'
                            onClick={resetFilters}
                        />
                    </div>
                </div>
            </Modal>
        </div>
    );
}
import React, { useState } from 'react';
import './Product.scss';

import PropTypes from 'prop-types';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Box from '@mui/material/Box';
import { useLocation } from 'react-router';
import TableData from '../../containers/tableData/tableData';
import { formatDate } from '../../utils/fotmatDate';
import useAddBill from '../../hooks/useAddBill';

function CustomTabPanel(props) {
    const { children, value, index, ...other } = props;

    return (
        <div
            role="tabpanel"
            hidden={value !== index}
            id={`simple-tabpanel-${index}`}
            aria-labelledby={`simple-tab-${index}`}
            {...other}
        >
            {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
        </div>
    );
}

CustomTabPanel.propTypes = {
    children: PropTypes.node,
    index: PropTypes.number.isRequired,
    value: PropTypes.number.isRequired,
};

function a11yProps(index) {
    return {
        id: `simple-tab-${index}`,
        'aria-controls': `simple-tabpanel-${index}`,
    };
}

export default function ProductDetail() {
    const [value, setValue] = useState(0);
    const location = useLocation();
    const { detail: data } = location.state || {};
    const { getUnitDescription } = useAddBill();

    const handleChange = (event, newValue) => {
        setValue(newValue);
    };

    const transactionColumn = [
        { title: 'Mã giao dịch', dataIndex: '_id', key: '_id', width: '25%' },
        { title: 'Kiểu', dataIndex: 'type', key: 'type', width: '15%' },
        {
            title: 'Ngày giao dịch',
            dataIndex: 'createdAt',
            key: 'createdAt',
            width: '15%',
            className: 'text-center',
            render: (date) => formatDate(date)
        },
        { title: 'Số lượng', dataIndex: 'quantity', key: 'quantity', width: '15%', className: 'text-center' },
    ];

    return (
        <div className='product-detail-container'>
            <h2>{data.name}</h2>
            <Box sx={{ width: '100%' }}>
                <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                    <Tabs value={value} onChange={handleChange} aria-label="basic tabs example">
                        <Tab label="Thông tin" {...a11yProps(0)} sx={{ marginRight: 5 }} />
                        <Tab label="Giao dịch" {...a11yProps(1)} sx={{ marginRight: 5 }} />
                    </Tabs>
                </Box>
                <CustomTabPanel value={value} index={0}>
                    <div className='information'>
                        <h3>Thông tin chính</h3>
                        <div className='header'>
                            <div className='left'>
                                <div className='row'>
                                    <label>Mã hàng</label>
                                    <span>{data.item_code}</span>
                                </div>
                                <div className='row'>
                                    <label>Tên sản phẩm</label>
                                    <span>{data.name}</span>
                                </div>

                                <div className='row'>
                                    <label>Loại sản phẩm</label>
                                    <span>{data.category_id.name}</span>
                                </div>
                                <div className='row'>
                                    <label>Barcode</label>
                                    <span>{data.barcode}</span>
                                </div>

                            </div>
                            <div className='right flex-row-align-center'>
                                <img src={data.img} alt='avatar' />
                            </div>
                        </div>

                        <h3>Nhà cung cấp</h3>
                        <div className='header'>
                            <div className='left'>
                                <div className='row'>
                                    <label>Tên nhà cung cấp</label>
                                    <span>{data.supplier_id.name}</span>
                                </div>
                                <div className='row'>
                                    <label>Số điện thoại</label>
                                    <span>{data.supplier_id.phone}</span>
                                </div>
                                <div className='row'>
                                    <label>Email</label>
                                    <span>{data.supplier_id.email}</span>
                                </div>
                            </div>

                            <div className='right'>
                                <div className='row'>
                                    <label>Đơn vị cơ bản</label>
                                    <span>{data.unit_id.description}</span>
                                </div>
                                <div className='row'>
                                    <label>Tồn kho</label>
                                    <span>{data.warehouse.stock_quantity}</span>
                                </div>
                                <div className='row'>
                                    <label>Ngưỡng giá trị</label>
                                    <span>{data.warehouse.min_stock_threshold}</span>
                                </div>
                            </div>
                        </div>

                        <h3>Đơn vị tính</h3>
                        <table style={{ width: "100%", borderCollapse: "collapse", border: "1px solid black" }}>
                            <thead>
                                <tr>
                                    <th>Đơn vị tính</th>
                                    <th>Số lượng</th>
                                    <th>Barcode</th>
                                    <th>Hình ảnh</th>
                                    <th>Đơn vị cơ bản</th>
                                </tr>
                            </thead>
                            <tbody>
                                {data.unit_convert.map((item, index) => (
                                    <tr key={index}>
                                        <td>{getUnitDescription(item.unit)}</td>
                                        <td>{item.quantity}</td>
                                        <td>{item.barcode}</td>
                                        <td>
                                            <img src={item.img} alt={`Unit ${item.unit}`} width="50" height="50" />
                                        </td>
                                        <td style={{ fontSize: 30 }}>{item.checkBaseUnit ? "x" : ''}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>

                    </div>
                </CustomTabPanel>
                <CustomTabPanel value={value} index={1}>
                    <div className='information'>
                        <h3>Danh sách giao dịch</h3>
                    </div>
                    <TableData
                        data={data.transactions}
                        columns={transactionColumn}
                    />
                </CustomTabPanel>

            </Box>
        </div>
    );
}
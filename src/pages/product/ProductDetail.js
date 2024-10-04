import React, { useState } from 'react';
import './Product.scss';

import PropTypes from 'prop-types';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Box from '@mui/material/Box';
import avatar from '../../assets/logo-supermarket-removebg.png';

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

    const handleChange = (event, newValue) => {
        setValue(newValue);
    };

    return (
        <div className='product-detail-container'>
            <h2>Margi</h2>
            <Box sx={{ width: '100%' }}>
                <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                    <Tabs value={value} onChange={handleChange} aria-label="basic tabs example">
                        <Tab label="Thông tin" {...a11yProps(0)} sx={{ marginRight: 5 }} />
                        <Tab label="Giao dịch" {...a11yProps(1)} sx={{ marginRight: 5 }} />
                        <Tab label="Lịch sử" {...a11yProps(2)} sx={{ marginRight: 5 }} />
                        <Tab label="Nhà cung cấp" {...a11yProps(2)} sx={{ marginRight: 5 }} />
                    </Tabs>
                </Box>
                <CustomTabPanel value={value} index={0}>
                    <div className='information'>
                        <h3>Thông tin chính</h3>
                        <div className='header'>
                            <div className='left'>
                                <div className='row'>
                                    <label>Tên sản phẩm</label>
                                    <span>Margin</span>
                                </div>
                                <div className='row'>
                                    <label>ID sản phẩm</label>
                                    <span>087426985</span>
                                </div>
                                <div className='row'>
                                    <label>Loại sản phẩm</label>
                                    <span>Bánh kẹo</span>
                                </div>
                                <div className='row'>
                                    <label>Barcode</label>
                                    <span>087528</span>
                                </div>
                                <div className='row'>
                                    <label>Mã sản phẩm</label>
                                    <span>M884</span>
                                </div>
                            </div>
                            <div className='right flex-row-align-center'>
                                <img src={avatar} alt='avatar' />
                            </div>
                        </div>

                        <h3>Nhà cung cấp</h3>
                        <div className='header'>
                            <div className='left'>
                                <div className='row'>
                                    <label>Tên nhà cung cấp</label>
                                    <span>Vinamilk</span>
                                </div>
                                <div className='row'>
                                    <label>Số điện thoại</label>
                                    <span>087426985</span>
                                </div>
                                <div className='row'>
                                    <label>email</label>
                                    <span>email@gmail.com</span>
                                </div>

                            </div>
                            <div className='right'>
                                <div className='row'>
                                    <label>Tồn kho</label>
                                    <span>100</span>
                                </div>
                                <div className='row'>
                                    <label>Ngưỡng giá trị</label>
                                    <span>24</span>
                                </div>
                                <div className='row'>
                                    <label>Đang trên đường</label>
                                    <span>0</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </CustomTabPanel>
                <CustomTabPanel value={value} index={1}>
                    Item Two
                </CustomTabPanel>
                <CustomTabPanel value={value} index={2}>
                    Item Three
                </CustomTabPanel>
            </Box>
        </div>
    );
}
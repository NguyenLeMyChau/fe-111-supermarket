import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom'; // Import useNavigate
import './FrameData.scss';
import Button from '../../components/button/Button';
import { IoFilterOutline } from "react-icons/io5";
import usePagination from '../../hooks/usePagination';
import TableData from '../tableData/tableData';
import Pagination from '../../components/pagination/Pagination';

export default function FrameData({ 
    title, 
    buttonText, 
    data, 
    columns, 
    onRowClick, 
    renderModal, 
    onButtonClick, 
    handleFilterClick, 
    itemsPerPage,
    showGoBack // Thêm prop showGoBack
}) {
    const navigate = useNavigate(); // Khởi tạo navigate
    const [isModalAddItem, setIsModalAddItem] = useState(false);

    const setItemsPerPage = itemsPerPage ? itemsPerPage : 10;

    const {
        totalPages,
        currentItems,
    } = usePagination(data, setItemsPerPage);

    const handleButtonClick = () => {
        if (onButtonClick) {
            onButtonClick();
        } else {
            setIsModalAddItem(true);
        }
    };

    const handleGoBack = () => {
        navigate(-1); // Quay lại trang trước
    };

    return (
        <div className='frame-data-container'>
            <>
                <header className='flex-row-space-between frame-data-padding'>
                    <h3>{title}</h3>
                    <div className='flex-row-align-center'>
                        {/* Chỉ hiển thị nút Quay lại nếu showGoBack là true */}
                        {showGoBack && (
                            <Button
                                text='Quay lại'
                                className='text-sm font-weight-medium'
                                backgroundColor='#ccc' // Bạn có thể điều chỉnh màu sắc
                                onClick={handleGoBack}
                            />
                        )}
                        {buttonText && (
                            <Button
                                text={buttonText}
                                backgroundColor='#1366D9'
                                className='text-sm font-weight-medium'
                                onClick={handleButtonClick}
                            />
                        )}
                        {handleFilterClick && (
                            <Button
                                text='Lọc'
                                className='text-sm font-weight-medium text-black'
                                border='1px solid #D0D3D9'
                                icon={<IoFilterOutline size={20} />}
                                onClick={handleFilterClick}
                            />
                        )}
                    </div>
                </header>

                <main className='main'>
                    {currentItems && (
                        <div className='main-table'>
                            <TableData
                                columns={columns}
                                data={currentItems}
                                onRowClick={onRowClick}
                            />
                        </div>
                    )}

                    {totalPages > 0 && (
                        <Pagination data={data} itemsPerPage={setItemsPerPage} />
                    )}
                </main>

                {isModalAddItem && renderModal && renderModal(() => setIsModalAddItem(false))}
            </>
        </div>
    );
}

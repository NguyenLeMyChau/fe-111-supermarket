import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
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
    showGoBack
}) {
    const navigate = useNavigate();
    const [isModalAddItem, setIsModalAddItem] = useState(false);
    const [sortConfig, setSortConfig] = useState({ key: null, direction: 'asc' });

    const setItemsPerPage = itemsPerPage || 10;

    const sortedData = React.useMemo(() => {
        if (sortConfig.key) {
            return [...data].sort((a, b) => {
                const valueA = a[sortConfig.key];
                const valueB = b[sortConfig.key];
                if (valueA < valueB) return sortConfig.direction === 'asc' ? -1 : 1;
                if (valueA > valueB) return sortConfig.direction === 'asc' ? 1 : -1;
                return 0;
            });
        }
        return data;
    }, [data, sortConfig]);

    const handleSort = (key) => {
        let direction = 'asc';
        if (sortConfig.key === key && sortConfig.direction === 'asc') {
            direction = 'desc';
        }
        setSortConfig({ key, direction });
    };

    const {
        totalPages,
        currentItems,
    } = usePagination(sortedData, setItemsPerPage);

    const handleButtonClick = () => {
        if (onButtonClick) {
            onButtonClick();
        } else {
            setIsModalAddItem(true);
        }
    };

    const handleGoBack = () => {
        navigate(-1);
    };

    return (
        <div className='frame-data-container'>
            <header className='flex-row-space-between frame-data-padding'>
                <h3>{title}</h3>
                <div className='flex-row-align-center'>
                    {showGoBack && (
                        <Button
                            text='Quay lại'
                            className='text-sm font-weight-medium'
                            backgroundColor='#ccc'
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
                            columns={columns.map((col) => ({
                                ...col,
                                onSort: handleSort,
                                sortDirection: sortConfig.key === col.dataIndex ? sortConfig.direction : null,
                            }))}
                            data={currentItems}
                            onRowClick={onRowClick}
                        />
                    </div>
                )}

                {totalPages > 0 && (
                    <Pagination data={sortedData} itemsPerPage={setItemsPerPage} />
                )}
            </main>

            {isModalAddItem && renderModal && renderModal(() => setIsModalAddItem(false))}
        </div>
    );
}

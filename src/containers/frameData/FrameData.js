import React, { useState } from 'react';
import './FrameData.scss';
import Button from '../../components/button/Button';
import { IoFilterOutline } from "react-icons/io5";
import usePagination from '../../hooks/usePagination';
import TableData from '../tableData/tableData';

export default function FrameData({ title, buttonText, data, columns, onRowClick, renderModal }) {
    const itemsPerPage = 10;
    const [isModalAddItem, setIsModalAddItem] = useState(false);

    const {
        currentPage,
        totalPages,
        currentItems,
        handleNextPage,
        handlePreviousPage,
        inputPage,
        handlePageInputChange,
    } = usePagination(data, itemsPerPage);

    return (
        <div className='frame-data-container'>
            {buttonText && (
                <header className='flex-row-space-between frame-data-padding'>
                    <h3>{title}</h3>
                    <div className='flex-row-align-center'>
                        <Button
                            text={buttonText}
                            backgroundColor='#1366D9'
                            className='text-sm font-weight-medium'
                            onClick={() => setIsModalAddItem(true)} // Mở modal
                        />

                        <Button
                            text='Lọc'
                            className='text-sm font-weight-medium text-black'
                            border='1px solid #D0D3D9'
                            icon={<IoFilterOutline size={20} />}
                        />
                    </div>
                </header>
            )}

            <main>
                {currentItems && (
                    <TableData
                        columns={columns}
                        data={currentItems}
                        onRowClick={onRowClick}
                    />
                )}

                <div className="pagination">
                    <button onClick={handlePreviousPage} disabled={currentPage === 1}>
                        Trước
                    </button>
                    <input
                        type="number"
                        value={inputPage}
                        min={1}
                        max={totalPages}
                        onChange={handlePageInputChange}
                        className='input-pagation'
                    />

                    <span> / {totalPages}</span>
                    <button onClick={handleNextPage} disabled={currentPage === totalPages}>
                        Sau
                    </button>
                </div>
            </main>

            {isModalAddItem
                && renderModal
                && renderModal(() => setIsModalAddItem(false))
                //() => setIsModalAddItem(false): onClose
            }

        </div>
    );
}


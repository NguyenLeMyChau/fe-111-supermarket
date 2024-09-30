import React, { useState } from 'react';
import './FrameData.scss';
import Button from '../../components/button/Button';
import { IoFilterOutline } from "react-icons/io5";
import usePagination from '../../hooks/usePagination';
import TableData from '../tableData/tableData';

export default function FrameData({ title, buttonText, data, columns, onRowClick, renderModal, component, itemsPerPage }) {
    const [isModalAddItem, setIsModalAddItem] = useState(false);

    const {
        currentPage,
        totalPages,
        currentItems,
        goToPage
    } = usePagination(data, itemsPerPage ? itemsPerPage : 10);

    return (
        <div className='frame-data-container'>
            {component ? (
                <div className='component-container'>
                    {component}
                </div>
            ) : (
                <>
                    {buttonText && (
                        <header className='flex-row-space-between frame-data-padding'>
                            <h3>{title}</h3>
                            <div className='flex-row-align-center'>
                                <Button
                                    text={buttonText}
                                    backgroundColor='#1366D9'
                                    className='text-sm font-weight-medium'
                                    onClick={() => {
                                        setIsModalAddItem(true);
                                    }}
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

                        {totalPages > 0 && (
                            <div className="pagination">
                                <button onClick={() => goToPage(currentPage - 1)} disabled={currentPage === 1}>
                                    Trước
                                </button>
                                <span> {currentPage}/ {totalPages}</span>
                                <button onClick={() => goToPage(currentPage + 1)} disabled={currentPage === totalPages}>
                                    Sau
                                </button>
                            </div>
                        )}
                    </main>

                    {isModalAddItem
                        && renderModal
                        && renderModal(() => setIsModalAddItem(false))
                        //() => setIsModalAddItem(false): onClose
                    }
                </>
            )}
        </div>
    );
}


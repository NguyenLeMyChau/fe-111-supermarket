import React, { useState } from 'react';
import './FrameData.scss';
import Button from '../../components/button/Button';
import { IoFilterOutline } from "react-icons/io5";
import usePagination from '../../hooks/usePagination';
import TableData from '../tableData/tableData';
import Pagination from '../../components/pagination/Pagination';

export default function FrameData({ title, buttonText, data, columns, onRowClick, renderModal, component, itemsPerPage }) {
    const [isModalAddItem, setIsModalAddItem] = useState(false);
    const setItemsPerPage = itemsPerPage ? itemsPerPage : 10;

    const {
        totalPages,
        currentItems,
    } = usePagination(data, setItemsPerPage);

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


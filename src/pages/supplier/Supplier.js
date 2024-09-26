import React from 'react';
import './Supplier.scss';
import Button from '../../components/button/Button';
import { IoFilterOutline } from "react-icons/io5";
import { useSelector } from 'react-redux';
import usePagination from '../../hooks/usePagination';

export default function Supplier() {
    const suppliers = useSelector((state) => state.commonData?.dataManager?.suppliers);
    const itemsPerPage = 10;

    const {
        currentPage,
        totalPages,
        currentItems,
        handleNextPage,
        handlePreviousPage,
    } = usePagination(suppliers, itemsPerPage);

    return (
        <div className='supplier-container'>
            <header className='flex-row-space-between'>
                <h3>Nhà cung cấp</h3>
                <div className='flex-row-align-center'>
                    <Button
                        text='Thêm nhà cung cấp'
                        backgroundColor='#1366D9'
                        className='text-sm font-weight-medium'
                    />

                    <Button
                        text='Lọc'
                        className='text-sm font-weight-medium text-black'
                        border='1px solid #D0D3D9'
                        icon={<IoFilterOutline size={20} />}
                    />
                </div>
            </header>

            <main>
                {currentItems && (
                    <table className="table">
                        <thead>
                            <tr>
                                <th>Nhà cung cấp</th>
                                <th>Số điện thoại</th>
                                <th>Email</th>
                            </tr>
                        </thead>
                        <tbody>
                            {currentItems.map((supplier) => (
                                <tr key={supplier._id}>
                                    <td>{supplier.name}</td>
                                    <td>{supplier.phone}</td>
                                    <td>{supplier.email}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}

                <div className="pagination">
                    <button onClick={handlePreviousPage} disabled={currentPage === 1}>
                        Trước
                    </button>
                    <span> {currentPage} / {totalPages}</span>
                    <button onClick={handleNextPage} disabled={currentPage === totalPages}>
                        Sau
                    </button>
                </div>
            </main>


        </div>
    );
}


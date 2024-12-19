import React from 'react';
import './table.scss';
import { FaSort, FaSortUp, FaSortDown } from 'react-icons/fa';

export default function TableData({ columns, data, onRowClick }) {
    const renderSortIcon = (key, sortDirection) => {
        if (!sortDirection) return <FaSort />;
        return sortDirection === 'asc' ? <FaSortUp /> : <FaSortDown />;
    };

    return (
        <table className="table">
            <thead>
                <tr>
                    {columns.map((column) => (
                        <th
                            key={column.key}
                            className={column.className}
                            style={{ width: column.width, cursor: column.sortable ? 'pointer' : 'default' }}
                            onClick={() => column.sortable && column.onSort && column.onSort(column.dataIndex)}
                        >
                            {column.title} {column.sortable && renderSortIcon(column.dataIndex, column.sortDirection)}
                        </th>
                    ))}
                </tr>
            </thead>
            <tbody>
                {data.map((item, index) => (
                    <tr
                        key={item._id}
                        onClick={() => onRowClick && onRowClick(item)}
                        style={{ cursor: onRowClick ? 'pointer' : 'default' }}
                    >
                        {columns.map((column) => (
                            <td key={column.key} className={column.className}>
                                {column.render ? column.render(item[column.dataIndex], item, index) : item[column.dataIndex]}
                            </td>
                        ))}
                    </tr>
                ))}
            </tbody>
        </table>
    );
}

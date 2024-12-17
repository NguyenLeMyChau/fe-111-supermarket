import React, { useState } from 'react';
import './table.scss';
import { FaSort, FaSortUp, FaSortDown } from 'react-icons/fa'; // Import icons

export default function TableData({ columns, data, onRowClick }) {
    const [sortConfig, setSortConfig] = useState({ key: null, direction: 'asc' });

    // Hàm sắp xếp dữ liệu
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

    const renderSortIcon = (key) => {
        if (sortConfig.key !== key) return <FaSort />;
        return sortConfig.direction === 'asc' ? <FaSortUp /> : <FaSortDown />;
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
                            onClick={() => column.sortable && handleSort(column.dataIndex)}
                        >
                            {column.title} {column.sortable && renderSortIcon(column.dataIndex)}
                        </th>
                    ))}
                </tr>
            </thead>
            <tbody>
                {sortedData.map((item, index) => (
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

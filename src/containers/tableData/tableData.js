import React from 'react';

export default function TableData({ columns, data, onRowClick }) {
    return (
        <table className="table">
            <thead>
                <tr>
                    {columns.map((column) => (
                        <th key={column.key} style={{ width: column.width }}>{column.title}</th>
                    ))}
                </tr>
            </thead>
            <tbody>
                {data.map((item, rowIndex) => (
                    <tr
                        key={rowIndex}
                        onClick={() => onRowClick && onRowClick(item)}
                        style={{ cursor: onRowClick ? 'pointer' : 'default' }}
                    >
                        {columns.map((column) => (
                            <td key={column.key}>{item[column.dataIndex]}</td>
                        ))}
                    </tr>
                ))}
            </tbody>
        </table>
    );
}
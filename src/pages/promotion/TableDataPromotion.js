import React, { useState } from 'react';
// import './table.scss';
import { FaAngleDown, FaAngleLeft, FaAngleRight } from 'react-icons/fa'; // Import icons

export default function TableDataPromotion({ columns, data, onRowClick, columnLine }) {
    const [expandedRows, setExpandedRows] = useState({}); // State as an object

    // Define types for better mapping
    const types = {
        quantity: 'Tặng sản phẩm',
        amount: 'Tặng tiền',
        percentage: 'Giảm hóa đơn',
    };

    const toggleRow = (index) => {
        setExpandedRows((prevState) => ({
            ...prevState,
            [index]: !prevState[index],
        }));
    };

    return (
        <div>
            <table className="table main-table">
                <thead>
                    <tr>
                        {columns.map((column) => (
                            <th key={column.key} className={column.className} style={{ width: column.width }}>
                                {column.title}
                            </th>
                        ))}
                    </tr>
                </thead>
                <tbody>
                    {data.map((item, index) => (
                        <React.Fragment key={item._id}>
                            {/* Main Row for promotionHeader */}
                            <tr
                                onClick={() => toggleRow(index)}
                                style={{ cursor: 'default' }} // Light background for parent row
                            >
                                {columns.map((column) => (
                                    <td key={column.key} className={column.className}>
                                        {column.render ? column.render(item[column.dataIndex], item, index) : item[column.dataIndex]}
                                    </td>
                                ))}
                                 <td>
                                    {expandedRows[index] ? (
                                        <FaAngleDown /> // Down arrow for expanded
                                    ) : (
                                        <FaAngleLeft /> // Right arrow for collapsed
                                    )}
                                </td>
                            </tr>

                            {/* Expanded Rows for promotionLine */}
                            {expandedRows[index] && (
                                <React.Fragment>
                                    {/* Expanded Header Row */}
                                    <tr>
                                        {columnLine.map((column) => (
                                            <th key={column.key} className={column.className} style={{ width: column.width }}>
                                                {column.title}
                                            </th>
                                        ))}
                                    </tr>
                                    {/* Expanded Data Rows */}
                                    {item.lines.map((line) => (
                                        <tr key={line._id}  
                                            onClick={() => {
                                                onRowClick && onRowClick(line);
                                            }}
                                            style={{ cursor: 'pointer', backgroundColor: '#e0e0e0' }} // Different background for child row
                                        >
                                            {columnLine.map((column) => (
                                                <td key={column.key} className={column.className}>
                                                    {column.render ? column.render(line[column.dataIndex], line, index) : line[column.dataIndex]}
                                                </td>
                                            ))}
                                        </tr>
                                    ))}
                                </React.Fragment>
                            )}
                        </React.Fragment>
                    ))}
                </tbody>
            </table>
        </div>
    );
}

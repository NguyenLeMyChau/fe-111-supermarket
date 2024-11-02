import React, { useState } from "react";
import "./Promotion.scss";
import { FaAngleDown, FaAngleLeft, FaPlusCircle } from "react-icons/fa"; // Import icons

export default function TableDataPromotion({
  columns,
  data,
  onRowClick,
  columnLine,
  onAddLine,
}) {
  const [expandedRows, setExpandedRows] = useState({}); // State as an object
  console.log(data);
  const toggleRow = (index) => {
    setExpandedRows((prevState) => ({
      ...prevState,
      [index]: !prevState[index],
    }));
  };

  return (
    <div>
      <table className="tablepromotion main-table">
        <thead>
          <tr>
            {columns.map((column) => (
              <th
                key={column.key}
                className={column.className}
                style={{ width: column.width }}
              >
                {column.title}
              </th>
            ))}
            <th style={{ width: "100px" }} /> {/* For the arrow icon */}
          </tr>
        </thead>
        <tbody>
          {Array.isArray(data) &&
            data.map((item, index) => (
              <React.Fragment key={item._id}>
                {/* Main Row for promotionHeader */}
                <tr
                  onClick={() => toggleRow(index)}
                  className="tablepromotionth"
                >
                  {columns.map((column) => (
                    <td key={column.key} className={column.className}>
                      {column.render
                        ? column.render(item[column.dataIndex], item, index)
                        : item[column.dataIndex]}
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
                    <tr style={{ backgroundColor: "#ddd" }}>
                      <td colSpan={columns.length + 1} style={{ padding: 0 }}>
                        <tr style={{ backgroundColor: "orange" }}>
                          {columnLine.map((column) => (
                            <th
                              key={column.key}
                              className={column.className}
                              style={{ width: column.width }}
                            >
                              {column.title}
                            </th>
                          ))}
                          <th>
                            {/* Thêm biểu tượng thêm dòng */}
                            <FaPlusCircle
                              style={{ cursor: "pointer" }}
                              onClick={() =>onAddLine && onAddLine(item)} // Gọi hàm thêm dòng khi nhấn
                            />
                          </th>
                        </tr>
                        {/* Expanded Data Rows */}
                        {item.lines.map((line) => (
                          <tr
                            key={line._id}
                            onClick={() => {
                              onRowClick && onRowClick(line);
                            }}
                            className="tableexpandedRowsth"
                            // Different background for child row
                          >
                            {columnLine.map((column) => (
                              <td key={column.key} className={column.className}>
                                {column.render
                                  ? column.render(
                                      line[column.dataIndex],
                                      line,
                                      index
                                    )
                                  : line[column.dataIndex]}
                              </td>
                            ))}
                          </tr>
                        ))}
                      </td>
                    </tr>
                  </React.Fragment>
                )}
              </React.Fragment>
            ))}
        </tbody>
      </table>
    </div>
  );
}

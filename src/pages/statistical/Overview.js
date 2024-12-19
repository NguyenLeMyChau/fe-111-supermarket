import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { Bar } from "react-chartjs-2";
import Select from "react-select";
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend,
} from "chart.js";

// Đăng ký các thành phần cần thiết
ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

export default function Overview() {
    const invoices = useSelector((state) => state.invoice?.invoices) || [];
    const [filterType, setFilterType] = useState("day"); // Bộ lọc: day, week, month, year
    const [selectedMonths, setSelectedMonths] = useState([]); // Các tháng đã chọn
    const [selectedWeeks, setSelectedWeeks] = useState([]); // Các tuần đã chọn
    console.log('invoices', invoices);

    // Lấy ngày hiện tại
    const currentMonth = new Date().getMonth() + 1; // Tháng hiện tại
    const currentYear = new Date().getFullYear(); // Năm hiện tại

    // Dữ liệu cho react-select
    const monthOptions = Array.from({ length: 12 }, (_, i) => ({
        value: i + 1,
        label: `Tháng ${i + 1}`,
    }));

    // Hàm tính tuần trong năm
    const getWeekNumber = (date) => {
        const firstDayOfYear = new Date(date.getFullYear(), 0, 1);
        const pastDaysOfYear = (date - firstDayOfYear) / 86400000;
        return Math.ceil((pastDaysOfYear + firstDayOfYear.getDay() + 1) / 7);
    };

    // Hàm lấy ngày bắt đầu và kết thúc của tuần
    const getWeekRange = (week, year) => {
        const startDate = new Date(year, 0, 1 + (week - 1) * 7);
        const endDate = new Date(startDate);
        endDate.setDate(startDate.getDate() + 6);
        return { start: startDate, end: endDate };
    };

    // Lọc dữ liệu theo tháng
    const filterByMonths = (date, months) => {
        if (months.length === 0) return true; // Nếu không chọn tháng nào, hiển thị tất cả
        return months.some((month) => date.getMonth() + 1 === month);
    };

    // Lọc dữ liệu theo tuần
    const filterByWeeks = (date, weeks) => {
        if (weeks.length === 0) return true; // Nếu không chọn tuần nào, hiển thị tất cả
        const weekNumber = getWeekNumber(date);
        return weeks.some((week) => week === weekNumber);
    };

    // Hàm xử lý dữ liệu
    const processData = (invoices, filterType) => {
        const groupedData = {};
        const filteredInvoices = invoices.filter(invoice => invoice.isRefund === false); // Lọc hóa đơn không phải là hoàn trả hàng 

        filteredInvoices.forEach((invoice) => {
            const date = new Date(invoice.createdAt);
            const amount = invoice.paymentAmount || 0;

            // Lọc dữ liệu theo các tháng đã chọn (nếu là day hoặc week)
            if (filterType !== "month" && filterType !== "year" && !filterByMonths(date, selectedMonths.map((m) => m.value)))
                return;

            // Lọc dữ liệu theo các tuần đã chọn (nếu là day)
            if (filterType === "day" && !filterByWeeks(date, selectedWeeks.map((w) => w.value)))
                return;

            let key;
            if (filterType === "day") {
                // Nhóm theo ngày: dd-MM-yyyy
                key = `${date.getDate().toString().padStart(2, "0")}-${(date.getMonth() + 1).toString().padStart(2, "0")}-${date.getFullYear()}`;
            } else if (filterType === "week") {
                // Nhóm theo tuần: yyyy-Www
                const week = getWeekNumber(date);
                key = `${date.getFullYear()}-W${week}`;
            } else if (filterType === "month") {
                // Nhóm theo tháng: mm-yyyy
                key = `${(date.getMonth() + 1).toString().padStart(2, "0")}-${date.getFullYear()}`;
            } else if (filterType === "year") {
                // Nhóm theo năm: yyyy
                key = date.getFullYear();
            }

            if (!groupedData[key]) groupedData[key] = 0;
            groupedData[key] += amount;
        });

        const labels = Object.keys(groupedData).sort((a, b) => {
            const [dayA, monthA, yearA] = a.split('-').map(Number);
            const [dayB, monthB, yearB] = b.split('-').map(Number);
            return new Date(yearA, monthA - 1, dayA) - new Date(yearB, monthB - 1, dayB);
        });
        const data = labels.map((label) => groupedData[label]);

        return { labels, data };
    };

    const { labels, data } = processData(invoices, filterType);

    // Cập nhật nhãn tuần: "Tuần X (DD/MM/YYYY - DD/MM/YYYY)"
    // Cập nhật nhãn cho năm: "Năm YYYY"
    const updatedLabels = labels.map((label) => {
        if (filterType === "week") {
            const weekNumber = parseInt(label.split("-W")[1]);
            const { start, end } = getWeekRange(weekNumber, currentYear);
            const startDate = `${start.getDate().toString().padStart(2, "0")}/${(start.getMonth() + 1).toString().padStart(2, "0")}/${start.getFullYear()}`;
            const endDate = `${end.getDate().toString().padStart(2, "0")}/${(end.getMonth() + 1).toString().padStart(2, "0")}/${end.getFullYear()}`;
            return `Tuần ${weekNumber} (${startDate} - ${endDate})`;
        } else if (filterType === "year") {
            return `Năm ${label}`; // Cập nhật nhãn cho năm
        }
        return label; // Nếu là ngày hoặc tháng, giữ nguyên nhãn
    });


    // Cấu hình dữ liệu biểu đồ
    const chartData = {
        labels: updatedLabels,
        datasets: [
            {
                label: "Doanh thu (VNĐ)",
                data,
                backgroundColor: "rgba(75, 192, 192, 0.6)",
                borderColor: "rgba(75, 192, 192, 1)",
                borderWidth: 1,
            },
        ],
    };

    // Cấu hình biểu đồ
    const options = {
        responsive: true,
        plugins: {
            legend: {
                position: "top",
            },
            title: {
                display: true,
                text: `Biểu đồ doanh thu bán hàng theo ${filterType === "day"
                    ? "ngày"
                    : filterType === "week"
                        ? "tuần"
                        : filterType === "month"
                            ? "tháng"
                            : "năm"
                    }`,
            },
        },
        scales: {
            x: {
                type: "category",
                title: {
                    display: true,
                    text: filterType === "day"
                        ? "Ngày"
                        : filterType === "week"
                            ? "Tuần"
                            : filterType === "month"
                                ? "Tháng"
                                : "Năm", // Cập nhật nhãn cho trục X khi lọc theo năm
                },
            },
            y: {
                beginAtZero: true,
                title: {
                    display: true,
                    text: "Doanh thu (VNĐ)",
                },
            },
        },
    };

    // Các kiểu nút lọc
    const filterButtons = [
        { id: "day", label: "Theo ngày" },
        { id: "week", label: "Theo tuần" },
        { id: "month", label: "Theo tháng" },
        { id: "year", label: "Theo năm" }, // Thêm bộ lọc cho năm
    ];

    // Sử dụng useEffect để tự động chọn tháng hiện tại cho filterType "day" và "week"
    useEffect(() => {
        if (filterType === "day" || filterType === "week") {
            setSelectedMonths([{ value: currentMonth, label: `Tháng ${currentMonth}` }]); // Chọn tháng hiện tại
        }
        if (filterType === "day") {
            setSelectedWeeks([]); // Reset tuần khi chuyển về lọc theo ngày
        }
    }, [filterType, currentMonth]);

    // Tạo danh sách các tuần trong tháng đã chọn
    const weekOptions = [];
    if (selectedMonths.length > 0) {
        selectedMonths.forEach((month) => {
            const weeksInMonth = [];
            const date = new Date(currentYear, month.value - 1, 1);
            while (date.getMonth() === month.value - 1) {
                const weekNumber = getWeekNumber(date);
                if (!weeksInMonth.includes(weekNumber)) {
                    weeksInMonth.push(weekNumber);
                    const { start, end } = getWeekRange(weekNumber, currentYear);
                    const startDate = `${start.getDate().toString().padStart(2, "0")}/${(start.getMonth() + 1).toString().padStart(2, "0")}/${start.getFullYear()}`;
                    const endDate = `${end.getDate().toString().padStart(2, "0")}/${(end.getMonth() + 1).toString().padStart(2, "0")}/${end.getFullYear()}`;
                    weekOptions.push({ value: weekNumber, label: `Tuần ${weekNumber} (${startDate} - ${endDate})` });
                }
                date.setDate(date.getDate() + 1);
            }
        });
        weekOptions.sort((a, b) => a.value - b.value); // Sắp xếp tuần từ nhỏ đến lớn
    }

    return (
        <div className="statistical-page">
            <div className="filter-statistical">
                <h3>Tổng quan doanh thu bán hàng</h3>
                <div style={{ display: "flex", alignItems: "center" }}>
                    {/* Bộ lọc */}
                    {filterButtons.map((btn) => (
                        <button
                            key={btn.id}
                            onClick={() => setFilterType(btn.id)}
                            style={{
                                backgroundColor: filterType === btn.id ? "#4CAF50" : "#f0f0f0",
                                color: filterType === btn.id ? "#fff" : "#000",
                                marginRight: "10px",
                                border: "none",
                                padding: "10px 15px",
                                cursor: "pointer",
                                borderRadius: "5px",
                            }}
                        >
                            {btn.label}
                        </button>
                    ))}

                    {/* Bộ lọc tháng */}
                    {(filterType === "day" || filterType === "week") && (
                        <div style={{ marginLeft: "10px", width: "200px" }}>
                            <Select
                                isMulti
                                options={monthOptions}
                                value={selectedMonths}
                                onChange={(selected) => setSelectedMonths(selected)}
                                placeholder="Lọc theo tháng"
                            />
                        </div>
                    )}

                    {/* Bộ lọc tuần */}
                    {filterType === "day" && selectedMonths.length > 0 && (
                        <div style={{ marginLeft: "10px", width: "300px" }}>
                            <Select
                                isMulti
                                options={weekOptions}
                                value={selectedWeeks}
                                onChange={(selected) => setSelectedWeeks(selected)}
                                placeholder="Lọc theo tuần"
                            />
                        </div>
                    )}
                </div>
            </div>

            {/* Biểu đồ */}
            <div className="chart-container">
                <Bar data={chartData} options={options} />
            </div>
        </div>
    );
}
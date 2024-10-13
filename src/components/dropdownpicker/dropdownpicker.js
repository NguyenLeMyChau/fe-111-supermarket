import React from 'react';
import Dropdown from 'react-dropdown-select';
import './Dropdownpicker.scss';

export default function Dropdownpicker({ label, options, value, onChange, error }) {
    // Chuyển đổi dữ liệu tùy chọn thành định dạng phù hợp cho react-dropdown-select
    const formattedOptions = options.map(option => ({
        value: option.value,
        label: option.label,
    }));

    return (
        <div className="dropdown-wrapper">
            <div className="dropdown-container">
                <label className="dropdown-label">{label}</label>
                <Dropdown 
                style={{ width: 300,fontSize:12}}
                    
                    options={formattedOptions}
                    onChange={values => onChange(values[0]?.value)}
                    values={formattedOptions.filter(option => option.value === value)} // Giá trị đã chọn
                    placeholder="Chọn một giá trị"
                    searchable
                    clearable
                    className={`dropdown-select ${error ? 'dropdown-error' : ''}`} // Thêm class cho CSS
                />
            </div>
            {error && <div className="error-message"><span className="error-icon">!</span>{error}</div>}
        </div>
    );
}

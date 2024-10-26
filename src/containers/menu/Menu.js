import React, { useState } from 'react';
import './Menu.scss';
import Logo from '../../components/logo/Logo';
import useMenuItems from '../../hooks/useMenuItems';
import { AiOutlineDown } from 'react-icons/ai'; // Import the arrow icon

function Menu({ onchange }) {
    const { selectedItem, menuItems, handleItemClick } = useMenuItems(onchange);
    const [openSubMenu, setOpenSubMenu] = useState(null);

    const toggleSubMenu = (label) => {
        setOpenSubMenu(openSubMenu === label ? null : label);
    };

    return (
        <div className='menu-body'>
            <div className='menu-logo'>
                <Logo />
                <p className='text-xl font-weight-semibold text-primary'>CAPY SMART</p>
            </div>

            {menuItems.map((menuSection) => (
                <div 
                    className={`menu-menu ${menuSection.section === 'Setting' ? 'menu-setting' : ''}`} 
                    key={menuSection.section}
                >
                    <div>
                        {menuSection.items.map(({ Icon, label, text, path, subItems }) => (
                            <div key={label}>
                                <div
                                    className={`menu-detail ${selectedItem === label ? 'selected' : ''}`}
                                    onClick={() => subItems ? toggleSubMenu(label) : handleItemClick(label, path)}
                                >
                                    <Icon size={20} />
                                    <p>{text}</p>
                                    
                                    {/* Conditionally render the down arrow */}
                                    {subItems && (
                                        <AiOutlineDown 
                                            size={16} 
                                            className={`arrow-icon ${openSubMenu === label ? 'open' : ''}`}
                                        />
                                    )}
                                </div>
                                
                                {/* Render Submenu if it has subItems and is open */}
                                {subItems && openSubMenu === label && (
                                    <div className="submenu">
                                        {subItems.map(({ Icon, label, text, path }) => (
                                            <div 
                                                key={label}
                                                className={`menu-detail submenu-item ${selectedItem === label ? 'selected' : ''}`}
                                                onClick={() => handleItemClick(label, path)}
                                            >
                                                <Icon size={18} />
                                                <p>{text}</p>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                </div>
            ))}
        </div>
    );
}

export default Menu;

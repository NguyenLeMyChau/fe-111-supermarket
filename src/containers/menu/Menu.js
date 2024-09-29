import React from 'react';
import './Menu.scss';
import Logo from '../../components/logo/Logo';
import useMenuItems from '../../hooks/useMenuItems';

function Menu({ onchange }) {
    const { selectedItem, menuItems, handleItemClick } = useMenuItems(onchange);

    return (
        <div className='menu-body'>
            <div className='menu-logo'>
                <Logo />
                <p className='text-xl font-weight-semibold text-primary'>CAPY SMART</p>
            </div>

            {menuItems.map((menuSection) => (
                <div className={`menu-menu ${menuSection.section === 'Setting' ? 'menu-setting' : ''}`} key={menuSection.section}>
                    <div>
                        {menuSection.items.map(({ Icon, label, text, path }) => (
                            <div
                                className={`menu-detail ${selectedItem === label ? 'selected' : ''}`}
                                onClick={() => handleItemClick(label, path)}
                                key={label}
                            >
                                <Icon size={20} />
                                <p>{text}</p>
                            </div>
                        ))}
                    </div>
                </div>
            ))}

        </div>
    );
}

export default Menu;

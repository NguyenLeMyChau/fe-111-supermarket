import React from 'react';
import './Header.scss';
import { useSelector } from 'react-redux';

export default function Header() {
    const currentUser = useSelector((state) => state.auth.login?.currentUser);

    return (
        <div className='header-container'>
            <div>

            </div>
            <div className='flex-row-center'>
                {currentUser && (
                    <div className='greeting'>
                        <span>Xin chào</span>
                        <span className='user-name'>{currentUser.user.name}</span>
                    </div>
                )}
            </div>

        </div>
    );
}


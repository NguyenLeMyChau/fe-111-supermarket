import React from 'react';
import './Header.scss';
import Input from '../../components/input/Input';
import { CiBellOn } from "react-icons/ci";
import { useSelector } from 'react-redux';

export default function Header() {
    const currentUser = useSelector((state) => state.auth.login?.currentUser);

    return (
        <div className='header-container'>
            <Input
                type='search'
                placeholder='Tìm kiếm...'
                direction='column'
            />
            <div className='flex-row-center'>
                <CiBellOn />
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


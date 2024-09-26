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
                {currentUser && <span>Xin chào, {currentUser.user.name}</span>}
            </div>

        </div>
    );
}


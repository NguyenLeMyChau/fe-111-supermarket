import React from 'react';
import './Header.scss';
import Input from '../../components/input/Input';
import { CiBellOn } from "react-icons/ci";
import avatar from '../../assets/avatar-music.jpg';

export default function Header() {
    return (
        <div className='header-container'>
            <Input
                type='search'
                placeholder='Search product, supplier, order'
            />
            <div>
                <CiBellOn />
                <img src={avatar} alt='User Avatar' className='avatar' />
            </div>

        </div>
    );
}


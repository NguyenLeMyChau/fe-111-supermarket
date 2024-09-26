import React, { useState } from 'react';
import '../../pages/login/Login.scss';
import Input from '../../components/input/Input';
import Button from '../../components/button/Button';
import { loginUser } from '../../services/authRequest';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router';

const LoginContainer = () => {
    const [phone, setPhone] = useState('');
    const [password, setPassword] = useState('');
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();

        const loginData = {
            phone: phone,
            password: password,
        };

        loginUser(loginData, dispatch, navigate);
    }

    return (
        <form onSubmit={handleLogin}>
            <Input
                label='Số điện thoại'
                placeholder='Nhập số điện thoại của bạn'
                color='white'
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                direction='column'
            />
            <Input
                type='password'
                label='Mật khẩu'
                placeholder='Nhập mật khẩu của bạn'
                color='white'
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                direction='column'
            />
            <div className='login-options'>
                <div className='flex-row-center'>
                    <input type='checkbox' />
                    <label className='text-md'>Ghi nhớ</label>
                </div>

                <a href='/' className='login-link'>Quên mật khẩu?</a>
            </div>

            <div className='login-button'>
                <Button
                    type='submit'
                    text='Đăng nhập'
                />
            </div>
        </form>
    );
};

export default LoginContainer;
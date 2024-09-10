import React, { useState } from 'react';
import '../../pages/login/Login.scss';
import Input from '../../components/input/Input';
import Button from '../../components/button/Button';

const LoginContainer = () => {
    // Truy cập CSS variables
    const root = document.documentElement;
    const titleColor = getComputedStyle(root).getPropertyValue('--title-color');

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const handleLogin = () => {
        // Logic đăng nhập
    };

    return (
        <div>
            <Input
                label='Email'
                placeholder='Enter your email'
                color='white'
                value={email}
                onChange={(e) => setEmail(e.target.value)}
            />
            <Input
                type='password'
                label='Password'
                placeholder='Enter your password'
                color='white'
                value={password}
                onChange={(e) => setPassword(e.target.value)}
            />
            <div className='login-options'>
                <div className='flex-row-center'>
                    <input type='checkbox' />
                    <label className='text-md'>Remember me</label>
                </div>

                <a href='/' className='login-link'>Forgot Password?</a>
            </div>

            <div className='login-button'>
                <Button
                    type='submit'
                    text='Sign In'
                    backgroundColor={titleColor}
                    onClick={handleLogin}
                />
            </div>
        </div>
    );
};

export default LoginContainer;
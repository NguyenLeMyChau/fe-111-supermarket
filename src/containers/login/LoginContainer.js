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
                label='Phone'
                placeholder='Enter your phone'
                color='white'
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
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
                />
            </div>
        </form>
    );
};

export default LoginContainer;
import './Login.scss';
import '../../components/styles/text.scss'
import '../../components/styles/layout.scss'
import Logo from '../../components/logo/Logo';
import LoginContainer from '../../containers/login/LoginContainer';
export default function Login() {


    return (
        <div className='centered-container'>
            <div className='login-container'>
                <div className='login-frame-left'>
                    <Logo width={300} height={300} />
                    <label className='display-md font-weight-semibold text-primary'>MINI SMART</label>
                </div>
                <div className='login-frame-right'>
                    <div className='login-title'>
                        <label className='display-sm font-weight-semibold text-title' style={{ margin: 10 }}>Log In</label>
                        <label className='text-md font-weight-regular text-muted text-title-2'>Welcome back! Please enter your details.</label>
                    </div>

                    <LoginContainer />


                </div>
            </div>

        </div>
    );
}
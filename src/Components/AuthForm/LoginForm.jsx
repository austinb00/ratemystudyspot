import React from 'react'
import './AuthForm.css'
import { FaUser, FaLock } from "react-icons/fa";

const LoginForm = (props) => {
    return (
        <div className="wrapper">
            <form className='form' action="">
                <h1>Login</h1>
                <div className="input-box">
                    <input type="email" placeholder="Email" required />
                    <FaUser className="icon" />
                </div>
                <div className="input-box">
                    <input type="password" placeholder="Password" required />
                    <FaLock className="icon" />
                </div>

                {/* <div className="remember-forgot">
                    <label><input type="checkbox" />Remember me</label>
                    
                </div> */}
                <div className='forgot-password'>
                    <a href="#">Forgot Password?</a> 
                </div>

                {/* add a link later !!! */}

                <button type="submit">Login</button>
            </form>
            <div className="register-link">
                <p>Don't have an account? <button onClick={() => props.onFormSwitch('register')}>Register</button></p>
            </div>
        </div>
    )
}

export default LoginForm;
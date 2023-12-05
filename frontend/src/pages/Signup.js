// Signup.js
import {Link, useNavigate} from "react-router-dom";

import React, {useState} from 'react';
import axios from 'axios';


const Signup = () => {
    const [values, setValues] = useState({
        username: '',
        email: '',
        password: '',
    });
    const navigate = useNavigate();
    const handleInput = (e) => {
        setValues(prev => ({...prev, [e.target.name]: [e.target.value]}))
    }
    const handleSubmit = (e) => {
        e.preventDefault();
        axios.post("http://localhost:3001/signup", values)
            .then(res => {
                navigate(`/login`);
            })
            .catch(err => console.log(err));
    }

    return <div className="d-flex justify-content-center align-items-center bg-secondary vh-100">
        <div className='bg-white p-3 rounded w-25'>
            <form onSubmit={handleSubmit}>
                <div className='mb-3'>
                    <label htmlFor="username"><strong>Name</strong></label>
                    <input type="text" placeholder="Enter your name" id="username" name="username"
                           onChange={handleInput} className="form-control rounded-0"/>
                </div>
                <div className='mb-3'>
                    <label htmlFor="email"><strong>Email</strong></label>
                    <input type="email" placeholder="Enter your email" id="email" name="email"
                           onChange={handleInput} className="form-control rounded-0"/>
                </div>
                <div className='mb-3'>
                    <label htmlFor="password"><strong>Password</strong></label>
                    <input type="password" placeholder="Enter your password" id="password" name="password"
                           onChange={handleInput} className="form-control rounded-0"/>
                </div>
                <button className="btn btn-success w-100 mb-2">Sign Up</button>
                <Link to="/login" className="btn btn-default border w-100 bg-light">Log In</Link>
            </form>
        </div>
    </div>;
};

export default Signup;

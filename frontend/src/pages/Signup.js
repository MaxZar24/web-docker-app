// Signup.js
import {Link} from "react-router-dom";

import React from 'react';

const Signup = () => {
    return <div className="d-flex justify-content-center align-items-center bg-secondary vh-100">
        <div className='bg-white p-3 rounded w-25'>
            <form>
                <div className='mb-3'>
                    <label htmlFor="name"><strong>Name</strong></label>
                    <input type="text" placeholder="Enter your name" id="name" name="name"
                           className="form-control rounded-0" />
                </div>
                <div className='mb-3'>
                    <label htmlFor="email"><strong>Email</strong></label>
                    <input type="email" placeholder="Enter your email" id="email" name="email"
                           className="form-control rounded-0" />
                </div>
                <div className='mb-3'>
                    <label htmlFor="password"><strong>Password</strong></label>
                    <input type="password" placeholder="Enter your password" id="pasword" name="password" className="form-control rounded-0" />
                </div>
                <button className="btn btn-success w-100 mb-2">Sign Up</button>
                <Link to="/login" className="btn btn-default border w-100 bg-light">Log In</Link>
            </form>
        </div>
    </div>;
};

export default Signup;

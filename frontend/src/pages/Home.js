import React, {useEffect, useState} from 'react';
import axios from "axios";

const Home = () => {
    const [page, setPage] = useState('profile');
    const [userData, setUserData] = useState({
        username: '',
        email: '',
        password: ''
    });


    const storedUserData = sessionStorage.getItem('user');

    useEffect(() => {
        if (storedUserData) {
            const parsedUserData = JSON.parse(storedUserData);
            setUserData(parsedUserData);
        }
    }, [storedUserData]);

    const usernameHandler = (event) => {
        setUserData((prevState) => {
            return {
                ...prevState,
                username: event.target.value
            };
        });
    };


    const passwordHandler = (event) => {
        setUserData((prevState) => {
            return {
                ...prevState,
                password: event.target.value
            };
        });
    };


    const changeUsername = async () => {
        try {
            const response = await axios.post('/change-username', {
                email: userData.email,
                username: userData.username,
            });


            if (response.status === 200) {
                sessionStorage.setItem('user', JSON.stringify(userData));
                alert('Username has been changed');
            }

        } catch (error) {
            console.error('Error changing username:', error.message);
        }
    };

    const changePassword = async () => {
        try {
            const response = await axios.post('/change-password', {
                email: userData.email, // Assuming you have a unique user ID
                password: userData.password,
            });

            if (response.status === 200) {
                sessionStorage.setItem('user', JSON.stringify(userData));
                alert('Password has been changed');
            }
        } catch (error) {
            console.error('Error changing password:', error.message);
        }
    };

    return (
        <div className="d-flex flex-column justify-content-center align-items-center bg-secondary vh-100">
            <div>
                <div className="btn-group w-100">
                    <button
                        onClick={() => setPage('profile')}
                        className={`btn btn-primary rounded-bottom-0 ${page === 'profile' ? 'active' : ''}`}
                    >
                        Profile
                    </button>
                    <button
                        onClick={() => setPage('orders')}
                        className={`btn btn-primary rounded-bottom-0 ${page === 'orders' ? 'active' : ''}`}
                    >
                        Orders
                    </button>

                </div>

                {page === 'profile' ? (
                    <div className="bg-white p-3 rounded-bottom">
                        <h1>Profile</h1>
                        <div><span className='fw-bold'>Email: </span>{userData.email}</div>
                        <div>
                            <label className="fw-bold">Username: </label>
                            <input
                                type="text"
                                value={userData.username}
                                onChange={usernameHandler}
                                id="newUsername"
                                name="newUsername"
                                className="form-control mb-3"
                            />
                            <button className="btn btn-secondary mb-3" onClick={changeUsername}>
                                Change username
                            </button>
                        </div>
                        <div>
                            <label className="fw-bold">Password: </label>
                            <input
                                type="password"
                                value={userData.password}
                                onChange={passwordHandler}
                                id="newPassword"
                                name="newPassword"
                                className="form-control mb-3"
                            />
                            <button className="btn btn-secondary mb-2" onClick={changePassword}>
                                Change password
                            </button>
                        </div>
                    </div>
                ) : (
                    <div className="bg-white p-3 rounded-bottom">
                        <h1>Orders</h1>
                        <table className="table">
                            <thead>
                            <tr>
                                <th scope="col">ID</th>
                                <th scope="col">Name</th>
                                <th scope="col">Date</th>
                                <th scope="col">Category</th>
                                <th scope="col">Price</th>
                                <th scope="col">Amount</th>
                            </tr>
                            </thead>
                            <tbody>
                            <tr>
                                <th scope="row">1</th>
                                <td>Pen</td>
                                <td>25.11.2023</td>
                                <td>Stationery</td>
                                <td>5$</td>
                                <td>10</td>
                            </tr>
                            </tbody>
                        </table>
                    </div>
                )}
            </div>

        </div>
    );
};

export default Home;

import React, { useState } from 'react';

const Home = () => {
    const [page, setPage] = useState('orders');
    const [username, setUsername] = useState('blablabla');
    const [password, setPassword] = useState('12345678');

    const changeUsername = () => {
        alert('Username has been changed');
    };

    const changePassword = () => {
        alert('Password has been changed');
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
                        <div><span className='fw-bold'>Email: </span>example@gmail.com</div>
                        <div>
                            <label className="fw-bold">Username: </label>
                            <input
                                type="text"
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                                id="email"
                                name="email"
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
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                id="password"
                                name="password"
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

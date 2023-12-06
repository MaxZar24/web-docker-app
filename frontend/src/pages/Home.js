import React, {useEffect, useState} from 'react';
import axios from "axios";

const Home = () => {
    const [page, setPage] = useState('orders');
    const [userData, setUserData] = useState(null);
    const [newUsername, setNewUsername] = useState('');
    const [newPassword, setNewPassword] = useState('');

    const storedUserData = sessionStorage.getItem('user');

    useEffect(() => {
        if (storedUserData) {
            const parsedUserData = JSON.parse(storedUserData);
            setUserData(parsedUserData);
        }
    }, [storedUserData]);

    const changeUsername = async () => {
        try {
            const response = await axios.post('/change-username', {
                userId: userData.id, // Assuming you have a unique user ID
                newUsername: newUsername,
            });

            if (response.status === 200) {
                alert('Username has been changed');
                // You might want to update the user data in state or sessionStorage here
            }
        } catch (error) {
            console.error('Error changing username:', error.message);
            // Handle error
        }
    };

    const changePassword = async () => {
        try {
            const response = await axios.post('/change-password', {
                userId: userData.id, // Assuming you have a unique user ID
                newPassword: newPassword,
            });

            if (response.status === 200) {
                alert('Password has been changed');
                // You might want to update the user data in state or sessionStorage here
            }
        } catch (error) {
            console.error('Error changing password:', error.message);
            // Handle error
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
                                    onChange={(e) => setNewUsername(e.target.value)}
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
                                    onChange={(e) => setNewPassword(e.target.value)}
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

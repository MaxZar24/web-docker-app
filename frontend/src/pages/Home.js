import React, {useEffect, useState} from 'react';
import {useNavigate} from "react-router-dom";
import axios from "axios";
import Profile from "../components/Profile";
import Orders from "../components/Orders";

const Home = () => {
    const [page, setPage] = useState('profile');
    const [userData, setUserData] = useState({
        username: '',
        email: '',
        password: '',
        photo: ''
    });
    const navigate = useNavigate();


    const storedUserData = sessionStorage.getItem('user');

    useEffect(() => {
        if (storedUserData) {
            const parsedUserData = JSON.parse(storedUserData);
            console.log(parsedUserData);
            setUserData(parsedUserData);
        } else {
            navigate('/login');
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

    const photoHandler = (event) => {
        const file = event.target.files[0];

        const reader = new FileReader();
        reader.onloadend = () => {
            const photoBlob = new Blob([reader.result], {type: file.type});

            setUserData((prevState) => {
                return {
                    ...prevState,
                    photo: photoBlob,
                };
            });
        };

        if (file) {
            reader.readAsArrayBuffer(file);
        }
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
                email: userData.email,
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
    const changePhoto = async () => {
        try {
            const formData = new FormData();
            formData.append('email', userData.email);
            formData.append('photo', userData.photo);

            const response = await axios.post('/change-photo', {
                email: userData.email,
                photo: userData.photo,
            }, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });

            if (response.status === 200) {
                sessionStorage.setItem('user', JSON.stringify(userData));
                alert('Photo has been changed');
            }
        } catch (error) {
            console.error('Error changing photo:', error.message);
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
                    <Profile userData={userData} usernameHandler={usernameHandler} changeUsername={changeUsername}
                             passwordHandler={passwordHandler} changePassword={changePassword}
                             photoHandler={photoHandler}
                             changePhoto={changePhoto}
                    />
                ) : (
                    <Orders userEmail={userData.email}/>
                )}
            </div>

        </div>
    );
};

export default Home;
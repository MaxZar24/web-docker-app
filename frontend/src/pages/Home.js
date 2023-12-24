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
        photo: '',
        mimetype: ''
    });
    const navigate = useNavigate();
    const [selectedFile, setSelectedFile] = useState(null);


    const storedUserData = sessionStorage.getItem('user');

    useEffect(() => {
        if (storedUserData) {
            const parsedUserData = JSON.parse(storedUserData);
            console.log(parsedUserData.email);

            const fetchData = async () => {
                try {
                    const response = await axios.get("/get-user-data", {
                        params: {
                            user: parsedUserData.email,
                        },
                    });
                    console.log(response.data);
                    const arrayBuffer = Uint8Array.from(atob(response.data.user.photo), char => char.charCodeAt(0));
                    const blob = new Blob([arrayBuffer], { type: response.data.user.mimetype });

                    const url = URL.createObjectURL(blob);
                    setUserData({...response.data.user, photoUrl: url});
                } catch (error) {
                    console.error("Error fetching data:", error);
                }
            };
            fetchData();
            console.log(userData)
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
        setSelectedFile(event.target.files[0]);
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
            if (!selectedFile) {
                console.log('Please select a file to upload.');
                return;
            }

            const formData = new FormData();
            formData.append('email', userData.email);
            formData.append('file', selectedFile);

            const response = await axios.post('/change-photo', formData,);

            if (response.status === 200) {
                alert('Photo has been changed');
            }


        } catch (error) {
            console.error('Error changing photo:', error.message);
        }
    };


    return (
        <div className="d-flex flex-column justify-content-center align-items-center bg-secondary">
            <div className="m-3">
                <div className="btn-group w-100 mt-3">
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
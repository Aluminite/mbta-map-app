import React, {useState, useEffect} from 'react';
import {useNavigate} from 'react-router-dom';
import getUserData from "../../utilities/getUserData";
import axios from "axios";

const HomePage = () => {
    const [user, setUser] = useState(null);
    const navigate = useNavigate();

    const handleClick = (e) => {
        e.preventDefault();
        (async () => {
            await axios.post(`${process.env.REACT_APP_BACKEND_SERVER_URI}/user/logout`, null,
                {withCredentials: true});
            navigate('/');
        })();
    };

    useEffect(() => {
        (async () => {
            const userData = await getUserData();
            setUser(userData);
        })();
    }, []);

    if (user === null) return (
        <div><h4>Log in to view this page.</h4></div>
    );

    const {_id, email, username} = user;

    return (
        <>
            <div className="card-container">
                <div className="card">
                    <h3>Welcome</h3>
                    <p className="username">{username}</p>
                </div>
                <div className="card">
                    <h3>Your userId in MongoDB is</h3>
                    <p className="userId">{_id}</p>
                </div>
                <div className="card">
                    <h3>Your email is</h3>
                    <p className="email">{email}</p>
                </div>
            </div>
            <button onClick={(e) => handleClick(e)}>
                Log Out
            </button>
        </>
    );
};

export default HomePage;
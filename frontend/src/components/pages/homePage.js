import React, {useContext} from 'react';
import {useNavigate} from 'react-router-dom';
import axios from "axios";
import {UserContext} from "../../App";

const HomePage = () => {
    const {user, setUser} = useContext(UserContext);
    const navigate = useNavigate();

    const handleClick = (e) => {
        e.preventDefault();
        (async () => {
            await axios.post(`${process.env.REACT_APP_BACKEND_SERVER_URI}/user/logout`, null,
                {withCredentials: true});
            setUser(null);
            navigate('/');
        })();
    };

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
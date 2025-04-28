import React, {useState, useContext, useEffect} from "react";
import {useNavigate, Link} from "react-router-dom";
import axios from "axios";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import getUserData from "../../utilities/getUserData";
import {UserContext} from "../../App";

const loginUrl = `${process.env.REACT_APP_BACKEND_SERVER_URI}/user/login`;

const Login = () => {
    const {user, setUser} = useContext(UserContext);
    const [data, setData] = useState({username: "", password: ""});
    const [error, setError] = useState("");
    const navigate = useNavigate();

    useEffect(() => {
        if (user !== null) {
            navigate('/home');
        }
    }, [user, navigate]);

    const handleChange = ({currentTarget: input}) => {
        setData({...data, [input.name]: input.value});
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await axios.post(loginUrl, data, {withCredentials: true});
            await (async () => {
                const userData = await getUserData();
                setUser(userData);
            })();
        } catch (error) {
            if (
                error.response &&
                error.response.status >= 400 &&
                error.response.status <= 500
            ) {
                setError(error.response.data.message);
            }
        }
    };

    return (
        <>
            <section className="vh-100">
                <div className="container-fluid h-custom vh-100">
                    <div
                        className="row d-flex justify-content-center align-items-center h-100">
                        <div className="col-md-8 col-lg-6 col-xl-4 offset-xl-1">
                            <Form>
                                <Form.Group className="mb-3" controlId="formBasicEmail">
                                    <Form.Label>Username</Form.Label>
                                    <Form.Control
                                        type="username"
                                        name="username"
                                        onChange={handleChange}
                                        placeholder="Enter username"
                                    />
                                    <Form.Text className="text-muted">
                                        We just might sell your data
                                    </Form.Text>
                                </Form.Group>
                                <Form.Group className="mb-3" controlId="formBasicPassword">
                                    <Form.Label>Password</Form.Label>
                                    <Form.Control
                                        type="password"
                                        name="password"
                                        placeholder="Password"
                                        onChange={handleChange}
                                    />
                                    <Form.Text className="text-muted pt-1">
                                        Dont have an account? <Link to="/signup">Sign up</Link>
                                    </Form.Text>
                                </Form.Group>
                                {error && <div className="pt-3">{error}</div>}
                                <Button
                                    variant="primary"
                                    type="submit"
                                    onClick={handleSubmit}
                                    className="mt-2"
                                >
                                    Log In
                                </Button>
                            </Form>
                        </div>
                    </div>
                </div>
            </section>
        </>
    );
};

export default Login;

import React, {useState, useContext} from "react";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import {useNavigate} from "react-router-dom";
import axios from "axios";
import Card from "react-bootstrap/Card";
import Form from "react-bootstrap/Form";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import getUserData from "../../utilities/getUserData";
import {UserContext, ThemeContext} from "../../App";

const PrivateUserProfile = () => {
    const [show, setShow] = useState(false);
    const {user, setUser} = useContext(UserContext);
    const {darkTheme, setDarkTheme} = useContext(ThemeContext);
    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);
    const navigate = useNavigate();
    const editUrl = `${process.env.REACT_APP_BACKEND_SERVER_URI}/user/editUser`;
    const themeUrl = `${process.env.REACT_APP_BACKEND_SERVER_URI}/user/darkTheme`;
    const [form, setFormValues] = useState({username: "", email: "", password: ""});
    const [errors, setErrors] = useState({});

    // handle logout button
    function handleLogout() {
        (async () => {
            await axios.post(`${process.env.REACT_APP_BACKEND_SERVER_URI}/user/logout`, null,
                {withCredentials: true});
            setUser(null);
            navigate('/');
        })();
    }

    // form validation checks
    function findFormErrors() {
        const {username, email, password} = form;
        const newErrors = {};
        // username validation checks
        if (!username || username === '') newErrors.name = 'Input a valid username';
        else if (username.length < 6) newErrors.name = 'Username must be at least 6 characters';
        // email validation checks
        if (!email || email === '') newErrors.email = 'Input a valid email address';
        if (!/\S+@\S+\.\S+/.test(email)) newErrors.email = 'Input a valid email address';
        // password validation checks
        if (!password || password === '') newErrors.password = 'Input a valid password';
        else if (password.length < 8) newErrors.password = 'Password must be at least 8 characters';
        return newErrors;
    }

    // handle form field changes
    function handleChange({currentTarget: input}) {
        setFormValues({...form, [input.id]: input.value});
        if (!!errors[input]) setErrors({
            ...errors,
            [input]: null
        });
    }

    // handle form submission with submit button
    async function handleEditSubmit(event) {
        event.preventDefault();
        const newErrors = findFormErrors();
        if (Object.keys(newErrors).length > 0) {
            setErrors(newErrors);
        } else {
            try {
                await axios.post(editUrl, form, {withCredentials: true});
                window.alert("Account information updated successfully!");
                await (async () => {
                    const userData = await getUserData();
                    setUser(userData);
                })();
            } catch (error) {
                if (
                    error.response &&
                    error.response.status !== 409 &&
                    error.response.status >= 400 &&
                    error.response.status <= 500
                ) {
                    window.alert(error.response.data.message);
                }
                if (error.response &&
                    error.response.status === 409
                ) {
                    setErrors({name: "Username is taken, pick another"});
                }
            }
        }
    }

    async function handleThemeSubmit(event) {
        event.preventDefault();
        try {
            await axios.post(themeUrl, {"darkTheme": darkTheme}, {withCredentials: true});
            window.alert("Default theme updated successfully!");
            await (async () => {
                const userData = await getUserData();
                setUser(userData);
            })();
        } catch (error) {
            window.alert("Failed to set default theme");
        }
    }

    // handle cancel button
    function handleCancel() {
        navigate("/privateuserprofile");
    }

    if (!user) return (<div><h4>Log in to view this page.</h4></div>);
    else return (
        <div className="container">
            <div className="col-md-12 text-center">
                <h1>{user.username}</h1>
                <Card color="success" className="my-2 mx-auto" style={{width: '30rem'}}>
                    <Card.Title>Edit User Information</Card.Title>
                    <Card.Body>
                        <Form>
                            <Form.Group className="mb-3">
                                <Form.Label>Username</Form.Label>
                                <Form.Control type="text" placeholder="Enter new username"
                                              id="username"
                                              value={form.username}
                                              onChange={handleChange}
                                              isInvalid={!!errors.name}
                                />
                                <Form.Control.Feedback type="invalid">
                                    {errors.name}
                                </Form.Control.Feedback>
                            </Form.Group>

                            <Form.Group className="mb-3">
                                <Form.Label>Email address</Form.Label>
                                <Form.Control type="text" placeholder="Enter new email address"
                                              id="email"
                                              value={form.email}
                                              onChange={handleChange}
                                              isInvalid={!!errors.email}
                                />
                                <Form.Control.Feedback type="invalid">
                                    {errors.email}
                                </Form.Control.Feedback>
                            </Form.Group>

                            <Form.Group className="mb-3">
                                <Form.Label>Password</Form.Label>
                                <Form.Control type="password" placeholder="Enter new password"
                                              id="password"
                                              value={form.password}
                                              onChange={handleChange}
                                              isInvalid={!!errors.password}
                                />
                                <Form.Control.Feedback type="invalid">
                                    {errors.password}
                                </Form.Control.Feedback>
                            </Form.Group>

                            <Row>
                                <Col>
                                    <Button variant="primary" type="submit" onClick={handleEditSubmit}>
                                        Save
                                    </Button>
                                </Col>

                                <Col>
                                    <Button variant="primary" type="cancel" onClick={handleCancel}>
                                        Cancel
                                    </Button>
                                </Col>
                            </Row>

                        </Form>
                    </Card.Body>
                </Card>
                <Card color="success" className="my-2 mx-auto" style={{width: '30rem'}}>
                    <Card.Title>Theme</Card.Title>
                    <Card.Body>
                        <Form>
                            <Form.Group className="mb-3">
                            <Form.Select id="darkTheme" value={darkTheme}
                                         onChange={(e) => setDarkTheme(e.target.value === "true")}>
                                    <option value="false">Light Theme</option>
                                    <option value="true">Dark Theme</option>
                                </Form.Select>
                            </Form.Group>
                            <Row>
                                <Col>
                                    <Button variant="primary" type="submit" onClick={handleThemeSubmit}>
                                        Set Default
                                    </Button>
                                </Col>

                                <Col>
                                    <Button variant="primary" type="cancel" onClick={handleCancel}>
                                        Cancel
                                    </Button>
                                </Col>
                            </Row>

                        </Form>
                    </Card.Body>
                </Card>
                <div className="col-md-12 text-center">
                    <>
                        <Button className="me-2" onClick={handleShow}>
                            Log Out
                        </Button>
                        <Modal
                            show={show}
                            onHide={handleClose}
                            backdrop="static"
                            keyboard={false}
                        >
                            <Modal.Header closeButton>
                                <Modal.Title>Log Out</Modal.Title>
                            </Modal.Header>
                            <Modal.Body>Are you sure you want to log out?</Modal.Body>
                            <Modal.Footer>
                                <Button variant="secondary" onClick={handleClose}>
                                    Close
                                </Button>
                                <Button variant="primary" onClick={handleLogout}>
                                    Yes
                                </Button>
                            </Modal.Footer>
                        </Modal>
                    </>
                </div>
            </div>
        </div>
    );
};

export default PrivateUserProfile;

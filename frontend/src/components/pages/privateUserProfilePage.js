import React, {useState, useEffect} from "react";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import {useNavigate} from "react-router-dom";
import getUserInfo from "../../utilities/decodeJwt";
import axios from "axios";
import Card from "react-bootstrap/Card";
import Form from "react-bootstrap/Form";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";


//link to service
//http://localhost:8096/privateUserProfile

const PrivateUserProfile = () => {
    const [show, setShow] = useState(false);
    const [user, setUser] = useState({})
    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);
    const navigate = useNavigate();
    const url = `${process.env.REACT_APP_BACKEND_SERVER_URI}/user/editUser`;


    // handle logout button
    const handleLogout = () => {
        localStorage.clear();
        navigate("/");
    };

    useEffect(() => {
        setUser(getUserInfo())
    }, []);

    // form validation checks
    const [errors, setErrors] = useState({})
    const findFormErrors = () => {
        const {username, email, password} = form
        const newErrors = {}
        // username validation checks
        if (!username || username === '') newErrors.name = 'Input a valid username'
        else if (username.length < 6) newErrors.name = 'Username must be at least 6 characters'
        // email validation checks
        if (!email || email === '') newErrors.email = 'Input a valid email address'
        if (!/\S+@\S+\.\S+/.test(email)) newErrors.email = 'Input a valid email address'
        // password validation checks
        if (!password || password === '') newErrors.password = 'Input a valid password'
        else if (password.length < 8) newErrors.password = 'Password must be at least 8 characters'
        return newErrors
    }

    // initialize form values and get userId on render
    const [form, setValues] = useState({userId: "", username: "", email: "", password: ""})
    useEffect(() => {
        setValues({userId: getUserInfo().id})
    }, [])

    // handle form field changes
    const handleChange = ({currentTarget: input}) => {
        setValues({...form, [input.id]: input.value});
        if (!!errors[input]) setErrors({
            ...errors,
            [input]: null
        })
    };

    // handle form submission with submit button
    const handleSubmit = async (event) => {
        event.preventDefault();
        const newErrors = findFormErrors()
        if (Object.keys(newErrors).length > 0) {
            setErrors(newErrors)
        } else {
            try {
                const {data: res} = await axios.post(url, form);
                const {accessToken} = res;
                //store token in localStorage
                localStorage.setItem("accessToken", accessToken);
                navigate("/privateuserprofile");
            } catch (error) {
                if (
                    error.response &&
                    error.response.status != 409 &&
                    error.response.status >= 400 &&
                    error.response.status <= 500
                ) {
                    window.alert(error.response.data.message);
                }
                if (error.response &&
                    error.response.status === 409
                ) {
                    setErrors({name: "Username is taken, pick another"})
                }
            }
        }
    }

    // handle cancel button
    const handleCancel = async => {
        navigate("/privateuserprofile");
    }

    if (!user) return (<div><h4>Log in to view this page.</h4></div>)
    return (
        <div className="container">
            <div className="col-md-12 text-center">
                <h1>{user && user.username}</h1>
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
                            <Modal.Body>Are you sure you want to Log Out?</Modal.Body>
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
            <Card body outline color="success" className="mx-1 my-2" style={{width: '30rem'}}>
                <Card.Title>Edit User Information</Card.Title>
                <Card.Body>
                    <Form>

                        <Form.Group className="mb-3" controlId="formName">
                            <Form.Label>Username</Form.Label>
                            <Form.Control type="text" placeholder="Enter new username"
                                          id="username"
                                          value={form.username}
                                          onChange={handleChange}
                                          isInvalid={!!errors.name}
                            />
                            <Form.Control.Feedback type='invalid'>
                                {errors.name}
                            </Form.Control.Feedback>
                        </Form.Group>

                        <Form.Group className="mb-3" controlId="formEmail">
                            <Form.Label>Email address</Form.Label>
                            <Form.Control type="text" placeholder="Enter new email address"
                                          id="email"
                                          value={form.email}
                                          onChange={handleChange}
                                          isInvalid={!!errors.email}
                            />
                            <Form.Control.Feedback type='invalid'>
                                {errors.email}
                            </Form.Control.Feedback>
                        </Form.Group>

                        <Form.Group className="mb-3" controlId="formPassword">
                            <Form.Label>Password</Form.Label>
                            <Form.Control type="text" placeholder="Enter new password"
                                          id="password"
                                          value={form.password}
                                          onChange={handleChange}
                                          isInvalid={!!errors.password}
                            />
                            <Form.Control.Feedback type='invalid'>
                                {errors.password}
                            </Form.Control.Feedback>
                        </Form.Group>

                        <Row>
                            <Col>
                                <Button variant="primary" type="submit" onClick={handleSubmit}>
                                    Submit
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
        </div>
    );
};

export default PrivateUserProfile;

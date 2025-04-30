import React, {useContext} from "react";
import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import ReactNavbar from 'react-bootstrap/Navbar';
import {Link} from "react-router-dom";
import { UserContext } from "../App";

export default function Navbar() {
    const {user} = useContext(UserContext);

    return (
        <ReactNavbar bg="dark" variant="dark">
            <Container>
                <Nav className="me-auto">
                    <Link to="/" className="nav-link">Map</Link>
                    {user === null ? <Link to="/login" className="nav-link">Login</Link> : null}
                    <Link to="/privateUserProfile" className="nav-link">Profile</Link>
                    <Link to="/alerts" className="nav-link">Alerts</Link>
                </Nav>
            </Container>
        </ReactNavbar>
    );
}
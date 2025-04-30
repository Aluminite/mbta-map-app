import React from "react";
import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import ReactNavbar from 'react-bootstrap/Navbar';
import {Link} from "react-router-dom";

export default function Navbar() {

    return (
        <ReactNavbar bg="dark" variant="dark">
            <Container>
                <Nav className="me-auto">
                    <Link to="/" className="nav-link">Map</Link>
                    <Link to="/login" className="nav-link">Login</Link>
                    <Link to="/privateUserProfile" className="nav-link">Profile</Link>
                    <Link to="/alerts" className="nav-link">Alerts</Link>
                </Nav>
            </Container>
        </ReactNavbar>
    );
}
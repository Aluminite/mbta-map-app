import React from "react";
import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import ReactNavbar from 'react-bootstrap/Navbar';

export default function Navbar() {
    return (
        <ReactNavbar bg="dark" variant="dark">
            <Container>
                <Nav className="me-auto">
                    <Nav.Link href="/">Start</Nav.Link>
                    <Nav.Link href="/home">Home</Nav.Link>
                    <Nav.Link href="/privateUserProfile">Profile</Nav.Link>
                    <Nav.Link href="/alerts">Alerts</Nav.Link>
                    <Nav.Link href="/map">Map</Nav.Link>
                </Nav>
            </Container>
        </ReactNavbar>
    );
}
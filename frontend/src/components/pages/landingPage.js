import React from 'react'
import Card from 'react-bootstrap/Card';
import {Link} from "react-router-dom";

const Landingpage = () => {

    return (
        <div className="bg-blue-500 text-white p-5">
            <Card style={{width: '30rem'}} className="mx-2 my-2">
                <Card.Body>
                    <Card.Title>WELCOME TO THE MBTAMAPAPP</Card.Title>
                    <Card.Subtitle className="mb-2 text-muted">A starting point for an application.</Card.Subtitle>
                    <Card.Text>
                        If you see this with a blue background and white text, Tailwind is working!
                    </Card.Text>
                    <Link to="/signup">Sign Up</Link> or <Link to="/login">Login</Link>
                </Card.Body>
            </Card>
        </div>
    )
}

export default Landingpage;

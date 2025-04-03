import React from "react";
import './index.css'
import App from "./App";
import 'bootstrap/dist/css/bootstrap.min.css';

import {BrowserRouter} from "react-router-dom";
import {createRoot} from "react-dom/client";
// Test Change

const root = createRoot(document.getElementById('root'));
root.render(
    <BrowserRouter>
        <App/>
    </BrowserRouter>
);

import React from "react";
// We use Route in order to define the different routes of our application
import {Route, Routes} from "react-router-dom";
import './css/card.css';
import './index.css';

// We import all the components we need in our app
import Navbar from "./components/navbar";
import LandingPage from "./components/pages/landingPage";
import HomePage from "./components/pages/homePage";
import Login from "./components/pages/loginPage";
import Signup from "./components/pages/registerPage";
import PrivateUserProfile from "./components/pages/privateUserProfilePage";
import {createContext, useState, useEffect} from "react";
import getUserData from "./utilities/getUserData";
import MbtaMap from "./components/pages/mbtaMapPage";
import AlertsPage from "./components/pages/alertsPage.js"

export const UserContext = createContext(null);
export const ThemeContext = createContext(null);

const App = () => {
    const [user, setUser] = useState(null);
    const [darkTheme, setDarkTheme] = useState(false);

    useEffect(() => {
        (async () => {
            const userData = await getUserData();
            setUser(userData);
        })();
    }, []);

    useEffect(() => {
        if (user !== undefined && user !== null) {
            setDarkTheme(user.darkTheme);
        }
    }, [user])

    return (
        <>
            <Navbar/>
            <UserContext.Provider value={{user, setUser}}>
                <ThemeContext.Provider value={{darkTheme, setDarkTheme}}>
                    <Routes>
                        <Route exact path="/" element={<LandingPage/>}/>
                        <Route exact path="/home" element={<HomePage/>}/>
                        <Route exact path="/alerts" element={<AlertsPage/>}/>
                        <Route exact path="/map" element={<MbtaMap/>}/>
                        <Route exact path="/login" element={<Login/>}/>
                        <Route exact path="/signup" element={<Signup/>}/>
                        <Route path="/privateUserProfile" element={<PrivateUserProfile/>}/>
                    </Routes>
                </ThemeContext.Provider>
            </UserContext.Provider>
        </>
    );
};


export default App;

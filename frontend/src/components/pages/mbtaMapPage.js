import React, {useContext, useEffect, useRef, useState} from 'react';
import {useMap} from "@uidotdev/usehooks";
import {Circle, MapContainer, Marker, Polyline, Popup, TileLayer, useMap as useLeafletMap} from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import '../../css/mbtaMapPage.css';
import axios from "axios";
import Form from 'react-bootstrap/Form';
import {ToggleButton} from "react-bootstrap";
import {decode} from "@googlemaps/polyline-codec";
import {generateHeadingIcon, generateVehicleIcon} from '../../utilities/icons';
import leaflet from 'leaflet';
import {LocateControl} from "leaflet.locatecontrol";
import "leaflet.locatecontrol/dist/L.Control.Locate.min.css";
import {ThemeContext, UserContext} from "../../App";
import getFavorites from "../../utilities/getFavorites";
import Button from "react-bootstrap/Button";

const MbtaMap = () => {
    const [transitRoutes, setTransitRoutes] = useState([]);
    const [routeVehicles, setRouteVehicles] = useState([]);
    const [route, setRoute] = useState("");
    const [routeFilter, setRouteFilter] = useState("");
    const selectedRoute = useRef(null);
    const [routeStops, setRouteStops] = useState([]);
    const [routeStopChildren, setRouteStopChildren] = useState([]);
    const stopPredictions = useMap();
    const [currentColor, setCurrentColor] = useState({color: "#FFFFFF"});
    const [currentVehicleIcon, setCurrentVehicleIcon] = useState(leaflet.divIcon());
    const [currentPolyline, setCurrentPolyline] = useState([]);
    const {user} = useContext(UserContext);
    const {darkTheme, setDarkTheme} = useContext(ThemeContext);
    const [favorites, setFavorites] = useState([]);
    const leafletMap = useRef(null);


    useEffect(() => {
        getRoutes();

        const interval = setInterval(() => {
            updateRouteVehicles(selectedRoute.current);
        }, 5000);

        return () => {
            clearInterval(interval);
        };
    }, []);

    useEffect(() => {
        if (user !== null) {
            (async () => {
                setFavorites(await getFavorites(user));
            })();
        }
    }, [user]);

    function LeafletMapGetter() {
        const map = useLeafletMap();
        if (leafletMap.current === null) {
            leafletMap.current = map;
            leafletMapLoaded();
        }
        return null;
    }

    function leafletMapLoaded() {
        const control = new LocateControl({
            keepCurrentZoomLevel: true,
            locateOptions: {
                enableHighAccuracy: true
            }
        });
        leafletMap.current.addControl(control);
    }

    function getRoutes() {
        (async () => {
            const routes = await axios.get(
                `${process.env.REACT_APP_BACKEND_SERVER_URI}/api/routes`
            );
            setTransitRoutes(routes.data.data);
        })();
    }

    function routeChange(newRoute) {
        setRoute(newRoute);
        selectedRoute.current = transitRoutes.find((route) => route.id === newRoute);
        setCurrentPolyline([]);
        updateRouteVehicles(selectedRoute.current);
        getStops(selectedRoute.current);
        if (selectedRoute.current != null) {
            setCurrentColor({color: "#" + selectedRoute.current.attributes["color"]});
            setCurrentVehicleIcon(generateVehicleIcon(selectedRoute.current.attributes["type"],
                "#" + selectedRoute.current.attributes["color"], darkTheme));
        }
    }

    function updateRouteVehicles(route) {
        if (route != null) {
            (async () => {
                const vehicles = await axios.get(
                    `${process.env.REACT_APP_BACKEND_SERVER_URI}/api/vehicles/${route.id}`
                );
                setRouteVehicles(vehicles.data.data);
            })();
        } else {
            setRouteVehicles([]);
        }
    }

    function findPolyline(tripID) {
        (async () => {
            const trip = await axios.get(
                `${process.env.REACT_APP_BACKEND_SERVER_URI}/api/trips/${tripID}`
            );
            const shape = await axios.get(
                `${process.env.REACT_APP_BACKEND_SERVER_URI}/api/shapes/${trip.data.data.relationships.shape.data.id}`
            );
            const decoded = decode(shape.data.data.attributes.polyline);
            setCurrentPolyline(decoded);
        })();
    }

    function currentServiceDate() {
        // JS does not provide a proper way of getting the date in a specific time zone.
        // This is a crap way of doing it, but it should work and doesn't require a library.
        const date = new Date(new Date().toLocaleString('en', {timeZone: 'America/New_York'}));
        if (date.getHours() < 3) {
            // If it's before 3:00AM, it's part of the previous service date.
            date.setDate(date.getDate() - 1);
        }

        const year = date.getFullYear().toString().padStart(4, '0');
        const month = (date.getMonth() + 1).toString().padStart(2, '0');
        const day = date.getDate().toString().padStart(2, '0');

        return `${year}-${month}-${day}`;
    }

    function getStops(route) {
        if (route != null) {
            (async () => {
                const stops = await axios.get(
                    `${process.env.REACT_APP_BACKEND_SERVER_URI}/api/stops/${currentServiceDate()}/${route.id}`
                );
                setRouteStops(stops.data.data);
                setRouteStopChildren(stops.data.included);
            })();
        } else {
            setRouteStops([]);
        }
    }

    function getStopPredictions(stop, route) {
        if (stop != null) {
            (async () => {
                const predictions = await axios.get(
                    `${process.env.REACT_APP_BACKEND_SERVER_URI}/api/predictions/${stop.id}/${route.id}`
                );
                stopPredictions.set(stop.id, predictions.data.data);
            })();
        }
    }

    function dateToUSTime(date) {
        let hours = (date.getHours() % 12).toString();
        if (hours === "0") hours = "12";
        let minutes = date.getMinutes().toString().padStart(2, '0');
        let ampm = Math.floor(date.getHours() / 12) === 0 ? "AM" : "PM";
        return hours + ":" + minutes + " " + ampm;
    }

    function findCorrectPredictionTime(predictions, direction) {
        let predictionDate = null;
        predictions.some((prediction) => {
            if (prediction.attributes.direction_id !== direction) {
                return false;
            }
            // Finds the first valid prediction that's in the future
            if (prediction.attributes.arrival_time !== null) {
                const arrivalTime = new Date(prediction.attributes.arrival_time);
                if (arrivalTime >= (Date.now() - 60000)) { // Gives 60 seconds of leeway
                    predictionDate = arrivalTime;
                    return true;
                } else {
                    return false;
                }
            } else if (prediction.attributes.departure_time !== null) {
                const departureTime = new Date(prediction.attributes.departure_time);
                if (departureTime >= (Date.now() - 60000)) {
                    predictionDate = departureTime;
                    return true;
                } else {
                    return false;
                }
            }
            return false;
        });

        if (predictionDate === null) {
            return "No prediction to " + selectedRoute.current.attributes.direction_destinations[direction];
        } else {
            return "Next to " + selectedRoute.current.attributes.direction_destinations[direction] +
                " at " + dateToUSTime(predictionDate);
        }
    }

    function findRealStop(stopID) {
        // Due to race conditions, one of the states might be currently undefined
        // Checking to avoid an exception
        if (routeStops === undefined || routeStopChildren === undefined) {
            return null;
        }

        let foundStop = routeStops.find((stop) => stop.id === stopID);
        if (foundStop !== undefined) {
            return foundStop;
        } else {
            foundStop = routeStopChildren.find((stop) => stop.id === stopID);
            if (foundStop !== undefined) {
                const parent = routeStops.find((stop) => stop.id === foundStop.relationships.parent_station.data.id);
                if (parent !== undefined) {
                    return parent;
                } else return null;
            } else return null;
        }
    }

    function statusFriendlyName(status) {
        switch (status) {
            case "INCOMING_AT":
                return "Arriving at";
            case "STOPPED_AT":
                return "Stopped at";
            case "IN_TRANSIT_TO":
                return "Going to";
            default:
                return "Unknown status to";
        }
    }

    function handleThemeChange({currentTarget: button}) {
        setDarkTheme(button.checked);
        if (selectedRoute.current != null) {
            setCurrentVehicleIcon(generateVehicleIcon(selectedRoute.current.attributes["type"],
                "#" + selectedRoute.current.attributes["color"], button.checked));
        }
    }

    function addFavoriteStop(route, routeName, station, stationLatLng, stationName) {
        (async () => {
            const body = {
                route: route,
                routeName: routeName,
                station: station,
                stationLatLng: stationLatLng,
                stationName: stationName
            };
            const newFavorite = await axios.post(`${process.env.REACT_APP_BACKEND_SERVER_URI}/favorites/new`,
                body, {withCredentials: true});
            setFavorites(favorites.concat([newFavorite.data]));
        })();
    }

    function addFavoriteRoute(route, routeName) {
        (async () => {
            const body = {
                route: route,
                routeName: routeName
            };
            const newFavorite = await axios.post(`${process.env.REACT_APP_BACKEND_SERVER_URI}/favorites/new`,
                body, {withCredentials: true});
            setFavorites(favorites.concat([newFavorite.data]));
        })();
    }

    function handleFavoriteSelect({currentTarget: dropdown}) {
        if (dropdown.value === "") {
            return;
        }
        const favorite = favorites.find((favorite) => favorite._id === dropdown.value);
        setRouteFilter("");
        routeChange(favorite.route);
        if (favorite.station !== undefined) {
            // station favorite
            if (leafletMap.current !== null) {
                leafletMap.current.setView(favorite.stationLatLng, 16);
            }
        }
    }

    return (
        <div className="map-page-container" data-bs-theme={darkTheme ? "dark" : "light"}>
            <div className="dropdown-container">
                <Form.Select className="no-round-corner"
                             onChange={(event) => setRouteFilter(event.currentTarget.value)}
                             value={routeFilter}>
                    <option value="none">All Route Types</option>
                    <option value="subway">Subway</option>
                    <option value="train">Commuter Rail</option>
                    <option value="bus">Bus</option>
                    <option value="ferry">Ferry</option>
                </Form.Select>
                <Form.Select className="no-round-corner"
                             onChange={(event) => routeChange(event.currentTarget.value)}
                             value={route}>
                    <option value="">Choose Route</option>
                    {transitRoutes.filter(route => {
                        switch (routeFilter) {
                            case "subway":
                                return route.attributes.type === 0 || route.attributes.type === 1;
                            case "train":
                                return route.attributes.type === 2;
                            case "bus":
                                return route.attributes.type === 3;
                            case "ferry":
                                return route.attributes.type === 4;
                            default:
                                return true;
                        }
                    }).map(route => {
                        let name = "";
                        switch (route.attributes["type"]) {
                            case 0:
                            case 1:
                                name = "Subway: " + route.attributes["long_name"];
                                break;
                            case 2:
                                name = "Commuter Rail: " + route.attributes["long_name"];
                                break;
                            case 3:
                                name = "Bus: " + route.attributes["short_name"] + " - " + route.attributes["long_name"];
                                break;
                            case 4:
                                name = "Ferry: " + route.attributes["long_name"];
                                break;
                            default:
                        }
                        return (
                            <option key={route.id} value={route.id}>
                                {name}
                            </option>
                        );
                    })}
                </Form.Select>
                {// Route favorite button, only shows if signed in, a route is selected, and route is not favorited
                    (user !== null && selectedRoute.current != null && favorites.find(favorite =>
                        favorite.route === selectedRoute.current.id && favorite.station === undefined) === undefined) ?
                        <Button className="no-round-corner" variant={darkTheme ? "dark" : "light"}
                                onClick={() =>
                                    addFavoriteRoute(selectedRoute.current.id, selectedRoute.current.attributes.long_name)}>
                            ⭐
                        </Button> : null}
                {favorites.length === 0 ? null :
                    <Form.Select className="no-round-corner" onChange={handleFavoriteSelect}>
                        <option value="">Select Favorite</option>
                        {favorites.map((favorite) =>
                            <option key={favorite._id} value={favorite._id}>
                                {favorite.stationName !== undefined ? favorite.stationName + " (" : null}
                                {favorite.routeName}
                                {favorite.stationName !== undefined ? ")" : null}
                            </option>
                        )}
                    </Form.Select>}
                <ToggleButton className="no-round-corner" id="dark-theme" value="1" type="checkbox"
                              variant={darkTheme ? "light" : "dark"} checked={darkTheme} onChange={handleThemeChange}>
                    {(darkTheme ? "Light" : "Dark")}
                </ToggleButton>
            </div>
            <div className="map-container">
                <div className="map">
                    <MapContainer center={[42.359149, -71.0581643]} zoom={10} scrollWheelZoom={true}>
                        <TileLayer
                            attribution='&copy; <a href="https://www.stadiamaps.com/" target="_blank">Stadia Maps</a> &copy; <a href="https://openmaptiles.org/" target="_blank">OpenMapTiles</a> &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                            url={"https://tiles.stadiamaps.com/tiles/alidade_smooth" +
                                (darkTheme ? "_dark" : "") + "/{z}/{x}/{y}{r}.{ext}"}
                            ext="png"
                            minZoom={8}
                        />
                        <Polyline pathOptions={currentColor} positions={currentPolyline} interactive={false}/>
                        {routeStops.map(stop => {
                            let direction0Prediction = null;
                            let direction1Prediction = null;
                            if (stopPredictions.has(stop.id)) {
                                direction0Prediction = findCorrectPredictionTime(stopPredictions.get(stop.id), 0);
                                direction1Prediction = findCorrectPredictionTime(stopPredictions.get(stop.id), 1);
                            }
                            return (
                                <Circle key={stop.id}
                                        center={[stop.attributes.latitude, stop.attributes.longitude]}
                                        pathOptions={{color: (darkTheme ? "#CCCCCC" : "#666666")}} radius={10}
                                        eventHandlers={{
                                            click: () => {
                                                getStopPredictions(stop, selectedRoute.current);
                                            },
                                        }}>
                                    <Popup>
                                        {stop.attributes.name}<br/>
                                        {direction0Prediction}{direction1Prediction !== null ? <br/> : null}
                                        {direction1Prediction}<br/>
                                        {(user !== null &&
                                            favorites.find(favorite => favorite.station === stop.id) === undefined) ?
                                            <Button size="sm" onClick={() => {
                                                addFavoriteStop(selectedRoute.current.id,
                                                    selectedRoute.current.attributes.long_name, stop.id,
                                                    [stop.attributes.latitude, stop.attributes.longitude],
                                                    stop.attributes.name);
                                            }}>
                                                Add to favorites
                                            </Button> : null}
                                    </Popup>
                                </Circle>
                            );
                        })}
                        {routeVehicles.map(vehicle => {
                            let realStop = null;
                            if (vehicle.relationships.stop.data !== null) {
                                realStop = findRealStop(vehicle.relationships.stop.data.id);
                            }
                            let realStopName = "unknown";
                            if (realStop !== null) {
                                realStopName = realStop.attributes.name;
                            }
                            const status = statusFriendlyName(vehicle.attributes.current_status);
                            return (
                                <Marker key={vehicle.id}
                                        position={[vehicle.attributes.latitude, vehicle.attributes.longitude]}
                                        icon={currentVehicleIcon} eventHandlers={{
                                    click: () => {
                                        findPolyline(vehicle.relationships.trip.data.id);
                                    },
                                }}>
                                    {vehicle.attributes.bearing != null ?
                                        <Marker // The API returns null for the bearing sometimes, so we need to check
                                            position={[vehicle.attributes.latitude, vehicle.attributes.longitude]}
                                            icon={generateHeadingIcon(vehicle.attributes.bearing, currentColor.color, darkTheme)}
                                            interactive={false}/> : null}
                                    <Popup>
                                        Vehicle {vehicle.attributes.label}<br/>
                                        {status} {realStopName}
                                    </Popup>
                                </Marker>
                            );
                        })}
                        <LeafletMapGetter/>
                    </MapContainer>
                </div>
            </div>
        </div>
    );
};

export default MbtaMap;
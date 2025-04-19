import React, {useEffect, useRef, useState} from 'react';
import {useMap} from "@uidotdev/usehooks";
import {MapContainer, TileLayer, Polyline, Marker, Circle, Popup, useMap as useLeafletMap} from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import axios from "axios";
import Form from 'react-bootstrap/Form';
import {decode} from "@googlemaps/polyline-codec";
import {generateVehicleIcon, generateHeadingIcon} from '../../utilities/icons';
import leaflet from 'leaflet';
import {LocateControl} from "leaflet.locatecontrol";
import "leaflet.locatecontrol/dist/L.Control.Locate.min.css";

const MbtaMap = () => {
    const [transitRoutes, setTransitRoutes] = useState([]);
    const [routeVehicles, setRouteVehicles] = useState([]);
    const selectedRoute = useRef(null);
    const [routeStops, setRouteStops] = useState([]);
    const [routeStopChildren, setRouteStopChildren] = useState([]);
    const stopPredictions = useMap();
    const [currentColor, setCurrentColor] = useState({color: "#FFFFFF"});
    const [currentVehicleIcon, setCurrentVehicleIcon] = useState(leaflet.divIcon());
    const [currentPolyline, setCurrentPolyline] = useState([]);
    const locationAdded = useRef(false);

    useEffect(() => {
        getRoutes("");

        const interval = setInterval(() => {
            updateRouteVehicles(selectedRoute.current);
        }, 5000);

        return () => {
            clearInterval(interval);
        }
    }, []);

    function handleTypeChange({currentTarget: dropdown}) {
        getRoutes(dropdown.value);
    }

    function getRoutes(filter) {
        async function fetchData() {
            const result = await axios(
                `${process.env.REACT_APP_BACKEND_SERVER_URI}/api/routes/` + filter
            );
            return result.data;
        }

        fetchData().then((routes) => {
            setTransitRoutes(routes.data);
        });
    }

    function handleRouteChange({currentTarget: dropdown}) {
        selectedRoute.current = transitRoutes.find((route) => route.id === dropdown.value);
        setCurrentPolyline([]);
        updateRouteVehicles(selectedRoute.current);
        getStops(selectedRoute.current);
        if (selectedRoute.current != null) {
            setCurrentColor({color: "#" + selectedRoute.current.attributes["color"]});
            setCurrentVehicleIcon(generateVehicleIcon(selectedRoute.current.attributes["type"],
                "#" + selectedRoute.current.attributes["color"]));
        }
    }

    function updateRouteVehicles(route) {
        if (route != null) {
            async function fetchData() {
                const result = await axios(
                    `${process.env.REACT_APP_BACKEND_SERVER_URI}/api/vehicles/` + route.id
                );
                return result.data;
            }

            fetchData().then((vehicles) => {
                setRouteVehicles(vehicles.data);
            });
        } else {
            setRouteVehicles([]);
        }
    }

    function findPolyline(tripID) {
        async function fetchData() {
            const result = await axios(
                `${process.env.REACT_APP_BACKEND_SERVER_URI}/api/trips/` + tripID
            );
            return result.data;
        }

        fetchData().then((trip) => {
            async function fetchData() {
                const result = await axios(
                    `${process.env.REACT_APP_BACKEND_SERVER_URI}/api/shapes/` + trip.data.relationships.shape.data.id
                );
                return result.data;
            }

            fetchData().then((shape) => {
                const decoded = decode(shape.data.attributes.polyline)
                setCurrentPolyline(decoded);
            })
        });
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
            async function fetchData() {
                const result = await axios(
                    `${process.env.REACT_APP_BACKEND_SERVER_URI}/api/stops/${currentServiceDate()}/${route.id}`
                );
                return result.data;
            }

            fetchData().then((stops) => {
                setRouteStops(stops.data);
                setRouteStopChildren(stops.included);
            });
        } else {
            setRouteStops([]);
        }
    }

    function getStopPredictions(stop, route) {
        if (stop != null) {
            async function fetchData() {
                const result = await axios(
                    `${process.env.REACT_APP_BACKEND_SERVER_URI}/api/predictions/${stop.id}/${route.id}`
                );
                return result.data;
            }

            fetchData().then((predictions) => {
                stopPredictions.set(stop.id, predictions.data)
            });
        }
    }

    function dateToUSTime(date) {
        let hours = (date.getHours() % 12).toString()
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
        })

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

    function LocationMarker() {
        const map = useLeafletMap();
        if (!locationAdded.current) {
            const control = new LocateControl({
                keepCurrentZoomLevel: true,
                locateOptions: {
                    enableHighAccuracy: true
                }
            });
            map.addControl(control);
            locationAdded.current = true;
        }
        return null;
    }

    return (
        <div className="map-page-container">
            <div className="dropdown-container">
                <Form.Select className="dropdown" onChange={handleTypeChange}>
                    <option value="">All Route Types</option>
                    <option value="0,1">Subway</option>
                    <option value="2">Commuter Rail</option>
                    <option value="3">Bus</option>
                    <option value="4">Ferry</option>
                </Form.Select>
                <Form.Select className="dropdown" onChange={handleRouteChange}>
                    <option value="">Choose Route</option>
                    {transitRoutes.map(route => {
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
                    })
                    }
                </Form.Select>
            </div>
            <div className="map-container">
                <div className="map">
                    <MapContainer center={[42.359149, -71.0581643]} zoom={10} scrollWheelZoom={true}>
                        <TileLayer
                            attribution='&copy; <a href="https://www.stadiamaps.com/" target="_blank">Stadia Maps</a> &copy; <a href="https://openmaptiles.org/" target="_blank">OpenMapTiles</a> &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                            url="https://tiles.stadiamaps.com/tiles/alidade_smooth_dark/{z}/{x}/{y}{r}.{ext}"
                            ext="png"
                            minZoom={8}
                        />
                        <LocationMarker/>
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
                                        pathOptions={{color: "#CCCCCC"}} radius={10} eventHandlers={{
                                    click: () => {
                                        getStopPredictions(stop, selectedRoute.current);
                                    },
                                }}>
                                    <Popup>
                                        {stop.attributes.name}<br/>
                                        {direction0Prediction}{direction1Prediction !== null ? <br/> : null}
                                        {direction1Prediction}
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
                                            icon={generateHeadingIcon(vehicle.attributes.bearing, currentColor.color)}
                                            interactive={false}/> : null}
                                    <Popup>
                                        Vehicle {vehicle.attributes.label}<br/>
                                        {status} {realStopName}
                                    </Popup>
                                </Marker>
                            );
                        })}
                    </MapContainer>
                </div>
            </div>
        </div>
    )
}

export default MbtaMap
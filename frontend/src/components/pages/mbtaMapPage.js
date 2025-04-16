import React, {useEffect, useRef, useState} from 'react';
import {useMap} from "@uidotdev/usehooks";
import {MapContainer, TileLayer, Polyline, Marker, Circle, Popup} from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import axios from "axios";
import Form from 'react-bootstrap/Form';
import {decode} from "@googlemaps/polyline-codec";
import {generateVehicleIcon, generateHeadingIcon} from '../../utilities/icons';
import leaflet from 'leaflet';

const MbtaMap = () => {
    const [transitRoutes, setTransitRoutes] = useState([]);
    const [routeVehicles, setRouteVehicles] = useState([]);
    const selectedRoute = useRef(null);
    const [routeStops, setRouteStops] = useState([]);
    const stopPredictions = useMap();
    const [currentColor, setCurrentColor] = useState({color: "#FFFFFF"});
    const [currentVehicleIcon, setCurrentVehicleIcon] = useState(leaflet.divIcon());
    const [currentPolyline, setCurrentPolyline] = useState([]);

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
                'https://api-v3.mbta.com/routes?filter%5Btype%5D=' + filter
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
                    'https://api-v3.mbta.com/vehicles?filter%5Broute%5D=' + route.id
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
                'https://api-v3.mbta.com/trips/' + tripID
            );
            return result.data;
        }

        fetchData().then((trip) => {
            async function fetchData() {
                const result = await axios(
                    'https://api-v3.mbta.com/shapes/' + trip.data.relationships.shape.data.id
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
                    `https://api-v3.mbta.com/stops?filter%5Bdate%5D=${currentServiceDate()}&filter%5Broute%5D=${route.id}`
                );
                return result.data;
            }

            fetchData().then((stops) => {
                setRouteStops(stops.data);
            });
        } else {
            setRouteStops([]);
        }
    }

    function getStopPredictions(stop, route) {
        if (stop != null) {
            async function fetchData() {
                const result = await axios(
                    `https://api-v3.mbta.com/predictions?sort=time&fields%5Bprediction%5D=arrival_time%2Cdeparture_time%2Cdirection_id&filter%5Bstop%5D=${stop.id}&filter%5Broute%5D=${route.id}`
                );
                return result.data;
            }

            fetchData().then((predictions) => {
                stopPredictions.set(stop.id, predictions.data)
            });
        }
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
        })

        if (predictionDate === null) {
            return "No prediction towards " + selectedRoute.current.attributes.direction_destinations[direction];
        } else {
            let hours = (predictionDate.getHours() % 12).toString()
            if (hours === "0") hours = "12";
            let minutes = predictionDate.getMinutes().toString().padStart(2, '0');
            let ampm = Math.floor(predictionDate.getHours() / 12) === 0 ? "AM" : "PM";
            const timeString = hours + ":" + minutes + " " + ampm;
            return "Next to " + selectedRoute.current.attributes.direction_destinations[direction] +
                " at " + timeString;
        }
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
                        <Polyline pathOptions={currentColor} positions={currentPolyline}> interactive={false}</Polyline>
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
                        {routeVehicles.map(vehicle => (
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
                                        interactive={false}></Marker> : null}
                            </Marker>
                        ))}
                    </MapContainer>
                </div>
            </div>
        </div>
    )
}

export default MbtaMap
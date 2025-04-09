import React, {useEffect, useRef, useState} from 'react';
import {MapContainer, TileLayer, CircleMarker, Polyline} from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import axios from "axios";
import Form from 'react-bootstrap/Form';
import {decode} from "@googlemaps/polyline-codec";

const MbtaMap = () => {
    const [transitRoutes, setTransitRoutes] = useState([]);
    const [routeVehicles, setRouteVehicles] = useState([]);
    const selectedRoute = useRef(null);
    const [currentColor, setCurrentColor] = useState({color: "#FFFFFF"});
    const [currentPolyline, setCurrentPolyline] = useState([]);

    useEffect(() => {
        async function fetchData() {
            const result = await axios(
                'https://api-v3.mbta.com/routes'
            );
            return result.data;
        }

        fetchData().then((routes) => {
            setTransitRoutes(routes.data);
        });

        const interval = setInterval(() => {
            updateRouteVehicles(selectedRoute.current);
        }, 5000);

        return () => {
            clearInterval(interval);
        }
    }, []);

    function handleTypeChange({currentTarget: dropdown}) {
        async function fetchData() {
            const result = await axios(
                'https://api-v3.mbta.com/routes?filter%5Btype%5D=' + dropdown.value
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
        if (selectedRoute.current != null) {
            setCurrentColor({color: "#" + selectedRoute.current.attributes["color"]});
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
                        {routeVehicles.map(vehicle => (
                            <CircleMarker key={vehicle.id}
                                          center={[vehicle.attributes.latitude, vehicle.attributes.longitude]}
                                          pathOptions={currentColor}
                                          radius={10} eventHandlers={{
                                click: () => {
                                    findPolyline(vehicle.relationships.trip.data.id);
                                },
                            }}></CircleMarker>
                        ))}
                        <Polyline pathOptions={currentColor} positions={currentPolyline}></Polyline>
                    </MapContainer>
                </div>
            </div>
        </div>
    )
}

export default MbtaMap
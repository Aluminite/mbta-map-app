import React, {useEffect, useRef, useState} from 'react';
import {MapContainer, TileLayer, CircleMarker} from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import axios from "axios";
import Form from 'react-bootstrap/Form';

const MbtaMap = () => {
    const [transitRoutes, setTransitRoutes] = useState([]);
    const [routeVehicles, setRouteVehicles] = useState([]);
    const selectedRoute = useRef(null);

    useEffect(() => {
        async function fetchData() {
            const result = await axios(
                'https://api-v3.mbta.com/routes'
            );
            return result.data;
        }

        fetchData().then((response) => {
            setTransitRoutes(response.data);
        });

        const interval = setInterval(() => {
            updateRouteVehicles(selectedRoute.current);
        }, 5000);

        return () => {
            clearInterval(interval);
        }
    }, []);

    function handleRouteChange({currentTarget: dropdown}) {
        selectedRoute.current = transitRoutes.find((route) => route.id === dropdown.value);
        updateRouteVehicles(selectedRoute.current);
    }

    function updateRouteVehicles(route) {
        if (route != null) {
            async function fetchData() {
                const result = await axios(
                    'https://api-v3.mbta.com/vehicles?filter%5Broute%5D=' + route.id
                );
                return result.data;
            }

            fetchData().then((response) => {
                setRouteVehicles(response.data);
            });
        } else {
            setRouteVehicles([]);
        }
    }

    return (
        <div>
            <Form.Select onChange={handleRouteChange}>
                <option value={null}>Choose route</option>
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
                })}
            </Form.Select>
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
                                      pathOptions={{color: "#" + selectedRoute.current.attributes["color"]}}
                                      radius={10}></CircleMarker>
                    ))}
                </MapContainer>
            </div>
        </div>
    )
}

export default MbtaMap
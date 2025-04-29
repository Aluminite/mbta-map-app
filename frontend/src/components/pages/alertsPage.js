import {useContext, useEffect, useState} from "react";
import {Form} from "react-bootstrap";
import '../../css/alertsPage.css';
import axios from "axios";
import {ThemeContext} from "../../App";

function AlertsPage() {
    const [alerts, setAlerts] = useState([]);
    const {darkTheme} = useContext(ThemeContext);

    useEffect(() => {
        fetchAlerts();
    }, []);

    function fetchAlerts(severity) {
        (async () => {
            const alerts = await axios.get(`${process.env.REACT_APP_BACKEND_SERVER_URI}/api/alerts/${severity}`);
            setAlerts(alerts.data.data);
        })();
    }

    function handleSeverityChange(event) {
        fetchAlerts(event.currentTarget.value);
    }

    return (
        <div className="alerts-page-container" data-bs-theme={darkTheme ? "dark" : "light"}>
            <div className="dropdown-container">
                <Form.Select
                    className="no-round-corner"
                    onChange={handleSeverityChange}>
                    <option value="">All Severities</option>
                    <option value="1">Severe</option>
                    <option value="2">Major</option>
                    <option value="3">Moderate</option>
                    <option value="4">Minor</option>
                </Form.Select>
            </div>

            <div className="alerts-container">
                {alerts.length === 0 ? (
                    <div className="no-alerts">No alerts found.</div>
                ) : (
                    alerts.map(alert => (
                        <div key={alert.id} className="alert-item">
                            <div className="alert-box">
                                <h5 className="alert-header">{alert.attributes.header || "No Title"}</h5>
                                <p className="alert-description">{alert.attributes.description || "No description available."}</p>
                                <small className="alert-severity">Severity: {alert.attributes.severity}</small>
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
}

export default AlertsPage;
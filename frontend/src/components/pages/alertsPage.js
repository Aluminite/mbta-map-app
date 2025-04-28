import { useEffect, useState } from "react";
import { Form } from "react-bootstrap";
import './alertsPage.css';

function AlertsPage() {
    const [alerts, setAlerts] = useState([]);
    const [filteredAlerts, setFilteredAlerts] = useState([]);
    const [alertSeverity, setAlertSeverity] = useState("");

    useEffect(() => {
        fetchAlerts();
    }, []);

    async function fetchAlerts() {
        try {
            const response = await fetch("http://localhost:8081/api/alerts");
            const data = await response.json();
            setAlerts(data.data);
            setFilteredAlerts(data.data);
        } catch (error) {
            console.error("Failed to fetch alerts:", error);
        }
    }

    function handleSeverityChange(event) {
        const severity = event.target.value;
        setAlertSeverity(severity);

        if (severity === "") {
            setFilteredAlerts(alerts);
        } else {
            setFilteredAlerts(alerts.filter(alert => alert.attributes.severity === parseInt(severity)));
        }
    }

    return (
        <div className="alerts-page-container">
            <div className="dropdown-container">
                <Form.Select
                    className="form-select no-round-corner"
                    onChange={handleSeverityChange}
                    value={alertSeverity}
                >
                    <option value="">All Severities</option>
                    <option value="1">Severe</option>
                    <option value="2">Major</option>
                    <option value="3">Moderate</option>
                    <option value="4">Minor</option>
                </Form.Select>
            </div>

            <div className="alerts-container">
                {filteredAlerts.length === 0 ? (
                    <div className="no-alerts">No alerts found.</div>
                ) : (
                    filteredAlerts.map(alert => (
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
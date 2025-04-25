import React, { useEffect, useState } from 'react';

function AlertsPage() {
  const [alerts, setAlerts] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchAlerts = async () => {
      try {
        const res = await fetch('http://localhost:8081/api/alerts');
        const data = await res.json();
        setAlerts(data.data);
      } catch (err) {
        console.error('Error fetching alerts:', err);
        setError('Failed to load alerts.');
      }
    };

    fetchAlerts();
  }, []);

  if (error) {
    return React.createElement('div', { className: 'p-4 text-red-600' }, error);
  }

  return React.createElement(
    'div',
    { className: 'p-4 max-w-4xl mx-auto' },
    [
      React.createElement(
        'h1',
        { key: 'title', className: 'text-2xl font-bold mb-4' },
        'MBTA Alerts'
      ),
      ...alerts.map((alert) =>
        React.createElement(
          'div',
          {
            key: alert.id,
            className: 'p-4 border rounded shadow bg-white space-y-1',
          },
          [
            React.createElement(
              'h2',
              { key: 'header', className: 'text-lg font-semibold' },
              alert.attributes.header || 'No title'
            ),
            React.createElement(
              'p',
              { key: 'effect', className: 'text-sm text-gray-700' },
              'Effect: ' + (alert.attributes.effect || 'Unknown')
            ),
            React.createElement(
              'p',
              { key: 'updated', className: 'text-xs text-gray-500' },
              'Last updated: ' +
                new Date(alert.attributes.updated_at).toLocaleString()
            ),
          ]
        )
      ),
    ]
  );
}

export default AlertsPage;
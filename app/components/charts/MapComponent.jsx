import React, { useEffect } from 'react';

const MapComponent = ({ gpsData }) => {
	useEffect(() => {
		if (gpsData) {
			const initMap = async () => {
				const { Map } = await google.maps.importLibrary('maps');
				const map = new Map(document.getElementById('map'), {
					center: { lat: gpsData.lat, lng: gpsData.lon },
					zoom: 8,
				});

				new google.maps.Marker({
					position: { lat: gpsData.lat, lng: gpsData.lon },
					map: map,
				});
			};

			initMap();
		}
	}, [gpsData]);

	return gpsData ? (
		<div
			id='map'
			style={{ height: '400px', width: '100%' }}
		></div>
	) : (
		<p>No GPS data available</p>
	);
};

export default MapComponent;

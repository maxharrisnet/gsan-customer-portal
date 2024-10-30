// /routes/modemStatus.js

const express = require('express');
const axios = require('axios');
const router = express.Router();

router.get('/modem-status', async (req, res) => {
	const { provider, modemid } = req.query;

	// Validate input
	if (!provider || !modemid) {
		return res.status(400).send('Both modemId and provider parameters are required.');
	}

	try {
		// Assuming you have accessToken stored globally or through environment variables
		const accessToken = process.env.ACCESS_TOKEN;

		if (!accessToken || accessToken.startsWith('Error')) {
			return res.status(401).send(accessToken || 'Invalid access token.');
		}

		// Construct the modem details URL (replace with actual logic to build URL)
		const modemDetailsURL = `https://api.example.com/${provider}/modems/${modemId}/details`;

		// Fetch modem details
		const modemResponse = await axios.get(modemDetailsURL, {
			headers: { Authorization: `Bearer ${accessToken}` },
		});

		const modem = modemResponse.data;

		if (!modem || modem.startsWith('Error')) {
			return res.status(404).send(modem || `No data available for modem ${modemid}`);
		}

		// Fetch GPS and other data (assuming similar structure)
		const gpsData = await fetchGPS(provider, [modemid], accessToken);
		const latencyData = modem.data.latency?.data || [];
		const throughputData = modem.data.throughput?.data || [];
		const signalQualityData = modem.data.signal?.data || [];
		const obstructionData = modem.data.obstruction?.data || [];

		// Return all data as JSON
		return res.json({
			modem: modem.data,
			gpsData,
			latencyData,
			throughputData,
			signalQualityData,
			obstructionData,
		});
	} catch (error) {
		console.error('Error fetching modem status:', error);
		return res.status(500).send('Internal server error');
	}
});

// Function to fetch GPS data (replace with actual implementation)
async function fetchGPS(provider, modemIds, accessToken) {
	const gpsURL = `https://api.example.com/${provider}/gps`;
	const response = await axios.post(
		gpsURL,
		{ modemIds },
		{
			headers: { Authorization: `Bearer ${accessToken}` },
		}
	);
	return response.data;
}

module.exports = router;

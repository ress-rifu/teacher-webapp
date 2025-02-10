// teacher-routine-backend/server.js

const express = require('express');
const cors = require('cors');
const { google } = require('googleapis');
const dotenv = require('dotenv');
dotenv.config();

const app = express();
const port = process.env.PORT || 5000;

// Enable CORS to allow requests from your frontend (localhost:5173)
app.use(cors());

// Set up Google Sheets API client
const sheets = google.sheets({ version: 'v4', auth: process.env.GOOGLE_SHEET_API_KEY });

// Define the /api/routines endpoint
app.get('/api/routines', async (req, res) => {
    try {
        // Fetch data from Google Sheets (Columns B to K, as per the range specified in App.jsx)
        const response = await sheets.spreadsheets.values.get({
            spreadsheetId: process.env.GOOGLE_SHEET_ID,
            range: 'Dashboard!B:K', // Columns B to K (Class Date to Teacher)
        });

        const routines = response.data.values;

        // Filter out the first row and any empty rows (as per the filtering logic in App.jsx)
        const filteredRoutines = routines.slice(1).filter((routine) => routine[0] && routine[8]);

        // Send filtered routines data as a JSON response
        res.json(filteredRoutines);
    } catch (err) {
        console.error(err);
        res.status(500).send('Error retrieving data from Google Sheets');
    }
});

// Start the server
app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
});

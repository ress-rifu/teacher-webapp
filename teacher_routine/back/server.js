const express = require('express');
const cors = require('cors');
const { google } = require('googleapis');
const dotenv = require('dotenv');
dotenv.config();

const app = express();
const port = process.env.PORT || 5000;

// Enable CORS for frontend hosted on Netlify
app.use(cors({
  origin: 'https://afsroutine.netlify.app',  // Allow only this frontend URL
}));

// Set up Google Sheets API client
const sheets = google.sheets({ version: 'v4', auth: process.env.GOOGLE_SHEET_API_KEY });

// Define the /api/routines endpoint
app.get('/api/routines', async (req, res) => {
  try {
    // Fetch fresh data from Google Sheets
    const response = await sheets.spreadsheets.values.get({
      spreadsheetId: process.env.GOOGLE_SHEET_ID,
      range: 'Dashboard!B:N', // Columns B to L (Class Date to Teacher)
      majorDimension: 'ROWS', // Fetch data as rows (default)
    });

    const routines = response.data.values;

    // Filter out the first row (header) and any empty rows
    const filteredRoutines = routines.slice(1).filter((routine) => routine[0] && routine[8]);

    // Send the fresh data as the JSON response
    res.json(filteredRoutines);
  } catch (err) {
    console.error(err);
    res.status(500).send('Error retrieving data from Google Sheets');
  }
});

// Start the server
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
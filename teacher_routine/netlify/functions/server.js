const { google } = require('googleapis');
const dotenv = require('dotenv');
dotenv.config();

// Set up Google Sheets API client
const sheets = google.sheets({ version: 'v4', auth: process.env.GOOGLE_SHEET_API_KEY });

// The handler for the Netlify serverless function
exports.handler = async function (event, context) {
    try {
        // Fetch data from Google Sheets (Columns B to K, as per the range specified in App.jsx)
        const response = await sheets.spreadsheets.values.get({
            spreadsheetId: process.env.GOOGLE_SHEET_ID,
            range: 'Dashboard!B:K', // Columns B to K (Class Date to Teacher)
        });

        const routines = response.data.values;

        // Filter out the first row and any empty rows (as per the filtering logic in App.jsx)
        const filteredRoutines = routines.slice(1).filter((routine) => routine[0] && routine[8]);

        // Return filtered routines data as a JSON response
        return {
            statusCode: 200,
            body: JSON.stringify(filteredRoutines),
        };
    } catch (err) {
        console.error(err);
        return {
            statusCode: 500,
            body: JSON.stringify({ message: 'Error retrieving data from Google Sheets', error: err.message }),
        };
    }
};

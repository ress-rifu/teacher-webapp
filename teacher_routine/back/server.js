const express = require('express');
const cors = require('cors');
const { google } = require('googleapis');
const dotenv = require('dotenv');
const axios = require('axios'); // To download the teacher's image
dotenv.config();

const app = express();
const port = process.env.PORT || 5000;

// Enable CORS for frontend hosted on Netlify
app.use(cors({
  origin: 'https://afsroutine.netlify.app',  // Allow only this frontend URL
}));

// Set up Google Sheets and Google Slides API clients
const sheets = google.sheets({ version: 'v4', auth: process.env.GOOGLE_SHEET_API_KEY });
const slides = google.slides({ version: 'v1', auth: process.env.GOOGLE_SHEET_API_KEY });

// Define the /api/routines endpoint
app.get('/api/routines', async (req, res) => {
    try {
        // Fetch data from Google Sheets (Columns B to M)
        const response = await sheets.spreadsheets.values.get({
            spreadsheetId: process.env.GOOGLE_SHEET_ID,
            range: 'Dashboard!B:M', // Columns B to M (Class Date to Class (বাংলা))
        });

        const routines = response.data.values;

        // Filter out the first row and any empty rows
        const filteredRoutines = routines.slice(1).filter((routine) => routine[0] && routine[8]);

        // Send filtered routines data as a JSON response
        res.json(filteredRoutines);
    } catch (err) {
        console.error(err);
        res.status(500).send('Error retrieving data from Google Sheets');
    }
});

// Function to generate Google Slides for a routine
app.post('/api/generate-slide', async (req, res) => {
    const { classDate, time, className, subject, teacher, topic, part } = req.body;
    
    try {
        // Create a new presentation by copying an existing template
        const templateId = process.env.GOOGLE_SLIDE_TEMPLATE_ID; // Replace with your template ID
        const presentation = await slides.presentations.copy({
            presentationId: templateId,
        });

        const newSlideId = presentation.data.presentationId;

        // Get teacher image URL
        const teacherImages = {
            "Abida Purvin Chowdhury": "https://i.postimg.cc/gkTqCV7g/Abida-Purvin-Chowdhury.png",
            "Al-Fahim": "https://i.postimg.cc/CxnHSZTS/Al-Fahim.png",
            "Mohammed Suhaib Sinan Aohin": "https://i.postimg.cc/q7fcRk4n/Aohin.png",
            "Arpita Dhar": "https://i.postimg.cc/QMpQKRdz/Arpita-Dhar.png",
            "Avik Chakroborty": "https://i.postimg.cc/4dsz6BKx/Avik-Chakroborty.png",
            "Dipit Saha": "https://i.postimg.cc/RFdwXKfQ/Dipit.png",
            "Fariha Naznin Tandra": "https://i.postimg.cc/zvfKMvFm/Fariha-Naznin-Tandra.png",
            "Hridita Chakraborty": "https://i.postimg.cc/kGhKdCT2/Hridita.png",
            "Kazi Rakibul Hasan": "https://i.postimg.cc/1RWpF0yy/Kazi-Rakibul-Hasan.png",
            "M Mashrur Hussain": "https://i.postimg.cc/qMz2xt7y/Mashrur.png",
            "Md Junayed Khan Ryan": "https://i.postimg.cc/NfSmJgyV/Md-Junayed-Khan-Ryan.png",
            "MD Omor Faruk": "https://i.postimg.cc/5N7nxdXq/MD-Omor-Faruk.png",
            "Mehrab Hossain Omio": "https://i.postimg.cc/SxHdM67n/Mehrab-Hossain-Omio.png",
            "Nousheen Tabassum Ahona": "https://i.postimg.cc/q7nLXNjj/Nousheen-Tabassum-Ahona.png",
            "Rafiad Rahman Mahin": "https://i.postimg.cc/138MXC6x/Rafiad-Rahman-Mahin.png",
            "Md. Mahfuzur Rahman Rahat": "https://i.postimg.cc/k4myj7H9/Rahat.png",
            "Samin Zahan Sieyam": "https://i.postimg.cc/PJfQj2hR/Samin-Zahan-Sieyam.png",
            "Md. Shadman Abrar Khan": "https://i.postimg.cc/gJHHQf9h/Shadman.png",
            "Shahreen Tabassum Nova": "https://i.postimg.cc/Kj9rvB8v/Shareen-Tabassum-Nova.png",
            "Tahiya Tahreema Hossain": "https://i.postimg.cc/wxFkV8Q8/Tahiya-Tahreema-Hossain.png",
            "Tashmiya Hasan": "https://i.postimg.cc/15tr7Cvg/Tashmia.png"
        };

        const teacherImage = teacherImages[teacher];

        // Prepare the requests to update the slide
        const requests = [
            // Replace placeholders with data
            {
                replaceAllText: {
                    containsText: { text: '{{class_date}}', matchCase: true },
                    replaceText: classDate,
                },
            },
            {
                replaceAllText: {
                    containsText: { text: '{{time}}', matchCase: true },
                    replaceText: time,
                },
            },
            {
                replaceAllText: {
                    containsText: { text: '{{class}}', matchCase: true },
                    replaceText: className,
                },
            },
            {
                replaceAllText: {
                    containsText: { text: '{{subject}}', matchCase: true },
                    replaceText: subject,
                },
            },
            {
                replaceAllText: {
                    containsText: { text: '{{teacher}}', matchCase: true },
                    replaceText: teacher,
                },
            },
            {
                replaceAllText: {
                    containsText: { text: '{{topic}}', matchCase: true },
                    replaceText: topic,
                },
            },
            {
                replaceAllText: {
                    containsText: { text: '{{part}}', matchCase: true },
                    replaceText: part,
                },
            },
            // Add teacher image
            {
                createImage: {
                    elementProperties: {
                        pageObjectId: newSlideId,
                        size: {
                            height: { magnitude: 1500000, unit: 'EMU' },
                            width: { magnitude: 1500000, unit: 'EMU' },
                        },
                        transform: {
                            scaleX: 1,
                            scaleY: 1,
                            translateX: 3000000, // Adjust the position as per your slide layout
                            translateY: 1500000, // Adjust the position as per your slide layout
                        },
                    },
                    url: teacherImage,
                },
            }
        ];

        // Execute the requests to update the slide
        await slides.presentations.batchUpdate({
            presentationId: newSlideId,
            requestBody: { requests },
        });

        // Return the URL of the newly created slide
        const slideUrl = `https://docs.google.com/presentation/d/${newSlideId}/edit`;
        res.json({ slideUrl });

    } catch (error) {
        console.error(error);
        res.status(500).send('Error generating Google Slide');
    }
});

// Start the server
app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});

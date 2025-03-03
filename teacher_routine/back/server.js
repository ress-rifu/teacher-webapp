const express = require('express');
const cors = require('cors');
const { google } = require('googleapis');
const axios = require('axios');
const dotenv = require('dotenv');
dotenv.config();

const app = express();
const port = process.env.PORT || 5000;

// Enable CORS for frontend hosted on Netlify
app.use(cors({
    origin: 'https://afsroutine.netlify.app',  // Allow only this frontend URL
}));

// Set up Google APIs (Slides & Drive)
const slides = google.slides({ version: 'v1', auth: process.env.GOOGLE_SHEET_API_KEY });
const drive = google.drive({ version: 'v3', auth: process.env.GOOGLE_SHEET_API_KEY });

// Teacher images mapping
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

// Define the /api/generate-slide endpoint
app.post('/api/generate-slide', async (req, res) => {
    const { classDate, time, className, subject, teacher, topic, part } = req.body;
    const slideTemplateId = process.env.GOOGLE_SLIDE_TEMPLATE_ID;  // Your predefined Google Slide Template ID

    try {
        // Step 1: Create a copy of the template slide
        const copyResponse = await slides.presentations.copy({
            presentationId: slideTemplateId,
            requestBody: {
                name: `Routine for ${subject} - ${teacher}`,
            },
        });

        const presentationId = copyResponse.data.presentationId;
        console.log(`Created new presentation with ID: ${presentationId}`);

        // Step 2: Update the placeholders with routine data
        const requests = [
            {
                replaceAllText: {
                    containsText: { text: '{{classDate}}' },
                    replaceText: classDate,
                },
            },
            {
                replaceAllText: {
                    containsText: { text: '{{time}}' },
                    replaceText: time,
                },
            },
            {
                replaceAllText: {
                    containsText: { text: '{{className}}' },
                    replaceText: className,
                },
            },
            {
                replaceAllText: {
                    containsText: { text: '{{subject}}' },
                    replaceText: subject,
                },
            },
            {
                replaceAllText: {
                    containsText: { text: '{{teacher}}' },
                    replaceText: teacher,
                },
            },
            {
                replaceAllText: {
                    containsText: { text: '{{topic}}' },
                    replaceText: topic,
                },
            },
            {
                replaceAllText: {
                    containsText: { text: '{{part}}' },
                    replaceText: part,
                },
            },
        ];

        // Step 3: Add image of teacher (if available) to slide
        const teacherImageUrl = teacherImages[teacher];  // Get image URL for the teacher from the mapping object
        if (teacherImageUrl) {
            const imageResponse = await axios({
                url: teacherImageUrl,
                responseType: 'arraybuffer',
            });

            const media = imageResponse.data;

            // Upload the image to Google Drive
            const fileResponse = await drive.files.create({
                media: {
                    mimeType: 'image/jpeg',
                    body: Buffer.from(media, 'binary'),
                },
                requestBody: {
                    name: `${teacher}-image.jpg`,
                    parents: ['appDataFolder'],
                },
            });

            const imageFileId = fileResponse.data.id;

            // Step 4: Place the teacher's image in the predefined location
            const insertImageRequest = {
                requests: [
                    {
                        createImage: {
                            objectId: 'imageId',
                            url: `https://drive.google.com/uc?id=${imageFileId}`,
                            elementProperties: {
                                pageObjectId: 'p',
                                size: { width: { magnitude: 100, unit: 'PT' }, height: { magnitude: 100, unit: 'PT' } },
                                transform: { scaleX: 1, scaleY: 1, translateX: 50, translateY: 150 },
                            },
                        },
                    },
                ],
            };

            await slides.presentations.batchUpdate({
                presentationId,
                requestBody: insertImageRequest,
            });
        }

        // Step 5: Execute the requests to replace the text
        await slides.presentations.batchUpdate({
            presentationId,
            requestBody: { requests },
        });

        // Step 6: Return the URL of the generated slide
        const slideUrl = `https://docs.google.com/presentation/d/${presentationId}/edit`;
        res.json({ url: slideUrl });

    } catch (err) {
        console.error('Error generating slide:', err);
        res.status(500).send('Error generating Google Slide');
    }
});

// Start the server
app.listen(port, () => {
    console.log('Server is running');
});

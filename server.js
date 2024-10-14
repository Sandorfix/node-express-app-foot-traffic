// Load environment variables from .env file
require('dotenv').config();

const express = require('express');
const cors = require('cors'); // Import the cors package
const app = express();
const port = process.env.PORT || 3000;

// Enable CORS for all routes
app.use(cors());

// Example usage of environment variables
const emailJsPublicKey = process.env.EMAILJS_PUBLIC_KEY;
const emailJsServiceId = process.env.EMAILJS_SERVICE_ID;
const emailJsTemplateId = process.env.EMAILJS_TEMPLATE_ID;

// Endpoint to provide EmailJS configuration
app.get('/api/emailjs-config', (req, res) => {
  res.json({
    publicKey: emailJsPublicKey,
    serviceId: emailJsServiceId,
    templateId: emailJsTemplateId
  });
});

app.get('/', (req, res) => {
    res.send('Hello World!');
});

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
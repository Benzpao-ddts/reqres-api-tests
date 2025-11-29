const axios = require('axios');
const fs = require('fs');
const path = require('path');
const { validateResponse } = require('../utils/validateResponse');

// Load config
const config = JSON.parse(
    fs.readFileSync(path.join(__dirname, '../data/config.json'), 'utf-8')
);

async function updateUser() {
    try {
        // Read userId
        const { userId } = JSON.parse(fs.readFileSync(path.join(__dirname, '..', config.files.userId)));

        // Load payload from config
        const payload = config.payloads.updateUser;

        // Measure start time
        const startTime = Date.now();

        // Call API
        const response = await axios.put(
            `${config.api.baseUrl}/users/${userId}`,
            payload,
            { headers: { ...config.api.headers, 'Content-Type': 'application/json' } }
        );

        // Measure end time
        const endTime = Date.now();
        response.duration = endTime - startTime;

        // Validate response
        const expected = config.validation.updateUser
        const result = validateResponse(
            response,
            expected
        );

        console.log(`UPDATE USER ID: ${userId} Validation result:`, result);
        console.log("\n\n--------------------------------------------------");

    } catch (err) {
        console.error("Error:", err.message);
    }
}

updateUser();

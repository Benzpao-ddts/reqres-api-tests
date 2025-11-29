const axios = require('axios');
const fs = require('fs');
const path = require('path');
const { validateResponse } = require('../utils/validateResponse');

// Load config
const config = JSON.parse(fs.readFileSync(path.join(__dirname, '../data/config.json')));

async function getSingleUser() {
    try {
        // Read userId
        const { userId } = JSON.parse(fs.readFileSync(config.files.userId));

        const startTime = Date.now();
        const response = await axios.get(`${config.api.baseUrl}/users/${userId}`, {
            headers: config.api.headers
        });
        const endTime = Date.now();
        response.duration = endTime - startTime;
        // Validate response
        const expected = config.validation.getSingleUser
        const result = validateResponse(response, expected);
        console.log("Validation result:", result);
        console.log("\n\n--------------------------------------------------");

    } catch (err) {
        console.error("Error:", err.message);
    }
}

getSingleUser();

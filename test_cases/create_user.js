const axios = require('axios');
const fs = require('fs');
const path = require('path');
const { validateResponse } = require('../utils/validateResponse');

// Load config
const config = JSON.parse(
    fs.readFileSync(path.join(__dirname, '../data/config.json'), 'utf-8')
);

async function createUser() {
    try {
        // Payload from config
        const payload = config.payloads.createUser;

        const startTime = Date.now();
        const response = await axios.post(
            `${config.api.baseUrl}/users`,
            payload,
            { headers: config.api.headers }
        );
        const endTime = Date.now();
        response.duration = endTime - startTime;

        // Validate response
        const expected = config.validation.createUser

        const result = validateResponse(
            response,
            expected
        );

        console.log("CREATE USER Validation:", result);

        // Just display the created user ID (DON’T SAVE)
        console.log("Created user ID:", response.data.id);
        console.log("\n\n--------------------------------------------------");


    } catch (err) {
        console.error("CREATE USER Error:", err.message);
    }
}

createUser();

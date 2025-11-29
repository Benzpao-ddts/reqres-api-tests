const axios = require('axios');
const fs = require('fs');
const path = require('path');
const { validateResponse } = require('../utils/validateResponse');

const config = JSON.parse(fs.readFileSync(path.join(__dirname, '../data/config.json')));

async function deleteUser() {
    try {
        const { userId } = JSON.parse(fs.readFileSync(config.files.userId));

        const startTime = Date.now();
        const response = await axios.delete(`${config.api.baseUrl}/users/${userId}`, {
            headers: config.api.headers
        });
        const endTime = Date.now();
        response.duration = endTime - startTime;

        const expected = config.validation.deleteUser
        const result = validateResponse(response, expected);
        console.log("Delete Validation:", result);
        console.log("\n\n--------------------------------------------------");

    } catch (err) {
        console.error("Delete Error:", err.message);
    }
}

deleteUser();

const axios = require('axios');
const fs = require('fs');
const path = require('path');

const { validateResponse } = require('../utils/validateResponse');

// Load config
const config = JSON.parse(
    fs.readFileSync(path.join(__dirname, '../data/config.json'), 'utf-8')
);

async function getAllUsers() {
    try {
        let allUsers = [];
        let page = 1;
        let totalPages = 1;
        let isFirstPage = true;

        do {
            const startTime = Date.now();
        
            // Call API
            const response = await axios.get(
                `${config.api.baseUrl}/users?page=${page}`,
                { headers: config.api.headers }
            );
        
            const endTime = Date.now();
            response.duration = endTime - startTime;
        
            const body = response.data;
        
            // --- Validate only for the first page ---
            if (isFirstPage) {
                const expected = config.validation.getAllUsers;
                const validationResult = validateResponse(response, expected);
                console.log("\nValidation result for first page of all users:\n", JSON.stringify(validationResult, null, 2), "\n");
                isFirstPage = false; // set flag false after first validation
            }
        
            // Append current page users
            if (Array.isArray(body.data)) {
                allUsers = allUsers.concat(body.data);
            }
        
            // Set total pages
            totalPages = body.total_pages;
            page++;
        
        } while (page <= totalPages);

        if (allUsers.length === 0) {
            console.warn("No users found!");
            return;
        }

        // --- Validate after all users are collected ---
        const randomUser = allUsers[Math.round(Math.random() * allUsers.length)];
        console.log("Random user ID:", randomUser.id);

        const userIdFilePath = path.join(__dirname, '..', config.files.userId);
        fs.writeFileSync(userIdFilePath, JSON.stringify({ userId: randomUser.id }, null, 2));
        console.log(`Random user ID saved to ${userIdFilePath}`);
        console.log("\n\n--------------------------------------------------");

    } catch (err) {
        console.error("Error:", err.message);
    }
}

getAllUsers();

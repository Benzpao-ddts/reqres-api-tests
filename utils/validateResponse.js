const fs = require('fs');
const path = require('path');
const Ajv = require('ajv');
const addFormats = require('ajv-formats');

const ajv = new Ajv({ allErrors: true, strict: false });
addFormats(ajv);

function validateResponse(response, expected) {
    const result = {
        status: null,
        schema: null,
        time: null
    };
    console.log("\n\n📍 ",expected.testName);
    const schemaFile = expected.schema;
    if (schemaFile != null){
        const expectedSchema = JSON.parse(fs.readFileSync(path.join(__dirname, '../', schemaFile), 'utf-8'));
        // --- Schema validation ---
        if (expectedSchema) {
            const validate = ajv.compile(expectedSchema);
            const valid = validate(response.data);
            
            if (valid) {
                console.log("✅ Response schema is valid");
                result.schema = true;
            } else {
                console.error("❌ Response schema validation failed:", validate.errors);
                result.schema = false;
            }
        }
    }
    // --- Status code check ---
    if (response.status === expected.status) {
        console.log(`✅ Status code is ${expected.status}`);
        result.status = true;
    } else {
        console.error(`❌ Unexpected status code: ${response.status} (expected ${expected.status})`);
        result.status = false;
    }

    // --- Response time check ---
    const responseTime = response.duration;
    console.log(`⏰ Response time: ${responseTime} ms`);
    if (responseTime > expected.maxTime) console.warn(`❌ Response time > ${expected.maxTime} ms`);
    result.time = responseTime <= expected.maxTime;
    
    return result;
}

module.exports = { validateResponse };

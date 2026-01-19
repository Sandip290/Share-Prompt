const mongoose = require('mongoose');
const path = require('path');
const fs = require('fs');

// Manually parse .env file
function loadEnv(filePath) {
    if (fs.existsSync(filePath)) {
        console.log(`\nLoading env from ${filePath}`);
        const buffer = fs.readFileSync(filePath);
        let content;
        let encoding = 'utf8';

        if (buffer.length >= 2 && buffer[0] === 0xFF && buffer[1] === 0xFE) {
            encoding = 'utf16le';
            content = buffer.subarray(2).toString('utf16le');
            console.log("Detected UTF-16 LE encoding from BOM.");
        } else {
            content = buffer.toString('utf8');
        }

        console.log(`First 20 chars (newlines escaped): ${content.substring(0, 20).replace(/\n/g, '\\n')}`);

        content.split(/\r?\n/).forEach(line => { // Handle CRLF properly
            line = line.trim();
            if (!line || line.startsWith('#')) return;
            // Handle export prefix
            if (line.startsWith('export ')) line = line.replace('export ', '');

            // Allow optional quotes around key, and permissive separator
            const match = line.match(/^([^=:]+?)\s*[=:]\s*(.*)$/);
            if (match) {
                const key = match[1].trim();
                let value = match[2].trim();
                // Remove quotes
                if ((value.startsWith('"') && value.endsWith('"')) || (value.startsWith("'") && value.endsWith("'"))) {
                    value = value.slice(1, -1);
                }
                process.env[key] = value;
                console.log(`Loaded key: ${key}`);
            } else {
                console.log(`Skipped line: ${line.substring(0, 15)}...`);
            }
        });
    } else {
        console.log(`File not found: ${filePath}`);
    }
}

// Load .env and .env.local
loadEnv(path.resolve(process.cwd(), '.env'));
loadEnv(path.resolve(process.cwd(), '.env.local'));

console.log("Checking MONGODB_URI...");
if (!process.env.MONGODB_URI) {
    console.error("❌ MONGODB_URI not found in environment variables.");
    process.exit(1);
} else {
    console.log("✅ MONGODB_URI found.");
}

async function verify() {
    try {
        console.log("Attempting to connect to MongoDB...");
        // Use the connection logic
        await mongoose.connect(process.env.MONGODB_URI, { dbName: "share_prompt" });
        console.log("✅ MongoDB Connection Successful!");

        // Verify Regex
        console.log("\nVerifying Username Generation & Validation...");
        const usernameRegex = /^(?=.{4,20}$)(?![_.])(?!.*[_.]{2})[a-zA-Z0-9._]+(?<![_.])$/;

        // Simulate generation logic from route.js
        const testInputs = [
            "Test User Name 123!",
            "Simple",
            "A Very Long Name That Will Be Truncated",
            "User.Name_With_Symbols"
        ];

        for (const testName of testInputs) {
            const namePart = testName.replace(/[^a-zA-Z0-9]/g, "").toLowerCase().slice(0, 15);
            const randomSuffix = "1234";
            const generatedUsername = (namePart || "user") + randomSuffix;

            console.log(`\nInput: "${testName}" -> Generated: "${generatedUsername}"`);
            const isValid = usernameRegex.test(generatedUsername);
            if (isValid) {
                console.log(`✅ Valid`);
            } else {
                console.error(`❌ Invalid (Regex: ${usernameRegex})`);
            }
        }

    } catch (error) {
        console.error("❌ Verification Failed:", error);
    } finally {
        await mongoose.disconnect();
        process.exit(0);
    }
}

verify();

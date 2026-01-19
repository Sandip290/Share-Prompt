const fs = require('fs');
const path = require('path');

const envPath = path.resolve(process.cwd(), '.env');

if (fs.existsSync(envPath)) {
    const buffer = fs.readFileSync(envPath);
    // Check for UTF-16 LE BOM (FF FE)
    if (buffer.length >= 2 && buffer[0] === 0xFF && buffer[1] === 0xFE) {
        console.log("Detected UTF-16 LE BOM. Converting .env to UTF-8...");

        // Decode
        const content = buffer.subarray(2).toString('utf16le');

        // Create backup
        fs.writeFileSync(path.resolve(process.cwd(), '.env.bak'), buffer);
        console.log("Created backup at .env.bak");

        // Write as UTF-8
        fs.writeFileSync(envPath, content, 'utf8');
        console.log("✅ Successfully converted .env to UTF-8.");
    } else {
        console.log("File is not detected as UTF-16 LE (no BOM found). Checking content snippet...");
        console.log(buffer.subarray(0, 20).toString());
    }
} else {
    console.error(".env file not found at " + envPath);
}

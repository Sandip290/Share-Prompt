
require('dotenv').config();
const mongoose = require('mongoose');

async function testConnection() {
    console.log('Testing MongoDB Connection...');
    console.log('URI:', process.env.MONGODB_URI ? 'Defined' : 'Undefined');

    try {
        await mongoose.connect(process.env.MONGODB_URI, {
            dbName: "share_prompt",
        });
        console.log('SUCCESS: MongoDB Connected!');
        process.exit(0);
    } catch (error) {
        console.error('ERROR: Connection Failed');
        console.error(error);
        process.exit(1);
    }
}

testConnection();

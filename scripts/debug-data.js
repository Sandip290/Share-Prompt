const mongoose = require('mongoose');
const path = require('path');
const dotenv = require('dotenv');

const envPath = path.resolve(process.cwd(), '.env');
dotenv.config({ path: envPath });

// Define Models (Need to define Schema here if not exporting/importing correctly in node script context, 
// but we can try to require the models if they are commonjs. 
// However, the project uses ES modules (import/export). 
// So I will redefine schema briefly or use dynamic import if possible.
// Simpler to just redefine schema for debug script to avoid module system issues.)

const UserSchema = new mongoose.Schema({
    email: { type: String, required: true },
    username: { type: String, required: true },
    image: { type: String }
});

const PromptSchema = new mongoose.Schema({
    creator: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    prompt: { type: String, required: true },
    tag: { type: String, required: true }
});

async function debugData() {
    try {
        await mongoose.connect(process.env.MONGODB_URI, { dbName: "share_prompt" });
        console.log("Connected to DB.");

        // Register models
        const User = mongoose.models.User || mongoose.model("User", UserSchema);
        const Prompt = mongoose.models.Prompt || mongoose.model("Prompt", PromptSchema);

        const prompts = await Prompt.find({}).populate('creator');

        console.log(`Found ${prompts.length} prompts.`);
        prompts.forEach((p, i) => {
            console.log(`\n--- Prompt ${i + 1} ---`);
            console.log(`Creator Username: '${p.creator?.username}'`);
            console.log(`Creator Email: '${p.creator?.email}'`);
            console.log(`Tag: '${p.tag}'`);
            console.log(`Prompt: '${p.prompt?.substring(0, 20)}...'`);
        });

    } catch (error) {
        console.error("Error:", error);
    } finally {
        await mongoose.disconnect();
    }
}

debugData();

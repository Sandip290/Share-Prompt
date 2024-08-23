import { connectToDB } from '@utils/database';
import  Prompt from '@models/prompt';

export const POST = async (req) => {

try{
    const { userId, prompt, tag } = await req.json();
    console.log('Received POST request with data:', { userId, prompt, tag });

    await connectToDB();
    console.log('Database connected'); 

    const newPrompt = new Prompt({
        creator: userId,
        prompt,
        tag
    });

    await newPrompt.save();
    console.log('Prompt saved:', newPrompt);

    return new Response(JSON.stringify(newPrompt), {status: 201})
}catch(error){
    console.error('Failed to create a new prompt:', error);
    return new Response("Failed to create a new prompt", { status: 500})
    }

}
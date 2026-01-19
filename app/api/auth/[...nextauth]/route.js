import NextAuth from 'next-auth';
import GoogleProvider from 'next-auth/providers/google';

import User from '@models/users';
import { connectToDB } from '@utils/database';


const handler = NextAuth({
    providers: [
        GoogleProvider({
            clientId: process.env.GOOGLE_ID,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        })
    ],
    callbacks: {
        async session({ session }) {
            const sessionUser = await User.findOne({
                email: session.user.email
            })

            session.user.id = sessionUser._id.toString();

            return session;
        },

        async signIn({ profile }) {
            try {
                await connectToDB();

                //check if a user already exists
                const userExists = await User.findOne({
                    email: profile.email
                });

                //if not, create a new user
                if (!userExists) {
                    // Just in case collision happens, we might want to try/catch specifically for that, 
                    // but for now let's hope unique names + simple fallback works. 
                    // Better yet, let's just append a random suffix to everything to ensure uniqueness.
                    // New Strategy: Name (max 15 chars) + Random (4 chars).

                    const namePart = profile.name.replace(/[^a-zA-Z0-9]/g, "").toLowerCase().slice(0, 15);
                    const randomSuffix = Math.floor(1000 + Math.random() * 9000).toString(); // 4 digits
                    const username = (namePart || "user") + randomSuffix;

                    await User.create({
                        email: profile.email,
                        username: username,
                        image: profile.picture
                    })
                }

                return true;
            }
            catch (error) {
                console.log("Error checking if user exists: ", error);
                return false;
            }
        }
    }

})

export { handler as GET, handler as POST };
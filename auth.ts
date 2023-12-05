import NextAuth from 'next-auth';
import { authConfig } from './auth.config';
import Credentials from 'next-auth/providers/credentials';
import userModel from '@/app/models/user';
import bcrypt from 'bcrypt';
import connect from './app/lib/db';

async function getUser(email) {
    try {
        await connect()
        const loginUser = await userModel.findOne({ email })
        return loginUser
    } catch (error) {
        console.error('Failed to fetch user:', error);
        throw new Error('Failed to fetch user.');
    }
}

export const { auth, signIn, signOut } = NextAuth({
    ...authConfig,
    providers: [
        Credentials({
            async authorize(credentials) {

                const user = await getUser(credentials.email);
                if (!user) return null;

                // const passwordsMatch = credentials.password === user.password
                const passwordsMatch = await bcrypt.compare(credentials.password, user.password)
                if (passwordsMatch) return user;
                
                console.log('Invalid credentials');
                return null;
            }
        })
    ],
});
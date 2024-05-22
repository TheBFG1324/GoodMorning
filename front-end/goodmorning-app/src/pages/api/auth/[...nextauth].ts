// pages/api/auth/[...nextauth].ts
import NextAuth from 'next-auth';
import GoogleProvider from 'next-auth/providers/google';
import dotenv from 'dotenv';

dotenv.config();

export default NextAuth({
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLOUD_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLOUD_CLIENT_SECRET!,
    }),
  ],
  callbacks: {
    async signIn({ user, account, profile, email, credentials }) {
      console.log('User:', user);
      console.log('Account:', account);
      console.log('Profile:', profile);
      console.log('Email:', email);
      debugger;
      return true;
    },
    async redirect({ url, baseUrl }) {
      return `${baseUrl}/login`;
    },
    async session({ session, user }) {
      console.log('Session:', session);
      console.log('User:', user);
      return session;
    },
    async jwt({ token, user, account, profile }) {
      console.log('Token:', token);
      console.log('User:', user);
      console.log('Account:', account);
      console.log('Profile:', profile);
      return token;
    },
  },
  debug: true, // Enable debug mode
});


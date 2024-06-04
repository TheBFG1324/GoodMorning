// pages/api/auth/[...nextauth].ts
import NextAuth from 'next-auth';
import GoogleProvider from 'next-auth/providers/google';
import dotenv from 'dotenv';
import { jwtDecode } from 'jwt-decode';
import CryptoJS from 'crypto-js';

dotenv.config();

interface DecodedToken {
  email: string;
  sub: string;
  [key: string]: any;
}

export default NextAuth({
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLOUD_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLOUD_CLIENT_SECRET!,
    }),
  ],
  secret: process.env.NEXTAUTH_SECRET, 
  callbacks: {
    async signIn({ user, account, profile }) {
      console.log('User:', user);
      console.log('Account:', account);
      console.log('Profile:', profile);
      return true;
    },
    async redirect({ url, baseUrl }) {
      return baseUrl;
    },
    async session({ session, token }) {
      
      if (session.user) {
        session.user.googleId = token.googleId as string;
        session.user.email = token.email as string;
      }
    
      return session;
    },
    async jwt({ token, account }) {

      if (account && account.id_token) {
        const decodedToken: DecodedToken = jwtDecode(account.id_token);
        token.email = decodedToken.email;
        token.googleId = CryptoJS.SHA256(decodedToken.sub).toString();
      }

      return token;
    },
  },
  debug: true, 
});

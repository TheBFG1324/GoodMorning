// types/next-auth.d.ts
import { DefaultSession, DefaultUser } from 'next-auth';

// Extend the default User type to include googleId
declare module 'next-auth' {
  interface Session {
    user: {
      googleId?: string;
    } & DefaultSession['user'];
  }

  interface User extends DefaultUser {
    googleId?: string;
  }
}

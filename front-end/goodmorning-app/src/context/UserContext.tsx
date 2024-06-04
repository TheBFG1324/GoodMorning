// src/context/UserContext.tsx
import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { useSession } from 'next-auth/react';

// Define the interface for the context props
interface UserContextProps {
  googleId: string | null;
  email: string | null;
  fullName: string | null;
  setGoogleId: (googleId: string | null) => void;
  setEmail: (email: string | null) => void;
  setFullName: (fullName: string | null) => void;
}

const UserContext = createContext<UserContextProps | undefined>(undefined);

export const UserProvider = ({ children }: { children: ReactNode }) => {
  const [googleId, setGoogleId] = useState<string | null>(null);
  const [email, setEmail] = useState<string | null>(null);
  const [fullName, setFullName] = useState<string | null>(null);
  const { data: session } = useSession();

  useEffect(() => {
    if (session?.user) {
      setGoogleId(session.user.googleId || null);
      setEmail(session.user.email || null);
      setFullName(session.user.name || null);
    }
  }, [session]);

  return (
    <UserContext.Provider value={{ googleId, email, fullName, setGoogleId, setEmail, setFullName }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUserContext = () => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error('useUserContext must be used within a UserProvider');
  }
  return context;
};



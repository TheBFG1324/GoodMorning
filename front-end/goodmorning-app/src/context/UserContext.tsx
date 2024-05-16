import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { useSession } from 'next-auth/react';

// Define the interface for the context props
interface UserContextProps {
  googleId: string | null;
  setGoogleId: (googleId: string) => void;
}

const UserContext = createContext<UserContextProps | undefined>(undefined);

export const UserProvider = ({ children }: { children: ReactNode }) => {
  const [googleId, setGoogleId] = useState<string | null>(null);
  const { data: session } = useSession();

  useEffect(() => {
    if (session?.user) {
      setGoogleId(session.user as string); // Assuming `id` is the googleId
    }
  }, [session]);

  return (
    <UserContext.Provider value={{ googleId, setGoogleId }}>
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



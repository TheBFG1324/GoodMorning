import { signIn, useSession } from 'next-auth/react';
import { useEffect } from 'react';
import { useUserContext } from '../context/UserContext';

const Login = () => {
  const { data: session, status } = useSession();
  const { setGoogleId, setEmail, setFullName } = useUserContext();

  useEffect(() => {
    if (status === 'authenticated' && session?.user) {
      const googleId = session.user.googleId ?? null;
      const email = session.user.email ?? null;
      const fullName = session.user.name ?? null;
      
      setGoogleId(googleId);
      setEmail(email);
      setFullName(fullName);
      
      console.log(googleId, email, fullName);
    }
  }, [session, status]);

  return (
    <div>
      <h1>Login</h1>
      <button onClick={() => signIn('google')}>Sign in with Google</button>
    </div>
  );
};

export default Login;

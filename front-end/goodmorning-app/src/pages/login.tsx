import { signIn, useSession } from 'next-auth/react';
import { useEffect } from 'react';

const Login = () => {
  const { data: session, status } = useSession();

  useEffect(() => {
    if (status === 'authenticated') {
      console.log('Session:', session);
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

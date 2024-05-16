// pages/login.tsx
import { signIn } from 'next-auth/react';
import { useEffect } from 'react';

const Login = () => {
  useEffect(() => {
    signIn('google');
  }, []);

  return (
    <div>
      <h1>Login</h1>
      <button onClick={() => signIn('google')}>Sign in with Google</button>
    </div>
  );
};

export default Login;

import { useSession } from 'next-auth/react';

const Home = () => {
  const { data: session, status } = useSession();

  if (status === 'loading') {
    return <div>Loading...</div>;
  }

  if (status === 'authenticated' && session?.user) {
    return (
      <div>
        <h1>Welcome to GoodMorning App, {session.user.name}!</h1>
      </div>
    );
  }

  return (
    <div>
      <h1>Welcome to GoodMorning App</h1>
      <p>Please log in to see personalized content.</p>
    </div>
  );
};

export default Home;

  
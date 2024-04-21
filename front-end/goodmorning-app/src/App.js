import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { UserProvider } from './userContext'
import Navbar from './components/navbar';

function App() {
    return (
        <UserProvider>
            <div>
                <Navbar />
            </div>
        </UserProvider>
    );
}

export default App;

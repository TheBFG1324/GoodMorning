import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';  // Import Bootstrap CSS

import Navbar from './components/navbar';
import MorningBriefing from './components/morningBriefing';

function App() {
    return (
        <div>
            <Navbar />
            <div className="container">
                <MorningBriefing />
            </div>
        </div>
    );
}

export default App;

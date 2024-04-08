import React, {useState} from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';

import Navbar from './components/navbar';
import MorningBriefing from './components/morningBriefing';
import EnrollUser from './components/enroll';

function App() {

    const [enrolled, setEnrolled] = useState(false);
    const [userData, setUserData] = useState(null);

    const updateMorningBriefingData = (user) => {
        setEnrolled(true);
        setUserData(user);
    };

    return (
        <div>
            <Navbar />
            {/* <div className="container">
                {enrolled ? (
                    <MorningBriefing user={userData} />
                ) : null}
                {!enrolled && <EnrollUser updateMorningBriefing={updateMorningBriefingData} />}
            </div>
            <MorningBriefing /> */}
        </div>
    );
}

export default App;

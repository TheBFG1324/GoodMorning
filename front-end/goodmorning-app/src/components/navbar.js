import React, { useState } from 'react';
import MorningBriefing from './morningBriefing';
import History from './history';
import About from './about';
import EnrollUserForm from './enroll';
import Account from './account';
import 'bootstrap/dist/css/bootstrap.min.css';

const Navbar = () => {
  const [activeTab, setActiveTab] = useState('about');

  const handleTabChange = (tabName) => {
    setActiveTab(tabName);
  };

  return (
    <div className="container mt-3">
      <nav className="navbar navbar-expand-lg navbar-light bg-light">
        <button
          className="navbar-toggler"
          type="button"
          data-toggle="collapse"
          data-target="#navbarNav"
          aria-controls="navbarNav"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>
        <div className="collapse navbar-collapse" id="navbarNav">
          <ul className="navbar-nav">
            <li
              className={`nav-item ${activeTab === 'morningBriefing' ? 'active' : ''}`}
              onClick={() => handleTabChange('morningBriefing')}
            >
              <p className="nav-link" >Briefing</p>
            </li>
            <li
              className={`nav-item ${activeTab === 'about' ? 'active' : ''}`}
              onClick={() => handleTabChange('about')}
            >
              <p className="nav-link">About</p>
            </li>
            <li
              className={`nav-item ${activeTab === 'enroll' ? 'active' : ''}`}
              onClick={() => handleTabChange('enroll')}
            >
              <p className="nav-link">Enroll</p>
            </li>
            <li
              className={`nav-item ${activeTab === 'account' ? 'active' : ''}`}
              onClick={() => handleTabChange('account')}
            >
              <p className="nav-link">Account</p>
            </li>
            <li
              className={`nav-item ${activeTab === 'history' ? 'active' : ''}`}
              onClick={() => handleTabChange('history')}
            >
              <p className="nav-link">History</p>
            </li>
          </ul>
        </div>
      </nav>
      <div className="mt-3">
        {activeTab === 'morningBriefing' && <MorningBriefing />}
        {activeTab === 'enroll' && <EnrollUserForm />}
        {activeTab === 'account' && <Account />}
        {activeTab === 'history' && <History />}
        {activeTab === 'about' && <About />}
      </div>
    </div>
  );
};

export default Navbar;

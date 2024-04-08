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
        <a className="navbar-brand" href="#">LOGO</a>
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
              <a className="nav-link" href="#">Briefing</a>
            </li>
            <li
              className={`nav-item ${activeTab === 'enroll' ? 'active' : ''}`}
              onClick={() => handleTabChange('enroll')}
            >
              <a className="nav-link" href="#">Enroll</a>
            </li>
            <li
              className={`nav-item ${activeTab === 'account' ? 'active' : ''}`}
              onClick={() => handleTabChange('account')}
            >
              <a className="nav-link" href="#">Account</a>
            </li>
            <li
              className={`nav-item ${activeTab === 'history' ? 'active' : ''}`}
              onClick={() => handleTabChange('history')}
            >
              <a className="nav-link" href="#">History</a>
            </li>
            <li
              className={`nav-item ${activeTab === 'about' ? 'active' : ''}`}
              onClick={() => handleTabChange('about')}
            >
              <a className="nav-link" href="#">About</a>
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

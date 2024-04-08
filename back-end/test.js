const axios = require('axios');
require('dotenv').config();

const baseUrl = process.env.SERVER_URL; // Replace with your server URL

async function enrollUser(userData, customizationData) {
    try {
        const response = await axios.post(`${baseUrl}/enroll-user`, {
            user: userData,
            customization: customizationData
        });
        console.log('Enroll User Response:', response.data);
    } catch (error) {
        console.error('Error enrolling user:', error.message);
    }
}

async function changeCustomization(googleId, newCustomizationData) {
    try {
        const response = await axios.put(`${baseUrl}/change-customization`, {
            googleId,
            customizationData: newCustomizationData
        });
        console.log('Change Customization Response:', response.data);
    } catch (error) {
        console.error('Error changing customization:', error.message);
    }
}

async function getBriefing(googleId) {
    try {
        const response = await axios.get(`${baseUrl}/get-briefing/${googleId}`);
        console.log('Get Briefing Response:', response.data);
    } catch (error) {
        console.error('Error getting briefing:', error.message);
    }
}

async function getHistory(googleId) {
    try {
        const response = await axios.get(`${baseUrl}/get-history/${googleId}`);
        console.log('Get History Response:', response.data);
    } catch (error) {
        console.error('Error fetching history:', error.message);
    }
}

async function updateUser(googleId, updatedUserData) {
    try {
        const response = await axios.put(`${baseUrl}/update-user/${googleId}`, updatedUserData);
        console.log('Update User Response:', response.data);
    } catch (error) {
        console.error('Error updating user:', error.message);
    }
}

// Example data for testing purposes
const userData = {
    googleId: '3',
    firstName: 'Lauren',
    lastName: 'Smelly',
    email: 'john.doe@example.com',
    birthday: '2000-01-01',
    city: 'Shawnee'
};

const customizationData = {
    bookRec: true,
    mindfulnessQuote: true,
    joke: true,
    vocabWord: true,
    foreignWord: "Arabic",
    news: true,
    weather: true
};

const updatedUserData = {
    firstName: 'John',
    lastName: 'Danny',
    email: 'john.doe@example.com',
    birthday: '2000-01-01',
    city: 'Berlin'
};

// Running the functions (you can comment out the ones you don't want to run)
(async () => {
    //await enrollUser(userData, customizationData);
    //await changeCustomization(userData.googleId, customizationData);
    //await getBriefing(userData.googleId);
    //await getHistory(userData.googleId);
    //await updateUser(userData.googleId, updatedUserData);
})();

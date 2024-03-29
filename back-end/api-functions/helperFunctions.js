const axios = require('axios');
require('dotenv').config();


const weatherAPIKey = process.env.WEATHER_API_KEY
const cityAPIKEY = process.env.CITY_API_KEY
const openaiAPIKEY = process.env.AI_API_KEY
const newsAPIKEY = process.env.NEWS_API_KEY

console.log(newsAPIKEY)

async function getCityCoordinates(city) {
    const apiKey = 'YOUR_API_KEY'; // Replace with your actual API key
    const url = `https://api.opencagedata.com/geocode/v1/json?q=${encodeURIComponent(city)}&key=${cityAPIKEY}`;

    try {
        const response = await axios.get(url);
        const data = response.data;

        if (data.results.length > 0) {
            const { lat, lng } = data.results[0].geometry;
            return { latitude: lat, longitude: lng };
        } else {
            throw new Error('No results found');
        }
    } catch (error) {
        console.error('Error fetching data:', error);
        throw error;
    }
}

async function getWeatherData(city) {

    try {
        const cordinates = await getCityCoordinates(city)

        const url = `https://api.openweathermap.org/data/3.0/onecall?lat=${cordinates.latitude}&lon=${cordinates.longitude}&appid=${weatherAPIKey}`;
        const response = await axios.get(url);
        return response.data;
    } catch (error) {
        console.error('Error fetching weather data:', error);
        throw error;
    }

}

async function callOpenAiApi(prompt) {
    const url = 'https://api.openai.com/v1/chat/completions';
    const headers = {
        'Authorization': `Bearer ${openaiAPIKEY}`,
        'Content-Type': 'application/json'
    };

    const data = {
        model: 'gpt-3.5-turbo',
        messages: [
            {
            role: 'user',
            content: prompt
            }
        ],
        max_tokens: 150
    };

    try {
        const response = await axios.post(url, data, { headers: headers });
        return response.data.choices[0].message.content
    } catch (error) {
        console.error('Error calling OpenAI API:', error);
        throw error;
    }
    
}

const fetchTopHeadlines = async () => {
    try {
        const response = await axios.get('https://newsapi.org/v2/top-headlines', {
            params: {
                country: 'us',
                apiKey: newsAPIKEY
            }
        });

        console.log(response.data);
        
    } catch (error) {
        console.error('Error fetching top headlines:', error);
    }
};


function generateResponse(briefingData) {
    // Mockup function for generateResponse. Replace this with actual logic.
    return `Response generated based on briefing data: ${JSON.stringify(briefingData)}`;
}

fetchTopHeadlines();

module.exports = {
    getCityCoordinates,
    getWeatherData,
    callOpenAiApi,
    generateResponse
};
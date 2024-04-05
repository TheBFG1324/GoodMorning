const axios = require('axios');
require('dotenv').config();
const fs = require('fs').promises;

const weatherAPIKey = process.env.WEATHER_API_KEY
const cityAPIKEY = process.env.CITY_API_KEY
const openaiAPIKEY = process.env.AI_API_KEY
const newsAPIKEY = process.env.NEWS_API_KEY
const instructions = process.env.GPT_INSTRUCTIONS

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

function kelvinToFahrenheit(kelvin) {
    return (kelvin - 273.15) * 9/5 + 32;
}

async function getWeatherData(city) {

    try {
        const cordinates = await getCityCoordinates(city)

        const url = `https://api.openweathermap.org/data/3.0/onecall?lat=${cordinates.latitude}&lon=${cordinates.longitude}&appid=${weatherAPIKey}`;
        const response = await axios.get(url);
        const data = response.data;
        const temp = kelvinToFahrenheit(data.current.temp)
        const summary = data.current.weather[0].description
        return "Tempature outside is (Fahrenheit) " + temp + " Weather is " + summary;
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
        model: 'gpt-4',
        messages: [
            {
            role: 'user',
            content: prompt
            }
        ],
        max_tokens: 500
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

        const data = response.data
        const articles = data.articles
        const titles = articles.map(article => article.title);

        return titles;
        
    } catch (error) {
        console.error('Error fetching top headlines:', error);
    }
};


async function generateBriefing(data) {
    if(data.weather){
        const weatherData = await getWeatherData(data.city)
        data.weatherData = weatherData
    }

    if(data.news){
        const news = await fetchTopHeadlines();
        data.newsArticles = news
    }

    const gptRequest = "INSTRUCTIONS:\n" + instructions + "\nDATA INFORMATION:\n" + JSON.stringify(data);
    const gptResponse = await callOpenAiApi(gptRequest)
    return gptResponse
}
/*
const main = async () => {
    const data =
    {   name: "Lauren",
        bookRec: "Poem",
        mindfulnessQuote: true,
        joke: true,
        vocabWord: true,
        foreignWord: "Spanish",
        news: true,
        weather: true,
        city: "Lawrence"
    }
    const response = await generateBriefing(data)
}

main();
*/

module.exports = {
    getCityCoordinates,
    getWeatherData,
    callOpenAiApi,
    generateBriefing
};
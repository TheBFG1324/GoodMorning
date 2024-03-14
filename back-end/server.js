const express = require('express');
const { MongoClient, ObjectId} = require('mongodb');
const cors = require('cors');
const axios = require('axios');
require('dotenv').config();

const app = express();
app.use(express.json()); 
app.use(cors({
    origin: 'http://localhost:3000' // Replace with your React app's URL
}));

const mongoUri = 'mongodb://127.0.0.1:27017/GoodMorningDB'; // Simplified MongoDB URI
const dbName = 'GoodMorningDB';

let db;
let user;
let pastInstance;
let customization;
let history;
let userCustomizationMapping;

const weatherAPIKey = process.env.WEATHER_API_KEY
const cityAPIKEY = process.env.CITY_API_KEY
const openaiAPIKEY = process.env.AI_API_KEY

MongoClient.connect(mongoUri)
    .then(client => {

        db = client.db(dbName);
        user = db.collection('user');
        pastInstance = db.collection('pastInstance');
        customization = db.collection('customization');
        history = db.collection('history');
        userCustomizationMapping = db.collection('userCustomizationMapping');
        console.log('Connected to MongoDB');
    })
    .catch(err => {
        console.error('Error connecting to MongoDB', err);
    });

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

    async function main() {
        try {
            const response = await callOpenAiApi("how are you doing");
            console.log(response);
        } catch (error) {
            console.error(error);
        }
    }
    
    main();
    

    app.post('/api/insert-user', async (req, res) => {
        try {
            const { googleId, firstName, lastName, email, birthday, city } = req.body;
            const newUser = { googleId, firstName, lastName, email, birthday, city };
            await user.insertOne(newUser);
            res.status(201).json(newUser);
        } catch (error) {
            console.error('Error occurred:', error);
            res.status(500).json({ message: 'Error occurred while inserting user data' });
        }
    });
    
    app.post('/api/insert-past-instance', async (req, res) => {
        try {
            const { prompt } = req.body; // MongoDB automatically creates _id if not provided
            const newPastInstance = { prompt };
            await pastInstance.insertOne(newPastInstance);
            res.status(201).json(newPastInstance);
        } catch (error) {
            console.error('Error occurred:', error);
            res.status(500).json({ message: 'Error occurred while inserting past instance data' });
        }
    });

    app.post('/api/insert-customization', async (req, res) => {
        try {
            const { googleId, bookRecommendation, mindfullnessQuote, joke, vocab, foreignLanguageWord, news, weather } = req.body;
    
            // Check if googleId exists in the user collection
            const userExists = await user.findOne({ googleId: googleId });
            if (!userExists) {
                return res.status(404).json({ message: 'User not found' });
            }
    
            // Insert new customization
            const newCustomization = { bookRecommendation, mindfullnessQuote, joke, vocab, foreignLanguageWord, news, weather };
            const customizationResult = await customization.insertOne(newCustomization);
            const customizationId = customizationResult.insertedId;
    
            // Update userCustomizationMapping collection
            const filter = { googleId: googleId };
            const update = { $set: { customizationId: customizationId } };
            const options = { upsert: true, returnOriginal: false };
    
            const mappingResult = await userCustomizationMapping.findOneAndUpdate(filter, update, options);
    
            res.status(201).json({
                message: 'Customization inserted and mapping updated',
                customizationData: newCustomization,
                mappingData: mappingResult.value
            });
    
        } catch (error) {
            console.error('Error occurred:', error);
            res.status(500).json({ message: 'Error occurred while processing request' });
        }
    });
    
    
    
    app.post('/api/insert-history', async (req, res) => {
        try {
            const { instanceId, googleId, timestamp } = req.body;
            const newHistory = { instanceId, googleId, timestamp };
            await history.insertOne(newHistory);
            res.status(201).json(newHistory);
        } catch (error) {
            console.error('Error occurred:', error);
            res.status(500).json({ message: 'Error occurred while inserting history data' });
        }
    });
    
const PORT = 4000; // You can choose any port
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
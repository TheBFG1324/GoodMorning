const express = require('express');
const { MongoClient, ObjectId} = require('mongodb');
const cors = require('cors');

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
            const {bookRecommendation, mindfullnessQuote, joke, vocab, foreignLanguageWord, news, weather } = req.body;
            const newCustomization = { bookRecommendation, mindfullnessQuote, joke, vocab, foreignLanguageWord, news, weather };
            await customization.insertOne(newCustomization);
            res.status(201).json(newCustomization);
        } catch (error) {
            console.error('Error occurred:', error);
            res.status(500).json({ message: 'Error occurred while inserting customization data' });
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

    app.post('/api/update-user-customization-mapping', async (req, res) => {
        try {
            const { googleId, customizationId } = req.body;
            if (!googleId || !customizationId) {
                return res.status(400).json({ message: 'Missing required fields' });
            }
    
            const filter = { googleId: googleId };
            const update = { $set: { customizationId: customizationId } };
            const options = { upsert: true, returnOriginal: false }; // upsert = true to insert if not exists, returnOriginal: false to return the updated/inserted document
    
            const result = await userCustomizationMapping.findOneAndUpdate(filter, update, options);
    
            if (result.lastErrorObject && result.lastErrorObject.upserted) {
                res.status(201).json({ message: 'New customization mapping created', data: result.value });
            } else {
                res.status(200).json({ message: 'Customization mapping updated', data: result.value });
            }
        } catch (error) {
            console.error('Error occurred:', error);
            res.status(500).json({ message: 'Error occurred while updating user customization mapping data' });
        }
    });
    
    


const PORT = 4000; // You can choose any port
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
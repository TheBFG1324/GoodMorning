const express = require('express');
const sql = require('mssql');
require('dotenv').config();
const { v4: uuidv4 } = require('uuid');

const { generateBriefing } = require('./api-functions/helperFunctions');

const config = {
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    server: process.env.DB_SERVER,
    port: 1433,
    pool: {
        max: 10,
        min: 0,
        idleTimeoutMillis: 30000
    },
    options: {
        encrypt: true,
        trustServerCertificate: false
    }
};

const app = express();
app.use(express.json());

sql.connect(config).then(pool => {
    
    if (pool.connecting) {
        console.log('Connecting to the database...');
    }

    if (pool.connected) {
        console.log('Connected to SQL database.');
    }

    app.post('/enroll-user', async (req, res) => {
        const transaction = new sql.Transaction(pool);
        try {
            await transaction.begin();
    
            // Extract user data from the request body
            const { googleId, firstName, lastName, email, birthday, city } = req.body.user;
    
            // Insert user data into the user table
            const userQuery = `
                INSERT INTO user (googleId, firstName, lastName, email, birthday, city)
                VALUES (@googleId, @firstName, @lastName, @email, @birthday, @city)
            `;
    
            await transaction.request()
                .input('googleId', sql.NVarChar, googleId)
                .input('firstName', sql.NVarChar, firstName)
                .input('lastName', sql.NVarChar, lastName)
                .input('email', sql.NVarChar, email)
                .input('birthday', sql.Date, birthday)
                .input('city', sql.NVarChar, city)
                .query(userQuery);
    
            // Extract customization data and generate a UUID
            const { bookRec, mindfulnessQuote, joke, vocabWord, foreignWord, news, weather } = req.body.customization;
            const customizationId = uuidv4();
    
            // Insert customization data into the customization table
            const customizationQuery = `
                INSERT INTO customization (customizationId, bookRec, mindfulnessQuote, joke, vocabWord, foreignWord, news, weather)
                VALUES (@customizationId, @bookRec, @mindfulnessQuote, @joke, @vocabWord, @foreignWord, @news, @weather)
            `;
    
            await transaction.request()
                .input('customizationId', sql.NVarChar, customizationId)
                .input('bookRec', sql.NVarChar, bookRec)
                .input('mindfulnessQuote', sql.NVarChar, mindfulnessQuote)
                .input('joke', sql.NVarChar, joke)
                .input('vocabWord', sql.NVarChar, vocabWord)
                .input('foreignWord', sql.NVarChar, foreignWord)
                .input('news', sql.NVarChar, news)
                .input('weather', sql.NVarChar, weather)
                .query(customizationQuery);
    
            // Insert a record into the has table
            const hasQuery = `
                INSERT INTO has (googleId, customizationId)
                VALUES (@googleId, @customizationId)
            `;
    
            await transaction.request()
                .input('googleId', sql.NVarChar, googleId)
                .input('customizationId', sql.NVarChar, customizationId)
                .query(hasQuery);
    
            await transaction.commit();
            res.status(201).send('User and customization enrolled successfully');
        } catch (err) {
            await transaction.rollback();
            res.status(500).send('Error enrolling user: ' + err.message);
        }
    });
    

    // Route to change a user's customization
    app.put('/change-customization', async (req, res) => {
        const transaction = new sql.Transaction(pool);
        try {
            await transaction.begin();
    
            // Extract googleId and new customization data from the request body
            const { googleId, customizationData } = req.body;
            const { bookRec, mindfulnessQuote, joke, vocabWord, foreignWord, news, weather } = customizationData;
    
            // Retrieve the current customizationId for the given googleId from the has table
            const currentCustomizationQuery = `SELECT customizationId FROM has WHERE googleId = @googleId`;
            const currentCustomizationResult = await transaction.request()
                .input('googleId', sql.NVarChar, googleId)
                .query(currentCustomizationQuery);
    
            if (currentCustomizationResult.recordset.length === 0) {
                throw new Error("No existing customization found for this user.");
            }
    
            const currentCustomizationId = currentCustomizationResult.recordset[0].customizationId;
    
            // Generate a new UUID for the new customization
            const newCustomizationId = uuidv4();
    
            // Insert the new customization data into the customization table
            const newCustomizationQuery = `
                INSERT INTO customization (customizationId, bookRec, mindfulnessQuote, joke, vocabWord, foreignWord, news, weather)
                VALUES (@customizationId, @bookRec, @mindfulnessQuote, @joke, @vocabWord, @foreignWord, @news, @weather)
            `;
    
            await transaction.request()
                .input('customizationId', sql.NVarChar, newCustomizationId)
                .input('bookRec', sql.NVarChar, bookRec)
                .input('mindfulnessQuote', sql.NVarChar, mindfulnessQuote)
                .input('joke', sql.NVarChar, joke)
                .input('vocabWord', sql.NVarChar, vocabWord)
                .input('foreignWord', sql.NVarChar, foreignWord)
                .input('news', sql.NVarChar, news)
                .input('weather', sql.NVarChar, weather)
                .query(newCustomizationQuery);
    
            // Update the has table with the new customizationId
            const updateHasQuery = `UPDATE has SET customizationId = @newCustomizationId WHERE googleId = @googleId`;
            await transaction.request()
                .input('newCustomizationId', sql.NVarChar, newCustomizationId)
                .input('googleId', sql.NVarChar, googleId)
                .query(updateHasQuery);
    
            // Optionally, delete the old customization record if it's no longer needed
            const deleteOldCustomizationQuery = `DELETE FROM customization WHERE customizationId = @oldCustomizationId`;
            await transaction.request()
                .input('oldCustomizationId', sql.NVarChar, currentCustomizationId)
                .query(deleteOldCustomizationQuery);
    
            await transaction.commit();
            res.status(200).send('Customization updated successfully');
        } catch (err) {
            await transaction.rollback();
            res.status(500).send('Error changing customization: ' + err.message);
        }
    });
    

    // Route to get a briefing
    app.get('/get-briefing/:googleId', async (req, res) => {
        const transaction = new sql.Transaction(pool);
        try {
            await transaction.begin();
    
            const googleId = req.params.googleId;
    
            // SQL query to join user and customization based on the googleId
            const briefingQuery = `
                SELECT u.firstName, u.lastName, u.email, u.birthday, u.city,
                       c.bookRec, c.mindfulnessQuote, c.joke, c.vocabWord, c.foreignWord, c.news, c.weather
                FROM has h
                INNER JOIN user u ON h.googleId = u.googleId
                INNER JOIN customization c ON h.customizationId = c.customizationId
                WHERE h.googleId = @googleId
            `;
    
            const briefingResult = await transaction.request()
                .input('googleId', sql.NVarChar, googleId)
                .query(briefingQuery);
    
            if (briefingResult.recordset.length === 0) {
                throw new Error('No briefing found for this user.');
            }
    
            // Call generateResponse() to generate the briefing string
            //const briefingString = generateBriefing();
            const briefingString = "This is a test"
            // Generate a new UUID for the pastInstance
            const instanceId = uuidv4();
            
            // Store the new record in pastInstance
            const pastInstanceQuery = `
                INSERT INTO pastInstance (instanceId, briefing)
                VALUES (@instanceId, @briefing)
            `;
            await transaction.request()
                .input('instanceId', sql.NVarChar, instanceId)
                .input('briefing', sql.NVarChar, briefingString)
                .query(pastInstanceQuery);
    
            // Add a record to the history table
            const historyQuery = `
                INSERT INTO history (googleId, instanceId, date)
                VALUES (@googleId, @instanceId, GETDATE())
            `;
            await transaction.request()
                .input('googleId', sql.NVarChar, googleId)
                .input('instanceId', sql.NVarChar, instanceId)
                .query(historyQuery);
    
            await transaction.commit();
            res.status(200).json({ instanceId: instanceId, briefing: briefingString });
        } catch (err) {
            await transaction.rollback();
            console.error('Error fetching briefing:', err);
            res.status(500).send('Error fetching briefing: ' + err.message);
        }
    });
    

    // Route to get history of briefings
    app.get('/get-history/:googleId', async (req, res) => {
        try {
            const googleId = req.params.googleId;
    
            const query = `
                SELECT h.date, p.instanceId, p.briefing
                FROM history h
                INNER JOIN pastInstance p ON h.instanceId = p.instanceId
                WHERE h.googleId = @googleId
                ORDER BY h.date DESC
            `;
    
            const result = await sql.query(query, { googleId });
            
            if (result.recordset.length > 0) {
                res.status(200).json(result.recordset);
            } else {
                res.status(404).send('No history found for this user.');
            }
        } catch (err) {
            console.error('Error fetching history:', err);
            res.status(500).send('Error fetching history: ' + err.message);
        }
    });
    

    // Route to update user information
    app.put('/update-user/:googleId', async (req, res) => {
        try {
            // Extract googleId from URL parameters and user data from the request body
            const googleId = req.params.googleId;
            const userData = req.body;
    
            // Construct the SQL UPDATE statement dynamically based on the provided fields
            let updateQuery = 'UPDATE user SET ';
            const updateFields = [];
            const requestKeys = Object.keys(userData);
    
            for (let i = 0; i < requestKeys.length; i++) {
                updateFields.push(`${requestKeys[i]} = @${requestKeys[i]}`);
            }
    
            updateQuery += updateFields.join(', ');
            updateQuery += ' WHERE googleId = @googleId';
    
            const request = new sql.Request();
    
            // Add each provided field to the request
            for (const key of requestKeys) {
                request.input(key, userData[key]);
            }
            request.input('googleId', sql.NVarChar, googleId);
    
            // Execute the update query
            await request.query(updateQuery);
            res.status(200).send('User updated successfully');
        } catch (err) {
            console.error('Error updating user:', err);
            res.status(500).send('Error updating user: ' + err.message);
        }
    });
    
    
    
}).catch(err => {

    console.error('Database connection failed', err);
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});

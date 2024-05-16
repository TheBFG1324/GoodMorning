
# GoodMorning customizable briefing platform

## Back End Info

### Routes

1. **POST `/enroll-user`**
   - **Request Info:**
     - `user` (object):
       - `googleId` (string)
       - `firstName` (string)
       - `lastName` (string)
       - `email` (string)
       - `birthday` (date)
       - `city` (string)
     - `customization` (object):
       - `bookRec` (bool)
       - `mindfulnessQuote` (bool)
       - `joke` (bool)
       - `vocabWord` (bool)
       - `foreignWord` (string)
       - `news` (bool)
       - `weather` (bool)
   - **Return Values:**
     - On Success: Status code 201 with a message 'User and customization enrolled successfully'
     - On Error: Status code 500 with an error message

2. **PUT `/change-customization`**
   - **Request Info:**
     - `googleId` (string)
     - `customizationData` (object):
       - Updated values for `bookRec`, `mindfulnessQuote`, `joke`, `vocabWord`, `foreignWord`, `news`, `weather`
   - **Return Values:**
     - On Success: Status code 200 with a message 'Customization updated successfully'
     - On Error: Status code 500 with an error message

3. **GET `/get-briefing/:googleId`**
   - **Request Info:**
     - URL parameter: `googleId` (string)
   - **Return Values:**
     - On Success: Status code 200 with JSON containing `instanceId` (string) and `briefing` (text)
     - On Error: Status code 500 with an error message

4. **GET `/get-history/:googleId`**
   - **Request Info:**
     - URL parameter: `googleId` (string)
   - **Return Values:**
     - On Success: Status code 200 with a JSON array of history objects, each containing `date` (date), `instanceId` (string), and `briefing` (text)
     - On Error: Status code 404 with message 'No history found for this user.' or Status code 500 with an error message

5. **PUT `/update-user/:googleId`**
   - **Request Info:**
     - URL parameter: `googleId` (string)
     - `userData` (object): Contains any user fields that need to be updated
   - **Return Values:**
     - On Success: Status code 200 with a message 'User updated successfully'
     - On Error: Status code 500 with an error message

# There are example calls to these routes in ./back-end/test.js

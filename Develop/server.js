const express = require('express');
const path = require('path');
const app = express();
const uuid = require('./helpers/uuid');
const db = require('./db/db.json');
const PORT = process.env.PORT || 3001;
const { readFromFile, writeToFile, readAndAppend } = require('./helpers/fsutils');

let parsedNotes;

// Static middleware pointing to the public folder
app.use(express.static('public'));

// Route to homepage
app.get('/', (req, res) =>
  res.sendFile(path.join(__dirname, '/public/index.html'))
);

// Route to notes page
app.get('/notes', (req, res) =>
  res.sendFile(path.join(__dirname, '/public/notes.html'))
);

// GET request
app.get('/api/notes', async (req, res) => {
  const dbData = await readFromFile('./db/db.json');
  const parsedData = await JSON.parse(dbData);
  res.json(parsedData);
});

// POST request
app.post('/api/notes', async (req, res) => {
    // Log that a POST request was received
    console.info(`${req.method} request received to add a note`);
  
    // Destructuring assignment for the items in req.body
    const { title, text } = req.body;
  
    // If all the required properties are present
    if (title && text) {
      // Variable for the object we will save
      const newNote = {
        title,
        text,
        note_id: uuid(),
      };
  
      const response = {
        status: 'success',
        body: parsedNotes,
      };
  
      console.log(response);
      res.status(201).json(response);
    } else {
      res.status(500).json('Error in saving note');
    }
  });

// Listen at specified port
app.listen(PORT, () =>
  console.log(`Listening at http://localhost:${PORT}`)
);

const fs = require('fs');
const express = require('express');
const path = require('path');
const app = express();
const uuid = require('./helpers/uuid');
const db = require('./db/db.json');
const PORT = process.env.PORT || 3001;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

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
app.get('/api/notes', (req, res) => res.json(db));

// POST request
app.post('/api/notes', (req, res) => {
    // Log that a POST request was received
    console.info(`${req.method} request received to add a note`);
  
    // Destructuring assignment for the items in req.body
    console.log(req.body);
    const { title, text } = req.body;
  
    // If all the required properties are present
    if (req.body.title && req.body.text) {
      // Variable for the object we will save
      const newNote = {
        title,
        text,
        note_id: uuid(),
      };

      fs.readFile('./db/db.json', 'utf8', (err, data) => {
        if(err){
          console.error(err);
        }else{
          const parsedNotes = JSON.parse(data);

          parsedNotes.push(newNote);

          fs.writeFile('./db/db.json', JSON.stringify(parsedNotes, null, 4),
          (writeErr) => writeErr ? console.log(writeErr) : console.log('Successfully updated notes.'));
        };
      });
  
      const response = {
        status: 'success',
        body: newNote,
      };
  
      console.log(response);
      res.status(201).json(response);
    }else{
      res.status(500).json('Error in saving note');
    }
  });

// Listen at specified port
app.listen(PORT, () =>
  console.log(`Listening at http://localhost:${PORT}`)
);

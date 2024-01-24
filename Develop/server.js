const express = require('express');
const path = require('path');
const fs = require('fs').promises;
const uuid = require('./helpers/uuid');
const db = require('./db/db.json');
const PORT = process.env.PORT || 3001;

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(express.static('public'));

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, './public/index.html'));
});

app.get('/notes', (req, res) => {
  res.sendFile(path.join(__dirname, './public/notes.html'));
});

app.get('/api/notes', (req, res) => res.json(db));

app.post('/api/notes', async (req, res) => {
  const { title, text } = req.body;

  if(title && text){
    const newNote = {
      title,
      text,
      note_id: uuid()
    };

    try{
      const dbData = await fs.readFile('./db/db.json', 'utf-8');
      const noteArray = JSON.parse(dbData);

      noteArray.push(newNote);
      await fs.writeFile('./db/db.json', JSON.stringify(noteArray), 'utf-8');

      const response = {
        status: 'success',
        body: newNote
      };
  
      console.log(response);
      res.status(201).json(response);
    }catch{
      res.status(500).json('Error');
    };
  }
});

app.listen(PORT, () => {
  console.log(`Listening at http://localhost:${PORT}`);
});

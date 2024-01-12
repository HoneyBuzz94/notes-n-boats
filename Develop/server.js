const express = require('express');
const path = require('path');
const app = express();
const PORT = 3001;

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

// Listen at specified port
app.listen(PORT, () =>
  console.log(`Listening at http://localhost:${PORT}`)
);

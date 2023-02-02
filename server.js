// Import express to store data
const express = require('express');

// Import path to natvigate through files
const path = require('path');
// Import the javascript methods from the second index file
const api = require('../03-Algorithms/extra/routes/index.js')

// define express as a constant called app
const app = express();
// Declare the port as 3001 which will be used as the base url
const PORT = 3001 || process.env.PORT

// Middleware to encrypt the data
app.use(express.json())
app.use(express.static('public'));
app.use(express.urlencoded({ extended: true }));
app.use('/api', api);

// Render index.html file when user first navigates to the page url
app.get('/', (req, res) => 
    res.sendFile(path.join(__dirname, 'public/index.html'))
);

// Render notes.html file when the user navigates to the /notes directory
app.get('/notes', (req, res) =>
  res.sendFile(path.join(__dirname, 'public/notes.html'))
);

// Wildcard for if the user tries any other path send them back to the index.html file
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '/public/index.html'))
});

// Activate the server
app.listen(PORT, () =>
  console.log(`Example app listening at http://localhost:${PORT}`)
);

// Creates a route within a route using Router()
const notes = require('express').Router(); 
// Adds the dependencies 
const fs = require('fs'); 
const path = require('path'); 
// Gets the route to the db file
const route = path.join(__dirname, '../db/db.json');

// Sends the file as a response when user comes to the homepage
notes.get('/', (req, res) => {
    res.sendFile(route);
});

// Post method to update the html page based on changes to the notes database
notes.post('/', (req, res) => {

    const { title, text } = req.body;
    // If there is a title and text run the command
    if (title && text) {
        // Creates a new object called new note with parameters
        const newNote = { title, text }
    
    // Reads the db.json file to get the information located in it
    fs.readFile(route, 'utf8', (error, data) => {
        // logs error if the db has no objects
        if (error) {
            console.error(error);
        } else {
            // Parse the saved note
            const parsedNote = JSON.parse(data);

            // Push it to an array
            parsedNote.push(newNote);

            // Creates a new db.json file but with the newNote if the user has entered one
            fs.writeFile(route, JSON.stringify(parsedNote),
            (error) => error ? console.error(error) : console.info('Success')
            );
        }
    })
        const response = {
            status: 'success',
            body: newNote,
        }

        // Responds back to the user with the new note object contained within the response object
        res.json(response);

    } else {
        console.info('error in saving');
    }
});

module.exports = notes;
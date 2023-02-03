// Imports all the dependencies and the db file
// Router() allows for routes within routes
const notes = require('express').Router(); 
const fs = require('fs'); 
const path = require('path'); 
const route = path.join(__dirname, '../db/db.json');

function uuid() {
    // Gets random number between 1 and 1000
    Math.floor(Math.random * 1000)
}

// fetches the data for the first note
notes.get('/', (req, res) => {
    res.sendFile(route);
});

notes.post('/', (req, res) => {

    // Sets title and text as variables which lay the base of the requests body which is what will be sent back
    const { title, text } = req.body;

    // If there is a title and text
    if (title == true && text == true) {
        // Structure for the 
        const Note = {
            title,
            text,
            id: uuid()
        };
    
    // Reads the db file and pulls the array of objects
    fs.readFile(route, 'utf8', (error, data) => {
        // logs error if the db has no objects
        if (error) {
            console.error(error);
        } else {
            // Parse the saved note
            const dbObject = JSON.parse(data);

            // Push it to an array
            dbObject.push(Note);

            // Create a new file with the new note withing the array
            fs.writeFile(route, JSON.stringify(dbObject),
            (error) =>
            error
                ? console.error(error)
                : console.info('Success')
            );
        }
    })

    // Creates a response that sends back the new note
    const response = {
        body: Note
    }
    
    // Sends the response
    res.json(response);
    } else {
        // or else log an error
        console.info('error in saving note');
    }
});

module.exports = notes;
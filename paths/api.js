
const notes = require('express').Router(); 
const fs = require('fs'); 
const path = require('path'); 
const route = path.join(__dirname, '../db/db.json');

function uuid() {
    // Gets random number between 1 and 1000
    Math.floor(Math.random * 1000)
}

notes.get('/', (req, res) => {
    res.sendFile(route);
});

// 
notes.post('/', (req, res) => {

    const { title, text } = req.body;

    // If there is a title and text
    if (title && text) {
        const newNote = {
            title,
            text,
            id: uuid()
        };

    fs.readFile(route, 'utf8', (error, data) => {
        // logs error if the db has no objects
        if (error) {
            console.error(error);
        } else {
            // Parse the saved note
            const parsedNote = JSON.parse(data);

            // Push it to an array
            parsedNote.push(newNote);

            fs.writeFile(route, JSON.stringify(parsedNote),
            (error) =>
            error
                ? console.error(error)
                : console.info('Success')
            );
        }
    })

        const response = {
            status: 'success',
            body: newNote,
        }

        res.json(response);

    } else {
        console.info('error in saving');
    }
});

module.exports = notes;
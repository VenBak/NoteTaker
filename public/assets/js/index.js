// Define one time use varaibles
let noteTitle;
let noteText;
let saveNoteBtn;
let newNoteBtn;
let noteList;

// Conditional for if the current window url is set to notes
if (window.location.pathname === '/notes') {
  // Selects html elements and sets them to the names given previously
  noteTitle = document.querySelector('.note-title');
  noteText = document.querySelector('.note-textarea');
  saveNoteBtn = document.querySelector('.save-note');
  newNoteBtn = document.querySelector('.new-note');
  noteList = document.querySelectorAll('.list-container .list-group');
}

// Show an element
const show = (elem) => {
  elem.style.display = 'inline';
};

// Hide an element
const hide = (elem) => {
  elem.style.display = 'none';
};

// activeNote is used to keep track of the note in the textarea
let activeNote = {};

// Sends a get request from the path of /api/notes to recieve the data 
const getNotes = () =>
  fetch('/api/notes', {
    // Get method recieves information
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  });

// Serves as a function that saves new notes within the database
const saveNote = (note) =>
  fetch('/api/notes', {
    // Post method sends a new object to the database
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    // the content of the sent object will be a stringified 'note'
    body: JSON.stringify(note),
  });

// Deletes the specific object from the array in db.json using their id as a tool to navigate
const deleteNote = (id) =>
  fetch(`/api/notes/${id}`, {
    // Delete method removes a specific object from the database
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json',
    },
  });

// The current note that the user is on will be displayed the on the right side of the screen
const renderActiveNote = () => {
  hide(saveNoteBtn);

  // Adds attributes that make the text visible
  if (activeNote.id) {
    // gives attributes to specific html elements
    noteTitle.setAttribute('readonly', true);
    noteText.setAttribute('readonly', true);
    // Changes the current content of the html element to what has been saved as the current note
    noteTitle.value = activeNote.title;
    noteText.value = activeNote.text;
  } else {
    // Alternatively remove the current text on the right side of the screen
    // gives attributes to specific html elements
    noteTitle.removeAttribute('readonly');
    noteText.removeAttribute('readonly');
    // Changes the current content of the html element to be empty
    noteTitle.value = '';
    noteText.value = '';
  }
};


const handleNoteSave = () => {
  // Creates an object for what was typed into the elements of the note title and text called newnote
  const newNote = {
    title: noteTitle.value,
    text: noteText.value,
  };
  // Calls the function which is a 'post' method to saved the text typed in the elements to the database
  saveNote(newNote).then(() => {
    // After saving the note a promise is conducted which calls the functions which add the saved notes on the left and right side of the screen
    getAndRenderNotes();
    renderActiveNote();
  });
};

// Delete the clicked note
const handleNoteDelete = (e) => {
  // Prevents the click listener for the list from being called when the button inside of it is clicked
  e.stopPropagation();


  const note = e.target;
  // Gets the id of the note which the user wants to delete
  const noteId = JSON.parse(note.parentElement.getAttribute('data-note')).id;

  // if the current active note which is displayed on the right side of the screen matches the one which the user wants to delete
  if (activeNote.id === noteId) {
    // Make the object of the active note which is the one being displayed empty, so nothing will get rendered 
    activeNote = {};
  }

  // Calls the function to delete the note with a promise
  deleteNote(noteId).then(() => {
    // This goes over the database once more and renders what has been saved on the left and right side of the screen
    getAndRenderNotes();
    renderActiveNote();
  });
};

// Sets the activeNote and displays it
const handleNoteView = (e) => {
  e.preventDefault();
  activeNote = JSON.parse(e.target.parentElement.getAttribute('data-note'));
  renderActiveNote();
};

// Sets the activeNote to and empty object and allows the user to enter a new note
const handleNewNoteView = (e) => {
  // When user presses the + button, empties the active note object so the user can type without having to delete the text
  activeNote = {};
  // Renders notes on the left side of the screen
  renderActiveNote();
};

// If the right side of the screen contains text show the save button or else don't
const handleRenderSaveBtn = () => {
  if (!noteTitle.value.trim() || !noteText.value.trim()) {
    hide(saveNoteBtn);
  } else {
    show(saveNoteBtn);
  }
};

// Render the list of note titles
const renderNoteList = async (notes) => {
  let jsonNotes = await notes.json();
  if (window.location.pathname === '/notes') {
    // For each note in the database, render it on the left side of the screen
    noteList.forEach((el) => (el.innerHTML = ''));
  }

  // creates an array called note list items
  let noteListItems = [];

  // Function to create the boxes on the left side of the screen
  // Returns HTML element with or without a delete button
  const createLi = (text, delBtn = true) => {
    // Creates a list element with attirbutes
    const liEl = document.createElement('li');
    liEl.classList.add('list-group-item');

    // Creates a span element with attributes 
    const spanEl = document.createElement('span');
    spanEl.classList.add('list-item-title');
    spanEl.innerText = text;
    spanEl.addEventListener('click', handleNoteView);

    // Put the spans inside of the list
    liEl.append(spanEl);


    if (delBtn) {
      // Creates an i element with attributes that when pressed calls the delete note method from the db
      const delBtnEl = document.createElement('i');
      delBtnEl.classList.add(
        'fas',
        'fa-trash-alt',
        'float-right',
        'text-danger',
        'delete-note'
      );
      // Event listener for when button is pressed
      delBtnEl.addEventListener('click', handleNoteDelete);

      // Put the delete button inside the list
      liEl.append(delBtnEl);
    }

    return liEl;
  };

  // If the database contains no saved notes, render the text which says that no notes have been saved
  if (jsonNotes.length === 0) {
    noteListItems.push(createLi('No saved Notes', false));
  }

  // Goes through the database and creates a li element for each element
  jsonNotes.forEach((note) => {
    const li = createLi(note.title);
    li.dataset.note = JSON.stringify(note);

    // Push the note to an array called note list items
    noteListItems.push(li);
  });

// If the user is on the /notes path in their url, iterate over the notelistitems array and render the list of the left 
  if (window.location.pathname === '/notes') {
    noteListItems.forEach((note) => noteList[0].append(note));
  }
};

// Gets notes from the db and renders them to the sidebar
const getAndRenderNotes = () => getNotes().then(renderNoteList);

// Creates event listeners for if the user presses on the save or + button
// As well as if the user uses the keyup on their keyboard 
if (window.location.pathname === '/notes') {
  saveNoteBtn.addEventListener('click', handleNoteSave);
  newNoteBtn.addEventListener('click', handleNewNoteView);
  noteTitle.addEventListener('keyup', handleRenderSaveBtn);
  noteText.addEventListener('keyup', handleRenderSaveBtn);
}

// Call function to render and creates the notes
getAndRenderNotes();

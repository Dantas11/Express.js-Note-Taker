const notes = require('express').Router();
const { v4: uuidv4 } = require('uuid');
const {readFromFile, readAndAppend, writeToFile} = require('../helpers/fsHelper');

notes.get('/', (req, res) => {
    readFromFile('./db/db.json').then((data) => res.json(JSON.parse(data)));
  })

notes.delete('/:id', (req, res) => {
  const noteId = req.params.id;
  readFromFile('./db/db.json')
    .then((data) => JSON.parse(data))
    .then((json) => {
      const result = json.filter((note) => note.id !== noteId);
      writeToFile('./db/db.json', result);
      return res.json(result);
    });
});  

notes.post('/', (req, res) => {
  const { title, text, id } = req.body;
  if (req.body) {
    const newNote = {
      id: uuidv4(),
      title,
      text
    };

    readAndAppend(newNote, './db/db.json');
    res.json(`Note added successfully`);
  } else {
    res.error('Error in adding note');
  }
});

module.exports = notes;
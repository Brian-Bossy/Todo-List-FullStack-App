const express = require('express');
const router = express.Router();
const Todo = require('../models/Todo'); 


//get all Todos
router.get('/', async (req, res) => {
    try {
        const todos = await Todo.find().sort({ createdAt: -1 }); // Get newest first
        res.json(todos);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

//post a new Todo
router.post('/', async (req, res) => {
    const { text } = req.body;

    if (!text) {
        return res.status(400).json({ msg: 'Please include text for the todo' });
    }

    try {
        const newTodo = new Todo({
            text: text,
        });

        const todo = await newTodo.save();
        res.status(201).json(todo); // 201 Created
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});


//update Todo
router.put('/:id', async (req, res) => {
    const { text } = req.body;
  
    try {
      let todo = await Todo.findById(req.params.id);
      if (!todo) {
        return res.status(404).json({ msg: 'Todo not found' });
      }
  
      if (text) {
        todo.text = text; // Update the text if it's provided in the body
      }
  
      await todo.save();
      res.json(todo);
    } catch (err) {
      console.error(err.message);
      res.status(500).send('Server Error');
    }
  });

//Delete a Todo
router.delete('/:id', async (req, res) => {
    try {
        let todo = await Todo.findById(req.params.id);
        if (!todo) return res.status(404).json({ msg: 'Todo not found' });

        await Todo.findByIdAndDelete(req.params.id); // Use findByIdAndDelete

        res.json({ msg: 'Todo removed' });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

module.exports = router;
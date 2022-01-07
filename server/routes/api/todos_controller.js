const express = require('express');
const async = require('async');
const router = express.Router();
//todos model 
const Todos = require('../../models/Todos');

//@routes Get api/todos
//@desc Get all todos
router.get('/', async (req, res) => {
    try {
        const ts = req.query.ts;
        let todos = [];

        if (ts) {
            todos = await Todos.find({ "timestamp": { $gt: ts } });
        } else {
            todos = await Todos.find();
        }

        res.status(200).json(todos);
    } catch (err) {
        res.status(400).json({ mesg: err })
    }
});

//@routes Show api/todos/:id
//@desc Show a todo
router.get('/:id', async (req, res) => {
    try {
        const todo = await Todos.findById(req.params.id);
        if (!todo) throw Error('No Items');
        res.status(200).json(todo);
    } catch (err) {
        res.status(400).json({ mesg: err })
    }
});

//@routes Post api/todos
//@desc Create a todo 
router.post('/', async (req, res) => {
    const newTodos = req.body;

    newTodos.forEach(todo => {
        todo.timestamp = Date.now();
        todo.createDate = todo.createDate || new Date();
        todo.updateDate = todo.updateDate || new Date();
    });

    Todos.insertMany(newTodos)
        .then(function (savedTodos) {
            console.log("Data inserted");  // Success
            res.status(200).json(savedTodos);
        }).catch(function (error) {
            console.log(error);      // Failure
            res.status(400).json({ msg: error });
        });
});

//@routes Update api/todos/:id
//@desc Update a todo
router.put('/', async (req, res) => {
    try {
        const updateTodos = req.body;

        async.map(updateTodos, async function (obj) {
            const todo = await Todos
                .findByIdAndUpdate(
                    { _id: obj.serverKey },
                    {
                        $set: {
                            summary: obj.summary,
                            description: obj.description,
                            timestamp: Date.now(),
                            isDeleted: obj.isDeleted,
                            isCompleted: obj.isCompleted,
                            updateDate: obj.updateDate || new Date()
                        }
                    },
                    { new: true }
                );

            return todo;
        }, (err, results) => {
            // console.log(results);

            if (err)
                res.status(400).json({ msg: err });
            else
                res.status(200).json(results);
        });
    } catch (err) {
        res.status(400).json({ msg: err });
    }
});

module.exports = router; 
const express = require('express');
const async = require('async');
const router = express.Router();
//labels model 
const Labels = require('../../models/Labels');

//@routes Get api/labels
//@desc Get all labels
router.get('/', async (req, res) => {
    try {
        const ts = req.query.ts;
        let labels = [];

        if (ts) {
            labels = await Labels.find({ "timestamp": { $gt: ts } });
        } else {
            labels = await Labels.find();
        }

        res.status(200).json(labels);
    } catch (err) {
        res.status(400).json({ mesg: err })
    }
});

//@routes Show api/labels/:id
//@desc Show a label
router.get('/:id', async (req, res) => {
    try {
        const label = await Labels.findById(req.params.id);
        if (!label) throw Error('No Items');
        res.status(200).json(label);
    } catch (err) {
        res.status(400).json({ mesg: err })
    }
});

//@routes Post api/labels
//@desc Create a label 
router.post('/', async (req, res) => {
    const newLabels = req.body;

    newLabels.forEach(label => {
        label.timestamp = Date.now();
        label.createDate = label.createDate || new Date();
        label.updateDate = label.updateDate || new Date();
    });

    Labels.insertMany(newLabels)
        .then(function (savedLabels) {
            console.log("Data inserted");  // Success
            res.status(200).json(savedLabels);
        }).catch(function (error) {
            console.log(error);      // Failure
            res.status(400).json({ msg: error });
        });
});

//@desc Update a label
router.put('/', async (req, res) => {
    try {
        const updateLabels = req.body;

        async.map(updateLabels, async function (obj) {
            const label = await Labels
                .findByIdAndUpdate(
                    { _id: obj.serverKey },
                    {
                        $set: {
                            name: obj.name,
                            timestamp: Date.now(),
                            isDeleted: obj.isDeleted,
                            updateDate: obj.updateDate || new Date()
                        }
                    },
                    { new: true }
                );

            return label;
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
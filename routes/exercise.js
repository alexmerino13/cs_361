const express = require("express");
const router = express.Router();
const { v4: uuidv4 } = require('uuid');
const db = require("../config/exerciseDb");

router.get("/exercises/:id", async (req, res) => {
    try {
      const { id } = req.params;
      const exercise = await db.get(id);
      res.status(200).send(exercise);
    } catch (error) {
        console.log(error.message);
        res.status(500).json({ error: error.message });
    }
});

router.get("/routine/exercises/:id", async (req, res) => {
    try {
        const { id } = req.params;
        const exercises = await db.find({
                                    selector: {
                                      $and: [
                                        {routine: id},
                                        {name: {$exists: true}}
                                    ]},
                                    sort: [{'name': 'asc'}]
                                });
        res.status(200).send(exercises.docs);
    } catch (error) {
        console.log(error.message);
        res.status(500).json({ error: error.message });
    }
});

router.post("/exercises/new", async (req, res) => {
    let data = req.body;
    let routine = data.routine;
    let name = data.name;
    let sets = data.sets;
    let reps = data.reps;
    let weight = data.weight;
    let berkhan = data.berkhan;

    // Generating _id
    const _id = uuidv4();
  
    const exercise = {
      _id,
      routine,
      name,
      sets,
      reps,
      weight,
      berkhan
    };
    
    // Saving to DB
    db.put(exercise)
      .then((response) => {

        res.status(200).send(exercise);
      })
      .catch((error) => {
        console.log(error.message);
        res.status(500).json({ error: error.message });
      });
  });

  router.post("/exercises/update", async (req, res) => {
    let data = req.body;
    let id = data._id;
    let name = data.name;
    let sets = data.sets;
    let reps = data.reps;
    let weight = data.weight;
    let berkhan = data.berkhan;

    db.get(id).then(function(exercise) {
      return db.put({
        _id: id,
        _rev: exercise._rev,
        name: name,
        sets: sets,
        reps: reps,
        weight: weight,
        berkhan: berkhan
      });
    }).then(function(response) {
      res.status(200).send(response);
    }).catch(function (error) {
      console.log(error.message);
      res.status(500).json({ error: error.message });
    });
    
  });

  router.post("/exercises/updateBerkhan", async (req, res) => {
    
    let data = req.body;
    let id = data._id;
    let sets = data.sets;
    let reps = data.reps;
    let berkhan = data.berkhan;

    db.get(id)
      .then((exercise) => {
        db.put({
          _id: id,
          _rev: exercise._rev,
          routine: exercise.routine,
          name: exercise.name,
          sets: sets,
          reps: reps,
          weight: exercise.weight,
          berkhan: berkhan
        }).then((response) => {
          db.get(id)
          .then((updated) => {
            res.status(200).send(updated);
          })
          .catch((error) => {
            console.log("Error getting updated exercise id " + id + ": " + error.message);
            res.status(500).json({ error: error.message });
          });
          
        })
        .catch((error) => {
          console.log("Error updating exercise id " + id + ": " + error.message);
          res.status(500).json({ error: error.message });
        });
        
      })
      .catch((error) => {
        console.log("Error getting exercise id " + id + ": " + error.message);
        res.status(500).json({ error: error.message });
      });

  });
    
  router.delete("/exercises/:id", async (req, res) => {
    try {
      const id = req.params.id;
      const doc = await db.get(id);
      const response = await db.remove(doc);
      res.status(200).send(response);
    } catch (error) {
        console.log(error.message);
        res.status(500).json({ error: error.message });
    }
  });

  module.exports = router;
  
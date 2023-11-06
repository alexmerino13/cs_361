const express = require("express");
const router = express.Router();
const { v4: uuidv4 } = require('uuid');
const db = require("../config/routineDb");

router.post("/routines/new", async (req, res) => {
    let data = req.body;
    let name = data.name;
    let monday = data.monday;
    let tuesday = data.tuesday;
    let wednesday = data.wednesday;
    let thursday = data.thursday;
    let friday = data.friday;
    let saturday = data.saturday;
    let sunday = data.sunday;

    // Generating _id
    const _id = uuidv4();
    const routine = {
      _id,
      name,
      monday,
      tuesday,
      wednesday,
      thursday,
      friday,
      saturday,
      sunday
    };
  
    // Saving to DB
    db.put(routine)
      .then((response) => {
        res.status(200).send(response);
      })
      .catch((error) => {
        console.log(error.message);
        res.status(500).json({ error: error.message });
      });
  });

  router.get("/routines", async (req, res) => {
    try {
      const routines = await db.find({
              selector: {
                
                  name: {$exists: true}
              },
              sort: [{'name': 'asc'}]
          });
      res.status(200).send(routines.docs);
    } catch (error) {
        console.log(error.message);
        res.status(500).json({ error: error.message });
    }
  });

  router.get("/routines/:id", async (req, res) => {
    const { id } = req.params;
    try {
        const routine = await db.get(id);
        res.status(200).send( routine);
    } catch (error) {
        console.log(error.message);
        res.status(500).json({ error: error.message });
    }
  });

  router.put("/routines/:id", async (req, res) => {
    try {
      const { id } = req.params;
      const { name, days } = req.body;
  
      db.get(id).then(async (doc) => {
        const response = await db.put({
            _id: id,
            _rev: doc._rev,
            name,
            monday,
            tuesday,
            wednesday,
            thursday,
            friday,
            saturday,
            sunday
        });
        res.status(200).send(response);
      });
    } catch (error) {
      console.log(error.message);
      res.status(500).json({ error: error.message });
    }
  });

  router.delete("/routines/:id", async (req, res) => {
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
  
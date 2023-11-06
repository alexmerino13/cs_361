const express = require("express");
const path = require("path");
const app = express();
var http = require('http');
const fs = require('fs');
const PORT=3761; 
const { engine } = require('express-handlebars');
var exphbs = require('express-handlebars');     // Import express-handlebars
var XMLHttpRequest = require("xmlhttprequest").XMLHttpRequest;
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.engine('.hbs', engine({ extname: ".hbs" }));  // Create an instance of the handlebars engine to process templates
app.set('view engine', '.hbs');                 // Tell express to use the handlebars engine whenever it encounters a *.hbs file.


const db = require("./config/routineDb");
//db.info().then((info) => console.log(info));

const db1 = require("./config/exerciseDb");
const e = require("express");
//db1.info().then((info) => console.log(info));

app.use(require('./routes/routine.js'));
app.use(require('./routes/exercise.js'));
app.use(express.static('public'))

/*
    ROUTES
*/
app.get('/', function (req, res) {
    return res.render('index');
});

app.get('/createRoutine', function (req, res) {
    return res.render('createRoutine');
});

app.get('/createExercise/:id', function (req, res) {
    const { id } = req.params;
    return res.render('createExercise', { routine: id });
});

app.get('/viewRoutines', function (req, res) {
    var xhttp = new XMLHttpRequest();
    xhttp.open("GET", "http://localhost:3761/routines", true);
    xhttp.setRequestHeader("Content-type", "application/json");
    xhttp.onreadystatechange = () => {
        if (xhttp.readyState == 4 && xhttp.status == 200) {
  
            let routines = JSON.parse(xhttp.responseText);

            // Reload the page
            return res.render('viewRoutines', { data: routines });
        }
        else if (xhttp.readyState == 4 && xhttp.status != 200) {
            console.log("There was an error.")
        }
    }

    // Send the request and wait for the response
    xhttp.send();

});

app.get('/berkhanValue/:id', function (req, res) {
    const { id } = req.params;
    var xhttp = new XMLHttpRequest();
    xhttp.open("GET", "http://localhost:3761/exercises/" + id, true);
    xhttp.setRequestHeader("Content-type", "application/json");
    xhttp.onreadystatechange = () => {
        if (xhttp.readyState == 4 && xhttp.status == 200) {
  
            let exercise = JSON.parse(xhttp.responseText);
            // Reload the page
            return res.render('berkhanValue', { exercise: exercise });
        }
        else if (xhttp.readyState == 4 && xhttp.status != 200) {
            console.log("There was an error.")
        }
    }

    // Send the request and wait for the response
    xhttp.send();
});

app.get('/viewRoutine/:id', function (req, res) {
    const { id } = req.params;
    var xhttp = new XMLHttpRequest();
    let url = "http://localhost:3761/routines/" + id;
    xhttp.open("GET", url, true);
    xhttp.setRequestHeader("Content-type", "application/json");
    xhttp.onreadystatechange = () => {
        if (xhttp.readyState == 4 && xhttp.status == 200) {

            let routine = JSON.parse(xhttp.responseText);
            var xhttp2 = new XMLHttpRequest();
            xhttp2.open("GET", "http://localhost:3761/routine/exercises/" + id, true);
            xhttp2.setRequestHeader("Content-type", "application/json");
            xhttp2.onreadystatechange = () => {
                if (xhttp2.readyState == 4 && xhttp2.status == 200) {

                    let exercises = JSON.parse(xhttp2.responseText);

                    // Reload the page
                    return res.render('viewRoutine', { routine: routine,  exercises: exercises});
                }
                else if (xhttp2.readyState == 4 && xhttp2.status != 200) {
                    console.log("There was an error.")
                }
            }

            // Send the request and wait for the response
            xhttp2.send();
        }
        else if (xhttp.readyState == 4 && xhttp.status != 200) {
            console.log("There was an error.")
        }
    }

    // Send the request and wait for the response
    xhttp.send();

});

/*
    LISTENER
*/
app.listen(PORT, function () {  
    console.log('Express started on http://localhost:' + PORT + '; press Ctrl-C to terminate.')
});


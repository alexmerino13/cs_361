// Get the objects we need to modify
let addExerciseForm = document.getElementById('add-exercise-form');

// Modify the objects we need
addExerciseForm.addEventListener("submit", function (e) {
    
    // Prevent the form from submitting
    e.preventDefault();

    // Get form fields we need to get data from
    let inputRoutineId = document.getElementById("input-routine-id");
    let routineIdValue = inputRoutineId.value;

    let inputExerciseName = document.getElementById("input-exercise-name");
    let exerciseNameValue = inputExerciseName.value;

    let inputExerciseSets = document.getElementById("input-exercise-sets");
    let exerciseSetsValue = inputExerciseSets.value;

    let inputExerciseReps = document.getElementById("input-exercise-reps");
    let exerciseRepsValue = inputExerciseReps.value;

    let inputExerciseWeight = document.getElementById("input-exercise-weight");
    let exerciseWeightValue = inputExerciseWeight.value;

    let inputExerciseBv = document.getElementById("input-exercise-bv");
    let exerciseBvValue = inputExerciseBv.value;

    var url = window.location.pathname;
    var id = url.substring(url.lastIndexOf('/') + 1);

    // Put our data we want to send in a javascript object
    let data = {
        routine: routineIdValue,
        name: exerciseNameValue,
        sets: exerciseSetsValue,
        reps: exerciseRepsValue,
        weight: exerciseWeightValue,
        berkhan: exerciseBvValue
    }

    // Setup our AJAX request
    var xhttp = new XMLHttpRequest();
    xhttp.open("POST", "http://localhost:3761/exercises/new", true);
    xhttp.setRequestHeader("Content-type", "application/json");

    // Tell our AJAX request how to resolve
    xhttp.onreadystatechange = () => {
        if (xhttp.readyState == 4 && xhttp.status == 200) {

            // Add the new data to the table
            //addRowToTable(xhttp.responseText);
            // Clear the input fields for another transaction
            inputExerciseName.value = '';
            inputExerciseSets.value = '';
            inputExerciseReps.value = '';
            inputExerciseWeight.value = '';
            inputExerciseBv.value = '';
        }
        else if (xhttp.readyState == 4 && xhttp.status != 200) {
            console.log("There was an error with the input.")
        }
    }

    // Send the request and wait for the response
    xhttp.send(JSON.stringify(data));

})
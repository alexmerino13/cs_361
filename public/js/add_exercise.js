// Get the objects we need to modify
let addExerciseForm = document.getElementById('add-exercise-form');

// Modify the objects we need
addExerciseForm.addEventListener("submit", function (e) {

    if (!addExerciseForm.checkValidity()) {
      
        e.preventDefault();
        e.stopPropagation();
    }
    else{
        addExerciseForm.classList.add('was-validated')
        // Prevent the form from submitting
        e.preventDefault();
  
        // Get form fields we need to get data from

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
            routine: id,
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
                addRowToTable(xhttp.responseText);
                // Clear the input fields for another transaction
                /* inputExerciseName.value = '';
                inputExerciseSets.value = '';
                inputExerciseReps.value = '';
                inputExerciseWeight.value = '';
                inputExerciseBv.value = ''; */
                $('#exerciseModal').modal('toggle');
            }
            else if (xhttp.readyState == 4 && xhttp.status != 200) {
                console.log("There was an error with the input.")
            }
        }

        // Send the request and wait for the response
        xhttp.send(JSON.stringify(data));
    }
})

addRowToTable = (data) => {
    // Get the objects we need to modify
    let exerciseTable = document.getElementById('exercise-table-body');

    // Get a reference to the new row from the database query (last object)
    let newRow = JSON.parse(data);

    // Create a row and 4 cells
    let row = document.createElement("TR");
    row.setAttribute("scope", "row")
    let nameCell = document.createElement("TD");
    let setsCell = document.createElement("TD");
    let repsCell = document.createElement("TD");
    let weightCell = document.createElement("TD");
    let berkhanCell = document.createElement("TD");
    let actionsCell = document.createElement("TD");

    // Fill the cells with correct data
    nameCell.innerText = newRow.name;
    setsCell.innerText = newRow.sets;
    repsCell.innerText = newRow.reps;
    weightCell.innerHTML = newRow.weight;
    berkhanCell.innerText = newRow.berkhan;
    let dropdownDiv = document.createElement("div");
    dropdownDiv.setAttribute("class", "dropdown");
    let actionIcon = document.createElement("i");
    actionIcon.setAttribute("class", "bi bi-three-dots");
    actionIcon.setAttribute("type", "dropdownMenuButton");
    actionIcon.setAttribute("data-bs-toggle", "dropdown");
    let menuDiv = document.createElement("div");
    menuDiv.setAttribute("class", "dropdown-menu");
    let valueLink = document.createElement("a");
    valueLink.setAttribute("class", "dropdown-item");
    valueLink.setAttribute("data-bs-toggle", "modal");
    valueLink.setAttribute("data-bs-target", "#berkhanModal");
    valueLink.setAttribute("data-id", newRow._id);
    valueLink.setAttribute("data-sets", newRow.sets);
    valueLink.setAttribute("data-reps", newRow.reps);
    valueLink.setAttribute("data-weight", newRow.weight);
    valueLink.innerHTML = "Calculate Next Value";
    let editLink = document.createElement("a");
    editLink.setAttribute("class", "dropdown-item");
    editLink.setAttribute("href", "#");
    editLink.innerHTML = "Edit";
    let deleteLink = document.createElement("a");
    deleteLink.setAttribute("class", "dropdown-item");
    deleteLink.setAttribute("href", "#");
    deleteLink.innerHTML = "Delete";
    menuDiv.appendChild(valueLink);
    menuDiv.appendChild(editLink);
    menuDiv.appendChild(deleteLink);
    dropdownDiv.appendChild(actionIcon);
    dropdownDiv.appendChild(menuDiv);
    actionsCell.appendChild(dropdownDiv);

    // Add the cells to the row 
    row.appendChild(nameCell);
    row.appendChild(setsCell);
    row.appendChild(repsCell);
    row.appendChild(weightCell);
    row.appendChild(berkhanCell);
    row.appendChild(actionsCell);

    // Add a row attribute so the deleteRow function can find a newly added row
    row.setAttribute('data-value', newRow._id);
    
    // Add the row to the table
    exerciseTable.appendChild(row);
}
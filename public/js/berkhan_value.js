// Get the objects we need to modify
let calculateValueForm = document.getElementById('calculate-value-form');

// Modify the objects we need
calculateValueForm.addEventListener("submit", function (e) {
    
    // Prevent the form from submitting
    e.preventDefault();

    // Clear previous calculations
    const optionsForm = document.getElementById("select-option");
    optionsForm.innerHTML = '';

    // Get form fields we need to get data from
    let inputExerciseSets = document.getElementById("input-berkhan-sets");
    let exerciseSetsValue = Number(inputExerciseSets.value);

    let inputExerciseReps = document.getElementById("input-berkhan-reps");
    let exerciseRepsValue = Number(inputExerciseReps.value);

    let inputExerciseWeight = document.getElementById("input-berkhan-weight");
    let exerciseWeightValue = parseFloat(inputExerciseWeight.value);

    // Put our data we want to send in a javascript object
    let data = {
        sets: exerciseSetsValue,
        reps: exerciseRepsValue,
        weight: exerciseWeightValue
    }

    // Setup our AJAX request
    var xhttp = new XMLHttpRequest();
    xhttp.open("POST", "http://localhost:6789/values", true);
    xhttp.setRequestHeader("Content-type", "application/json");

    // Tell our AJAX request how to resolve
    xhttp.onreadystatechange = () => {
        if (xhttp.readyState == 4 && xhttp.status == 200) {

            // Add the new data to the table
            displayOptions(xhttp.responseText);
        }
        else if (xhttp.readyState == 4 && xhttp.status != 200) {
            console.log("There was an error with the input.")
        }
    }

    // Send the request and wait for the response
    xhttp.send(JSON.stringify(data));

});


displayOptions = (inputData) => {

    let data = JSON.parse(inputData);
    
    // Get a reference to the current table on the page and clear it out.
   /*  let form = document.createElement("form");
    form.id = "select-option-form";
    for ( let i in data){
        let option = data[i];
        let row = document.createElement("input");
        row.setAttribute("type", "radio");
        row.setAttribute("id", option.capacity);
        row.value = '{"sets": ' + option.sets + ', "reps": ' + option.reps + ', "capacity": ' + option.capacity +"}";
        row.setAttribute("name", "berkhan_value");
        let label = document.createElement("label");
        label.setAttribute("for", option.capacity);
        label.innerHTML = "Sets: " + option.sets + ", Reps: " + option.reps + ", Capacity: " + option.capacity;
        form.appendChild(row);
        form.appendChild(label);
        let br = document.createElement("br");
        form.appendChild(br);
    } */
    let optionTable = document.createElement("table");
    optionTable.id = "select-option-table";
    optionTable.setAttribute("class", "table table-fixed");
    optionTable.setAttribute("data-click-to-select", "true");
    optionTable.setAttribute("data-toggle", "select-option-table");
    optionTable.setAttribute("data-height", "460");
    let tableHeader = document.createElement("thead");
    let tableHeaderRow = document.createElement("tr");
   
    let selectHeader = document.createElement("th");
    selectHeader.setAttribute("data-field", "state");
    selectHeader.setAttribute("data-checkbox", "true");
    selectHeader.setAttribute("scope", "col");
    let setsHeader = document.createElement("th");
    setsHeader.setAttribute("scope", "col");
    setsHeader.setAttribute("data-field", "sets");
    let repsHeader = document.createElement("th");
    repsHeader.setAttribute("scope", "col");
    repsHeader.setAttribute("data-field", "reps");
    let bvHeader = document.createElement("th");
    bvHeader.setAttribute("scope", "col");
    bvHeader.setAttribute("data-field", "capacity");
    setsHeader.innerHTML = 'Sets';
    repsHeader.innerHTML = 'Reps';
    bvHeader.innerHTML = 'Berkhan Value';
    tableHeaderRow.appendChild(selectHeader);
    tableHeaderRow.appendChild(setsHeader);
    tableHeaderRow.appendChild(repsHeader);
    tableHeaderRow.appendChild(bvHeader);
    tableHeader.appendChild(tableHeaderRow);
    optionTable.appendChild(tableHeader);

    let tableBody = document.createElement("tbody");

    for ( let i in data){
        let option = data[i];
        let row = document.createElement("tr");
        row.setAttribute("scope", "row");
        let state = document.createElement("td");
        state.setAttribute("class", "bs-checkbox");
        state.setAttribute("scope", "col");
        let radio = document.createElement("input");
        radio.setAttribute("type", "radio");
        radio.setAttribute("name", "berkhan_value");
        radio.setAttribute("id", option.capacity);
        radio.setAttribute("value", '{"sets": ' + option.sets + ', "reps": ' + option.reps + ', "capacity": ' + option.capacity +"}");
        let radioLabel = document.createElement("label");
        radioLabel.setAttribute("for", option.capacity);
        state.appendChild(radioLabel);
        state.appendChild(radio);
        let sets = document.createElement("td");
        sets.setAttribute("scope", "col");
        sets.innerHTML = option.sets
        let reps = document.createElement("td");
        reps.setAttribute("scope", "col");
        reps.innerHTML = option.reps
        let bv = document.createElement("td");
        bv.setAttribute("scope", "col");
        bv.innerHTML = option.capacity
        row.appendChild(state); 
        row.appendChild(sets);   
        row.appendChild(reps);   
        row.appendChild(bv);    
        tableBody.appendChild(row);
    }
    optionTable.appendChild(tableBody);
    let form = document.createElement("form");
    form.id = "select-option-form";
    let submit = document.createElement("button");
    submit.setAttribute("type", "submit");
    submit.setAttribute("class", "btn btn-primary");
    submit.innerHTML = 'Save';
    form.appendChild(submit);
    form.addEventListener("submit", function (e) {
        
        // Prevent the form from submitting
        e.preventDefault();

        // Get form fields we need to get data from
        let inputBerkhan = document.querySelector('input[name="berkhan_value"]:checked');
        let berkhanValue = JSON.parse(inputBerkhan.value);
        var url = window.location.pathname;
        var exerciseId = document.getElementById("input-berkhan-id").value;

        // Put our data we want to send in a javascript object
        let data = {
            _id: exerciseId,
            sets: berkhanValue.sets,
            reps: berkhanValue.reps,
            berkhan: berkhanValue.capacity
        }
       
        // Setup our AJAX request
        var xhttp = new XMLHttpRequest();
        xhttp.open("POST", "http://localhost:3761/exercises/updateBerkhan", true);
        xhttp.setRequestHeader("Content-type", "application/json");

        // Tell our AJAX request how to resolve
        xhttp.onreadystatechange = () => {
            if (xhttp.readyState == 4 && xhttp.status == 200) {
                updateRow(xhttp.responseText, exerciseId);
                $('#berkhanModal').modal('toggle');
            }
            else if (xhttp.readyState == 4 && xhttp.status != 200) {
                console.log("There was an error with the input.")
            }
        }

        // Send the request and wait for the response
        xhttp.send(JSON.stringify(data));

    });
    let selectionDiv = document.getElementById("select-option");
    selectionDiv.appendChild(optionTable);
    selectionDiv.appendChild(form);

}

updateRow = (data, exerciseId) => {
 
    let parsedData = JSON.parse(data);
    let table = document.getElementById("exercise-table-body");

    for (let i = 0, row; row = table.rows[i]; i++) {
       //iterate through rows
       //rows would be accessed using the "row" variable assigned in the for loop
       if (table.rows[i].getAttribute("data-value") == exerciseId) {

            // Get the location of the row where we found the matching season ID
            let updateRowIndex = table.getElementsByTagName("tr")[i];

            // Get td of name value
            let td_sets = updateRowIndex.getElementsByTagName("td")[1];
            let td_reps = updateRowIndex.getElementsByTagName("td")[2];
            let td_berkhan = updateRowIndex.getElementsByTagName("td")[4];

            // Reassign name and year to new values
            td_sets.innerHTML = parsedData.sets;
            td_reps.innerHTML = parsedData.reps;
            td_berkhan.innerHTML = parsedData.berkhan;
       }
    }
}
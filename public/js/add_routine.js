'use strict'


// Get the objects we need to modify
let addRoutineForm = document.getElementById('add-routine-form');

// Modify the objects we need
addRoutineForm.addEventListener("submit", function (e) {

    if ($("[name='days_box']:checked").length == 0) {
        $("[name='days_box']").attr('required', true);
        $("input[name='days_box']")[0].setCustomValidity('Please select at least one checkbox.');
        e.preventDefault();
        e.stopPropagation();
    }
    else {
        $("[name='days_box']").attr('required', false);
        $("input[name='days_box']")[0].setCustomValidity('');
    }

    $("[name='days_box']")[0].reportValidity();

    if (!addRoutineForm.checkValidity()) {
          e.preventDefault();
          e.stopPropagation();
    }
    else{
        addRoutineForm.classList.add('was-validated')
        // Prevent the form from submitting
        e.preventDefault();

        // Get form fields we need to get data from
        let inputRoutineName = document.getElementById("input-routine-name");
        let routineNameValue = inputRoutineName.value;

        let inputMon = document.getElementById("mon");
        //let valueMon = inputMon.value;
        let inputTue = document.getElementById("tue");
        //let valueTue = inputTue.value;
        let inputWed = document.getElementById("wed");
        //let valueWed = inputWed.value;
        let inputThu = document.getElementById("thu");
        //let valueThu = inputThu.value;
        let inputFri = document.getElementById("fri");
        //let valueFri = inputFri.value;
        let inputSat = document.getElementById("sat");
        //let valueSat = inputSat.value;
        let inputSun = document.getElementById("sun");
        //let valueSun = inputSun.value;
        let valueMon = '';
        let valueTue = '';
        let valueWed = '';
        let valueThu = '';
        let valueFri = '';
        let valueSat = '';
        let valueSun = '';

        if (inputMon.checked){
            valueMon = inputMon.value;
        };
        if (inputTue.checked){
            valueTue = inputTue.value;
        };
        if (inputWed.checked){
            valueWed = inputWed.value;
        };
        if (inputThu.checked){
            valueThu = inputThu.value;
        };
        if (inputFri.checked){
            valueFri = inputFri.value;
        };
        if (inputSat.checked){
            valueSat = inputSat.value;
        };
        if (inputSun.checked){
            valueSun = inputSun.value;
        };

        // Put our data we want to send in a javascript object
        let data = {
            name: routineNameValue,
            monday: valueMon,
            tuesday: valueTue,
            wednesday: valueWed,
            thursday: valueThu,
            friday: valueFri,
            saturday: valueSat,
            sunday: valueSun
        }

        // Setup our AJAX request
        var xhttp = new XMLHttpRequest();
        xhttp.open("POST", "http://localhost:3761/routines/new", true);
        xhttp.setRequestHeader("Content-type", "application/json");

        // Tell our AJAX request how to resolve
        xhttp.onreadystatechange = () => {
            if (xhttp.readyState == 4 && xhttp.status == 200) {

                // Add the new data to the table
                //addRowToTable(xhttp.responseText);

                // Clear the input fields for another transaction
                let url = "/viewRoutines";
                window.location = url;
            }
            else if (xhttp.readyState == 4 && xhttp.status != 200) {
                console.log("There was an error with the input.")
            }
        }

        // Send the request and wait for the response
        xhttp.send(JSON.stringify(data));
    }
    
})
const express = require("express");

var cors = require('cors')
const app = express();
const PORT=6789; 
app.use(cors());
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

const tolerance = 0.015;

app.post("/values", function (req, res) {
    let data = req.body;
    let setsValue = data.sets;
    let repsValue = data.reps;
    let weightValue = data.weight;

    // Calculate the value grid
    let valueGrid = [];

    //row = reps, col = sets
    for (let col = 0; col < 10; col++){
        let column = [];
        let currentValue = 0;
        if(col == 0 ){
            currentValue = weightValue;
        }
        else{
            currentValue = valueGrid[col-1][0] * 1.025;
        }
        //add the first value to the column
        column.push(currentValue);

        for (let row = 1; row < 10; row++){

            // first column in the grid is calculated differently
            if(col == 0) {
                // add new values to the column based on the previous value
                let newValue = weightValue * (1+(0.025*(row+1)));
                column.push(newValue);
            }
            else{
                // add new values to the column based on the previous value
                let colValue = valueGrid[col-1][row] * 1.025;
                column.push(colValue);         
            }
        }
        valueGrid.push(column);
    }

    // Get starting value, lookup in the value grid using sets and reps input
    let startingValue = valueGrid[setsValue-1][repsValue-1];

    let options = [];
    let high = startingValue + (startingValue * tolerance);

    for (let col = 0; col < 10; col++){
        for (let row = 0; row < 10; row++){
            if (startingValue < valueGrid[col][row] && valueGrid[col][row] <= high ){
                let option = {"sets": col + 1, "reps": row + 1, "capacity": valueGrid[col][row]};
                options.push(option);
            }
        }
    }

    //res.send(data);
    res.send(JSON.stringify(options));
});

app.listen(PORT, () => {
    console.log("Application started and Listening on port 6789");
});

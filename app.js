// declare variables

const width = 6;
const height = 5;

// FUNCTION: create data table, array of arrays

const createDataTable = () => {
    let newArray = []; 
    for(let i = 0; i < height; i++){
        for (let j = 0; j < width; j++){
            newArray.push([]);
        }
     }
     return newArray;
}
let cellsContainer = document.querySelector(".cells");
let sheetsDB=[];
let db;
let visitedCells;

function initCells() {
  let cellsContent = '<div class="top-left-cell"></div>';

  cellsContent += '<div class="top-row">';
  for (let j = 0; j < 26; j++) {   //for row abcd
    cellsContent += `<div class="top-row-cell">${String.fromCharCode(
      65 + j
    )}</div>`;
  }
  cellsContent += "</div>";

  cellsContent += '<div class="left-col">';
  for (let j = 0; j < 100; j++) {  //for col 1234 
    cellsContent += `<div class="left-col-cell">${j + 1}</div>`;
  }
  cellsContent += "</div>";

  cellsContent += '<div class="all-cells">';
  for (let i = 0; i < 100; i++) {
    cellsContent += '<div class="row">';
    for (let j = 0; j < 26; j++) {
      cellsContent += `<div class="cell" contenteditable="true" rowid="${i}" colid="${j}"></div>`;
    }
    cellsContent += "</div>";
  }
  cellsContent += "</div";
  cellsContainer.innerHTML = cellsContent;
}

//db---db is  array
//db --- [row1[cellobject],row1[cellobject],row1[cellobject]]

function initDB() {
  newDB = [];
  for (let i = 0; i < 100; i++) {
    let row = [];
    for (let j = 0; j < 26; j++) {
      // i=1
      // j=1   =>   B2
      let cellName = String.fromCharCode(65 + j) + (i + 1);
      let cellObject = {
        name: cellName,
        value: "",
        formula: "",
        childrens:[],
        parents:[],
        visited: false,
        fontStyles:{bold:false , italic:false , underline:false },
        textAlign:"left",
      };
      row.push(cellObject);
    }
    newDB.push(row);
  }
  let dbObject = { db: newDB, visitedCells: [] };
  sheetsDB.push(dbObject);
  db = newDB;
  visitedCells = dbObject.visitedCells;
}

initCells();
initDB();
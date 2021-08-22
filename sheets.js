let addSheetBtn = document.querySelector(".add-sheet");
let sheetsList = document.querySelector(".sheets-list");
let defaultSheet = document.querySelector(".sheet");
let sheetId = 0;

addSheetBtn.addEventListener("click", function () {
  addSheet();
});

//for sheet1
defaultSheet.addEventListener("click", function () {
  switchSheet(defaultSheet);
});


//adding sheet
function addSheet() {
  document.querySelector(".active-sheet").classList.remove("active-sheet");
  sheetId++;
  let sheetDiv = document.createElement("div");
  sheetDiv.classList.add("sheet");
  sheetDiv.classList.add("active-sheet");
  sheetDiv.setAttribute("sid", sheetId);
  sheetDiv.innerHTML = `Sheet ${sheetId + 1}`;
  sheetsList.append(sheetDiv);

  sheetDiv.addEventListener("click", function () {
    switchSheet(sheetDiv);
  });
  // remove all the data from current db cells
  cleanUI();
  initDB();
  //initCells();
  //attachEventListeners();
  lastSelectedCell = undefined;

}

//switching sheets
function switchSheet(currentSheet) {
  if (currentSheet.classList.contains("active-sheet")) {
    return;
  }
  document.querySelector(".active-sheet").classList.remove("active-sheet");
  currentSheet.classList.add("active-sheet");

  cleanUI();

  //set db
  let sid = currentSheet.getAttribute("sid");
  db = sheetsDB[sid].db;
  visitedCells = sheetsDB[sid].visitedCells
  //db = sheetsDB[sid];
   //set UI
 // let lastCellIndex = 0;
  //for (let i = 0; i < db.length; i++) {
   // let dbRow = db[i];
    //for (let j = 0; j < dbRow.length; j++) {
     // allCells[lastCellIndex].textContent = dbRow[j].value;
     // lastCellIndex++;
   // }
 // }
 // set UI optimized
 for (let i = 0; i < visitedCells.length; i++) {
  let { rowId, colId } = visitedCells[i];
  let idx = Number(rowId) * 26 + Number(colId);
  allCells[idx].textContent = db[rowId][colId].value;

  let cellObject = db[rowId][colId];
  let { bold, underline, italic } = cellObject.fontStyles;
  if (bold) {
    allCells[i].style.fontWeight = "bold";
  }
  if (underline) {
    allCells[i].style.textDecoration = "underline";
  }
  if (italic) {
    allCells[i].style.fontStyle = "italic";
  }
  
  let textAlign = cellObject.textAlign;
  allCells[i].style.textAlign = textAlign;


}
}

function attachEventListeners() {
    topLeftCell = document.querySelector(".top-left-cell");
    topRow = document.querySelector(".top-row");
    leftCol = document.querySelector(".left-col");
    allCells = document.querySelectorAll(".cell");
    attachClickAndBlurEventOnCell();
  }


  function cleanUI() {
    //sheet change k time jo fontstyle lge ho unhe unselected krne  liye
    let allActiveMenus = document.querySelectorAll(".active-menu");
    if (allActiveMenus) {
      for (let i = 0; i < allActiveMenus.length; i++) {
        allActiveMenus[i].classList.remove("active-menu");
      }
    }
    for (let i = 0; i < visitedCells.length; i++) {
      let { rowId, colId } = visitedCells[i];
      let idx = Number(rowId) * 26 + Number(colId);
      allCells[idx].innerHTML = "";
      allCells[idx].style = "";
      // console.log(allCells[idx]);
    }
  }
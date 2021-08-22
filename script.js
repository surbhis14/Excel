let topLeftCell = document.querySelector(".top-left-cell");
let topRow = document.querySelector(".top-row");
let leftCol = document.querySelector(".left-col");
let address = document.querySelector("#address");
let formulaInput = document.querySelector("#formula");
let allCells = document.querySelectorAll(".cell");
let lastSelectedCell;

cellsContainer.addEventListener("scroll", function (e) {
  let topOffset = e.target.scrollTop; //niche scroll krne pr ek value milti h
  let leftOffset = e.target.scrollLeft; //left scroll pr b value milti h

  topRow.style.top = topOffset + "px"; //abcd waali row ka top set 
  topLeftCell.style.top = topOffset + "px"; //top left col ka top set
  topLeftCell.style.left = leftOffset + "px"; // top left col ka left set
  leftCol.style.left = leftOffset + "px"; // 1234 waale col. ka left set
});

//blur---when a cell out of focus..mtlb uske bd khi or click krdia

formulaInput.addEventListener("blur", function (e) {
    let formula = e.target.value;
    if (formula) {
      let cellObject = getCellObjectFromElement(lastSelectedCell);
      if(cellObject.formula != formula){   //formula to formula edge case
        deleteFormula(cellObject);
      }
  
      let calculatedValue = solveFormula(formula, cellObject);
      // UI Update
      lastSelectedCell.textContent = calculatedValue;
      // DB Update
      cellObject.value = calculatedValue;
      cellObject.formula = formula;

      //update children value to formula edge case
      updateChildrens(cellObject.childrens);
    }
});
function attachClickAndBlurEventOnCell(){
for (let i = 0; i < allCells.length; i++) {
  allCells[i].addEventListener("click", function (e) {
    let cellObject = getCellObjectFromElement(e.target);
    address.value = cellObject.name;
    formulaInput.value = cellObject.formula;
      

    //cell change k time jo fontstyle lge ho unhe unselected krne  liye
    let allActiveMenus = document.querySelectorAll(".active-menu");
    if (allActiveMenus) {
      for (let i = 0; i < allActiveMenus.length; i++) {
        allActiveMenus[i].classList.remove("active-menu");
      }
    }
///if kisi cell pr vaps aate h or uspr koi fontstyle lgra ho toh use selected show krne k liye
    let {bold , underline , italic} = cellObject.fontStyles;
      bold && document.querySelector(".bold").classList.add("active-menu");
      underline && document.querySelector(".underline").classList.add("active-menu");
      italic && document.querySelector(".italic").classList.add("active-menu");

      let textAlign=cellObject.textAlign;
      document.querySelector("."+textAlign).classList.add("active-menu");

  });

  allCells[i].addEventListener("blur", function (e) {
    lastSelectedCell = e.target;
    // logic to save this value in db
    let cellValueFromUI = e.target.textContent;
    if (cellValueFromUI) {
      // cellObject ki value update !!
      let cellObject = getCellObjectFromElement(e.target);

      // check if the given cell has a formula on it
      //formula to value edge case....if ui value not equal to db value
      if (cellObject.formula && cellValueFromUI != cellObject.value) {
        deleteFormula(cellObject);
        formulaInput.value="";
      }
      cellObject.value = cellValueFromUI;

      //   update childrens of the current updated cell
      updateChildrens(cellObject.childrens);

      let rowId = lastSelectedCell.getAttribute("rowid");
        let colId = lastSelectedCell.getAttribute("colid");
        if (!cellObject.visited) {
          visitedCells.push({ rowId, colId });
          cellObject.visited = true;
        }
    }
  });
}
}

attachClickAndBlurEventOnCell();

function deleteFormula(cellObject) {
  cellObject.formula = "";
  for (let i = 0; i < cellObject.parents.length; i++) {
    let parentName = cellObject.parents[i];  //parent me child remove krne if formula ki value agyi h toh
    // A1
    let parentCellObject = getCellObjectFromName(parentName);
    let updatedChildrens = parentCellObject.childrens.filter(function (
      childName
    ) {
      if (childName == cellObject.name) {
        return false;
      }
      return true;
    });
    parentCellObject.childrens = updatedChildrens;
  }
  cellObject.parents = [];
}

function solveFormula(formula , selfCellObject) {
  // tip : implement infix evalutaion
  // ( A1 + A2 ) => ( 10 + 20 );
  let formulaComps = formula.split(" "); //splitting of formula components on tha basis of split
  // ["(" , "A1" , "+" , "A2" , ")"];
  // find valid component
  for (let i = 0; i < formulaComps.length; i++) {
    let fComp = formulaComps[i];
    if (
      (fComp[0] >= "A" && fComp[0] <= "Z") ||
      (fComp[0] >= "a" && fComp <= "z")
    )
    {
      // A1 || A2
      // fComp = A1
      let parentCellObject = getCellObjectFromName(fComp);
      let value = parentCellObject.value;

      if (selfCellObject) {
        //add yourself as a child of parentCellObject
        parentCellObject.childrens.push(selfCellObject.name);
        // update your parents
        selfCellObject.parents.push(parentCellObject.name);
      }
      formula = formula.replace(fComp, value);  //replace----1st jisko replace krna or 2nd jisse replace krna
    }
  }
  // ( 10 + 20 ) => infix evaluation
  let calculatedValue = eval(formula); //eval---for calculation
  return calculatedValue;
}

function getCellObjectFromElement(element) {
  let rowId = element.getAttribute("rowid");
  let colId = element.getAttribute("colid");
  return db[rowId][colId];
}

function getCellObjectFromName(name) {
  // A100
  let colId = name.charCodeAt(0) - 65;   //ABCD
  let rowId = Number(name.substring(1)) - 1; //1234
  return db[rowId][colId];
}

function updateChildrens(childrens) {
    for (let i = 0; i < childrens.length; i++) {
      let child = childrens[i];
      //B1
      let childCellObject = getCellObjectFromName(child);
      let updatedValueOfChild = solveFormula(childCellObject.formula);
      //db update
      childCellObject.value = updatedValueOfChild;
      //ui update
      let colId = child.charCodeAt(0) - 65;
      let rowId = Number(child.substring(1)) - 1;
      document.querySelector(`div[rowid="${rowId}"][colid="${colId}"]`).textContent = updatedValueOfChild;
      //recursive call
      updateChildrens(childCellObject.childrens);
    }
}
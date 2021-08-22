let bold = document.querySelector(".bold");
let italic = document.querySelector(".italic");
let underline = document.querySelector(".underline");

bold.addEventListener("click",function(){

    handleMenuOptionsOne("bold");
})

italic.addEventListener("click",function(){
    
    handleMenuOptionsOne("italic");
})

underline.addEventListener("click",function(){
    
    handleMenuOptionsOne("underline");
})

function handleMenuOptionsOne(buttonClicked){
    let cellObject = getCellObjectFromElement(lastSelectedCell);
    if(buttonClicked=="bold"){
     if(bold.classList.contains("active-menu")){
         //if already selected
         //toh remove krdo
         bold.classList.remove("active-menu");
         lastSelectedCell.style.fontWeight="normal";
         //fontWeight--> thick or thin

     }
    
    else{
          //set ni h toh set krdo
        bold.classList.add("active-menu");
        lastSelectedCell.style.fontWeight="bold";

    }

      //true toh false krdo....false ho toh true krdo
    cellObject.fontStyles.bold = !cellObject.fontStyles.bold;



}
else if(buttonClicked=="italic"){
    if(italic.classList.contains("active-menu")){
        //if already selected
        //toh remove krdo
        italic.classList.remove("active-menu");
        lastSelectedCell.style.fontStyle="normal";
        //fontStyle--> setting for font style

    }
   
   else{
        //set ni h toh set krdo
       italic.classList.add("active-menu");
       lastSelectedCell.style.fontStyle="italic";

   }
    //true toh false krdo....false ho toh true krdo
   cellObject.fontStyles.italic = !cellObject.fontStyles.italic;

}

else if(buttonClicked=="underline"){
    if(underline.classList.contains("active-menu")){
        //if already selected
        //toh remove krdo
        underline.classList.remove("active-menu");
        lastSelectedCell.style.textDecoration="none";

    }
   
   else{
        //set ni h toh set krdo
       underline.classList.add("active-menu");
       lastSelectedCell.style.textDecoration="underline";

   }
    //true toh false krdo....false ho toh true krdo
   cellObject.fontStyles.underline = !cellObject.fontStyles.underline;

}


}

let left = document.querySelector(".left");
let center = document.querySelector(".center");
let right = document.querySelector(".right");

left.addEventListener("click", function(){
     handleTextAlign("left");
})

center.addEventListener("click", function(){
    handleTextAlign("center");
})

right.addEventListener("click", function(){
    handleTextAlign("right");
});


function handleTextAlign(alignment){
    let cellObject = getCellObjectFromElement(lastSelectedCell);
    if (alignment == cellObject.textAlign) {
      return;
    }
    // remove prev active menu from text align
    document
      .querySelector(".menu-options-2 .active-menu")
      .classList.remove("active-menu");
  
    document.querySelector("." + alignment).classList.add("active-menu");
    // Db me text align set krna hoga
    cellObject.textAlign = alignment;
  
    // UI pe alignmnet change hogi
    lastSelectedCell.style.textAlign = alignment;
}
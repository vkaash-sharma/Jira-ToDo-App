const addbtn = document.querySelector(".add-btn");
const modalCont = document.querySelector(".modal-cont");


let isModalPresent = false;
addbtn.addEventListener('click', function() {
    if(!isModalPresent){
        modalCont.style.display = "flex";
    }else{
        modalCont.style.display = "none";
    }
    isModalPresent = !isModalPresent;
})

const allPriorityColor =  document.querySelectorAll(".priority-color");

allPriorityColor.forEach(function (colorElement) {
    colorElement.addEventListener("click",function () {
        allPriorityColor.forEach(function (priorityColorElem){
            priorityColorElem.classList.remove("active");
        });
       colorElement.classList.add("active");
    });
});